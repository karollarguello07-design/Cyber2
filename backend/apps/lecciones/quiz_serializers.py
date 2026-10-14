from rest_framework import serializers
from .models import QuizPregunta, QuizOpcion


class QuizOpcionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizOpcion
        fields = ('id', 'texto')


class QuizPreguntaSerializer(serializers.ModelSerializer):
    opciones = QuizOpcionSerializer(many=True, read_only=True)
    ya_acertada = serializers.SerializerMethodField()

    class Meta:
        model = QuizPregunta
        fields = ('id', 'orden', 'enunciado', 'xp', 'opciones', 'ya_acertada')

    def get_ya_acertada(self, obj):
        usuario = self.context['request'].user
        return obj.respuestas.filter(estudiante=usuario, es_correcta=True).exists()
