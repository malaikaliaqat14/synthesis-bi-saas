import os
import io
import pandas as pd
from decimal import Decimal
from datetime import datetime
from django.utils import timezone
from django.db import transaction
from django.db.models import Q
from rest_framework import status, permissions, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from companies.permissions import TenantRequired, IsCompanyManagerOrAdmin
from .models import Category, Customer, Product, Order, OrderItem, Sale, Expense, Dataset
from .serializers import (
    CategorySerializer,
    CustomerSerializer,
    ProductSerializer,
    OrderSerializer,
    ExpenseSerializer,
    DatasetSerializer,
)

class BaseTenantViewSet(viewsets.ModelViewSet):
    """Base ViewSet ensuring strict tenant isolation across all CRUD queries"""
    permission_classes = [permissions.IsAuthenticated, TenantRequired]

    def get_queryset(self):
        return self.queryset.filter(company=self.request.company)

    def perform_create(self, serializer):
        serializer.save(company=self.request.company)


class CategoryViewSet(BaseTenantViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class CustomerViewSet(BaseTenantViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        search = self.request.query_params.get('search')
        region = self.request.query_params.get('region')
        is_active = self.request.query_params.get('is_active')

        if search:
            qs = qs.filter(Q(name__icontains=search) | Q(email__icontains=search) | Q(phone__icontains=search))
        if region:
            qs = qs.filter(region=region)
        if is_active is not None:
            qs = qs.filter(is_active=is_active.lower() == 'true')
        return qs

    def perform_destroy(self, instance):
        # Soft delete
        instance.is_active = False
        instance.save()


class ProductViewSet(BaseTenantViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        search = self.request.query_params.get('search')
        category_id = self.request.query_params.get('category')
        low_stock = self.request.query_params.get('low_stock')

        if search:
            qs = qs.filter(Q(name__icontains=search) | Q(sku__icontains=search))
        if category_id:
            qs = qs.filter(category_id=category_id)
        if low_stock and low_stock.lower() == 'true':
            qs = qs.filter(stock_quantity__lte=models.F('reorder_level'))
        return qs

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()


class OrderViewSet(BaseTenantViewSet):
    queryset = Order.objects.prefetch_related('items__product').select_related('customer')
    serializer_class = OrderSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        status_param = self.request.query_params.get('status')
        customer_id = self.request.query_params.get('customer')
        search = self.request.query_params.get('search')

        if status_param:
            qs = qs.filter(status=status_param)
        if customer_id:
            qs = qs.filter(customer_id=customer_id)
        if search:
            qs = qs.filter(Q(order_number__icontains=search) | Q(customer__name__icontains=search))
        return qs


class ExpenseViewSet(BaseTenantViewSet):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        category = self.request.query_params.get('category')
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')

        if category:
            qs = qs.filter(category=category)
        if start_date:
            qs = qs.filter(expense_date__gte=start_date)
        if end_date:
            qs = qs.filter(expense_date__lte=end_date)
        return qs

    def perform_create(self, serializer):
        serializer.save(company=self.request.company, created_by=self.request.user)


class DatasetViewSet(BaseTenantViewSet):
    queryset = Dataset.objects.all()
    serializer_class = DatasetSerializer
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        serializer.save(company=self.request.company, created_by=self.request.user)

    def perform_destroy(self, instance):
        """
        When a dataset ingestion record is deleted:
        Delete all orders, sales, order items specifically belonging to this dataset.
        Also cleanup any orphan customers or products that have no other orders/sales.
        """
        company = instance.company
        with transaction.atomic():
            # Delete physical file
            if instance.file:
                instance.file.delete(save=False)

            dataset_id = instance.id
            
            # 1. Delete sales linked to this dataset
            Sale.objects.filter(dataset=instance).delete()

            # 2. Delete orders (and cascaded order items) linked to this dataset
            Order.objects.filter(dataset=instance).delete()

            # Delete the dataset itself
            instance.delete()

            # 3. Clean up orphan customers (who now have 0 orders)
            Customer.objects.filter(company=company, orders__isnull=True).delete()

            # 4. Clean up orphan products (which have no orders)
            Product.objects.filter(company=company, order_items__isnull=True).delete()

            # If all datasets are gone, ensure 100% clean reset
            remaining = Dataset.objects.filter(company=company).count()
            if remaining == 0:
                Sale.objects.filter(company=company).delete()
                OrderItem.objects.filter(order__company=company).delete()
                Order.objects.filter(company=company).delete()
                Product.objects.filter(company=company).delete()
                Customer.objects.filter(company=company).delete()


def normalize_col_name(c):
    raw = str(c).strip().lower().replace(' ', '_').replace('-', '_')
    if raw in ['date', 'order_date', 'transaction_date']:
        return 'date'
    if raw in ['customer', 'customer_name', 'client', 'buyer', 'user']:
        return 'customer'
    if raw in ['customer_id', 'client_id']:
        return 'customer_id'
    if raw in ['customer_email', 'email']:
        return 'customer_email'
    if raw in ['city', 'town', 'district']:
        return 'city'
    if raw in ['country', 'nation']:
        return 'country'
    if raw in ['product', 'product_name', 'item', 'item_name', 'sku_name']:
        return 'product'
    if raw in ['category', 'product_category', 'department']:
        return 'category'
    if raw in ['quantity', 'qty', 'units', 'volume']:
        return 'quantity'
    if raw in ['price', 'unit_price', 'amount_per_unit', 'rate']:
        return 'price'
    if raw in ['cost', 'unit_cost', 'product_cost']:
        return 'cost'
    if raw in ['total', 'total_amount', 'revenue', 'order_total', 'gross_amount', 'sales']:
        return 'total_amount'
    if raw in ['region', 'country', 'market', 'location']:
        return 'region'
    return raw


class CSVPreviewView(APIView):
    """Upload temporary CSV file to validate columns and preview first rows"""
    permission_classes = [permissions.IsAuthenticated, TenantRequired]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({'error': 'No file uploaded.'}, status=status.HTTP_400_BAD_REQUEST)

        if not file_obj.name.endswith('.csv'):
            return Response({'error': 'Invalid file format. Please upload a CSV file.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Read first chunk with Pandas
            df = pd.read_csv(file_obj, nrows=10)
            mapped_cols = [normalize_col_name(col) for col in df.columns]
            
            required_cols = ['date', 'customer', 'product', 'quantity', 'price']
            missing = [c for c in required_cols if c not in mapped_cols]

            preview_data = df.head(5).to_dict(orient='records')
            
            return Response({
                'filename': file_obj.name,
                'detected_columns': list(df.columns),
                'normalized_columns': mapped_cols,
                'missing_required_columns': missing,
                'is_valid': len(missing) == 0,
                'preview_rows': preview_data,
                'estimated_rows': len(df),
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': f'Failed to parse CSV: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)


class CSVImportProcessView(APIView):
    """Processes uploaded CSV file with Pandas and loads records into MySQL"""
    permission_classes = [permissions.IsAuthenticated, TenantRequired, IsCompanyManagerOrAdmin]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def post(self, request):
        file_obj = request.FILES.get('file')
        company = request.company
        user = request.user

        if not file_obj:
            return Response({'error': 'No file provided.'}, status=status.HTTP_400_BAD_REQUEST)

        # Create Dataset entry
        dataset = Dataset.objects.create(
            company=company,
            name=file_obj.name,
            file=file_obj,
            status='PROCESSING',
            created_by=user
        )

        try:
            # Read full file with Pandas
            file_obj.seek(0)
            df = pd.read_csv(file_obj)

            # Standardize and map column names
            col_mapping = {col: normalize_col_name(col) for col in df.columns}
            df.rename(columns=col_mapping, inplace=True)

            # Required column check
            req = ['date', 'customer', 'product', 'quantity', 'price']
            for col in req:
                if col not in df.columns:
                    dataset.status = 'FAILED'
                    dataset.error_message = f"Missing required column: {col}"
                    dataset.save()
                    return Response({'error': dataset.error_message}, status=status.HTTP_400_BAD_REQUEST)

            # Data cleaning with Pandas
            initial_count = len(df)
            df.dropna(subset=['customer', 'product', 'quantity', 'price'], inplace=True)
            df.drop_duplicates(inplace=True)

            # Cast and sanitize numbers
            df['quantity'] = pd.to_numeric(df['quantity'], errors='coerce').fillna(1).astype(int)
            df['price'] = pd.to_numeric(df['price'], errors='coerce').fillna(0.0)
            df = df[(df['quantity'] > 0) & (df['price'] >= 0)]

            # Calculate revenue
            df['total_amount'] = df['quantity'] * df['price']

            # Parse dates
            df['parsed_date'] = pd.to_datetime(df['date'], errors='coerce')
            df['parsed_date'] = df['parsed_date'].fillna(pd.Timestamp.now())

            # Check for city and region column
            city_col = None
            for candidate in ['city', 'town', 'district']:
                if candidate in df.columns:
                    city_col = candidate
                    break

            region_col = None
            for candidate in ['region', 'province', 'state']:
                if candidate in df.columns:
                    region_col = candidate
                    break

            punjab_cities = ['lahore', 'faisalabad', 'rawalpindi', 'multan', 'sialkot', 'gujranwala', 'bahawalpur', 'sargodha', 'gujrat', 'sahiwal', 'jhelum', 'rahim yar khan']
            sindh_cities = ['karachi', 'hyderabad', 'sukkur', 'larkana']
            kpk_cities = ['peshawar', 'abbottabad', 'mardan', 'swat']
            balochistan_cities = ['quetta', 'gwadar']

            def resolve_region(c_name, c_city, explicit_region):
                if explicit_region and explicit_region.lower() not in ['nan', '', 'none', 'north america']:
                    return explicit_region
                c_low = (c_city or '').lower().strip()
                if c_low in punjab_cities:
                    return 'Punjab'
                if c_low in sindh_cities:
                    return 'Sindh'
                if c_low in kpk_cities:
                    return 'Khyber Pakhtunkhwa'
                if c_low in balochistan_cities:
                    return 'Balochistan'
                if 'islamabad' in c_low:
                    return 'Islamabad Capital'
                return c_city or 'Punjab'

            cleaned_count = len(df)

            # Perform bulk database operations inside transaction
            created_customers = 0
            created_products = 0
            created_orders = 0

            with transaction.atomic():
                # Cache existing customers and products for tenant
                cust_cache = {c.name.lower(): c for c in Customer.objects.filter(company=company)}
                prod_cache = {p.name.lower(): p for p in Product.objects.filter(company=company)}

                sales_to_create = []

                for _, row in df.iterrows():
                    cust_name = str(row['customer']).strip()
                    prod_name = str(row['product']).strip()
                    cust_email = str(row.get('customer_email', '')).strip() if 'customer_email' in row else ''
                    if not cust_email or cust_email.lower() == 'nan':
                        cust_email = f"{cust_name.lower().replace(' ', '.')}@example.com"

                    city = str(row[city_col]).strip() if (city_col and str(row[city_col]).lower() != 'nan') else ''
                    explicit_reg = str(row[region_col]).strip() if (region_col and str(row[region_col]).lower() != 'nan') else ''
                    region = resolve_region(cust_name, city, explicit_reg)
                    country = 'Pakistan'

                    # Find or create customer
                    if cust_name.lower() not in cust_cache:
                        c_obj = Customer.objects.create(
                            company=company,
                            name=cust_name,
                            email=cust_email,
                            city=city,
                            country=country,
                            region=region
                        )
                        cust_cache[cust_name.lower()] = c_obj
                        created_customers += 1
                    else:
                        c_obj = cust_cache[cust_name.lower()]
                        changed = False
                        if city and not c_obj.city:
                            c_obj.city = city
                            changed = True
                        if region and (not c_obj.region or c_obj.region == 'North America'):
                            c_obj.region = region
                            changed = True
                        if changed:
                            c_obj.save()
                    customer = cust_cache[cust_name.lower()]

                    # Find or create product
                    if prod_name.lower() not in prod_cache:
                        sku = f"SKU-{prod_name[:3].upper()}-{len(prod_cache)+1:04d}"
                        p_obj = Product.objects.create(
                            company=company,
                            name=prod_name,
                            sku=sku,
                            unit_price=Decimal(str(round(row['price'], 2))),
                            unit_cost=Decimal(str(round(row['price'] * 0.6, 2))),
                            stock_quantity=100
                        )
                        prod_cache[prod_name.lower()] = p_obj
                        created_products += 1
                    product = prod_cache[prod_name.lower()]

                    # Create order
                    order_num = f"ORD-{int(row['parsed_date'].timestamp())}-{created_orders+1}"
                    order = Order.objects.create(
                        company=company,
                        customer=customer,
                        dataset=dataset,
                        order_number=order_num,
                        order_date=row['parsed_date'],
                        status='COMPLETED',
                        total_amount=Decimal(str(round(row['total_amount'], 2))),
                        created_by=user
                    )
                    created_orders += 1

                    OrderItem.objects.create(
                        order=order,
                        product=product,
                        quantity=int(row['quantity']),
                        unit_price=Decimal(str(round(row['price'], 2))),
                        subtotal=Decimal(str(round(row['total_amount'], 2)))
                    )

                    sales_to_create.append(
                        Sale(
                            company=company,
                            order=order,
                            dataset=dataset,
                            customer=customer,
                            product=product,
                            sale_date=row['parsed_date'],
                            quantity=int(row['quantity']),
                            unit_price=Decimal(str(round(row['price'], 2))),
                            total_amount=Decimal(str(round(row['total_amount'], 2))),
                            region=region
                        )
                    )

                if sales_to_create:
                    Sale.objects.bulk_create(sales_to_create)

            # Update dataset
            dataset.status = 'COMPLETED'
            dataset.row_count = cleaned_count
            dataset.summary_json = {
                'initial_rows': initial_count,
                'imported_rows': cleaned_count,
                'created_customers': created_customers,
                'created_products': created_products,
                'created_orders': created_orders,
                'total_revenue': float(df['total_amount'].sum()),
            }
            dataset.save()

            return Response({
                'message': 'CSV data successfully imported and synced to database.',
                'summary': dataset.summary_json,
                'dataset_id': dataset.id
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            dataset.status = 'FAILED'
            dataset.error_message = str(e)
            dataset.save()
            return Response({'error': f"Import processing failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
