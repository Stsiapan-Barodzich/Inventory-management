# from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework.viewsets import ModelViewSet

from main.models import Product, ProductStock, Warehouse
from main.serializers import (
    ProductSerializer,
    ProductStockSerializer,
    UserSerializer,
    WarehouseSerializer,
)


class WarehouseViewSet(ModelViewSet):
    queryset = Warehouse.objects.all()
    serializer_class = WarehouseSerializer


class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class ProductViewSet(ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class ProductStockViewSet(ModelViewSet):
    queryset = ProductStock.objects.all()
    serializer_class = ProductStockSerializer
