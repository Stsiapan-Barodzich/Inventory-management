# from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from main.views import (
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
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("logout/", LogoutAPIView.as_view(), name="logout"),
    path("", include(router.urls)),
]
