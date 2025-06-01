# from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from main.views import (
    LoginAPIView,
    LogoutAPIView,
    ProductStockViewSet,
    ProductViewSet,
    UserViewSet,
    WarehouseViewSet,
)

router = DefaultRouter()
router.register(r"warehouses", WarehouseViewSet)
router.register(r"products", ProductViewSet)
router.register(r"product-stocks", ProductStockViewSet)
router.register(r"users", UserViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("login/", LoginAPIView.as_view(), name="login"),
    path("logout/", LogoutAPIView.as_view(), name="logout"),
]
