from django.urls import path
from .views import ModulosListaView, MarcarLeccionCompletadaView

urlpatterns = [
    path('modulos/', ModulosListaView.as_view(), name='modulos_lista'),
    path('lecciones/<int:leccion_id>/completar/', MarcarLeccionCompletadaView.as_view(), name='leccion_completar'),
]
