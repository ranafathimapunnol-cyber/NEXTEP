from rest_framework import viewsets
from rest_framework.exceptions import PermissionDenied

from .models import Category, Task
from .serializers import CategorySerializer, TaskSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer

    def get_queryset(self):
        return Category.objects.filter(
            owner=self.request.user
        ).order_by("name")

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer

    def get_queryset(self):
        queryset = (
            Task.objects
            .filter(owner=self.request.user)
            .select_related("category")
            .order_by("-created_at")
        )

        category_id = self.request.query_params.get("category")

        if category_id:
            queryset = queryset.filter(category_id=category_id)

        return queryset

    def perform_create(self, serializer):
        category = serializer.validated_data.get("category")

        if category and category.owner != self.request.user:
            raise PermissionDenied(
                "You cannot use this category."
            )

        serializer.save(owner=self.request.user)

    def perform_update(self, serializer):
        category = serializer.validated_data.get(
            "category",
            serializer.instance.category,
        )

        if category and category.owner != self.request.user:
            raise PermissionDenied(
                "You cannot use this category."
            )

        serializer.save()