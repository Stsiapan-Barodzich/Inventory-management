from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Product, ProductStock, Warehouse


class UserSerializer(serializers.ModelSerializer[User]):
    class Meta:
        model = User
        fields = "__all__"


class ProductSerializer(serializers.ModelSerializer[Product]):
    class Meta:
        model = Product
        fields = "__all__"


class ProductStockSerializer(serializers.ModelSerializer[ProductStock]):
    class Meta:
        model = ProductStock
        fields = "__all__"


class WarehouseSerializer(serializers.ModelSerializer[Warehouse]):
    class Meta:
        model = Warehouse
        fields = "__all__"
