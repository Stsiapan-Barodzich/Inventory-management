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

# Create your views here.


class WarehouseViewSet(ModelViewSet[Warehouse]):
    queryset = Warehouse.objects.all()
    serializer_class = WarehouseSerializer


class UserViewSet(ModelViewSet[User]):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class ProductViewSet(ModelViewSet[Product]):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class ProductStockViewSet(ModelViewSet[ProductStock]):
    queryset = ProductStock.objects.all()
    serializer_class = ProductStockSerializer
