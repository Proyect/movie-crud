# consult/permissions.py
from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Permiso personalizado para permitir solo a los dueños de un objeto editarlo.
    Asume que el modelo (Movie) tiene un campo 'created_by' que es una ForeignKey al User.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return obj.created_by == request.user