from django.urls import path
from .views import DashboardSummaryView, CustomerAnalyticsView, InsightsView

urlpatterns = [
    path('dashboard/', DashboardSummaryView.as_view(), name='analytics_dashboard'),
    path('customer-analytics/', CustomerAnalyticsView.as_view(), name='customer_analytics'),
    path('insights/', InsightsView.as_view(), name='analytics_insights'),
]
