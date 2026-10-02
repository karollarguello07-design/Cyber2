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

        return Response(IntentoRetoSerializer(intento).data, status=201)


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

