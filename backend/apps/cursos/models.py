from django.conf import settings
from django.db import models


class Curso(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    profesor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='cursos_dictados',
        limit_choices_to={'rol': 'profesor'},
    )
    cupo_maximo = models.PositiveIntegerField(default=30)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    activo = models.BooleanField(default=True)

    def __str__(self):
        return self.nombre


class Inscripcion(models.Model):
    estudiante = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='inscripciones',
        limit_choices_to={'rol': 'estudiante'},
    )
    curso = models.ForeignKey(
        Curso,
        on_delete=models.CASCADE,
        related_name='inscripciones',
    )
    fecha_inscripcion = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('estudiante', 'curso')

    def __str__(self):
        return f'{self.estudiante.username} en {self.curso.nombre}'
