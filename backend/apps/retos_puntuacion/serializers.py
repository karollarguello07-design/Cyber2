from rest_framework import serializers
from .models import Reto, PreguntaQuiz, OpcionRespuesta, IntentoReto, PerfilEstudiante, UsuarioInsignia


class OpcionRespuestaSerializer(serializers.ModelSerializer):
    class Meta:
        model = OpcionRespuesta
        fields = ('id', 'texto_opcion')  # nunca exponemos 'es_correcta' al frontend


class PreguntaQuizSerializer(serializers.ModelSerializer):
    opciones = OpcionRespuestaSerializer(many=True, read_only=True)

    class Meta:
        model = PreguntaQuiz
        fields = ('id', 'enunciado', 'orden', 'opciones')


class RetoSerializer(serializers.ModelSerializer):
    titulo = serializers.CharField(source='plantilla.titulo', read_only=True)
    descripcion = serializers.CharField(source='plantilla.descripcion', read_only=True)
    xp_recompensa = serializers.IntegerField(source='plantilla.xp_recompensa', read_only=True)
    orden = serializers.IntegerField(source='plantilla.orden', read_only=True)
    instrucciones_practica = serializers.CharField(source='plantilla.instrucciones_practica', read_only=True)
    credenciales_practica = serializers.CharField(source='plantilla.credenciales_practica', read_only=True)
    curso_nombre = serializers.CharField(source='curso.nombre', read_only=True)
    preguntas = PreguntaQuizSerializer(many=True, read_only=True)

    class Meta:
        model = Reto
        fields = (
            'id', 'titulo', 'descripcion', 'xp_recompensa', 'orden',
            'instrucciones_practica', 'credenciales_practica',
            'curso', 'curso_nombre', 'activo', 'preguntas',
        )


class ResponderRetoSerializer(serializers.Serializer):
    opcion_id = serializers.IntegerField()

    def validate_opcion_id(self, valor):
        reto = self.context['reto']
        if not OpcionRespuesta.objects.filter(id=valor, pregunta__reto=reto).exists():
            raise serializers.ValidationError('La opción no pertenece a este reto.')
        return valor

class IntentoRetoSerializer(serializers.ModelSerializer):
    reto_titulo = serializers.CharField(source='reto.plantilla.titulo', read_only=True)
    curso_nombre = serializers.CharField(source='reto.curso.nombre', read_only=True)

    class Meta:
        model = IntentoReto
        fields = ('id', 'reto', 'reto_titulo', 'curso_nombre', 'es_correcto', 'xp_otorgado', 'fecha_intento')

class PerfilEstudianteSerializer(serializers.ModelSerializer):
    nivel_nombre = serializers.CharField(source='nivel.nombre_nivel', read_only=True)
    numero_nivel = serializers.IntegerField(source='nivel.numero_nivel', read_only=True)
    insignias = serializers.SerializerMethodField()
    xp_siguiente_nivel = serializers.SerializerMethodField()
    total_retos_correctos = serializers.SerializerMethodField()
    total_intentos = serializers.SerializerMethodField()

    class Meta:
        model = PerfilEstudiante
        fields = (
            'xp_total', 'nivel_nombre', 'numero_nivel', 'insignias',
            'xp_siguiente_nivel', 'total_retos_correctos', 'total_intentos',
        )

    def get_insignias(self, obj):
        registros = UsuarioInsignia.objects.filter(usuario=obj.usuario).select_related('insignia')
        return [
            {'nombre': r.insignia.nombre, 'fecha': r.fecha_obtencion}
            for r in registros
        ]

    def get_xp_siguiente_nivel(self, obj):
        from .models import Nivel
        siguiente = (
            Nivel.objects.filter(numero_nivel__gt=obj.nivel.numero_nivel)
            .order_by('numero_nivel')
            .first()
        ) if obj.nivel else None
        if not siguiente:
            return None
        return {
            'xp_requerido': siguiente.xp_minimo,
            'xp_faltante': max(siguiente.xp_minimo - obj.xp_total, 0),
            'nombre_siguiente': siguiente.nombre_nivel,
        }

    def get_total_retos_correctos(self, obj):
        return IntentoReto.objects.filter(estudiante=obj.usuario, es_correcto=True).count()

    def get_total_intentos(self, obj):
        return IntentoReto.objects.filter(estudiante=obj.usuario).count()
