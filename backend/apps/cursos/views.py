from rest_framework import generics, permissions
from .models import Curso, Inscripcion
from .serializers import CursoSerializer, InscripcionSerializer
from .permissions import EsAdministrador
from .permissions import EsProfesor
from .serializers import CursoConEstudiantesSerializer



class CursoListaCrearView(generics.ListCreateAPIView):
    queryset = Curso.objects.filter(activo=True)
    serializer_class = CursoSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [EsAdministrador()]
        return [permissions.IsAuthenticated()]


class CursoDetalleView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Curso.objects.all()
    serializer_class = CursoSerializer
    permission_classes = [EsAdministrador]


class InscripcionCrearView(generics.CreateAPIView):
    serializer_class = InscripcionSerializer
    permission_classes = [permissions.IsAuthenticated]


class MisInscripcionesView(generics.ListAPIView):
    serializer_class = InscripcionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Inscripcion.objects.filter(estudiante=self.request.user)


class MisCursosProfesorView(generics.ListAPIView):
    serializer_class = CursoConEstudiantesSerializer
    permission_classes = [EsProfesor]

    def get_queryset(self):
        return Curso.objects.filter(profesor=self.request.user)
