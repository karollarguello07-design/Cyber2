import api from './api';

export async function obtenerReglasPuntuacion() {
  const respuesta = await api.get('/reglas-puntuacion/');
  return respuesta.data;
}
