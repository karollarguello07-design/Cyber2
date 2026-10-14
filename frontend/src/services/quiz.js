import api from './api';

export async function obtenerQuizModulos() {
  const respuesta = await api.get('/quiz/modulos/');
  return respuesta.data;
}

export async function obtenerPreguntasModulo(moduloId) {
  const respuesta = await api.get(`/quiz/modulos/${moduloId}/preguntas/`);
  return respuesta.data;
}

export async function responderPregunta(preguntaId, opcionId) {
  const respuesta = await api.post(`/quiz/preguntas/${preguntaId}/responder/`, {
    opcion_id: opcionId,
  });
  return respuesta.data;
}
