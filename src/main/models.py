from django.contrib.auth.models import User
from django.db import models


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

    def identical_items(self) -> "ProductStock":
        existing = ProductStock.objects.filter(product=self.product, warehouse=self.warehouse).first()
        if existing:
            existing.quantity += self.quantity
            existing.save()
            self.delete()
            return existing
        return self

    def __str__(self) -> str:
        return f"{self.product.name} - {self.warehouse.name} ({self.quantity})"
