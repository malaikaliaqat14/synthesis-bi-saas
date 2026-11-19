import os
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import TimeSeriesSplit
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_absolute_error, root_mean_squared_error, r2_score
from preprocess import prepare_sales_forecast_features

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASETS_DIR = os.path.join(BASE_DIR, 'datasets')
MODELS_DIR = os.path.join(BASE_DIR, 'models')
os.makedirs(MODELS_DIR, exist_ok=True)

def train_sales_forecast_model():
    print("=" * 60)
    print("TRAINING ML MODEL 1: SALES FORECASTING (REGRESSION)")
    print("=" * 60)

    sales_csv = os.path.join(DATASETS_DIR, 'synthetic_sales_data.csv')
    if not os.path.exists(sales_csv):
        from generate_synthetic_data import generate_synthetic_business_dataset
        generate_synthetic_business_dataset()

    df_sales = pd.read_csv(sales_csv)
    df_daily = prepare_sales_forecast_features(df_sales)

    features = [
        'day', 'month', 'year', 'day_of_week', 'is_weekend',
        'lag_1', 'lag_7', 'lag_14', 'lag_30',
        'rolling_mean_7', 'rolling_std_7', 'rolling_mean_30'
    ]
    target = 'revenue'

    X = df_daily[features]
    y = df_daily[target]

    # Time-series train/test split (80% train, 20% test chronologically)
    split_idx = int(len(X) * 0.8)
    X_train, X_test = X.iloc[:split_idx], X.iloc[split_idx:]
    y_train, y_test = y.iloc[:split_idx], y.iloc[split_idx:]

    print(f"Dataset split: {len(X_train)} training days | {len(X_test)} evaluation days")

    # Evaluate candidates: Ridge, RandomForest, GradientBoosting
    candidates = {
        'Ridge Regression': Ridge(alpha=1.0),
        'Random Forest Regressor': RandomForestRegressor(n_estimators=100, max_depth=12, random_state=42),
        'Gradient Boosting Regressor': GradientBoostingRegressor(n_estimators=120, max_depth=5, learning_rate=0.08, random_state=42)
    }

    best_model_name = None
    best_model = None
    best_rmse = float('inf')
    evaluation_results = {}

    for name, model in candidates.items():
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        
        # Calculate evaluation metrics: MAE, RMSE, R²
        mae = mean_absolute_error(y_test, y_pred)
        rmse = root_mean_squared_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)

        evaluation_results[name] = {
            'MAE': round(mae, 2),
            'RMSE': round(rmse, 2),
            'R2': round(r2, 4)
        }
        print(f"[{name}] -> MAE: ${mae:,.2f} | RMSE: ${rmse:,.2f} | R²: {r2:.4f}")

        if rmse < best_rmse:
            best_rmse = rmse
            best_model_name = name
            best_model = model

    print(f"\n>>> Selected Best Model: {best_model_name} (RMSE: ${best_rmse:,.2f})")

    # Re-train best model on full dataset
    best_model.fit(X, y)

    # Save artifact with Joblib
    model_payload = {
        'model': best_model,
        'model_name': best_model_name,
        'features': features,
        'metrics': evaluation_results[best_model_name],
        'comparison': evaluation_results,
        'last_trained': pd.Timestamp.now().isoformat()
    }

    model_path = os.path.join(MODELS_DIR, 'sales_forecast.joblib')
    joblib.dump(model_payload, model_path)
    print(f"Model successfully saved to: {model_path}\n")

    return model_payload

if __name__ == '__main__':
    train_sales_forecast_model()
