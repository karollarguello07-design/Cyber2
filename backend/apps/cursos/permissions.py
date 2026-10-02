from rest_framework import permissions


class EsAdministrador(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.rol == 'admin'
        )


class EsProfesorDelCurso(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.profesor_id == request.user.id


class EsEstudiante(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.rol == 'estudiante'
        )

class EsProfesor(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.rol == 'profesor'
        )
