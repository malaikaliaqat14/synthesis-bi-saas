import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler

def prepare_sales_forecast_features(df_sales):
    """
    Transforms raw sales transactions into daily aggregated time-series with
    lag features, rolling averages, and calendar signals.
    """
    df = df_sales.copy()
    df['date'] = pd.to_datetime(df['date'])
    df['day_date'] = df['date'].dt.date

    # Daily aggregation
    daily = df.groupby('day_date').agg(
        revenue=('total_amount', 'sum'),
        orders_count=('order_number', 'nunique'),
        units_sold=('quantity', 'sum')
    ).reset_index()

    daily['day_date'] = pd.to_datetime(daily['day_date'])
    daily.sort_values('day_date', inplace=True)
    daily.set_index('day_date', inplace=True)

    # Reindex to ensure continuous daily dates without missing gaps
    full_idx = pd.date_range(start=daily.index.min(), end=daily.index.max(), freq='D')
    daily = daily.reindex(full_idx, fill_value=0.0)
    daily.index.name = 'date'
    daily.reset_index(inplace=True)

    # Calendar features
    daily['day'] = daily['date'].dt.day
    daily['month'] = daily['date'].dt.month
    daily['year'] = daily['date'].dt.year
    daily['day_of_week'] = daily['date'].dt.dayofweek
    daily['is_weekend'] = daily['day_of_week'].isin([5, 6]).astype(int)

    # Lag features
    daily['lag_1'] = daily['revenue'].shift(1)
    daily['lag_7'] = daily['revenue'].shift(7)
    daily['lag_14'] = daily['revenue'].shift(14)
    daily['lag_30'] = daily['revenue'].shift(30)

    # Rolling average features
    daily['rolling_mean_7'] = daily['revenue'].shift(1).rolling(window=7, min_periods=1).mean()
    daily['rolling_std_7'] = daily['revenue'].shift(1).rolling(window=7, min_periods=1).std().fillna(0)
    daily['rolling_mean_30'] = daily['revenue'].shift(1).rolling(window=30, min_periods=1).mean()

    # Drop early rows with NaN from lags
    daily_cleaned = daily.dropna().copy()
    return daily_cleaned


def prepare_churn_features(df_customers):
    """
    Extracts numerical behavioral signals for churn classification.
    """
    feature_cols = [
        'total_orders',
        'total_spending',
        'avg_order_value',
        'days_since_last_order',
        'customer_lifetime_days',
        'purchase_frequency'
    ]
    X = df_customers[feature_cols].copy()
    y = df_customers['churned'].copy() if 'churned' in df_customers.columns else None
    return X, y, feature_cols


def prepare_rfm_features(df_customers):
    """
    Prepares normalized Recency, Frequency, Monetary values for K-Means clustering.
    """
    rfm = df_customers[['days_since_last_order', 'total_orders', 'total_spending']].copy()
    rfm.columns = ['Recency', 'Frequency', 'Monetary']

    # Log transformation to handle skewness
    rfm_log = np.log1p(rfm)
    return rfm_log, rfm
