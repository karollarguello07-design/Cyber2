import api from './api';

export async function obtenerRanking() {
  const respuesta = await api.get('/ranking/');
  return respuesta.data;
}
