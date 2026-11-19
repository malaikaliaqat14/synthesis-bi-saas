import uuid
from decimal import Decimal
from django.db import models
from django.conf import settings
from companies.models import Company

class Category(models.Model):
    """Product and business categorization within a company"""
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='categories')
    name = models.CharField(max_length=120)
    description = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'business_categories'
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'
        unique_together = ('company', 'name')
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.company.name})"


class Customer(models.Model):
    """Customer entity strictly scoped to tenant"""
    REGION_CHOICES = (
        ('Punjab', 'Punjab'),
        ('Sindh', 'Sindh'),
        ('Khyber Pakhtunkhwa', 'Khyber Pakhtunkhwa'),
        ('Balochistan', 'Balochistan'),
        ('Islamabad Capital', 'Islamabad Capital'),
        ('Asia-Pacific', 'Asia-Pacific'),
        ('Middle East & Africa', 'Middle East & Africa'),
        ('Europe', 'Europe'),
        ('North America', 'North America'),
        ('Latin America', 'Latin America'),
    )

    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='customers')
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=30, blank=True, default='')
    address = models.CharField(max_length=255, blank=True, default='')
    city = models.CharField(max_length=100, blank=True, default='')
    state = models.CharField(max_length=100, blank=True, default='')
    country = models.CharField(max_length=100, default='Pakistan')
    postal_code = models.CharField(max_length=20, blank=True, default='')
    region = models.CharField(max_length=60, choices=REGION_CHOICES, default='Punjab')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'business_customers'
        verbose_name = 'Customer'
        verbose_name_plural = 'Customers'
        indexes = [
            models.Index(fields=['company', 'email']),
            models.Index(fields=['company', 'region']),
            models.Index(fields=['company', 'is_active']),
            models.Index(fields=['company', 'created_at']),
        ]
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.company.name}"


class Product(models.Model):
    """Product catalog strictly scoped to tenant"""
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='products')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    name = models.CharField(max_length=200)
    sku = models.CharField(max_length=80)
    description = models.TextField(blank=True, default='')
    unit_price = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    unit_cost = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    stock_quantity = models.IntegerField(default=0)
    reorder_level = models.IntegerField(default=10)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'business_products'
        verbose_name = 'Product'
        verbose_name_plural = 'Products'
        unique_together = ('company', 'sku')
        indexes = [
            models.Index(fields=['company', 'sku']),
            models.Index(fields=['company', 'category']),
            models.Index(fields=['company', 'is_active']),
        ]
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.sku})"


class Order(models.Model):
    """Customer purchase order"""
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('PROCESSING', 'Processing'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
        ('REFUNDED', 'Refunded'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='orders')
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='orders')
    dataset = models.ForeignKey('Dataset', on_delete=models.CASCADE, null=True, blank=True, related_name='orders')
    order_number = models.CharField(max_length=50)
    order_date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='COMPLETED')
    total_amount = models.DecimalField(max_digits=14, decimal_places=2, default=Decimal('0.00'))
    notes = models.TextField(blank=True, default='')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='created_orders')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'business_orders'
        verbose_name = 'Order'
        verbose_name_plural = 'Orders'
        unique_together = ('company', 'order_number')
        indexes = [
            models.Index(fields=['company', 'order_date']),
            models.Index(fields=['company', 'status']),
            models.Index(fields=['company', 'customer']),
        ]
        ordering = ['-order_date']

    def __str__(self):
        return f"Order #{self.order_number} - {self.customer.name}"


class OrderItem(models.Model):
    """Individual line item within an order"""
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='order_items')
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)
    subtotal = models.DecimalField(max_digits=14, decimal_places=2)

    class Meta:
        db_table = 'business_order_items'
        verbose_name = 'Order Item'
        verbose_name_plural = 'Order Items'

    def save(self, *args, **kwargs):
        self.subtotal = self.unit_price * Decimal(self.quantity)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.quantity}x {self.product.name} @ ${self.unit_price}"


class Sale(models.Model):
    """Denormalized analytical sale transaction record for rapid BI queries and ML training"""
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='sales')
    order = models.ForeignKey(Order, on_delete=models.CASCADE, null=True, blank=True, related_name='sales')
    dataset = models.ForeignKey('Dataset', on_delete=models.CASCADE, null=True, blank=True, related_name='sales')
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='sales')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='sales')
    sale_date = models.DateTimeField()
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)
    total_amount = models.DecimalField(max_digits=14, decimal_places=2)
    region = models.CharField(max_length=60, default='North America')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'business_sales'
        verbose_name = 'Sale'
        verbose_name_plural = 'Sales'
        indexes = [
            models.Index(fields=['company', 'sale_date']),
            models.Index(fields=['company', 'product']),
            models.Index(fields=['company', 'region']),
            models.Index(fields=['company', 'customer']),
        ]
        ordering = ['-sale_date']

    def __str__(self):
        return f"Sale {self.product.name} - ${self.total_amount}"


class Expense(models.Model):
    """Company operational expense record"""
    CATEGORY_CHOICES = (
        ('Office', 'Office & Facilities'),
        ('Marketing', 'Marketing & Advertising'),
        ('R&D', 'Research & Development'),
        ('Operations', 'Cloud & Operations'),
        ('Salaries', 'Salaries & Benefits'),
        ('Logistics', 'Logistics & Shipping'),
        ('Other', 'General & Administrative'),
    )

    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='expenses')
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Operations')
    amount = models.DecimalField(max_digits=14, decimal_places=2)
    expense_date = models.DateField()
    description = models.TextField(blank=True, default='')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'business_expenses'
        verbose_name = 'Expense'
        verbose_name_plural = 'Expenses'
        indexes = [
            models.Index(fields=['company', 'expense_date']),
            models.Index(fields=['company', 'category']),
        ]
        ordering = ['-expense_date']

    def __str__(self):
        return f"{self.category} - ${self.amount} ({self.expense_date})"


class Dataset(models.Model):
    """Uploaded datasets (e.g. CSV) for historical import or background analytics processing"""
    STATUS_CHOICES = (
        ('PENDING', 'Pending Processing'),
        ('PROCESSING', 'Processing'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
    )

    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='datasets')
    name = models.CharField(max_length=200)
    file = models.FileField(upload_to='datasets/%Y/%m/')
    file_type = models.CharField(max_length=20, default='CSV')
    row_count = models.IntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    error_message = models.TextField(blank=True, default='')
    summary_json = models.JSONField(default=dict, blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'business_datasets'
        verbose_name = 'Dataset'
        verbose_name_plural = 'Datasets'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.status})"


class Report(models.Model):
    """Generated business intelligence and prediction reports"""
    TYPE_CHOICES = (
        ('SALES', 'Sales Performance Report'),
        ('CUSTOMER', 'Customer & Churn Report'),
        ('PRODUCT', 'Product Analytics Report'),
        ('REVENUE', 'Executive Revenue Report'),
        ('ML_PREDICTIONS', 'ML Forecast & Segmentation Report'),
    )
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('GENERATING', 'Generating'),
        ('READY', 'Ready'),
        ('FAILED', 'Failed'),
    )

    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='reports')
    title = models.CharField(max_length=200)
    report_type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    parameters = models.JSONField(default=dict, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    file_url = models.CharField(max_length=500, blank=True, null=True)
    file_format = models.CharField(max_length=10, default='CSV') # CSV or PDF
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'business_reports'
        verbose_name = 'Report'
        verbose_name_plural = 'Reports'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.company.name}"


class MLPrediction(models.Model):
    """Stored model outputs and risk scores for company entities"""
    MODEL_CHOICES = (
        ('SALES_FORECAST', 'Revenue & Sales Forecast'),
        ('CHURN_RISK', 'Customer Churn Classification'),
        ('SEGMENTATION', 'Customer RFM Segmentation'),
    )

    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='ml_predictions')
    model_type = models.CharField(max_length=30, choices=MODEL_CHOICES)
    target_id = models.CharField(max_length=100, blank=True, null=True)
    target_label = models.CharField(max_length=200, blank=True, null=True)
    prediction_value = models.FloatField(null=True, blank=True)
    probability = models.FloatField(null=True, blank=True)
    risk_category = models.CharField(max_length=50, blank=True, null=True)
    details = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'business_ml_predictions'
        verbose_name = 'ML Prediction'
        verbose_name_plural = 'ML Predictions'
        indexes = [
            models.Index(fields=['company', 'model_type']),
            models.Index(fields=['company', 'created_at']),
        ]
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.model_type}: {self.target_label} ({self.company.name})"


class AnalyticsSnapshot(models.Model):
    """Cached daily/weekly metrics snapshot for rapid historical BI reporting"""
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='analytics_snapshots')
    snapshot_date = models.DateField()
    total_revenue = models.DecimalField(max_digits=16, decimal_places=2, default=Decimal('0.00'))
    total_orders = models.IntegerField(default=0)
    total_customers = models.IntegerField(default=0)
    total_expenses = models.DecimalField(max_digits=16, decimal_places=2, default=Decimal('0.00'))
    net_profit = models.DecimalField(max_digits=16, decimal_places=2, default=Decimal('0.00'))
    aov = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    metrics_json = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'business_analytics_snapshots'
        unique_together = ('company', 'snapshot_date')
        ordering = ['-snapshot_date']

    def __str__(self):
        return f"Snapshot {self.snapshot_date} - {self.company.name}"
