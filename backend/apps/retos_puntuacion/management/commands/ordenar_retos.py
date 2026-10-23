from django.core.management.base import BaseCommand
from apps.retos_puntuacion.models import PlantillaReto

ORDEN = [
    ('Identifica el ataque de fuerza bruta', 1, 'reconocimiento'),
    ('¿Diccionario o fuerza bruta?', 2, 'reconocimiento'),
    ('Reconociendo un escaneo Nmap', 3, 'reconocimiento'),
    ('¿Qué hizo el atacante después de entrar?', 4, 'dentro_sistema'),
    ('Detecta la descarga sospechosa', 5, 'dentro_sistema'),
    ('Reutilizando credenciales filtradas', 6, 'dentro_sistema'),
    ('Explorando el sistema comprometido', 7, 'dentro_sistema'),
    ('Descubriendo quién más usa el sistema', 8, 'dentro_sistema'),
    ('Ejecutando un script en el sistema comprometido', 9, 'dentro_sistema'),
    ('Convirtiendo el equipo en parte de una botnet', 10, 'avanzado'),
    ('Asegurando el acceso a largo plazo', 11, 'avanzado'),
    ('Saltando hacia otros equipos de la red', 12, 'avanzado'),
    ('Aprovechando los recursos del sistema para minar', 13, 'avanzado'),
]


class Command(BaseCommand):
    help = 'Corrige el orden y asigna el nivel de dificultad a las 13 plantillas de retos'

    def handle(self, *args, **options):
        actualizados = 0
        for titulo, orden, nivel in ORDEN:
            filas = PlantillaReto.objects.filter(titulo=titulo).update(
                orden=orden, nivel_dificultad=nivel
            )
            if filas == 0:
                self.stderr.write(self.style.WARNING(f'No encontré: «{titulo}»'))
            else:
                actualizados += filas

        self.stdout.write(self.style.SUCCESS(f'{actualizados} plantillas actualizadas.'))
        self.stdout.write('')
        for p in PlantillaReto.objects.order_by('orden'):
            self.stdout.write(f'{p.orden:>2} [{p.nivel_dificultad}] {p.titulo}')
