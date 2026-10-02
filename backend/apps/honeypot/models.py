from django.db import models
from apps.retos_puntuacion.models import TipoAtaque


class AtaqueHoneypot(models.Model):
    ip_origen = models.GenericIPAddressField()
    tipo_ataque = models.ForeignKey(
        TipoAtaque, on_delete=models.SET_NULL, null=True, related_name='ataques'
    )
    usuario_probado = models.CharField(max_length=100, blank=True)
    contrasena_probada = models.CharField(max_length=100, blank=True)
    protocolo = models.CharField(max_length=20, blank=True)
    detalle = models.CharField(
        max_length=255, blank=True,
        help_text='Comando ejecutado o archivo/URL descargado, según el tipo de evento.'
    )
    sesion_cowrie = models.CharField(max_length=64)
    eventid_original = models.CharField(max_length=100)
    timestamp_evento = models.DateTimeField()
    fecha_ingesta = models.DateTimeField(auto_now_add=True)
    procesado = models.BooleanField(default=False)

    class Meta:
        unique_together = ('sesion_cowrie', 'eventid_original', 'timestamp_evento')
        ordering = ['-timestamp_evento']

    def __str__(self):
        return f'{self.ip_origen} — {self.eventid_original} ({self.timestamp_evento})'
