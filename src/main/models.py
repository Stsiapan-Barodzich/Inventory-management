from django.contrib.auth.models import User
from django.db import models

# Create your models her


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

    def __str__(self) -> str:
        return self.name


class ProductStock(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()

    class Meta:
        unique_together = ("product", "warehouse")

    def __str__(self) -> str:
        return f"{self.product.name} - {self.warehouse.name} ({self.quantity})"
