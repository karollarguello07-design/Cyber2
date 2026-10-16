import api from './api';

export async function obtenerUsuarios() {
  const respuesta = await api.get('/usuarios/');
  return respuesta.data;
}

export async function obtenerCursosAdmin() {
  const respuesta = await api.get('/cursos/');
  return respuesta.data;
}

export async function crearUsuario(datos) {
  const respuesta = await api.post('/usuarios/crear/', datos);
  return respuesta.data;
}

export async function actualizarUsuario(id, datos) {
  const respuesta = await api.patch(`/usuarios/${id}/`, datos);
  return respuesta.data;
}

export async function eliminarUsuario(id) {
  await api.delete(`/usuarios/${id}/`);
}
