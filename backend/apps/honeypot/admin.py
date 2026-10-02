from django.contrib import admin
from .models import AtaqueHoneypot


@admin.register(AtaqueHoneypot)
class AtaqueHoneypotAdmin(admin.ModelAdmin):
    list_display = ('ip_origen', 'usuario_probado', 'contrasena_probada', 'protocolo', 'timestamp_evento', 'procesado')
    list_filter = ('protocolo', 'procesado', 'tipo_ataque')
    search_fields = ('ip_origen', 'usuario_probado')
