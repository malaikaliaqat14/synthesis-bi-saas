import pandas as pd
from datetime import timedelta
from django.utils import timezone
from business.models import Sale, Order, Expense, Customer, MLPrediction

class InsightsService:
    """
    Synthesizes real transactional data, financial trends, and ML risk scores
    into actionable, high-context business intelligence insights.
    """

    @classmethod
    def generate_insights(cls, company):
        insights = []
        now = timezone.now()
        thirty_days_ago = now - timedelta(days=30)
        sixty_days_ago = now - timedelta(days=60)

        # 1. Period-over-Period Revenue Comparison
        current_sales = Sale.objects.filter(company=company, sale_date__gte=thirty_days_ago)
        prev_sales = Sale.objects.filter(company=company, sale_date__gte=sixty_days_ago, sale_date__lt=thirty_days_ago)

        curr_rev = float(sum(s.total_amount for s in current_sales))
        prev_rev = float(sum(s.total_amount for s in prev_sales))

        if prev_rev > 0:
            diff_pct = ((curr_rev - prev_rev) / prev_rev) * 100
            if diff_pct > 5:
                insights.append({
                    'type': 'POSITIVE',
                    'title': f'Revenue Growth Acceleration (+{diff_pct:.1f}%)',
                    'description': f'Revenue over the last 30 days reached PKR {curr_rev:,.0f}, outperforming the prior 30-day period (PKR {prev_rev:,.0f}) by {diff_pct:.1f}%.',
                    'metric': f'+{diff_pct:.1f}% period-over-period',
                    'category': 'Revenue'
                })
            elif diff_pct < -5:
                insights.append({
                    'type': 'WARNING',
                    'title': f'Revenue Contraction Observed ({diff_pct:.1f}%)',
                    'description': f'Revenue for the past 30 days contracted by {abs(diff_pct):.1f}% compared to the previous period (PKR {curr_rev:,.0f} vs PKR {prev_rev:,.0f}).',
                    'metric': f'{diff_pct:.1f}% period-over-period',
                    'category': 'Revenue'
                })
        elif curr_rev > 0:
            insights.append({
                'type': 'POSITIVE',
                'title': 'Active Revenue Inflow',
                'description': f'Current monthly revenue stands at PKR {curr_rev:,.0f}.',
                'metric': f'PKR {curr_rev:,.0f}',
                'category': 'Revenue'
            })

        # 2. Product and Category Drivers
        if current_sales.exists():
            df_curr = pd.DataFrame(list(current_sales.values('product__category__name', 'product__name', 'total_amount')))
            df_curr['total_amount'] = pd.to_numeric(df_curr['total_amount'], errors='coerce').fillna(0.0)
            
            # Top category driver
            cat_totals = df_curr.groupby('product__category__name')['total_amount'].sum().sort_values(ascending=False)
            if not cat_totals.empty:
                top_cat = cat_totals.index[0] or 'General'
                top_cat_rev = float(cat_totals.iloc[0])
                top_cat_share = (top_cat_rev / curr_rev * 100) if curr_rev > 0 else 0
                insights.append({
                    'type': 'INFO',
                    'title': f'Primary Revenue Engine: {top_cat}',
                    'description': f'Category "{top_cat}" generated PKR {top_cat_rev:,.0f}, representing {top_cat_share:.1f}% of total sales.',
                    'metric': f'{top_cat_share:.1f}% of volume',
                    'category': 'Catalog'
                })

        # 3. Expense to Revenue Ratio Check
        expenses = Expense.objects.filter(company=company, expense_date__gte=thirty_days_ago.date())
        tot_exp = float(sum(e.amount for e in expenses))
        if curr_rev > 0:
            exp_ratio = (tot_exp / curr_rev) * 100
            if exp_ratio > 70:
                insights.append({
                    'type': 'WARNING',
                    'title': 'Elevated Operational Expenditure',
                    'description': f'Expenses over the last 30 days (PKR {tot_exp:,.0f}) consumed {exp_ratio:.1f}% of gross revenue. Review overhead costs to preserve cash margins.',
                    'metric': f'{exp_ratio:.1f}% OPEX ratio',
                    'category': 'Finance'
                })
            else:
                insights.append({
                    'type': 'POSITIVE',
                    'title': 'Healthy Operating Margin',
                    'description': f'Operational expenses accounted for only {exp_ratio:.1f}% of gross revenue, yielding strong net margins.',
                    'metric': f'{100 - exp_ratio:.1f}% margin',
                    'category': 'Finance'
                })

        # 4. Machine Learning Churn Risk Insight
        high_risk_predictions = MLPrediction.objects.filter(
            company=company,
            model_type='CHURN_RISK',
            risk_category__icontains='High'
        )
        high_risk_count = high_risk_predictions.count()
        if high_risk_count > 0:
            insights.append({
                'type': 'DANGER',
                'title': f'At-Risk Accounts Detected ({high_risk_count} Customers)',
                'description': f'Our customer churn model identified {high_risk_count} accounts with high churn probability based on purchase recency and frequency decay.',
                'metric': f'{high_risk_count} accounts flagged',
                'category': 'Customer Retention'
            })

        # 5. Customer Segmentation Insight
        cluster_predictions = MLPrediction.objects.filter(
            company=company,
            model_type='SEGMENTATION'
        )
        if cluster_predictions.exists():
            champions = cluster_predictions.filter(target_label='Champions').count()
            if champions > 0:
                insights.append({
                    'type': 'POSITIVE',
                    'title': f'Core Customer Champions Group',
                    'description': f'K-Means RFM clustering identified {champions} High-Value Champion customers who generate disproportionate lifetime value.',
                    'metric': f'{champions} VIPs',
                    'category': 'Segmentation'
                })

        # Fallback if no specific trigger fired
        if not insights:
            insights.append({
                'type': 'INFO',
                'title': 'Platform Ready for Ingestion',
                'description': 'Add sales orders or upload historical CSV data to activate real-time predictive insights and analytics tracking.',
                'metric': 'Initial Setup',
                'category': 'Onboarding'
            })

        return insights
