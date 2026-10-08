from rest_framework import serializers
from .models import Modulo, Leccion, TarjetaEstudio


class LeccionSerializer(serializers.ModelSerializer):
    completada = serializers.SerializerMethodField()

    class Meta:
        model = Leccion
        fields = ('id', 'titulo', 'contenido', 'dato_curioso', 'orden', 'completada')

    def get_completada(self, obj):
        usuario = self.context['request'].user
        return obj.completadas_por.filter(estudiante=usuario).exists()

class TarjetaEstudioSerializer(serializers.ModelSerializer):
    class Meta:
        model = TarjetaEstudio
        fields = (
            'id', 'orden', 'icono', 'titulo', 'analogia', 'peligro',
            'que_es', 'como_se_ve', 'como_defenderse', 'solo_teoria',
        )

class ModuloSerializer(serializers.ModelSerializer):
    lecciones = LeccionSerializer(many=True, read_only=True)
    progreso_porcentaje = serializers.SerializerMethodField()
    tarjetas = TarjetaEstudioSerializer(many=True, read_only=True)

    class Meta:
        model = Modulo
        fields = ('id', 'nombre', 'descripcion', 'icono', 'lecciones', 'progreso_porcentaje','tarjetas')

    def get_progreso_porcentaje(self, obj):
        usuario = self.context['request'].user
        total = obj.lecciones.count()
        if total == 0:
            return 0
        completadas = obj.lecciones.filter(completadas_por__estudiante=usuario).count()
        return round((completadas / total) * 100)
