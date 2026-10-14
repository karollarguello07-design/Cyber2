from django.shortcuts import get_object_or_404
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.retos_puntuacion.services import actualizar_xp_y_nivel
from .models import Modulo, QuizPregunta, QuizOpcion, QuizRespuesta
from .quiz_serializers import QuizPreguntaSerializer


class QuizModulosView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        resultado = []
        for modulo in Modulo.objects.order_by('-nivel', 'orden'):
            total = modulo.preguntas_quiz.count()
            if total == 0:
                continue
            correctas = (
                QuizRespuesta.objects
                .filter(estudiante=request.user, pregunta__modulo=modulo, es_correcta=True)
                .values('pregunta')
                .distinct()
                .count()
            )
            resultado.append({
                'id': modulo.id,
                'nombre': modulo.nombre,
                'icono': modulo.icono,
                'nivel': modulo.nivel,
                'total': total,
                'correctas': correctas,
                'porcentaje': round(correctas / total * 100),
            })
        return Response(resultado)


class QuizModuloPreguntasView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, modulo_id):
        modulo = get_object_or_404(Modulo, id=modulo_id)
        preguntas = modulo.preguntas_quiz.prefetch_related('opciones')
        datos = QuizPreguntaSerializer(preguntas, many=True, context={'request': request}).data
        return Response({
            'modulo': {'id': modulo.id, 'nombre': modulo.nombre, 'icono': modulo.icono},
            'preguntas': datos,
        })


class QuizResponderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pregunta_id):
        pregunta = get_object_or_404(QuizPregunta, id=pregunta_id)
        opcion = QuizOpcion.objects.filter(id=request.data.get('opcion_id'), pregunta=pregunta).first()
        if not opcion:
            return Response({'error': 'La opción no pertenece a esta pregunta.'}, status=400)

        ya_acertada = QuizRespuesta.objects.filter(
            estudiante=request.user, pregunta=pregunta, es_correcta=True
        ).exists()
        xp = pregunta.xp if (opcion.es_correcta and not ya_acertada) else 0

        QuizRespuesta.objects.create(
            estudiante=request.user, pregunta=pregunta, opcion=opcion,
            es_correcta=opcion.es_correcta, xp_otorgado=xp,
        )

        if xp and request.user.rol == 'estudiante':
            actualizar_xp_y_nivel(request.user, xp)

        respuesta = {'es_correcta': opcion.es_correcta, 'xp_otorgado': xp}
        if opcion.es_correcta:
            respuesta['explicacion'] = pregunta.explicacion
            respuesta['opcion_correcta_id'] = opcion.id
        return Response(respuesta)
