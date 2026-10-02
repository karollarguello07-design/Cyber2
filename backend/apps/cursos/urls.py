from django.urls import path
from .views import (
    CursoListaCrearView,
    CursoDetalleView,
    InscripcionCrearView,
    MisInscripcionesView,
    MisCursosProfesorView
)

urlpatterns = [
    path('cursos/', CursoListaCrearView.as_view(), name='curso_lista_crear'),
    path('cursos/<int:pk>/', CursoDetalleView.as_view(), name='curso_detalle'),
    path('inscripciones/', InscripcionCrearView.as_view(), name='inscripcion_crear'),
    path('mis-inscripciones/', MisInscripcionesView.as_view(), name='mis_inscripciones'),
    path('profesor/mis-cursos/', MisCursosProfesorView.as_view(), name='profesor_mis_cursos'),

]
