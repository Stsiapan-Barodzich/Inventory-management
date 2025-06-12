from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from main.views import (
    LoginAPIView,
    LogoutAPIView,
    ProductStockViewSet,
    ProductViewSet,
    UserViewSet,
    WarehouseViewSet,
)

router = DefaultRouter()
router.register(r"warehouses", WarehouseViewSet, basename="warehouses")
router.register(r"products", ProductViewSet, basename="products")
router.register(r"product-stocks", ProductStockViewSet, basename="product-stocks")
router.register(r"users", UserViewSet, basename="users")

urlpatterns = [
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("login/", LoginAPIView.as_view(), name="login"),
    path("logout/", LogoutAPIView.as_view(), name="logout"),
    path("", include(router.urls)),
]
