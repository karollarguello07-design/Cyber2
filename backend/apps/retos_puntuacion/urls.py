from django.urls import path
from .views import RetosDisponiblesView, ResponderRetoView, MiPerfilView, MiHistorialView, MisLogrosView
from .ranking_views import RankingView
from .reglas_views import ReglasPuntuacionView

urlpatterns = [
    path('retos/', RetosDisponiblesView.as_view(), name='retos_disponibles'),
    path('retos/<int:reto_id>/responder/', ResponderRetoView.as_view(), name='responder_reto'),
    path('mi-perfil/', MiPerfilView.as_view(), name='mi_perfil'),
    path('mi-historial/', MiHistorialView.as_view(), name='mi_historial'),
    path('mis-logros/', MisLogrosView.as_view(), name='mis_logros'),
    path('ranking/', RankingView.as_view(), name='ranking'),
    path('reglas-puntuacion/', ReglasPuntuacionView.as_view(), name='reglas_puntuacion'),
]
