import json
from datetime import datetime
from django.core.management.base import BaseCommand
from django.utils import timezone
from apps.honeypot.models import AtaqueHoneypot
from apps.retos_puntuacion.models import TipoAtaque
from apps.retos_puntuacion.services import generar_retos_desde_ataques
from apps.usuarios.telegram_service import notificar_usuario
from apps.usuarios.models import Usuario

RUTA_LOG_COWRIE = '/home/cyberedu/cowrie/var/log/cowrie/cowrie.json'

EVENTOS_RELEVANTES = [
    'cowrie.login.failed',
    'cowrie.login.success',
    'cowrie.command.input',
    'cowrie.session.file_download',
    'cowrie.session.file_upload',
]

# Palabras clave para clasificar comandos ejecutados dentro de la sesión
PALABRAS_CLAVE_COMANDOS = [
    ('Minería de criptomonedas (Cryptomining)', ['xmrig', 'miner', 'crypto']),
    ('Instalación de botnets', ['wget bot', './bot', 'chmod +x bot']),
    ('Persistencia', ['authorized_keys', 'mkdir ~/.ssh', '.ssh/']),
    ('Movimiento lateral', ['ssh ', 'nc ', 'netcat']),
    ('Ejecución de scripts maliciosos', ['.sh', 'bash ', 'chmod +x']),
    ('Enumeración de usuarios', ['/etc/passwd', 'last', 'ps aux', ' w']),
    ('Reconocimiento del sistema', ['whoami', 'uname', 'pwd', ' id', 'hostname', 'ls']),
]


def clasificar_comando(texto_comando):
    """Devuelve el nombre del TipoAtaque según palabras clave encontradas en el comando."""
    texto = texto_comando.lower()
    for nombre_tipo, palabras in PALABRAS_CLAVE_COMANDOS:
        for palabra in palabras:
            if palabra.lower() in texto:
                return nombre_tipo
    return 'Reconocimiento del sistema'  # valor por defecto si no coincide con nada


class Command(BaseCommand):
    help = 'Lee el log JSON de Cowrie y guarda los eventos de ataque en PostgreSQL, clasificados por tipo'

    def handle(self, *args, **options):
        tipo_fuerza_bruta, _ = TipoAtaque.objects.get_or_create(
            nombre='Fuerza bruta SSH',
            defaults={'descripcion': 'Múltiples intentos de acceso probando credenciales por SSH.'}
        )
        tipo_descarga, _ = TipoAtaque.objects.get_or_create(
            nombre='Descarga de malware',
            defaults={'descripcion': 'Descarga de archivos maliciosos al sistema comprometido tras obtener acceso.'}
        )

        nuevos = 0
        omitidos = 0
        errores = 0

        try:
            with open(RUTA_LOG_COWRIE, 'r') as archivo:
                lineas = archivo.readlines()
        except FileNotFoundError:
            self.stderr.write(self.style.ERROR(f'No se encontró el archivo: {RUTA_LOG_COWRIE}'))
            return

        for linea in lineas:
            linea = linea.strip()
            if not linea:
                continue
            try:
                evento = json.loads(linea)
            except json.JSONDecodeError:
                errores += 1
                continue

            eventid = evento.get('eventid')
            if eventid not in EVENTOS_RELEVANTES:
                continue

            timestamp_str = evento.get('timestamp')
            try:
                timestamp_evento = datetime.fromisoformat(timestamp_str.replace('Z', '+00:00'))
            except (ValueError, AttributeError):
                errores += 1
                continue

            # Determinar tipo de ataque, usuario/contraseña y detalle según el tipo de evento
            usuario_probado = ''
            contrasena_probada = ''
            detalle = ''

            if eventid in ('cowrie.login.failed', 'cowrie.login.success'):
                tipo_ataque = tipo_fuerza_bruta
                usuario_probado = evento.get('username', '')
                contrasena_probada = evento.get('password', '')

            elif eventid == 'cowrie.command.input':
                comando = evento.get('input', '')
                detalle = comando
                nombre_tipo = clasificar_comando(comando)
                tipo_ataque, _ = TipoAtaque.objects.get_or_create(
                    nombre=nombre_tipo,
                    defaults={'descripcion': f'Comandos relacionados con {nombre_tipo.lower()}.'}
                )

            elif eventid in ('cowrie.session.file_download', 'cowrie.session.file_upload'):
                tipo_ataque = tipo_descarga
                detalle = evento.get('url', evento.get('outfile', ''))

            else:
                continue

            _, creado = AtaqueHoneypot.objects.get_or_create(
                sesion_cowrie=evento.get('session', ''),
                eventid_original=eventid,
                timestamp_evento=timestamp_evento,
                defaults={
                    'ip_origen': evento.get('src_ip', '0.0.0.0'),
                    'tipo_ataque': tipo_ataque,
                    'usuario_probado': usuario_probado,
                    'contrasena_probada': contrasena_probada,
                    'protocolo': evento.get('protocol', ''),
                    'detalle': detalle,
                }
            )

            if creado:
                nuevos += 1
                for destinatario in Usuario.objects.filter(
                    rol__in=['admin', 'profesor'],
                    telegram_vinculado=True
                ):
                    notificar_usuario(
                        destinatario,
                        f'Nuevo evento detectado ({tipo_ataque.nombre}): '
                        f'{evento.get("src_ip")} — {detalle or f"{usuario_probado}/{contrasena_probada}"}'
                    )
            else:
                omitidos += 1

        self.stdout.write(
            self.style.SUCCESS(
                f'Ingesta completada: {nuevos} nuevos, '
                f'{omitidos} ya existían, '
                f'{errores} con error de formato.'
            )
        )

        total_retos = generar_retos_desde_ataques()
        self.stdout.write(
            self.style.SUCCESS(
                f'Se generaron {total_retos} retos nuevos a partir de estos ataques.'
            )
        )
