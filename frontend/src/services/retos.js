import api from './api';

export async function obtenerRetos() {
  const respuesta = await api.get('/retos/');
  return respuesta.data;
}

export async function responderReto(retoId, opcionId) {
  const respuesta = await api.post(`/retos/${retoId}/responder/`, { opcion_id: opcionId });
  return respuesta.data;
}

export async function obtenerMiPerfil() {
  const respuesta = await api.get('/mi-perfil/');
  return respuesta.data;
}
export async function obtenerMiHistorial() {
  const respuesta = await api.get('/mi-historial/');
  return respuesta.data;
}
