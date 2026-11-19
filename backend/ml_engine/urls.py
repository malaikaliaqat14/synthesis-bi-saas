from django.urls import path
from .views import SalesForecastView, CustomerChurnView, CustomerSegmentsView, TriggerMLTrainView

urlpatterns = [
    path('sales-forecast/', SalesForecastView.as_view(), name='ml_sales_forecast'),
    path('churn/', CustomerChurnView.as_view(), name='ml_churn'),
    path('segments/', CustomerSegmentsView.as_view(), name='ml_segments'),
    path('train/', TriggerMLTrainView.as_view(), name='ml_train'),
]
