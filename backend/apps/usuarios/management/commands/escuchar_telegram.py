import time
import requests
from django.conf import settings
from django.core.management.base import BaseCommand
from apps.usuarios.telegram_service import vincular_por_codigo, enviar_mensaje_telegram

TELEGRAM_API_URL = f'https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN}'


class Command(BaseCommand):
    help = 'Escucha mensajes entrantes de Telegram y procesa códigos de vinculación (polling)'

    def handle(self, *args, **options):
        self.stdout.write('Escuchando mensajes de Telegram... (Ctrl+C para detener)')
        ultimo_update_id = None

        while True:
            params = {'timeout': 20}
            if ultimo_update_id:
                params['offset'] = ultimo_update_id + 1

            try:
                respuesta = requests.get(f'{TELEGRAM_API_URL}/getUpdates', params=params, timeout=25)
                datos = respuesta.json()
            except (requests.RequestException, ValueError):
                time.sleep(3)
                continue

            for update in datos.get('result', []):
                ultimo_update_id = update['update_id']
                mensaje = update.get('message')
                if not mensaje:
                    continue

                chat_id = mensaje['chat']['id']
                texto = mensaje.get('text', '').strip()

                if texto.isdigit() and len(texto) == 6:
                    usuario = vincular_por_codigo(texto, chat_id)
                    if usuario:
                        enviar_mensaje_telegram(
                            chat_id,
                            f'✅ ¡Cuenta vinculada correctamente, {usuario.username}! '
                            f'Ahora recibirás notificaciones de CyberEdu aquí.'
                        )
                        self.stdout.write(self.style.SUCCESS(f'Vinculado: {usuario.username}'))
                    else:
                        enviar_mensaje_telegram(
                            chat_id,
                            '❌ Código inválido o expirado. Genera uno nuevo desde la app.'
                        )
                else:
                    enviar_mensaje_telegram(
                        chat_id,
                        'Hola 👋, soy el bot de CyberEdu. Envíame el código de 6 dígitos que '
                        'generaste en la app para vincular tu cuenta.'
                    )
