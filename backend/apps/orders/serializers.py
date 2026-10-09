from rest_framework import serializers
from decimal import Decimal
from django.db import transaction
from .models import Order, OrderItem
from apps.catalog.models import Product

class OrderItemReadSerializer(serializers.ModelSerializer):
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    product_image = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'price', 'quantity', 'subtotal', 'product_image']

    def get_product_image(self, obj):
        if obj.product:
            main = obj.product.images.filter(is_main=True).first() or obj.product.images.first()
            if main and main.image:
                request = self.context.get('request')
                if request:
                    return request.build_absolute_uri(main.image.url)
                return main.image.url
        return None


class OrderItemCreateSerializer(serializers.Serializer):
    product = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1, default=1)


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemReadSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'user', 'full_name', 'phone', 'email', 'address',
            'comment', 'delivery_method', 'payment_method', 'status',
            'status_display', 'total', 'created_at', 'items'
        ]
        read_only_fields = ['id', 'user', 'status', 'total', 'created_at']


class OrderCreateSerializer(serializers.ModelSerializer):
    items = OrderItemCreateSerializer(many=True, write_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'full_name', 'phone', 'email', 'address',
            'comment', 'delivery_method', 'payment_method', 'items'
        ]

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError("Заказ должен содержать хотя бы один товар")
        return value

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        user = self.context['request'].user if self.context['request'].user.is_authenticated else None

        with transaction.atomic():
            total = Decimal('0.00')
            order_items_to_create = []

            for item_data in items_data:
                product_id = item_data['product']
                quantity = item_data['quantity']

                try:
                    product = Product.objects.select_for_update().get(id=product_id, is_active=True)
                except Product.DoesNotExist:
                    raise serializers.ValidationError(f"Товар с ID {product_id} не найден или недоступен")

                price = product.price
                item_total = price * quantity
                total += item_total

                if product.stock >= quantity:
                    product.stock -= quantity
                    product.save(update_fields=['stock'])

                order_items_to_create.append({
                    'product': product,
                    'product_name': product.name,
                    'price': price,
                    'quantity': quantity
                })

            order = Order.objects.create(
                user=user,
                total=total,
                **validated_data
            )

            for item_info in order_items_to_create:
                OrderItem.objects.create(
                    order=order,
                    product=item_info['product'],
                    product_name=item_info['product_name'],
                    price=item_info['price'],
                    quantity=item_info['quantity']
                )

        return order
