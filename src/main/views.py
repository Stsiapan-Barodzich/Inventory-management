from typing import Any, Sequence, Type, cast

from django.contrib.auth.models import User
from django.db import transaction
from django.db.models import QuerySet
from rest_framework import status
from rest_framework.decorators import action
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
    ProductTransferSerializer,
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

    def get_serializer_class(self) -> Type[BaseSerializer]:
        if self.action in ["list", "retrieve"]:
            return ProductStockReadSerializer
        if self.action == "transfer":
            return ProductTransferSerializer
        return ProductStockSerializer

    def get_queryset(self) -> QuerySet:
        qs = super().get_queryset()
        if not self.request.user.is_superuser:
            qs = qs.filter(warehouse__users=self.request.user)
        return qs

    def create(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        product = data["product"]
        warehouse = data["warehouse"]
        quantity = data["quantity"]

        stock, created = ProductStock.objects.get_or_create(
            product=product, warehouse=warehouse, defaults={"quantity": quantity}
        )

        if not created:
            stock.quantity += quantity
            stock.save()
            serializer = self.get_serializer(stock)

        TransferLog.objects.create(
            product=product,
            from_warehouse=None,
            to_warehouse=warehouse,
            quantity=quantity,
            transferred_by=cast(User, request.user),
        )

        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

    @action(detail=False, methods=["post"], url_path="transfer")
    def transfer(self, request: Request) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        product = data["product_id"]
        from_warehouse = data.get("from_warehouse_id")
        to_warehouse = data["to_warehouse_id"]
        quantity = data["quantity"]

        with transaction.atomic():
            if from_warehouse:
                from_stock = ProductStock.objects.select_for_update().get(product=product, warehouse=from_warehouse)
                from_stock.quantity -= quantity
                if from_stock.quantity == 0:
                    from_stock.delete()
                else:
                    from_stock.save()

            to_stock, created = ProductStock.objects.get_or_create(
                product=product, warehouse=to_warehouse, defaults={"quantity": quantity}
            )
            if not created:
                to_stock.quantity += quantity
                to_stock.save()

            TransferLog.objects.create(
                product=product,
                from_warehouse=from_warehouse,
                to_warehouse=to_warehouse,
                quantity=quantity,
                transferred_by=cast(User, request.user),
            )

        return Response(
            {
                "message": "Transfered successful",
                "stocks": ProductStockReadSerializer(
                    ProductStock.objects.filter(
                        product=product, warehouse__in=[w for w in [from_warehouse, to_warehouse] if w]
                    ),
                    many=True,
                ).data,
            }
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
