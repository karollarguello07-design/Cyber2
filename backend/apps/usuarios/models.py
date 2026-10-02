from django.contrib.auth.models import AbstractUser
from django.db import models


class Usuario(AbstractUser):
    class Rol(models.TextChoices):
        ADMINISTRADOR = 'admin', 'Administrador'
        PROFESOR = 'profesor', 'Profesor'
        ESTUDIANTE = 'estudiante', 'Estudiante'

    rol = models.CharField(
        max_length=20,
        choices=Rol.choices,
        default=Rol.ESTUDIANTE,
    )
    telegram_chat_id = models.CharField(max_length=50, null=True, blank=True)
    telegram_vinculado = models.BooleanField(default=False)
    codigo_vinculacion_telegram = models.CharField(max_length=10, null=True, blank=True)
    codigo_vinculacion_expira = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f'{self.username} ({self.rol})'
