from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response

from companies.permissions import TenantRequired
from .services import AnalyticsService
from .insights import InsightsService

class DashboardSummaryView(APIView):
    """
    Returns full dashboard KPI cards and interactive charts scoped to current tenant.
    Accepts:
    - ?time_range=today|7d|30d|3m|6m|year|custom
    - ?start_date=YYYY-MM-DD
    - ?end_date=YYYY-MM-DD
    """
    permission_classes = [permissions.IsAuthenticated, TenantRequired]

    def get(self, request):
        time_range = request.query_params.get('time_range', '30d')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        data = AnalyticsService.get_dashboard_summary(
            company=request.company,
            time_range=time_range,
            start_date=start_date,
            end_date=end_date
        )
        return Response(data, status=status.HTTP_200_OK)


class CustomerAnalyticsView(APIView):
    """Returns Customer Lifetime Value, repeat rates, and cohort frequency analytics"""
    permission_classes = [permissions.IsAuthenticated, TenantRequired]

    def get(self, request):
        data = AnalyticsService.get_deep_customer_analytics(company=request.company)
        return Response(data, status=status.HTTP_200_OK)


class InsightsView(APIView):
    """Returns dynamic AI business insights generated from real MySQL data and ML predictions"""
    permission_classes = [permissions.IsAuthenticated, TenantRequired]

    def get(self, request):
        insights = InsightsService.generate_insights(company=request.company)
        return Response({'insights': insights}, status=status.HTTP_200_OK)
