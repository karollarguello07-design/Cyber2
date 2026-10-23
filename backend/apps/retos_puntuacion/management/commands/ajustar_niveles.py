from django.core.management.base import BaseCommand
from apps.retos_puntuacion.models import Nivel, PerfilEstudiante

NIVELES = [
    (1, 'Aprendiz', 0, 39),
    (2, 'Explorador', 40, 79),
    (3, 'Analista', 80, 119),
    (4, 'Defensor', 120, 159),
    (5, 'Experto', 160, 209),
    (6, 'Guardián', 210, None),
]


class Command(BaseCommand):
    help = 'Define los 6 niveles con umbrales de XP alcanzables y recalcula el nivel de cada estudiante'

    def handle(self, *args, **options):
        for numero, nombre, xp_min, xp_max in NIVELES:
            Nivel.objects.update_or_create(
                numero_nivel=numero,
                defaults={'nombre_nivel': nombre, 'xp_minimo': xp_min, 'xp_maximo': xp_max},
            )
        self.stdout.write(self.style.SUCCESS(f'{len(NIVELES)} niveles actualizados.'))

        actualizados = 0
        for perfil in PerfilEstudiante.objects.all():
            nuevo = (
                Nivel.objects.filter(xp_minimo__lte=perfil.xp_total)
                .order_by('-numero_nivel')
                .first()
            )
            if nuevo and perfil.nivel_id != nuevo.id:
                perfil.nivel = nuevo
                perfil.save()
                actualizados += 1

        self.stdout.write(self.style.SUCCESS(f'{actualizados} perfiles recalculados con el nuevo nivel.'))
        self.stdout.write('')
        for p in PerfilEstudiante.objects.select_related('usuario', 'nivel'):
            self.stdout.write(f'{p.usuario.username}: {p.xp_total} XP -> {p.nivel.nombre_nivel if p.nivel else "sin nivel"}')
