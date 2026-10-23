from django.core.management.base import BaseCommand
from apps.retos_puntuacion.models import PerfilEstudiante, Nivel
from apps.retos_puntuacion.services import evaluar_insignias, _otorgar_insignia_si_no_existe


class Command(BaseCommand):
    help = 'Otorga retroactivamente las insignias de retos y de nivel ya alcanzadas antes de que existiera este sistema'

    def handle(self, *args, **options):
        for perfil in PerfilEstudiante.objects.select_related('usuario', 'nivel'):
            evaluar_insignias(perfil.usuario)

            if perfil.nivel:
                niveles_alcanzados = Nivel.objects.filter(
                    numero_nivel__gte=2, numero_nivel__lte=perfil.nivel.numero_nivel
                )
                for nivel in niveles_alcanzados:
                    _otorgar_insignia_si_no_existe(perfil.usuario, nivel.nombre_nivel)

        self.stdout.write(self.style.SUCCESS('Insignias retroactivas evaluadas para todos los estudiantes.'))
