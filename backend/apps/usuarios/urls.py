from django.urls import path
from .views import (
    UsuariosListaView, GenerarCodigoTelegramView,
    DesvincularTelegramView, EstadoTelegramView,
    UsuarioCrearView, UsuarioDetalleView,
)

urlpatterns = [
    path('usuarios/', UsuariosListaView.as_view(), name='usuarios_lista'),
    path('usuarios/crear/', UsuarioCrearView.as_view(), name='usuarios_crear'),
    path('usuarios/<int:pk>/', UsuarioDetalleView.as_view(), name='usuarios_detalle'),
    path('telegram/generar-codigo/', GenerarCodigoTelegramView.as_view(), name='telegram_generar_codigo'),
    path('telegram/desvincular/', DesvincularTelegramView.as_view(), name='telegram_desvincular'),
    path('telegram/estado/', EstadoTelegramView.as_view(), name='telegram_estado'),
]
