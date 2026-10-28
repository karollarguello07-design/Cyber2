from django.db.models import Count
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.cursos.models import Inscripcion
from .models import PerfilEstudiante, UsuarioInsignia
from .permissions import EsEstudiante
from .ranking_serializers import RankingFilaSerializer, MiPosicionSerializer


class RankingView(APIView):
    permission_classes = [EsEstudiante]

    def get(self, request):
        usuario = request.user
        inscripcion = Inscripcion.objects.filter(estudiante=usuario).select_related('curso').first()

        if not inscripcion:
            return Response({
                'detalle': 'Aún no estás inscrito en ningún curso.',
                'top_10': [],
                'mi_posicion': None,
            })

        curso = inscripcion.curso
        estudiantes_ids = Inscripcion.objects.filter(curso=curso).values_list('estudiante_id', flat=True)

        perfiles = (
            PerfilEstudiante.objects
            .filter(usuario_id__in=estudiantes_ids)
            .select_related('usuario', 'nivel')
            .order_by('-xp_total', 'usuario__date_joined')
        )

        conteo_insignias = dict(
            UsuarioInsignia.objects
            .filter(usuario_id__in=estudiantes_ids)
            .values_list('usuario_id')
            .annotate(total=Count('id'))
        )

        filas_completas = []
        mi_puesto = None

        for indice, perfil in enumerate(perfiles, start=1):
            fila = {
                'usuario_id': perfil.usuario_id,
                'alias': perfil.usuario.alias,
                'nivel_nombre': perfil.nivel.nombre_nivel if perfil.nivel else None,
                'xp_total': perfil.xp_total,
                'insignias_count': conteo_insignias.get(perfil.usuario_id, 0),
                'visible': perfil.usuario.visible_en_ranking,
            }
            filas_completas.append(fila)
            if perfil.usuario_id == usuario.id:
                mi_puesto = indice

        top_10 = [f for f in filas_completas if f['visible']][:10]

        mi_fila = next((f for f in filas_completas if f['usuario_id'] == usuario.id), None)
        mi_posicion = None
        if mi_fila:
            mi_posicion = {
                **mi_fila,
                'puesto': mi_puesto,
                'total_estudiantes': len(filas_completas),
            }

        return Response({
            'curso_nombre': curso.nombre,
            'top_10': RankingFilaSerializer(top_10, many=True).data,
            'mi_posicion': MiPosicionSerializer(mi_posicion).data if mi_posicion else None,
        })
