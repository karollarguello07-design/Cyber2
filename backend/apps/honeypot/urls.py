from django.urls import path
from .views import AtaquesListaView, EstadisticasAtaquesView, ActualizarAtaquesView

urlpatterns = [
    path('ataques/', AtaquesListaView.as_view(), name='ataques_lista'),
    path('ataques/estadisticas/', EstadisticasAtaquesView.as_view(), name='ataques_estadisticas'),
    path('ataques/actualizar/', ActualizarAtaquesView.as_view(), name='ataques_actualizar'),
]
