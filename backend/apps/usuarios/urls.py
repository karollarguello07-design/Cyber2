from django.urls import path
from .views import (
    UsuariosListaView, GenerarCodigoTelegramView,
    DesvincularTelegramView, EstadoTelegramView,
)

urlpatterns = [
    path('usuarios/', UsuariosListaView.as_view(), name='usuarios_lista'),
    path('telegram/generar-codigo/', GenerarCodigoTelegramView.as_view(), name='telegram_generar_codigo'),
    path('telegram/desvincular/', DesvincularTelegramView.as_view(), name='telegram_desvincular'),
    path('telegram/estado/', EstadoTelegramView.as_view(), name='telegram_estado'),
]
