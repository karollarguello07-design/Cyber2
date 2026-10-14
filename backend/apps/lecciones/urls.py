from django.urls import path
from .views import ModulosListaView, MarcarLeccionCompletadaView

urlpatterns = [
    path('modulos/', ModulosListaView.as_view(), name='modulos_lista'),
    path('lecciones/<int:leccion_id>/completar/', MarcarLeccionCompletadaView.as_view(), name='leccion_completar'),
]


from .quiz_views import QuizModulosView, QuizModuloPreguntasView, QuizResponderView

urlpatterns += [
    path('quiz/modulos/', QuizModulosView.as_view(), name='quiz_modulos'),
    path('quiz/modulos/<int:modulo_id>/preguntas/', QuizModuloPreguntasView.as_view(), name='quiz_preguntas'),
    path('quiz/preguntas/<int:pregunta_id>/responder/', QuizResponderView.as_view(), name='quiz_responder'),
]
