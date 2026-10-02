from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from apps.usuarios.views import RegistroUsuarioView, TokenObtainPairConRolView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairConRolView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/usuarios/registro/', RegistroUsuarioView.as_view(), name='registro_usuario'),
    path('api/', include('apps.cursos.urls')),
    path('api/', include('apps.retos_puntuacion.urls')),
    path('api/', include('apps.honeypot.urls')),
    path('api/', include('apps.usuarios.urls')),
    path('api/', include('apps.lecciones.urls')),

]
