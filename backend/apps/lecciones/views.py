from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Modulo, Leccion, LeccionCompletada
from .serializers import ModuloSerializer


class ModulosListaView(generics.ListAPIView):
    queryset = Modulo.objects.all()
    serializer_class = ModuloSerializer
    permission_classes = [permissions.IsAuthenticated]


class MarcarLeccionCompletadaView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, leccion_id):
        leccion = Leccion.objects.filter(id=leccion_id).first()
        if not leccion:
            return Response({'error': 'Lección no encontrada.'}, status=404)

        LeccionCompletada.objects.get_or_create(estudiante=request.user, leccion=leccion)
        return Response({'mensaje': 'Lección marcada como completada.'})
