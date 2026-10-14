import api from './api';

export async function obtenerUsuarios() {
  const respuesta = await api.get('/usuarios/');
  return respuesta.data;
}

export async function obtenerCursosAdmin() {
  const respuesta = await api.get('/cursos/');
  return respuesta.data;
}
