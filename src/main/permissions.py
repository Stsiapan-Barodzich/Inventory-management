from typing import Any

from rest_framework.permissions import BasePermission
from rest_framework.request import Request
from rest_framework.views import APIView


class IsWarehouseUser(BasePermission):

    def has_object_permission(self, request: Request, view: APIView, obj: Any) -> bool:
        if request.user.is_superuser:
            return True
        return request.user in obj.warehouse.users.all()
