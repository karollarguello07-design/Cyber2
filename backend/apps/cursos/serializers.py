from rest_framework import serializers
from .models import Curso, Inscripcion


class CursoSerializer(serializers.ModelSerializer):
    profesor_nombre = serializers.CharField(source='profesor.username', read_only=True)
    cupo_disponible = serializers.SerializerMethodField()

    class Meta:
        model = Curso
        fields = (
            'id', 'nombre', 'descripcion', 'profesor', 'profesor_nombre',
            'cupo_maximo', 'cupo_disponible', 'activo', 'fecha_creacion',
        )
        read_only_fields = ('fecha_creacion',)

    def get_cupo_disponible(self, obj):
        inscritos = obj.inscripciones.count()
        return obj.cupo_maximo - inscritos

    def validate_profesor(self, valor):
        if valor.rol != 'profesor':
            raise serializers.ValidationError(
                'El usuario asignado debe tener rol de Profesor.'
            )
        return valor


class InscripcionSerializer(serializers.ModelSerializer):
    estudiante_nombre = serializers.CharField(source='estudiante.username', read_only=True)
    curso_nombre = serializers.CharField(source='curso.nombre', read_only=True)

    class Meta:
        model = Inscripcion
        fields = ('id', 'estudiante', 'estudiante_nombre', 'curso', 'curso_nombre', 'fecha_inscripcion')
        read_only_fields = ('estudiante', 'fecha_inscripcion')

    def validate_curso(self, valor):
        estudiante = self.context['request'].user
        if valor.inscripciones.count() >= valor.cupo_maximo:
            raise serializers.ValidationError('El curso ya no tiene cupo disponible.')

        inscripcion_existente = Inscripcion.objects.filter(estudiante=estudiante).first()
        if inscripcion_existente:
           raise serializers.ValidationError(
               f'Ya estás inscrito en el curso "{inscripcion_existente.curso.nombre}".'
        )
        return valor

    def create(self, validated_data):
        validated_data['estudiante'] = self.context['request'].user
        return super().create(validated_data)

class EstudianteConProgresoSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    username = serializers.CharField()
    xp_total = serializers.IntegerField()
    nivel_nombre = serializers.CharField()


class CursoConEstudiantesSerializer(serializers.ModelSerializer):
    estudiantes = serializers.SerializerMethodField()

    class Meta:
        model = Curso
        fields = ('id', 'nombre', 'cupo_maximo', 'estudiantes')

    def get_estudiantes(self, obj):
        from apps.retos_puntuacion.models import PerfilEstudiante
        resultado = []
        for inscripcion in obj.inscripciones.select_related('estudiante').all():
            estudiante = inscripcion.estudiante
            perfil, _ = PerfilEstudiante.objects.get_or_create(usuario=estudiante)
            resultado.append({
                'id': estudiante.id,
                'username': estudiante.username,
                'xp_total': perfil.xp_total,
                'nivel_nombre': perfil.nivel.nombre_nivel if perfil.nivel else 'Sin nivel',
            })
        return resultado
