from django.contrib import admin

from main.models import Product, ProductStock, Warehouse


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "price")


@admin.register(ProductStock)
class ProductStockAdmin(admin.ModelAdmin):
    list_display = ("id", "product", "warehouse", "quantity")


@admin.register(Warehouse)
class WarehouseAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "location")
