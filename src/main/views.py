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

from main.models import Product, ProductStock, TransferLog, Warehouse
from main.serializers import (
    LoginSerializer,
    ProductSerializer,
    ProductStockReadSerializer,
    ProductStockSerializer,
    TransferLogSerializer,
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
        if self.request.user.is_superuser:
            return qs
        return qs.filter(warehouse__users=self.request.user)

    def perform_create(self, serializer: BaseSerializer) -> None:
        product = serializer.validated_data["product"]
        warehouse = serializer.validated_data["warehouse"]
        quantity = serializer.validated_data["quantity"]
        user = cast(User, self.request.user)

        if not user.is_superuser and not warehouse.users.filter(id=user.id).exists():
            raise PermissionDenied("Только владелец склада может добавлять продукты.")

        existing = ProductStock.objects.filter(product=product, warehouse=warehouse).first()
        if existing:
            existing.quantity += quantity
            existing.save()
            TransferLog.objects.create(
                product=product,
                from_warehouse=None,
                to_warehouse=warehouse,
                quantity=quantity,
                transferred_by=user,
            )
        else:
            serializer.save()
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

        # Проверка, что все параметры предоставлены
        if not all([product_id, from_warehouse_id, to_warehouse_id, quantity]):
            raise ValidationError("Необходимо указать product_id, from_warehouse_id, to_warehouse_id и quantity.")

        # Проверка типов и валидности quantity
        if quantity is None:
            raise ValidationError("Количество не указано.")
        try:
            quantity = int(quantity)
            if quantity <= 0:
                raise ValidationError("Количество должно быть положительным.")
        except (TypeError, ValueError):
            raise ValidationError("Количество должно быть числом.")

        # Проверка типов и валидности ID
        if product_id is None or from_warehouse_id is None or to_warehouse_id is None:
            raise ValidationError("ID продукта или складов не указаны.")
        try:
            product_id = int(product_id)
            from_warehouse_id = int(from_warehouse_id)
            to_warehouse_id = int(to_warehouse_id)
        except (TypeError, ValueError):
            raise ValidationError("ID продукта или складов должны быть числами.")

        # Получение объектов
        try:
            product: Product = Product.objects.get(id=product_id)
            from_warehouse: Warehouse = Warehouse.objects.get(id=from_warehouse_id)
            to_warehouse: Warehouse = Warehouse.objects.get(id=to_warehouse_id)
        except Product.DoesNotExist:
            raise ValidationError("Product not found.")
        except Warehouse.DoesNotExist:
            raise ValidationError("Warehouse not found.")

        # Проверка прав доступа
        if not user.is_superuser:
            if not from_warehouse.users.filter(id=user.id).exists():
                raise PermissionDenied("У вас нет доступа к исходному складу.")
            if not to_warehouse.users.filter(id=user.id).exists():
                raise PermissionDenied("У вас нет доступа к целевому складу.")

        # Проверка наличия товара
        from_stock = ProductStock.objects.filter(product=product, warehouse=from_warehouse).first()
        if not from_stock or from_stock.quantity < quantity:
            raise ValidationError("Недостаточно товара на исходном складе.")

        # Обновление запасов
        from_stock.quantity -= quantity
        if from_stock.quantity == 0:
            from_stock.delete()
        else:
            from_stock.save()

        to_stock = ProductStock.objects.filter(product=product, warehouse=to_warehouse).first()
        if to_stock:
            to_stock.quantity += quantity
            to_stock.save()
        else:
            ProductStock.objects.create(product=product, warehouse=to_warehouse, quantity=quantity)

        # Создание лога перевода
        TransferLog.objects.create(
            product=product,
            from_warehouse=from_warehouse,
            to_warehouse=to_warehouse,
            quantity=quantity,
            transferred_by=user,
        )

        # Возврат обновлённых запасов
        updated_stocks = ProductStock.objects.filter(product=product, warehouse__in=[from_warehouse, to_warehouse])
        serializer = ProductStockReadSerializer(updated_stocks, many=True)
        return Response(
            {
                "message": "Товар успешно переведен.",
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
