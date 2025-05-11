from django.db import models

# Create your models here.
class TestModel(models.Model):
    test_field_name = models.CharField(max_length=20)
    test_field_int = models.IntegerField()
