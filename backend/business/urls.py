from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoryViewSet,
    CustomerViewSet,
    ProductViewSet,
    OrderViewSet,
    ExpenseViewSet,
    DatasetViewSet,
    CSVPreviewView,
    CSVImportProcessView,
)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'customers', CustomerViewSet)
router.register(r'products', ProductViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'expenses', ExpenseViewSet)
router.register(r'datasets', DatasetViewSet)

urlpatterns = [
    path('import/preview/', CSVPreviewView.as_view(), name='csv_preview'),
    path('import/process/', CSVImportProcessView.as_view(), name='csv_process'),
    path('', include(router.urls)),
]
