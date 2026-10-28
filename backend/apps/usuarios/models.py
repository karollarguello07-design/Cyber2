import random

from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.db import models

validador_alias = RegexValidator(
    regex=r'^[A-Za-z0-9-]{3,20}$',
    message='El alias debe tener entre 3 y 20 caracteres: solo letras, números y guiones.',
)


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

    alias = models.CharField(
        max_length=20,
        unique=True,
        blank=True,
        validators=[validador_alias],
        help_text='Seudónimo visible en el ranking. Se genera uno automático si se deja vacío.',
    )
    visible_en_ranking = models.BooleanField(
        default=True,
        help_text='Si está en False, el estudiante no aparece en el ranking de su curso.',
    )

    def __str__(self):
        return f'{self.username} ({self.rol})'

    def save(self, *args, **kwargs):
        if not self.alias:
            self.alias = self._generar_alias_unico()
        super().save(*args, **kwargs)

    def _generar_alias_unico(self):
        for _ in range(20):
            candidato = f'Agente-{random.randint(1000, 9999)}'
            if not Usuario.objects.filter(alias=candidato).exclude(pk=self.pk).exists():
                return candidato
        # Respaldo extremadamente improbable: usa el id si los 20 intentos chocaron
        return f'Agente-{self.pk or random.randint(10000, 99999)}'
