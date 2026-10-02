from django.conf import settings
from django.db import models
from apps.cursos.models import Curso


class TipoAtaque(models.Model):
    nombre = models.CharField(max_length=80, unique=True)
    descripcion = models.TextField(blank=True)

    def __str__(self):
        return self.nombre


class Nivel(models.Model):
    numero_nivel = models.PositiveIntegerField(unique=True)
    nombre_nivel = models.CharField(max_length=50)
    xp_minimo = models.PositiveIntegerField()
    xp_maximo = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        ordering = ['numero_nivel']

    def __str__(self):
        return f'Nivel {self.numero_nivel} — {self.nombre_nivel}'

class PlantillaReto(models.Model):
    tipo_ataque = models.ForeignKey(TipoAtaque, on_delete=models.CASCADE, related_name='plantillas')
    titulo = models.CharField(max_length=150)
    descripcion = models.TextField()
    xp_recompensa = models.PositiveIntegerField(default=10)
    orden = models.PositiveIntegerField(
        default=1,
        help_text='Orden en que aparece el reto dentro de su nivel (1, 2, 3...)'
    )
    instrucciones_practica = models.TextField(
        blank=True,
        help_text='Pasos y comandos exactos que el estudiante debe ejecutar contra el Cowrie real'
    )
    credenciales_practica = models.CharField(
        max_length=255,
        blank=True,
        help_text='Usuario/contraseña de práctica a usar en este reto, ej: usuario=admin, contraseña=123456'
    )
    enunciado_pregunta = models.TextField(
        blank=True,
        help_text='Pregunta molde que se copiará automáticamente a cada reto generado.'
    )

    def __str__(self):
        return self.titulo


class PlantillaOpcionRespuesta(models.Model):
    plantilla = models.ForeignKey(PlantillaReto, on_delete=models.CASCADE, related_name='opciones_molde')
    texto_opcion = models.CharField(max_length=255)
    es_correcta = models.BooleanField(default=False)

    def __str__(self):
        return self.texto_opcion

class Reto(models.Model):
    plantilla = models.ForeignKey(PlantillaReto, on_delete=models.CASCADE, related_name='retos')
    curso = models.ForeignKey(Curso, on_delete=models.CASCADE, related_name='retos')
    ataque_origen = models.ForeignKey(
        'honeypot.AtaqueHoneypot',
        on_delete=models.SET_NULL, null=True, blank=True,
        related_name='retos_generados',
    )
    fecha_generacion = models.DateTimeField(auto_now_add=True)
    activo = models.BooleanField(default=True)

    class Meta:
        unique_together = ('ataque_origen', 'curso')

    def __str__(self):
        return f'{self.plantilla.titulo} ({self.curso.nombre})'



class PreguntaQuiz(models.Model):
    reto = models.ForeignKey(Reto, on_delete=models.CASCADE, related_name='preguntas')
    enunciado = models.TextField()
    orden = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ['orden']

    def __str__(self):
        return self.enunciado[:50]


class OpcionRespuesta(models.Model):
    pregunta = models.ForeignKey(PreguntaQuiz, on_delete=models.CASCADE, related_name='opciones')
    texto_opcion = models.CharField(max_length=255)
    es_correcta = models.BooleanField(default=False)

    def __str__(self):
        return self.texto_opcion


class IntentoReto(models.Model):
    estudiante = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='intentos_retos', limit_choices_to={'rol': 'estudiante'},
    )
    reto = models.ForeignKey(Reto, on_delete=models.CASCADE, related_name='intentos')
    respuesta_seleccionada = models.ForeignKey(OpcionRespuesta, on_delete=models.CASCADE)
    es_correcto = models.BooleanField()
    xp_otorgado = models.PositiveIntegerField(default=0)
    fecha_intento = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.estudiante.username} - {self.reto} - {"OK" if self.es_correcto else "X"}'


class PerfilEstudiante(models.Model):
    usuario = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='perfil_gamificacion',
    )
    xp_total = models.PositiveIntegerField(default=0)
    nivel = models.ForeignKey(Nivel, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f'Perfil de {self.usuario.username} ({self.xp_total} XP)'


class Insignia(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField()
    condicion_logro = models.CharField(max_length=255)
    icono = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.nombre


class UsuarioInsignia(models.Model):
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='insignias_obtenidas',
    )
    insignia = models.ForeignKey(Insignia, on_delete=models.CASCADE)
    fecha_obtencion = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('usuario', 'insignia')

    def __str__(self):
        return f'{self.usuario.username} - {self.insignia.nombre}'
