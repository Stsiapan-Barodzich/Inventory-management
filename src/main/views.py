from typing import Any

from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken

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
    authentication_classes = (JWTAuthentication,)


class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = (JWTAuthentication,)


class ProductViewSet(ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    authentication_classes = (JWTAuthentication,)


class ProductStockViewSet(ModelViewSet):
    queryset = ProductStock.objects.all()
    serializer_class = ProductStockSerializer
    authentication_classes = (JWTAuthentication,)


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
