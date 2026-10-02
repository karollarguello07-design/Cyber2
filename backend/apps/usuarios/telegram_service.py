import random
import string
import requests
from django.conf import settings
from django.utils import timezone
from datetime import timedelta

TELEGRAM_API_URL = f'https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN}'


def generar_codigo_vinculacion(usuario):
    codigo = ''.join(random.choices(string.digits, k=6))
    usuario.codigo_vinculacion_telegram = codigo
    usuario.codigo_vinculacion_expira = timezone.now() + timedelta(minutes=10)
    usuario.save()
    return codigo


def vincular_por_codigo(codigo, chat_id):
    from .models import Usuario

    try:
        usuario = Usuario.objects.get(
            codigo_vinculacion_telegram=codigo,
            codigo_vinculacion_expira__gte=timezone.now(),
        )
    except Usuario.DoesNotExist:
        return None

    usuario.telegram_chat_id = str(chat_id)
    usuario.telegram_vinculado = True
    usuario.codigo_vinculacion_telegram = None
    usuario.codigo_vinculacion_expira = None
    usuario.save()
    return usuario


def desvincular_telegram(usuario):
    usuario.telegram_chat_id = None
    usuario.telegram_vinculado = False
    usuario.save()


def enviar_mensaje_telegram(chat_id, texto):
    if not chat_id:
        return False
    try:
        respuesta = requests.post(
            f'{TELEGRAM_API_URL}/sendMessage',
            data={'chat_id': chat_id, 'text': texto},
            timeout=5,
        )
        return respuesta.status_code == 200
    except requests.RequestException:
        return False


def notificar_usuario(usuario, mensaje):
    if usuario.telegram_vinculado and usuario.telegram_chat_id:
        enviar_mensaje_telegram(usuario.telegram_chat_id, mensaje)
