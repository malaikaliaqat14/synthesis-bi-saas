from django.urls import path
from .views import ReportListView, ReportDownloadView

urlpatterns = [
    path('', ReportListView.as_view(), name='report_list_create'),
    path('<int:pk>/download/', ReportDownloadView.as_view(), name='report_download'),
]
