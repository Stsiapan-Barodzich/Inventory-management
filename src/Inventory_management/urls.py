from django.contrib import admin
from django.urls import include, path

# fmt: off
urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("main.urls")),
]
# fmt: on
