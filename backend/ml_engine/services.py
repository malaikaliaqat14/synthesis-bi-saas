import sys
import os
import pandas as pd
from datetime import datetime, timedelta
from django.utils import timezone
from decimal import Decimal

# Add ml/ directory to path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ML_DIR = os.path.join(BASE_DIR, 'ml')
if ML_DIR not in sys.path:
    sys.path.insert(0, ML_DIR)

from predict import predict_sales_forecast, predict_customer_churn, predict_customer_segments
from business.models import Sale, Customer, Order, MLPrediction

class MLEngineService:
    """
    Connects Django tenant database records with trained Joblib ML models.
    """

    @classmethod
    def get_company_customer_feature_df(cls, company):
        """Constructs RFM and behavioral feature table from live company transactions"""
        customers = Customer.objects.filter(company=company, is_active=True)
        if not customers.exists():
            return pd.DataFrame()

        sales = Sale.objects.filter(company=company).values('customer_id', 'total_amount', 'sale_date', 'order_id')
        df_sales = pd.DataFrame(list(sales))

        records = []
        now = timezone.now()

        if not df_sales.empty:
            df_sales['total_amount'] = pd.to_numeric(df_sales['total_amount'], errors='coerce').fillna(0.0)
            df_sales['sale_date'] = pd.to_datetime(df_sales['sale_date'])

            cust_stats = df_sales.groupby('customer_id').agg(
                total_spent=('total_amount', 'sum'),
                total_orders=('order_id', 'nunique'),
                last_order=('sale_date', 'max'),
                first_order=('sale_date', 'min')
            ).reset_index()
            stat_map = cust_stats.set_index('customer_id').to_dict('index')
        else:
            stat_map = {}

        for c in customers:
            s = stat_map.get(c.id, {})
            last_dt = s.get('last_order')
            days_since = (now - last_dt).days if last_dt else 120
            first_dt = s.get('first_order')
            lifetime = max((now - first_dt).days, 1) if first_dt else 30
            tot_orders = s.get('total_orders', 0)
            tot_spent = float(s.get('total_spent', 0.0))
            aov = round(tot_spent / tot_orders, 2) if tot_orders > 0 else 0.0
            freq = round(tot_orders / (lifetime / 30.0 + 1), 2)

            records.append({
                'customer_id': c.id,
                'customer_name': c.name,
                'email': c.email,
                'region': c.region,
                'total_orders': tot_orders,
                'total_spending': tot_spent,
                'avg_order_value': aov,
                'days_since_last_order': days_since,
                'customer_lifetime_days': lifetime,
                'purchase_frequency': freq
            })

        return pd.DataFrame(records)

    @classmethod
    def get_sales_forecast(cls, company, days_ahead=14):
        sales = Sale.objects.filter(company=company).values('sale_date', 'total_amount')
        df_sales = pd.DataFrame(list(sales)) if sales.exists() else None
        if df_sales is not None and not df_sales.empty:
            df_sales.rename(columns={'sale_date': 'date'}, inplace=True)

        result = predict_sales_forecast(df_sales, days_ahead=days_ahead)

        # Cache snapshot prediction record
        MLPrediction.objects.update_or_create(
            company=company,
            model_type='SALES_FORECAST',
            target_id=f"forecast-{days_ahead}d",
            defaults={
                'target_label': f'{days_ahead}-Day Revenue Forecast',
                'prediction_value': result['projected_revenue'],
                'details': result
            }
        )

        return result

    @classmethod
    def get_customer_churn_predictions(cls, company):
        df_cust = cls.get_company_customer_feature_df(company)
        if df_cust.empty:
            return {'summary': {'high_risk': 0, 'medium_risk': 0, 'low_risk': 0}, 'customers': []}

        predictions = predict_customer_churn(df_cust)

        high = sum(1 for p in predictions if p['risk_category'] == 'High Risk')
        med = sum(1 for p in predictions if p['risk_category'] == 'Medium Risk')
        low = sum(1 for p in predictions if p['risk_category'] == 'Low Risk')

        # Cache top high-risk accounts in MLPrediction table
        for p in predictions[:10]:
            MLPrediction.objects.update_or_create(
                company=company,
                model_type='CHURN_RISK',
                target_id=str(p['customer_id']),
                defaults={
                    'target_label': p['customer_name'],
                    'probability': p['churn_probability'],
                    'risk_category': p['risk_category'],
                    'details': p
                }
            )

        return {
            'summary': {
                'total_evaluated': len(predictions),
                'high_risk': high,
                'medium_risk': med,
                'low_risk': low,
                'high_risk_rate': round(high / len(predictions) * 100, 1) if predictions else 0
            },
            'customers': predictions
        }

    @classmethod
    def get_customer_segmentation(cls, company):
        df_cust = cls.get_company_customer_feature_df(company)
        if df_cust.empty:
            return {'segments_summary': [], 'customers': [], 'silhouette_score': 0.0}

        result = predict_customer_segments(df_cust)

        # Cache segments in DB
        for c in result.get('customers', [])[:20]:
            MLPrediction.objects.update_or_create(
                company=company,
                model_type='SEGMENTATION',
                target_id=str(c['customer_id']),
                defaults={
                    'target_label': c['segment'],
                    'risk_category': c['segment'],
                    'details': c
                }
            )

        return result
