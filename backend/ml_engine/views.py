from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response

from companies.permissions import TenantRequired, IsCompanyManagerOrAdmin
from .services import MLEngineService

class SalesForecastView(APIView):
    """
    GET /api/ml/sales-forecast/?days=14
    Returns AI sales forecasting time series with model metrics (MAE, RMSE, R²)
    """
    permission_classes = [permissions.IsAuthenticated, TenantRequired]

    def get(self, request):
        days = int(request.query_params.get('days', 14))
        days = min(max(days, 7), 60)  # Bound between 7 and 60 days
        data = MLEngineService.get_sales_forecast(company=request.company, days_ahead=days)
        return Response(data, status=status.HTTP_200_OK)


class CustomerChurnView(APIView):
    """
    GET /api/ml/churn/
    Returns churn probabilities, risk tiers, and flagged customer accounts
    """
    permission_classes = [permissions.IsAuthenticated, TenantRequired]

    def get(self, request):
        data = MLEngineService.get_customer_churn_predictions(company=request.company)
        return Response(data, status=status.HTTP_200_OK)


class CustomerSegmentsView(APIView):
    """
    GET /api/ml/segments/
    Returns K-Means RFM customer clusters, distribution, and VIP tags
    """
    permission_classes = [permissions.IsAuthenticated, TenantRequired]

    def get(self, request):
        data = MLEngineService.get_customer_segmentation(company=request.company)
        return Response(data, status=status.HTTP_200_OK)


class TriggerMLTrainView(APIView):
    """
    POST /api/ml/train/
    Triggers re-training of all 3 machine learning models (Admin/Manager only)
    """
    permission_classes = [permissions.IsAuthenticated, TenantRequired, IsCompanyManagerOrAdmin]

    def post(self, request):
        import sys, os
        ml_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'ml')
        if ml_path not in sys.path:
            sys.path.insert(0, ml_path)

        from train_sales_model import train_sales_forecast_model
        from train_churn_model import train_churn_model
        from train_segmentation_model import train_segmentation_model

        try:
            m1 = train_sales_forecast_model()
            m2 = train_churn_model()
            m3 = train_segmentation_model()

            return Response({
                'message': 'All machine learning models successfully trained and serialized to Joblib.',
                'sales_model': {'name': m1['model_name'], 'metrics': m1['metrics']},
                'churn_model': {'name': m2['model_name'], 'metrics': m2['metrics']},
                'segmentation_model': {'clusters': m3['n_clusters'], 'silhouette': m3['silhouette_score']},
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': f"Model training failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
