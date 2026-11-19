from rest_framework import serializers
from decimal import Decimal
from .models import Category, Customer, Product, Order, OrderItem, Sale, Expense, Dataset, Report, MLPrediction, AnalyticsSnapshot

class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'created_at', 'updated_at', 'product_count']
        read_only_fields = ['id', 'created_at', 'updated_at', 'product_count']

    def get_product_count(self, obj):
        return obj.products.filter(is_active=True).count()


class CustomerSerializer(serializers.ModelSerializer):
    total_orders = serializers.SerializerMethodField()
    total_spent = serializers.SerializerMethodField()

    class Meta:
        model = Customer
        fields = [
            'id', 'name', 'email', 'phone', 'address', 'city', 'state',
            'country', 'postal_code', 'region', 'is_active', 'created_at',
            'updated_at', 'total_orders', 'total_spent'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'total_orders', 'total_spent']

    def get_total_orders(self, obj):
        return obj.orders.count()

    def get_total_spent(self, obj):
        return float(sum(order.total_amount for order in obj.orders.all()) if obj.orders.exists() else 0.0)


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    profit_margin = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'category', 'category_name', 'name', 'sku', 'description',
            'unit_price', 'unit_cost', 'stock_quantity', 'reorder_level',
            'is_active', 'created_at', 'updated_at', 'profit_margin'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'category_name', 'profit_margin']

    def get_profit_margin(self, obj):
        if obj.unit_price > 0:
            margin = ((obj.unit_price - obj.unit_cost) / obj.unit_price) * 100
            return round(float(margin), 1)
        return 0.0


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_sku = serializers.CharField(source='product.sku', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'product_sku', 'quantity', 'unit_price', 'subtotal']
        read_only_fields = ['id', 'subtotal', 'product_name', 'product_sku']


class OrderSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    customer_email = serializers.CharField(source='customer.email', read_only=True)
    items = OrderItemSerializer(many=True, required=False)

    class Meta:
        model = Order
        fields = [
            'id', 'customer', 'customer_name', 'customer_email', 'order_number',
            'order_date', 'status', 'total_amount', 'notes', 'items',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'customer_name', 'customer_email', 'created_at', 'updated_at']

    def create(self, validated_data):
        items_data = self.context['request'].data.get('items', [])
        validated_data['company'] = self.context['request'].company
        validated_data['created_by'] = self.context['request'].user
        
        # Calculate total if not provided
        order = Order.objects.create(**validated_data)
        total = Decimal('0.00')

        for item_data in items_data:
            product = Product.objects.get(id=item_data['product'], company=order.company)
            qty = int(item_data.get('quantity', 1))
            price = Decimal(str(item_data.get('unit_price', product.unit_price)))
            subtotal = price * qty
            total += subtotal

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=qty,
                unit_price=price,
                subtotal=subtotal
            )

            # Record in Sales table for BI aggregation
            Sale.objects.create(
                company=order.company,
                order=order,
                customer=order.customer,
                product=product,
                sale_date=order.order_date,
                quantity=qty,
                unit_price=price,
                total_amount=subtotal,
                region=order.customer.region
            )

            # Deduct stock
            if product.stock_quantity >= qty:
                product.stock_quantity -= qty
                product.save()

        order.total_amount = total
        order.save()
        return order


class ExpenseSerializer(serializers.ModelSerializer):
    created_by_email = serializers.CharField(source='created_by.email', read_only=True)

    class Meta:
        model = Expense
        fields = [
            'id', 'category', 'amount', 'expense_date', 'description',
            'created_by', 'created_by_email', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_by', 'created_by_email', 'created_at', 'updated_at']


class DatasetSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.CharField(source='created_by.email', read_only=True)

    class Meta:
        model = Dataset
        fields = [
            'id', 'name', 'file', 'file_type', 'row_count', 'status',
            'error_message', 'summary_json', 'uploaded_by', 'created_at'
        ]
        read_only_fields = ['id', 'file_type', 'row_count', 'status', 'error_message', 'summary_json', 'uploaded_by', 'created_at']


class ReportSerializer(serializers.ModelSerializer):
    generated_by = serializers.CharField(source='created_by.email', read_only=True)

    class Meta:
        model = Report
        fields = [
            'id', 'title', 'report_type', 'parameters', 'status',
            'file_url', 'file_format', 'generated_by', 'created_at'
        ]
        read_only_fields = ['id', 'status', 'file_url', 'generated_by', 'created_at']


class MLPredictionSerializer(serializers.ModelSerializer):
    class Meta:
        model = MLPrediction
        fields = [
            'id', 'model_type', 'target_id', 'target_label', 'prediction_value',
            'probability', 'risk_category', 'details', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
