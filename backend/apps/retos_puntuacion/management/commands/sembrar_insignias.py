from django.core.management.base import BaseCommand
from apps.retos_puntuacion.models import Insignia

INSIGNIAS = [
    ('Primer paso', 'Completaste tu primer reto.', 'completar_1_reto', '🥇'),
    ('Rastreador', 'Completaste los 3 retos de Reconocimiento.', 'completar_reconocimiento', '🔎'),
    ('Infiltrado', 'Completaste los 6 retos de Dentro del sistema.', 'completar_dentro_sistema', '🕵️'),
    ('Estratega', 'Completaste los 4 retos Avanzados.', 'completar_avanzado', '🧠'),
    ('Maestro del Camino', 'Completaste los 13 retos del camino.', 'completar_todos', '👑'),
    ('Explorador', 'Subiste a Nivel 2.', 'nivel_2', '🌱'),
    ('Analista', 'Subiste a Nivel 3.', 'nivel_3', '📊'),
    ('Defensor', 'Subiste a Nivel 4.', 'nivel_4', '🛡️'),
    ('Experto', 'Subiste a Nivel 5.', 'nivel_5', '🎯'),
    ('Guardián', 'Subiste a Nivel 6, el más alto del camino.', 'nivel_6', '🏆'),
]


class Command(BaseCommand):
    help = 'Siembra el catálogo de 10 insignias (seguro de correr varias veces)'

    def handle(self, *args, **options):
        total = 0
        for nombre, descripcion, condicion, icono in INSIGNIAS:
            Insignia.objects.update_or_create(
                nombre=nombre,
                defaults={'descripcion': descripcion, 'condicion_logro': condicion, 'icono': icono},
            )
            total += 1
        self.stdout.write(self.style.SUCCESS(f'{total} insignias cargadas.'))
