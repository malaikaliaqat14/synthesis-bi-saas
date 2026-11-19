import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from django.utils import timezone
from decimal import Decimal
from business.models import Sale, Order, Customer, Product, Expense

class AnalyticsService:
    """
    High-performance business intelligence service utilizing Pandas.
    Extracts tenant-isolated data from MySQL and computes statistical aggregations,
    cohort trends, and financial KPIs.
    """

    @staticmethod
    def get_date_range(time_range_filter, start_date_str=None, end_date_str=None):
        now = timezone.now()
        start = None
        # Default end is end of current year/future so all imported orders are captured
        end = now + timedelta(days=365)

        if time_range_filter == 'today':
            start = now.replace(hour=0, minute=0, second=0, microsecond=0)
            end = now.replace(hour=23, minute=59, second=59, microsecond=999999)
        elif time_range_filter == '7d':
            start = now - timedelta(days=7)
        elif time_range_filter == '30d':
            start = now - timedelta(days=30)
        elif time_range_filter == '3m':
            start = now - timedelta(days=90)
        elif time_range_filter == '6m':
            start = now - timedelta(days=180)
        elif time_range_filter == 'year':
            start = now.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
            end = now.replace(month=12, day=31, hour=23, minute=59, second=59, microsecond=999999)
        elif time_range_filter == 'custom' and start_date_str:
            try:
                start = datetime.strptime(start_date_str, '%Y-%m-%d')
                if end_date_str:
                    end = datetime.strptime(end_date_str, '%Y-%m-%d') + timedelta(days=1)
            except Exception:
                start = now - timedelta(days=30)
        else:
            # Default to 30 days
            start = now - timedelta(days=30)

        return start, end

    @classmethod
    def get_dashboard_summary(cls, company, time_range='30d', start_date=None, end_date=None):
        start, end = cls.get_date_range(time_range, start_date, end_date)

        # Sales and Orders query
        sales_qs = Sale.objects.filter(company=company)
        orders_qs = Order.objects.filter(company=company)
        expenses_qs = Expense.objects.filter(company=company)

        if start:
            sales_qs = sales_qs.filter(sale_date__gte=start, sale_date__lte=end)
            orders_qs = orders_qs.filter(order_date__gte=start, order_date__lte=end)
            expenses_qs = expenses_qs.filter(expense_date__gte=start.date(), expense_date__lte=end.date())

        total_customers = Customer.objects.filter(company=company, is_active=True).count()
        total_products = Product.objects.filter(company=company, is_active=True).count()

        sales_data = list(sales_qs.values(
            'sale_date', 'quantity', 'unit_price', 'total_amount', 'region',
            'product__name', 'product__category__name', 'product__unit_cost', 'customer_id'
        ))

        expenses_data = list(expenses_qs.values('amount', 'expense_date', 'category'))

        if not sales_data:
            # Return baseline empty stats structure
            total_expenses_val = float(sum(e['amount'] for e in expenses_data)) if expenses_data else 0.0
            return {
                'kpis': {
                    'total_revenue': 0.0,
                    'total_orders': orders_qs.count(),
                    'total_customers': total_customers,
                    'total_products': total_products,
                    'total_expenses': round(total_expenses_val, 2),
                    'net_profit': round(-total_expenses_val, 2),
                    'profit_margin': 0.0,
                    'aov': 0.0,
                },
                'charts': {
                    'revenue_over_time': [],
                    'orders_over_time': [],
                    'sales_by_category': [],
                    'sales_by_region': [],
                    'top_products': [],
                    'profit_trend': [],
                },
                'insights': ["No transactions found for the selected date range."]
            }

        df_sales = pd.DataFrame(sales_data)
        df_sales['total_amount'] = pd.to_numeric(df_sales['total_amount'], errors='coerce').fillna(0.0)
        df_sales['unit_cost'] = pd.to_numeric(df_sales['product__unit_cost'], errors='coerce').fillna(0.0)
        df_sales['quantity'] = pd.to_numeric(df_sales['quantity'], errors='coerce').fillna(1)
        df_sales['cogs'] = df_sales['unit_cost'] * df_sales['quantity']
        df_sales['date'] = pd.to_datetime(df_sales['sale_date']).dt.date

        total_rev = float(df_sales['total_amount'].sum())
        total_cogs = float(df_sales['cogs'].sum())
        total_orders_count = orders_qs.count()
        aov = round(total_rev / total_orders_count, 2) if total_orders_count > 0 else 0.0

        total_expenses = float(sum(Decimal(str(e['amount'])) for e in expenses_data)) if expenses_data else 0.0
        net_profit = round(total_rev - total_cogs - total_expenses, 2)
        profit_margin = round((net_profit / total_rev * 100), 1) if total_rev > 0 else 0.0

        # Daily Revenue & Profit Trend
        daily_rev = df_sales.groupby('date').agg({
            'total_amount': 'sum',
            'cogs': 'sum'
        }).reset_index()

        daily_rev['date_str'] = daily_rev['date'].astype(str)
        daily_rev.sort_values('date', inplace=True)

        revenue_over_time = [
            {'date': row['date_str'], 'revenue': round(float(row['total_amount']), 2)}
            for _, row in daily_rev.iterrows()
        ]

        profit_trend = [
            {'date': row['date_str'], 'gross_profit': round(float(row['total_amount'] - row['cogs']), 2)}
            for _, row in daily_rev.iterrows()
        ]

        # Orders over time
        orders_data = list(orders_qs.values('order_date'))
        if orders_data:
            df_orders = pd.DataFrame(orders_data)
            df_orders['date'] = pd.to_datetime(df_orders['order_date']).dt.date
            daily_orders = df_orders.groupby('date').size().reset_index(name='count')
            daily_orders['date_str'] = daily_orders['date'].astype(str)
            daily_orders.sort_values('date', inplace=True)
            orders_over_time = [
                {'date': row['date_str'], 'orders': int(row['count'])}
                for _, row in daily_orders.iterrows()
            ]
        else:
            orders_over_time = []

        # Sales by Category
        df_sales['category'] = df_sales['product__category__name'].fillna('Uncategorized')
        cat_group = df_sales.groupby('category')['total_amount'].sum().reset_index()
        cat_group.sort_values('total_amount', ascending=False, inplace=True)
        sales_by_category = [
            {'category': row['category'], 'revenue': round(float(row['total_amount']), 2)}
            for _, row in cat_group.iterrows()
        ]

        # Sales by Region / Province
        df_sales['region'] = df_sales['region'].replace({'North America': 'Punjab'}).fillna('Punjab')
        reg_group = df_sales.groupby('region')['total_amount'].sum().reset_index()
        reg_group.sort_values('total_amount', ascending=False, inplace=True)
        sales_by_region = [
            {'region': row['region'], 'revenue': round(float(row['total_amount']), 2)}
            for _, row in reg_group.iterrows()
        ]

        # Top Products
        prod_group = df_sales.groupby('product__name').agg({
            'total_amount': 'sum',
            'quantity': 'sum'
        }).reset_index()
        prod_group.sort_values('total_amount', ascending=False, inplace=True)
        top_products = [
            {
                'product': row['product__name'],
                'revenue': round(float(row['total_amount']), 2),
                'units_sold': int(row['quantity'])
            }
            for _, row in prod_group.head(8).iterrows()
        ]

        return {
            'kpis': {
                'total_revenue': round(total_rev, 2),
                'total_orders': total_orders_count,
                'total_customers': total_customers,
                'total_products': total_products,
                'total_expenses': round(total_expenses, 2),
                'net_profit': net_profit,
                'profit_margin': profit_margin,
                'aov': aov,
            },
            'charts': {
                'revenue_over_time': revenue_over_time,
                'orders_over_time': orders_over_time,
                'sales_by_category': sales_by_category,
                'sales_by_region': sales_by_region,
                'top_products': top_products,
                'profit_trend': profit_trend,
            }
        }

    @classmethod
    def get_deep_customer_analytics(cls, company):
        """Calculates Customer Lifetime Value, Repeat Customer %, and purchase frequencies"""
        sales = Sale.objects.filter(company=company).values('customer_id', 'total_amount', 'sale_date')
        if not sales:
            return {
                'total_customers': Customer.objects.filter(company=company, is_active=True).count(),
                'repeat_customer_rate': 0.0,
                'average_clv': 0.0,
                'purchase_frequency_distribution': [],
                'top_customers': []
            }

        df = pd.DataFrame(list(sales))
        df['total_amount'] = pd.to_numeric(df['total_amount'], errors='coerce').fillna(0.0)

        cust_stats = df.groupby('customer_id').agg(
            total_spent=('total_amount', 'sum'),
            order_count=('total_amount', 'count'),
            first_purchase=('sale_date', 'min'),
            last_purchase=('sale_date', 'max')
        ).reset_index()

        total_cust_count = len(cust_stats)
        repeat_customers = cust_stats[cust_stats['order_count'] > 1]
        repeat_rate = round((len(repeat_customers) / total_cust_count * 100), 1) if total_cust_count > 0 else 0.0
        avg_clv = round(float(cust_stats['total_spent'].mean()), 2) if total_cust_count > 0 else 0.0

        # Frequency distribution bins: 1 order, 2-3 orders, 4-6 orders, 7+ orders
        freq_1 = int((cust_stats['order_count'] == 1).sum())
        freq_2_3 = int(((cust_stats['order_count'] >= 2) & (cust_stats['order_count'] <= 3)).sum())
        freq_4_6 = int(((cust_stats['order_count'] >= 4) & (cust_stats['order_count'] <= 6)).sum())
        freq_7_plus = int((cust_stats['order_count'] >= 7).sum())

        distribution = [
            {'label': '1 Purchase (One-Time)', 'count': freq_1},
            {'label': '2 - 3 Purchases', 'count': freq_2_3},
            {'label': '4 - 6 Purchases', 'count': freq_4_6},
            {'label': '7+ Purchases (Loyal)', 'count': freq_7_plus},
        ]

        # Fetch names for top 10 customers
        top_10 = cust_stats.sort_values('total_spent', ascending=False).head(10)
        cust_id_map = {c.id: (c.name, c.email, c.region) for c in Customer.objects.filter(id__in=top_10['customer_id'])}

        top_customers = []
        for _, r in top_10.iterrows():
            c_info = cust_id_map.get(r['customer_id'], ('Unknown', '', ''))
            top_customers.append({
                'id': r['customer_id'],
                'name': c_info[0],
                'email': c_info[1],
                'region': c_info[2],
                'orders': int(r['order_count']),
                'total_spent': round(float(r['total_spent']), 2)
            })

        return {
            'total_customers': total_cust_count,
            'repeat_customer_rate': repeat_rate,
            'average_clv': avg_clv,
            'purchase_frequency_distribution': distribution,
            'top_customers': top_customers
        }
