from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import FileResponse, Http404
import os

from companies.permissions import TenantRequired
from business.models import Report
from business.serializers import ReportSerializer
from .services import ReportService

class ReportListView(APIView):
    """
    GET /api/reports/ -> List generated reports for tenant
    POST /api/reports/ -> Generate new report (CSV or PDF)
    """
    permission_classes = [permissions.IsAuthenticated, TenantRequired]

    def get(self, request):
        reports = Report.objects.filter(company=request.company).order_by('-created_at')
        serializer = ReportSerializer(reports, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        report_type = request.data.get('report_type', 'SALES')
        file_format = request.data.get('file_format', 'CSV')
        date_from = request.data.get('date_from')
        date_to = request.data.get('date_to')

        valid_types = ['CONSOLIDATED', 'SALES', 'CUSTOMER', 'PRODUCT', 'REVENUE', 'ML_PREDICTIONS']
        if report_type not in valid_types:
            return Response({'error': f"Invalid report type. Must be one of: {valid_types}"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            report_record = ReportService.generate_report(
                company=request.company,
                user=request.user,
                report_type=report_type,
                file_format=file_format,
                date_from=date_from,
                date_to=date_to
            )
            serializer = ReportSerializer(report_record)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': f"Report generation failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ReportDownloadView(APIView):
    """
    GET /api/reports/<id>/download/ -> Streams the generated file
    """
    permission_classes = [permissions.IsAuthenticated, TenantRequired]

    def get(self, request, pk):
        try:
            report = Report.objects.get(pk=pk, company=request.company)
            # Find file path on filesystem
            from django.conf import settings
            relative_url = report.file_url.replace(settings.MEDIA_URL, '')
            full_path = os.path.join(settings.MEDIA_ROOT, relative_url)

            if not os.path.exists(full_path):
                raise Http404("Report file not found on disk.")

            response = FileResponse(open(full_path, 'rb'))
            ext = 'csv' if report.file_format == 'CSV' else 'pdf'
            response['Content-Disposition'] = f'attachment; filename="{report.report_type.lower()}_report.{ext}"'
            return response
        except Report.DoesNotExist:
            raise Http404("Report not found.")
