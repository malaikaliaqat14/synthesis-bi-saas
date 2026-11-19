import os
import joblib
import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score
from preprocess import prepare_rfm_features

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASETS_DIR = os.path.join(BASE_DIR, 'datasets')
MODELS_DIR = os.path.join(BASE_DIR, 'models')
os.makedirs(MODELS_DIR, exist_ok=True)

def train_segmentation_model():
    print("=" * 60)
    print("TRAINING ML MODEL 3: CUSTOMER SEGMENTATION (K-MEANS RFM)")
    print("=" * 60)

    churn_csv = os.path.join(DATASETS_DIR, 'synthetic_customer_data.csv')
    if not os.path.exists(churn_csv):
        from generate_synthetic_data import generate_synthetic_business_dataset
        generate_synthetic_business_dataset()

    df_customers = pd.read_csv(churn_csv)
    rfm_log, rfm_raw = prepare_rfm_features(df_customers)

    scaler = StandardScaler()
    rfm_scaled = scaler.fit_transform(rfm_log)

    # Evaluate k from 3 to 6 using Silhouette score and Inertia
    best_k = 4
    best_silhouette = -1.0
    k_evals = {}

    for k in range(3, 7):
        km = KMeans(n_clusters=k, random_state=42, n_init=10)
        labels = km.fit_predict(rfm_scaled)
        sil = silhouette_score(rfm_scaled, labels)
        k_evals[k] = {
            'Inertia': round(float(km.inertia_), 2),
            'Silhouette_Score': round(float(sil), 4)
        }
        print(f"K={k} -> Inertia: {km.inertia_:,.1f} | Silhouette Score: {sil:.4f}")
        if sil > best_silhouette:
            best_silhouette = sil
            best_k = k

    print(f"\n>>> Selected Optimal K: {best_k} (Silhouette Score: {best_silhouette:.4f})")

    # Fit final model with optimal clusters
    final_kmeans = KMeans(n_clusters=best_k, random_state=42, n_init=15)
    cluster_labels = final_kmeans.fit_predict(rfm_scaled)
    rfm_raw['Cluster'] = cluster_labels

    # Dynamically assign meaningful segment business labels based on cluster center characteristics
    cluster_stats = rfm_raw.groupby('Cluster').mean()
    print("\nCluster RFM Means:")
    print(cluster_stats)

    # Sort clusters by Monetary and Frequency to tag:
    # 1. High-Value Champions (Low recency, high frequency, high monetary)
    # 2. Loyal Customers (Moderate recency, good frequency, moderate monetary)
    # 3. Occasional / Promising (Moderate recency, low frequency, low/medium monetary)
    # 4. At-Risk / Inactive (High recency, low frequency, low monetary)
    sorted_by_monetary = cluster_stats.sort_values(by=['Monetary', 'Frequency'], ascending=[False, False])
    label_map = {}
    standard_names = [
        'Champions (High Value)',
        'Loyal Regulars',
        'Occasional / Promising',
        'At Risk / Inactive'
    ]

    for idx, cluster_id in enumerate(sorted_by_monetary.index):
        name = standard_names[idx] if idx < len(standard_names) else f"Segment {idx+1}"
        label_map[int(cluster_id)] = name

    print("\nSegment Label Mapping:", label_map)

    model_payload = {
        'model': final_kmeans,
        'scaler': scaler,
        'features': ['Recency', 'Frequency', 'Monetary'],
        'n_clusters': best_k,
        'label_mapping': label_map,
        'evaluation': k_evals,
        'silhouette_score': round(float(best_silhouette), 4),
        'last_trained': pd.Timestamp.now().isoformat()
    }

    model_path = os.path.join(MODELS_DIR, 'customer_segmentation.joblib')
    joblib.dump(model_payload, model_path)
    print(f"Model successfully saved to: {model_path}\n")

    return model_payload

if __name__ == '__main__':
    train_segmentation_model()
