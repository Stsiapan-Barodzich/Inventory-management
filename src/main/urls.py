from django.urls import include, path
from rest_framework.routers import DefaultRouter

from main.views import (
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
]
