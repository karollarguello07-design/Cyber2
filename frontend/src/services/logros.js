import api from './api';

export async function obtenerMisLogros() {
  const respuesta = await api.get('/mis-logros/');
  return respuesta.data;
}
