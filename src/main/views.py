from collections.abc import Sequence
from typing import Any

from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import BaseSerializer
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken

from main.models import Product, ProductStock, Warehouse
from main.permissions import IsWarehouseUser
from main.serializers import (
    ProductSerializer,
    ProductStockSerializer,
    UserSerializer,
    WarehouseSerializer,
)


class WarehouseViewSet(ModelViewSet):
    queryset = Warehouse.objects.all()
    serializer_class = WarehouseSerializer
    authentication_classes = (JWTAuthentication,)
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=["get"])
    def products(self, request: Request) -> Response:
        warehouse = self.get_object()
        product_stocks = ProductStock.objects.filter(warehouse=warehouse)
        data = [{"product_name": ps.product.name, "quantity": ps.quantity} for ps in product_stocks]
        return Response(data)


class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = (JWTAuthentication,)
    permission_classes = [IsAuthenticated]


class ProductViewSet(ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    authentication_classes = (JWTAuthentication,)
    permission_classes = [IsAuthenticated]


class ProductStockViewSet(ModelViewSet):
    queryset = ProductStock.objects.all()
    serializer_class = ProductStockSerializer
    authentication_classes = (JWTAuthentication,)
    permission_classes = [IsAuthenticated]

    def get_permissions(self) -> Sequence:
        if self.action in ["retrieve", "update", "partial_update", "destroy"]:
            return [IsAuthenticated(), IsWarehouseUser()]
        return [IsAuthenticated()]

    def perform_create(self, serializer: BaseSerializer) -> None:
        warehouse = serializer.validated_data["warehouse"]
        if not self.request.user.is_superuser and self.request.user not in warehouse.users.all():
            raise PermissionDenied("Вы не можете добавлять товары в чужой склад.")
        serializer.save()


class LoginAPIView(APIView):
    def post(self, request: Request) -> Response:
        data: dict[str, Any] = request.data
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return Response({"error": "Нужен и логин, и пароль"}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)
        if user is None:
            return Response({"error": "Неверные данные"}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            },
            status=status.HTTP_200_OK,
        )


class LogoutAPIView(APIView):
    def post(self, request: Request) -> Response:

        refresh_token = request.data.get("refresh_token")
        if not refresh_token:
            return Response({"error": "Необходим Refresh token"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception:
            return Response({"error": "Неверный Refresh token"}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"success": "Выход успешен"}, status=status.HTTP_200_OK)
