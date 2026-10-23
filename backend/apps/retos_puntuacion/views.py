from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Reto, OpcionRespuesta, PerfilEstudiante, IntentoReto
from .serializers import (
    RetoSerializer, ResponderRetoSerializer,
    IntentoRetoSerializer, PerfilEstudianteSerializer,
)
from .permissions import EsEstudiante
from .services import registrar_intento, obtener_o_crear_perfil


class RetosDisponiblesView(generics.ListAPIView):
    serializer_class = RetoSerializer
    permission_classes = [permissions.IsAuthenticated]

    
    def get_queryset(self):
        usuario = self.request.user
        cursos_ids = usuario.inscripciones.values_list('curso_id', flat=True)
        return Reto.objects.filter(
            curso_id__in=cursos_ids, activo=True
        ).order_by('plantilla__orden')  


class ResponderRetoView(APIView):
    permission_classes = [EsEstudiante]

    def post(self, request, reto_id):
        reto = get_object_or_404(Reto, id=reto_id)
        serializer = ResponderRetoSerializer(data=request.data, context={'reto': reto})
        serializer.is_valid(raise_exception=True)

        opcion = OpcionRespuesta.objects.get(id=serializer.validated_data['opcion_id'])
        intento = registrar_intento(request.user, reto, opcion)

        datos = IntentoRetoSerializer(intento).data
        datos['subio_nivel'] = intento.subio_nivel
        datos['nivel_nuevo'] = intento.nivel_nuevo

        return Response(datos, status=201)

class MiPerfilView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        perfil = obtener_o_crear_perfil(request.user)
        return Response(PerfilEstudianteSerializer(perfil).data)

class MiHistorialView(generics.ListAPIView):
    serializer_class = IntentoRetoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return IntentoReto.objects.filter(estudiante=self.request.user).order_by('-fecha_intento')



class MisLogrosView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        from .models import Insignia, UsuarioInsignia

        usuario = request.user
        obtenidas = {
            ui.insignia_id: ui.fecha_obtencion
            for ui in UsuarioInsignia.objects.filter(usuario=usuario)
        }

        insignias = []
        for insignia in Insignia.objects.all().order_by('id'):
            insignias.append({
                'id': insignia.id,
                'nombre': insignia.nombre,
                'descripcion': insignia.descripcion,
                'icono': insignia.icono,
                'obtenida': insignia.id in obtenidas,
                'fecha': obtenidas.get(insignia.id),
            })

        historial = (
            IntentoReto.objects.filter(estudiante=usuario, es_correcto=True)
            .select_related('reto__plantilla')
            .order_by('-fecha_intento')[:30]
        )
        linea_tiempo = [
            {
                'tipo': 'reto',
                'titulo': i.reto.plantilla.titulo,
                'xp': i.xp_otorgado,
                'fecha': i.fecha_intento,
            }
            for i in historial
        ] + [
            {
                'tipo': 'insignia',
                'titulo': insignia['nombre'],
                'xp': 0,
                'fecha': insignia['fecha'],
            }
            for insignia in insignias
            if insignia['obtenida']
        ]
        linea_tiempo.sort(key=lambda x: x['fecha'], reverse=True)

        perfil = obtener_o_crear_perfil(usuario)
        total_retos_correctos = IntentoReto.objects.filter(
            estudiante=usuario, es_correcto=True
        ).values('reto').distinct().count()
        total_intentos = IntentoReto.objects.filter(estudiante=usuario).count()

        return Response({
            'xp_total': perfil.xp_total,
            'nivel_nombre': perfil.nivel.nombre_nivel if perfil.nivel else None,
            'numero_nivel': perfil.nivel.numero_nivel if perfil.nivel else None,
            'total_retos_correctos': total_retos_correctos,
            'total_retos': 13,
            'porcentaje_aciertos': round((total_retos_correctos / total_intentos * 100)) if total_intentos else 0,
            'insignias': insignias,
            'insignias_obtenidas': len(obtenidas),
            'insignias_totales': len(insignias),
            'linea_tiempo': linea_tiempo[:20],
        })
