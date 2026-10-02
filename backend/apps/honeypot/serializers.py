from rest_framework import serializers
from .models import AtaqueHoneypot


class AtaqueHoneypotSerializer(serializers.ModelSerializer):
    tipo_ataque_nombre = serializers.CharField(source='tipo_ataque.nombre', read_only=True)

    class Meta:
        model = AtaqueHoneypot
        fields = (
            'id', 'ip_origen', 'tipo_ataque_nombre', 'usuario_probado',
            'contrasena_probada', 'protocolo', 'timestamp_evento',
        )
