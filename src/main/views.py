from typing import Sequence, cast

from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny, BasePermission, IsAuthenticated
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
    def products(self, request: Request, pk: str | None = None) -> Response:
        warehouse = self.get_object()
        product_stocks = ProductStock.objects.filter(warehouse=warehouse)
        data = [{"product_name": ps.product.name, "quantity": ps.quantity} for ps in product_stocks]
        return Response(data, status=status.HTTP_200_OK)


class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = (JWTAuthentication,)
    permission_classes = [IsAuthenticated]

    def get_permissions(self) -> Sequence[BasePermission]:
        if self.action == "create":
            return [AllowAny()]
        return cast(Sequence[BasePermission], super().get_permissions())

    def create(self, request: Request, *args: str, **kwargs: str) -> Response:
        data = request.data.copy()
        password = data.get("password")

        if not password:
            return Response({"error": "Password required."}, status=status.HTTP_400_BAD_REQUEST)
        if not data.get("username"):
            return Response({"error": "Username required"}, status=status.HTTP_400_BAD_REQUEST)
        if not data.get("email"):
            return Response({"error": "Email required"}, status=status.HTTP_400_BAD_REQUEST)

        data["password"] = make_password(password)

        serializer = self.get_serializer(data=data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        self.perform_create(serializer)

        # Generate JWT-tokens
        user = serializer.instance
        if user is None:
            return Response({"error": "Failed to create user."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        refresh = RefreshToken.for_user(user)

        response_data = {
            "user": serializer.data,
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }
        return Response(response_data, status=status.HTTP_201_CREATED)


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

    def get_permissions(self) -> list | list[IsAuthenticated]:
        if self.action in ["retrieve", "update", "partial_update", "destroy"]:
            return [IsAuthenticated(), IsWarehouseUser()]
        return [IsAuthenticated()]

    def perform_create(self, serializer: BaseSerializer) -> None:
        warehouse = serializer.validated_data["warehouse"]
        product = serializer.validated_data["product"]
        quantity = serializer.validated_data["quantity"]

        if not self.request.user.is_superuser and self.request.user not in warehouse.users.all():
            raise PermissionDenied("You can add products only to your warehouses.")

        existing = ProductStock.objects.filter(product=product, warehouse=warehouse).first()
        if existing:
            existing.quantity += quantity
            existing.save()
        else:
            serializer.save()


class LogoutAPIView(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = [IsAuthenticated]

    def post(self, request: Request) -> Response:
        refresh_token = request.data.get("refresh_token")
        if not refresh_token:
            return Response({"error": "Need refresh-token"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"success": "Successful log out"}, status=status.HTTP_200_OK)
        except Exception:
            return Response({"error": "Bad refresh-token"}, status=status.HTTP_400_BAD_REQUEST)
