from django.db.models import Count
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Nivel, Insignia, PlantillaReto

NOMBRES_GRUPOS = {
    'reconocimiento': 'Nivel 1 · Reconocimiento',
    'dentro_sistema': 'Nivel 2 · Dentro del sistema',
    'avanzado': 'Nivel 3 · Avanzado',
}


class ReglasPuntuacionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        niveles = Nivel.objects.all().order_by('numero_nivel')
        insignias = Insignia.objects.all().order_by('id')

        valores_xp = list(
            PlantillaReto.objects.values_list('xp_recompensa', flat=True).distinct()
        )
        if len(valores_xp) == 1:
            xp_por_reto = str(valores_xp[0])
        elif valores_xp:
            xp_por_reto = f'entre {min(valores_xp)} y {max(valores_xp)}'
        else:
            xp_por_reto = '10'

        conteo_por_grupo = (
            PlantillaReto.objects
            .values('nivel_dificultad')
            .annotate(cantidad=Count('id'))
        )
        mapa_conteo = {fila['nivel_dificultad']: fila['cantidad'] for fila in conteo_por_grupo}

        grupos_camino = [
            {
                'clave': clave,
                'nombre': nombre,
                'cantidad': mapa_conteo.get(clave, 0),
            }
            for clave, nombre in NOMBRES_GRUPOS.items()
        ]

        return Response({
            'xp_por_reto': xp_por_reto,
            'xp_por_pregunta_quiz': 5,
            'total_retos': PlantillaReto.objects.count(),
            'grupos_camino': grupos_camino,
            'niveles': [
                {
                    'numero_nivel': n.numero_nivel,
                    'nombre_nivel': n.nombre_nivel,
                    'xp_minimo': n.xp_minimo,
                    'xp_maximo': n.xp_maximo,
                }
                for n in niveles
            ],
            'insignias': [
                {
                    'nombre': i.nombre,
                    'descripcion': i.descripcion,
                    'icono': i.icono,
                }
                for i in insignias
            ],
        })
