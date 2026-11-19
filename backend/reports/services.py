import os
import io
import csv
from datetime import datetime
from django.utils import timezone
from django.conf import settings
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

from business.models import Sale, Order, Customer, Product, Expense, Report, MLPrediction

class ReportService:
    """
    Produces executive business intelligence reports in CSV and PDF formats,
    strictly bounded to tenant scope.
    """

    @classmethod
    def generate_report(cls, company, user, report_type, file_format='CSV', date_from=None, date_to=None):
        timestamp = timezone.now().strftime('%Y%m%d_%H%M%S')
        title = f"{company.name} - {report_type.replace('_', ' ').title()} Report"
        filename = f"{report_type.lower()}_{timestamp}.{file_format.lower()}"

        report_dir = os.path.join(settings.MEDIA_ROOT, 'reports', str(company.id))
        os.makedirs(report_dir, exist_ok=True)
        file_path = os.path.join(report_dir, filename)

        # Retrieve relevant records
        headers, data_rows = cls.extract_report_data(company, report_type, date_from, date_to)

        if file_format.upper() == 'CSV':
            with open(file_path, 'w', newline='', encoding='utf-8') as f:
                writer = csv.writer(f)
                writer.writerow(headers)
                for r in data_rows:
                    writer.writerow(r)
        else:
            # Generate PDF using ReportLab
            doc = SimpleDocTemplate(file_path, pagesize=letter, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
            elements = []
            styles = getSampleStyleSheet()

            title_style = ParagraphStyle(
                'ReportTitle',
                parent=styles['Heading1'],
                fontSize=18,
                textColor=colors.HexColor('#1e1b4b'),
                spaceAfter=12
            )
            meta_style = ParagraphStyle(
                'ReportMeta',
                parent=styles['Normal'],
                fontSize=9,
                textColor=colors.HexColor('#64748b'),
                spaceAfter=18
            )

            elements.append(Paragraph(title, title_style))
            elements.append(Paragraph(f"Generated: {timezone.now().strftime('%B %d, %Y %H:%M UTC')} | Organization: {company.name} | Records: {len(data_rows)}", meta_style))
            elements.append(Spacer(1, 10))

            table_data = [headers] + data_rows[:150] # Top 150 rows in printable PDF table
            pdf_table = Table(table_data, repeatRows=1)
            pdf_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#4f46e5')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 9),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 6),
                ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f8fafc')),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
                ('FONTSIZE', (0, 1), (-1, -1), 8),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f1f5f9')]),
            ]))
            elements.append(pdf_table)
            doc.build(elements)

        file_url = f"{settings.MEDIA_URL}reports/{company.id}/{filename}"

        report_record = Report.objects.create(
            company=company,
            title=title,
            report_type=report_type,
            file_format=file_format.upper(),
            file_url=file_url,
            status='READY',
            created_by=user,
            parameters={'date_from': date_from, 'date_to': date_to, 'record_count': len(data_rows)}
        )
        return report_record

    @classmethod
    def extract_report_data(cls, company, report_type, date_from, date_to):
        if report_type == 'CONSOLIDATED':
            # Complete consolidated business report containing sales, customer, and product details in one CSV
            sales = Sale.objects.filter(company=company)
            if date_from:
                sales = sales.filter(sale_date__gte=date_from)
            if date_to:
                sales = sales.filter(sale_date__lte=date_to)
            
            headers = [
                'Sale ID', 'Order Date', 'Customer Name', 'Customer Email', 'Customer Region',
                'Product Name', 'Category', 'Quantity', 'Unit Price (PKR)', 'Total Amount (PKR)', 'Status'
            ]
            rows = [
                [
                    s.id,
                    s.sale_date.strftime('%Y-%m-%d %H:%M'),
                    s.customer.name,
                    s.customer.email,
                    s.customer.region or s.region,
                    s.product.name,
                    s.product.category.name if s.product and s.product.category else 'General',
                    s.quantity,
                    f"{s.unit_price:.0f}",
                    f"{s.total_amount:.0f}",
                    'Completed'
                ]
                for s in sales[:1000]
            ]
            return headers, rows

        elif report_type == 'SALES':
            qs = Sale.objects.filter(company=company)
            if date_from:
                qs = qs.filter(sale_date__gte=date_from)
            if date_to:
                qs = qs.filter(sale_date__lte=date_to)
            headers = ['Sale ID', 'Date', 'Customer', 'Product', 'Quantity', 'Unit Price (PKR)', 'Total (PKR)', 'Region']
            rows = [
                [s.id, s.sale_date.strftime('%Y-%m-%d %H:%M'), s.customer.name, s.product.name, s.quantity, f"{s.unit_price:.0f}", f"{s.total_amount:.0f}", s.region]
                for s in qs[:500]
            ]
            return headers, rows

        elif report_type == 'CUSTOMER':
            qs = Customer.objects.filter(company=company, is_active=True)
            headers = ['Customer ID', 'Name', 'Email', 'Phone', 'Region', 'Country', 'Joined Date']
            rows = [
                [c.id, c.name, c.email, c.phone or '-', c.region, c.country, c.created_at.strftime('%Y-%m-%d')]
                for c in qs[:500]
            ]
            return headers, rows

        elif report_type == 'PRODUCT':
            qs = Product.objects.filter(company=company, is_active=True)
            headers = ['SKU', 'Product Name', 'Category', 'Unit Price (PKR)', 'Unit Cost (PKR)', 'Stock', 'Margin (%)']
            rows = [
                [p.sku, p.name, p.category.name if p.category else 'General', f"{p.unit_price:.0f}", f"{p.unit_cost:.0f}", p.stock_quantity, f"{((p.unit_price - p.unit_cost)/p.unit_price*100):.1f}%" if p.unit_price > 0 else '0%']
                for p in qs[:500]
            ]
            return headers, rows

        elif report_type == 'REVENUE':
            sales = Sale.objects.filter(company=company)
            expenses = Expense.objects.filter(company=company)
            headers = ['Type', 'Identifier / Category', 'Date', 'Amount (PKR)']
            rows = []
            for s in sales[:300]:
                rows.append(['REVENUE', f"Sale #{s.id} ({s.product.name})", s.sale_date.strftime('%Y-%m-%d'), f"+{s.total_amount:.0f}"])
            for e in expenses[:200]:
                rows.append(['EXPENSE', f"Expense: {e.category} - {e.description}", e.expense_date.strftime('%Y-%m-%d'), f"-{e.amount:.0f}"])
            return headers, rows

        else: # ML_PREDICTIONS
            preds = MLPrediction.objects.filter(company=company)
            headers = ['Prediction ID', 'Model Type', 'Target / Entity', 'Predicted Value', 'Probability', 'Category', 'Date']
            rows = [
                [p.id, p.model_type, p.target_label or p.target_id, f"{p.prediction_value:.2f}" if p.prediction_value else '-', f"{p.probability:.1f}%" if p.probability else '-', p.risk_category or '-', p.created_at.strftime('%Y-%m-%d')]
                for p in preds[:500]
            ]
            return headers, rows
