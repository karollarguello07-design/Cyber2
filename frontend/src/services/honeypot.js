import api from './api';

export async function obtenerEstadisticasAtaques() {
  const respuesta = await api.get('/ataques/estadisticas/');
  return respuesta.data;
}

export async function obtenerAtaques() {
  const respuesta = await api.get('/ataques/');
  return respuesta.data;
}

export async function actualizarAtaques() {
  const respuesta = await api.post('/ataques/actualizar/');
  return respuesta.data;
}
