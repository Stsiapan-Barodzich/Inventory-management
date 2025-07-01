import logging
from typing import Sequence, cast

from django.contrib.auth.models import User
from django.db.models import QuerySet
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.permissions import AllowAny, BasePermission, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import BaseSerializer
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken

from main.models import Category, Product, ProductStock, TransferLog, Warehouse
from main.serializers import (
    CategorySerializer,
    LoginSerializer,
    ProductSerializer,
    ProductStockReadSerializer,
    ProductStockSerializer,
    TransferLogSerializer,
    UserSerializer,
    WarehouseSerializer,
)
from main.services.email import send_stock_notification

logger = logging.getLogger(__name__)


class WarehouseViewSet(ModelViewSet):
    queryset = Warehouse.objects.all()
    serializer_class = WarehouseSerializer
    authentication_classes = (JWTAuthentication,)
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=["get"])
    def products(self, request: Request, pk: str | None = None) -> Response:
        warehouse = self.get_object()
        product_stocks = ProductStock.objects.filter(warehouse=warehouse)
        serializer = ProductStockReadSerializer(product_stocks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


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
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
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

    def get_queryset(self) -> QuerySet:
        queryset = super().get_queryset()
        category = self.request.query_params.get("category", None)
        if category:
            queryset = queryset.filter(category__name=category)
        return queryset


class ProductStockViewSet(ModelViewSet):
    queryset = ProductStock.objects.all()
    serializer_class = ProductStockSerializer
    authentication_classes = (JWTAuthentication,)
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self) -> type[BaseSerializer]:
        if self.action == "list" or self.action == "retrieve":
            return ProductStockReadSerializer
        return ProductStockSerializer

    def get_queryset(self) -> QuerySet:
        qs = super().get_queryset()
        category = self.request.query_params.get("category", None)
        if category:
            qs = qs.filter(product__category__name=category)
        if not self.request.user.is_superuser:
            qs = qs.filter(warehouse__users=self.request.user)
        return qs

    def perform_create(self, serializer: BaseSerializer) -> None:
        product = serializer.validated_data["product"]
        warehouse = serializer.validated_data["warehouse"]
        quantity = serializer.validated_data["quantity"]
        user = cast(User, self.request.user)

        if not user.is_superuser and not warehouse.users.filter(id=user.id).exists():
            raise PermissionDenied("You can add products only to your warehouses")

        existing = ProductStock.objects.filter(product=product, warehouse=warehouse).first()
        if existing:
            existing.quantity += quantity
            existing.save()
            send_stock_notification(existing)
            TransferLog.objects.create(
                product=product,
                from_warehouse=None,
                to_warehouse=warehouse,
                quantity=quantity,
                transferred_by=user,
            )
        else:
            product_stock = serializer.save()
            send_stock_notification(product_stock)
            TransferLog.objects.create(
                product=product,
                from_warehouse=None,
                to_warehouse=warehouse,
                quantity=quantity,
                transferred_by=user,
            )

    @action(detail=False, methods=["post"], url_path="transfer")
    def transfer(self, request: Request) -> Response:
        product_id = request.data.get("product_id")
        from_warehouse_id = request.data.get("from_warehouse_id")
        to_warehouse_id = request.data.get("to_warehouse_id")
        quantity = request.data.get("quantity")
        user = cast(User, self.request.user)

        if not all([product_id, from_warehouse_id, to_warehouse_id, quantity]):
            raise ValidationError("Need product_id, from_warehouse_id, to_warehouse_id and quantity.")

        if quantity is None:
            raise ValidationError("Need count.")
        try:
            quantity = int(quantity)
            if quantity <= 0:
                raise ValidationError("The quantity must be positive.")
        except (TypeError, ValueError):
            raise ValidationError("The quantity must be number.")

        if product_id is None or from_warehouse_id is None or to_warehouse_id is None:
            raise ValidationError("No product or warehouse IDs provided.")
        try:
            product_id = int(product_id)
            from_warehouse_id = int(from_warehouse_id)
            to_warehouse_id = int(to_warehouse_id)
        except (TypeError, ValueError):
            raise ValidationError("Product or warehouse IDs must be numbers.")

        try:
            product: Product = Product.objects.get(id=product_id)
            from_warehouse: Warehouse = Warehouse.objects.get(id=from_warehouse_id)
            to_warehouse: Warehouse = Warehouse.objects.get(id=to_warehouse_id)
        except Product.DoesNotExist:
            raise ValidationError("Product not found.")
        except Warehouse.DoesNotExist:
            raise ValidationError("Warehouse not found.")

        if not user.is_superuser:
            if not from_warehouse.users.filter(id=user.id).exists():
                raise PermissionDenied("You do not have access to the original warehouse.")
            if not to_warehouse.users.filter(id=user.id).exists():
                raise PermissionDenied("You do not have access to the target warehouse.")

        from_stock = ProductStock.objects.filter(product=product, warehouse=from_warehouse).first()
        if not from_stock or from_stock.quantity < quantity:
            raise ValidationError("Not enough product in original warehouse.")

        from_stock.quantity -= quantity
        if from_stock.quantity == 0:
            from_stock.delete()
        else:
            from_stock.save()
            send_stock_notification(from_stock)

        to_stock = ProductStock.objects.filter(product=product, warehouse=to_warehouse).first()
        if to_stock:
            to_stock.quantity += quantity
            to_stock.save()
            send_stock_notification(to_stock)
        else:
            to_stock = ProductStock.objects.create(product=product, warehouse=to_warehouse, quantity=quantity)
            send_stock_notification(to_stock)

        TransferLog.objects.create(
            product=product,
            from_warehouse=from_warehouse,
            to_warehouse=to_warehouse,
            quantity=quantity,
            transferred_by=user,
        )

        updated_stocks = ProductStock.objects.filter(product=product, warehouse__in=[from_warehouse, to_warehouse])
        serializer = ProductStockReadSerializer(updated_stocks, many=True)
        return Response(
            {
                "message": "The item has been successfully transferred.",
                "stocks": serializer.data,
            },
            status=status.HTTP_200_OK,
        )


class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request: Request) -> Response:
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        refresh = RefreshToken.for_user(user)
        response_data = {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
            },
        }
        return Response(response_data, status=status.HTTP_200_OK)


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


class TransferLogViewSet(ModelViewSet):
    queryset = TransferLog.objects.all()
    serializer_class = TransferLogSerializer
    authentication_classes = (JWTAuthentication,)
    permission_classes = [IsAuthenticated]

    def get_queryset(self) -> QuerySet:
        if self.request.user.is_superuser:
            return super().get_queryset()
        user = cast(User, self.request.user)
        return super().get_queryset().filter(transferred_by=user)


class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
