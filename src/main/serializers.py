from typing import Any

from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from rest_framework import serializers

from main.models import Product, ProductStock, TransferLog, Warehouse


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]
        extra_kwargs = {
            "password": {"write_only": True},
            "email": {"required": True},
            "username": {"required": True},
        }
        read_only_fields: list[str] = ["id"]

    def validate_password(self, value: Any) -> Any:
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        return value

    def create(self, validated_data: Any) -> Any:
        validated_data["password"] = make_password(validated_data["password"])
        return super().create(validated_data)


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"
        read_only_fields = ["id"]


class WarehouseSerializer(serializers.ModelSerializer):
    users = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Warehouse
        fields = "__all__"
        read_only_fields = ["id"]


class ProductStockReadSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    warehouse = WarehouseSerializer(read_only=True)

    class Meta:
        model = ProductStock
        fields = ["id", "product", "warehouse", "quantity"]


class ProductStockSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    warehouse = WarehouseSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), source="product", write_only=True)
    warehouse_id = serializers.PrimaryKeyRelatedField(
        queryset=Warehouse.objects.all(), source="warehouse", write_only=True
    )

    class Meta:
        model = ProductStock
        fields = ["id", "product", "warehouse", "product_id", "warehouse_id", "quantity"]
        read_only_fields = ["id", "product", "warehouse"]


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data: Any) -> Any:
        username = data.get("username")
        password = data.get("password")

        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError("Invalid username or password.")
            data["user"] = user
        else:
            raise serializers.ValidationError("Both username and password are required.")
        return data


class TransferLogSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    from_warehouse = WarehouseSerializer(allow_null=True)
    to_warehouse = WarehouseSerializer()
    transferred_by = UserSerializer()

    class Meta:
        model = TransferLog
        fields = ["id", "product", "from_warehouse", "to_warehouse", "quantity", "transferred_by", "created_at"]
