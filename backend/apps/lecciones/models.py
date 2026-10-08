from django.conf import settings
from django.db import models


class Modulo(models.Model):
    class Nivel(models.TextChoices):
        BASICO = 'basico', 'Básico'
        AVANZADO = 'avanzado', 'Avanzado'

    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    icono = models.CharField(max_length=10, default='📘')
    orden = models.PositiveIntegerField(default=1)
    nivel = models.CharField(max_length=10, choices=Nivel.choices, default=Nivel.BASICO)

    class Meta:
        ordering = ['nivel', 'orden']

    def __str__(self):
        return self.nombre

class Leccion(models.Model):
    modulo = models.ForeignKey(Modulo, on_delete=models.CASCADE, related_name='lecciones')
    titulo = models.CharField(max_length=150)
    contenido = models.TextField()
    dato_curioso = models.TextField(
        blank=True,
        help_text='Dato curioso "¿Sabías qué...?" que se muestra en una tarjeta destacada.'
    )
    orden = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ['orden']

    def __str__(self):
        return f'{self.modulo.nombre} — {self.titulo}'


class LeccionCompletada(models.Model):
    estudiante = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='lecciones_completadas', limit_choices_to={'rol': 'estudiante'},
    )
    leccion = models.ForeignKey(Leccion, on_delete=models.CASCADE, related_name='completadas_por')
    fecha_completada = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('estudiante', 'leccion')

    def __str__(self):
        return f'{self.estudiante.username} completó {self.leccion.titulo}'


class TarjetaEstudio(models.Model):
    modulo = models.ForeignKey(Modulo, on_delete=models.CASCADE, related_name='tarjetas')
    orden = models.PositiveIntegerField(default=1)
    icono = models.CharField(max_length=10, default='🃏')
    titulo = models.CharField(max_length=100)
    analogia = models.CharField(max_length=255)
    peligro = models.PositiveSmallIntegerField(default=1, help_text='1 = bajo, 2 = medio, 3 = alto')
    que_es = models.TextField()
    como_se_ve = models.TextField()
    como_defenderse = models.TextField()
    solo_teoria = models.BooleanField(default=False)

    class Meta:
        ordering = ['orden']
        unique_together = ('modulo', 'orden')

    def __str__(self):
        return f'{self.modulo.nombre} — {self.titulo}'
