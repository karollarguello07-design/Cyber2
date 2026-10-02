import api from './api';

export async function obtenerModulos() {
  const respuesta = await api.get('/modulos/');
  return respuesta.data;
}

export async function marcarLeccionCompletada(leccionId) {
  const respuesta = await api.post(`/lecciones/${leccionId}/completar/`);
  return respuesta.data;
}
