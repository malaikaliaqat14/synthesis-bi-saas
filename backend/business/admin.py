from django.contrib import admin
from .models import (
    Category,
    Customer,
    Product,
    Order,
    OrderItem,
    Sale,
    Expense,
    Dataset,
    Report,
    MLPrediction,
    AnalyticsSnapshot
)

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    autocomplete_fields = ['product']

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'company', 'created_at')
    list_filter = ('company',)
    search_fields = ('name', 'company__name')

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'company', 'region', 'phone', 'is_active', 'created_at')
    list_filter = ('region', 'is_active', 'company')
    search_fields = ('name', 'email', 'phone', 'company__name')

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'sku', 'company', 'category', 'unit_price', 'unit_cost', 'stock_quantity', 'is_active')
    list_filter = ('is_active', 'category', 'company')
    search_fields = ('name', 'sku', 'company__name')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'company', 'customer', 'status', 'total_amount', 'order_date')
    list_filter = ('status', 'company', 'order_date')
    search_fields = ('order_number', 'customer__name', 'customer__email', 'company__name')
    inlines = [OrderItemInline]
    date_hierarchy = 'order_date'

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'product', 'quantity', 'unit_price', 'subtotal')
    search_fields = ('order__order_number', 'product__name')

@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    list_display = ('product', 'company', 'customer', 'quantity', 'unit_price', 'total_amount', 'region', 'sale_date')
    list_filter = ('region', 'company', 'sale_date')
    search_fields = ('product__name', 'customer__name', 'company__name')
    date_hierarchy = 'sale_date'

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('category', 'company', 'amount', 'expense_date', 'description')
    list_filter = ('category', 'company', 'expense_date')
    search_fields = ('category', 'description', 'company__name')
    date_hierarchy = 'expense_date'

@admin.register(Dataset)
class DatasetAdmin(admin.ModelAdmin):
    list_display = ('name', 'company', 'row_count', 'status', 'created_by', 'created_at')
    list_filter = ('status', 'file_type', 'company')
    search_fields = ('name', 'company__name')

@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ('title', 'company', 'report_type', 'file_format', 'status', 'created_by', 'created_at')
    list_filter = ('report_type', 'file_format', 'status', 'company')
    search_fields = ('title', 'company__name')

@admin.register(MLPrediction)
class MLPredictionAdmin(admin.ModelAdmin):
    list_display = ('model_type', 'target_label', 'company', 'prediction_value', 'risk_category', 'created_at')
    list_filter = ('model_type', 'risk_category', 'company')
    search_fields = ('target_label', 'company__name')

@admin.register(AnalyticsSnapshot)
class AnalyticsSnapshotAdmin(admin.ModelAdmin):
    list_display = ('snapshot_date', 'company', 'total_revenue', 'total_orders', 'net_profit', 'aov')
    list_filter = ('company', 'snapshot_date')
    date_hierarchy = 'snapshot_date'
