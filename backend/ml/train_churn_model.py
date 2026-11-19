import os
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
from preprocess import prepare_churn_features

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASETS_DIR = os.path.join(BASE_DIR, 'datasets')
MODELS_DIR = os.path.join(BASE_DIR, 'models')
os.makedirs(MODELS_DIR, exist_ok=True)

def train_churn_model():
    print("=" * 60)
    print("TRAINING ML MODEL 2: CUSTOMER CHURN (CLASSIFICATION)")
    print("=" * 60)

    churn_csv = os.path.join(DATASETS_DIR, 'synthetic_customer_data.csv')
    if not os.path.exists(churn_csv):
        from generate_synthetic_data import generate_synthetic_business_dataset
        generate_synthetic_business_dataset()

    df_customers = pd.read_csv(churn_csv)
    X, y, feature_cols = prepare_churn_features(df_customers)

    # Stratified train/test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=42, stratify=y
    )

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # Classifiers to compare
    classifiers = {
        'Logistic Regression': LogisticRegression(random_state=42, max_iter=500),
        'Random Forest Classifier': RandomForestClassifier(n_estimators=100, max_depth=6, random_state=42),
        'Gradient Boosting Classifier': GradientBoostingClassifier(n_estimators=100, max_depth=3, learning_rate=0.1, random_state=42)
    }

    best_f1 = -1.0
    best_clf_name = None
    best_clf = None
    evaluation_results = {}

    for name, clf in classifiers.items():
        clf.fit(X_train_scaled, y_train)
        y_pred = clf.predict(X_test_scaled)
        y_prob = clf.predict_proba(X_test_scaled)[:, 1]

        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred, zero_division=0)
        rec = recall_score(y_test, y_pred, zero_division=0)
        f1 = f1_score(y_test, y_pred, zero_division=0)
        auc = roc_auc_score(y_test, y_prob)

        evaluation_results[name] = {
            'Accuracy': round(acc, 4),
            'Precision': round(prec, 4),
            'Recall': round(rec, 4),
            'F1': round(f1, 4),
            'ROC_AUC': round(auc, 4)
        }
        print(f"[{name}] -> Accuracy: {acc:.2%} | Precision: {prec:.2%} | Recall: {rec:.2%} | F1: {f1:.4f} | ROC-AUC: {auc:.4f}")

        if f1 > best_f1:
            best_f1 = f1
            best_clf_name = name
            best_clf = clf

    print(f"\n>>> Selected Best Classifier: {best_clf_name} (F1-score: {best_f1:.4f})")

    # Re-train scaler and best classifier on full dataset
    X_full_scaled = scaler.fit_transform(X)
    best_clf.fit(X_full_scaled, y)

    model_payload = {
        'model': best_clf,
        'scaler': scaler,
        'model_name': best_clf_name,
        'features': feature_cols,
        'metrics': evaluation_results[best_clf_name],
        'comparison': evaluation_results,
        'last_trained': pd.Timestamp.now().isoformat()
    }

    model_path = os.path.join(MODELS_DIR, 'churn_model.joblib')
    joblib.dump(model_payload, model_path)
    print(f"Model successfully saved to: {model_path}\n")

    return model_payload

if __name__ == '__main__':
    train_churn_model()
