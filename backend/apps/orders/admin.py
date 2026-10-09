from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    fields = ("product", "product_name", "price", "quantity")

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "full_name", "phone", "total", "delivery_method", "payment_method", "status", "created_at")
    list_filter = ("status", "delivery_method", "payment_method", "created_at")
    search_fields = ("id", "full_name", "phone", "email")
    inlines = [OrderItemInline]
