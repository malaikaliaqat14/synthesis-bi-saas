import os
import random
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# Create datasets directory
DATASETS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'datasets')
os.makedirs(DATASETS_DIR, exist_ok=True)

MODELS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models')
os.makedirs(MODELS_DIR, exist_ok=True)

def generate_synthetic_business_dataset():
    print("Generating realistic synthetic business dataset for ML training and evaluation...")
    np.random.seed(42)
    random.seed(42)

    # 1. Product Catalog
    categories = {
        'Cloud Infrastructure': [
            ('Cloud Server Alpha', 120.0, 45.0),
            ('Database Cluster Pro', 250.0, 90.0),
            ('Kubernetes Pod Manager', 320.0, 110.0),
            ('CDN Edge Accelerator', 85.0, 25.0),
        ],
        'Enterprise Software': [
            ('AI Analytics Suite', 450.0, 120.0),
            ('CRM Enterprise License', 380.0, 100.0),
            ('ERP Connector Module', 520.0, 150.0),
            ('Security Shield Pro', 210.0, 60.0),
        ],
        'Hardware & Devices': [
            ('Enterprise Gateway Router', 650.0, 390.0),
            ('Biometric Terminal X', 420.0, 240.0),
            ('Edge Sensor Node', 140.0, 75.0),
            ('Secure Token Key', 45.0, 15.0),
        ],
        'Consulting & Support': [
            ('Architecture Review Tier 1', 800.0, 300.0),
            ('Dedicated DevOps Hour', 150.0, 70.0),
            ('24/7 Priority SLA', 600.0, 180.0),
        ],
        'Data Solutions': [
            ('Data Warehouse Pipeline', 490.0, 160.0),
            ('ETL Sync Engine', 280.0, 85.0),
            ('Vector Search Index', 340.0, 115.0),
        ]
    }

    products = []
    for cat, prod_list in categories.items():
        for name, price, cost in prod_list:
            sku = f"SKU-{cat[:3].upper()}-{len(products)+1:03d}"
            products.append({
                'product_name': name,
                'category': cat,
                'sku': sku,
                'unit_price': price,
                'unit_cost': cost
            })
    df_products = pd.DataFrame(products)

    # 2. Customers
    first_names = ['James', 'Emma', 'Oliver', 'Sophia', 'Lucas', 'Mia', 'Alexander', 'Isabella', 'William', 'Ava', 'Ethan', 'Charlotte', 'Daniel', 'Amelia', 'Benjamin', 'Harper', 'Michael', 'Evelyn', 'Liam', 'Abigail', 'Noah', 'Emily', 'Henry', 'Ella', 'Sebastian', 'Scarlett']
    last_names = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin']
    regions = ['North America', 'Europe', 'Asia-Pacific', 'Latin America', 'Middle East & Africa']

    customers = []
    for i in range(120):
        fn = random.choice(first_names)
        ln = random.choice(last_names)
        name = f"{fn} {ln}"
        email = f"{fn.lower()}.{ln.lower()}{i+1}@example.com"
        reg = random.choice(regions)
        customers.append({
            'customer_id': i + 1,
            'customer_name': name,
            'email': email,
            'region': reg
        })
    df_customers = pd.DataFrame(customers)

    # 3. Time Series Sales & Orders (from 2024-01-01 to 2026-09-01)
    start_date = datetime(2024, 1, 1)
    total_days = 970 # ~32 months

    # Assign each customer an activity lifecycle window
    # 25% of customers will stop purchasing early (churned cohort)
    churn_cohort_size = int(len(df_customers) * 0.28) # ~33 churned customers
    churned_cids = set(df_customers.sample(churn_cohort_size, random_state=42)['customer_id'])

    cust_expiry_days = {}
    for cid in df_customers['customer_id']:
        if cid in churned_cids:
            # Drop off anywhere between day 180 and day 750 (so at least 220+ days since last order)
            cust_expiry_days[cid] = random.randint(180, 750)
        else:
            cust_expiry_days[cid] = total_days # remains active until end

    sales_records = []
    order_id = 1000

    current_date = start_date
    for day in range(total_days):
        current_date = start_date + timedelta(days=day)
        
        # Seasonality & general growth trend
        weekday = current_date.weekday()
        day_factor = 0.4 if weekday >= 5 else 1.0
        trend_factor = 1.0 + (day / total_days) * 0.7
        num_transactions = int(np.random.poisson(lam=5.5 * day_factor * trend_factor))

        # Filter customers eligible on this day
        active_candidates = df_customers[df_customers['customer_id'].map(lambda cid: cust_expiry_days[cid] >= day)]
        if active_candidates.empty:
            active_candidates = df_customers

        for _ in range(num_transactions):
            order_id += 1
            cust = active_candidates.sample(1).iloc[0]
            prod = df_products.sample(1).iloc[0]
            
            qty = int(np.random.choice([1, 2, 3, 4, 5, 8], p=[0.55, 0.22, 0.12, 0.06, 0.03, 0.02]))
            price = prod['unit_price']
            total = round(qty * price, 2)

            hour = random.randint(8, 20)
            minute = random.randint(0, 59)
            tx_time = current_date.replace(hour=hour, minute=minute)

            sales_records.append({
                'order_number': f"ORD-{order_id}",
                'date': tx_time.strftime('%Y-%m-%d %H:%M:%S'),
                'customer_id': cust['customer_id'],
                'customer': cust['customer_name'],
                'customer_email': cust['email'],
                'product': prod['product_name'],
                'category': prod['category'],
                'quantity': qty,
                'price': price,
                'total_amount': total,
                'region': cust['region']
            })

    df_sales = pd.DataFrame(sales_records)
    sales_csv_path = os.path.join(DATASETS_DIR, 'synthetic_sales_data.csv')
    df_sales.to_csv(sales_csv_path, index=False)
    print(f"Generated {len(df_sales)} sales transactions saved to: {sales_csv_path}")

    # 4. Customer Churn Dataset Calculation
    # For each customer, calculate aggregate RFM + churn indicator (no order in last 90 days of synthetic timeline)
    max_date = pd.to_datetime(df_sales['date']).max()
    cust_groups = df_sales.groupby(['customer_id', 'customer', 'customer_email', 'region'])

    churn_records = []
    for (cid, cname, cemail, reg), group in cust_groups:
        dates = pd.to_datetime(group['date'])
        last_date = dates.max()
        first_date = dates.min()
        
        days_since_last_order = (max_date - last_date).days
        total_orders = len(group['order_number'].unique())
        total_spending = group['total_amount'].sum()
        avg_order_value = round(total_spending / total_orders, 2)
        customer_lifetime_days = max((last_date - first_date).days, 1)
        purchase_frequency = round(total_orders / (customer_lifetime_days / 30.0 + 1), 2)

        # Churn definition: hasn't purchased in last 75 days OR low frequency
        churn_label = 1 if days_since_last_order > 75 else 0

        churn_records.append({
            'customer_id': cid,
            'customer_name': cname,
            'email': cemail,
            'region': reg,
            'total_orders': total_orders,
            'total_spending': round(total_spending, 2),
            'avg_order_value': avg_order_value,
            'days_since_last_order': days_since_last_order,
            'customer_lifetime_days': customer_lifetime_days,
            'purchase_frequency': purchase_frequency,
            'churned': churn_label
        })

    df_churn = pd.DataFrame(churn_records)
    churn_csv_path = os.path.join(DATASETS_DIR, 'synthetic_customer_data.csv')
    df_churn.to_csv(churn_csv_path, index=False)
    print(f"Generated {len(df_churn)} customer profiles saved to: {churn_csv_path}")

    return sales_csv_path, churn_csv_path

if __name__ == '__main__':
    generate_synthetic_business_dataset()
