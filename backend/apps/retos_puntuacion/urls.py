from django.urls import path
from .views import RetosDisponiblesView, ResponderRetoView, MiPerfilView, MiHistorialView

urlpatterns = [
    path('retos/', RetosDisponiblesView.as_view(), name='retos_disponibles'),
    path('retos/<int:reto_id>/responder/', ResponderRetoView.as_view(), name='responder_reto'),
    path('mi-perfil/', MiPerfilView.as_view(), name='mi_perfil'),
    path('mi-historial/', MiHistorialView.as_view(), name='mi_historial'),
]
