from django.contrib.auth.models import User
from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self) -> str:
        return self.name


class Warehouse(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    users = models.ManyToManyField(User, related_name="warehouses")

    def __str__(self) -> str:
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=60)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.CharField(max_length=400)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self) -> str:
        return self.name


class ProductStock(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()

    def __str__(self) -> str:
        return f"{self.product.name} - {self.warehouse.name} ({self.quantity})"


class TransferLog(models.Model):
    product = models.ForeignKey("Product", on_delete=models.CASCADE)
    from_warehouse = models.ForeignKey(
        "Warehouse", related_name="transfers_from", on_delete=models.CASCADE, null=True, blank=True
    )
    to_warehouse = models.ForeignKey("Warehouse", related_name="transfers_to", on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    transferred_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Transfer Log"
        verbose_name_plural = "Transfer Logs"
