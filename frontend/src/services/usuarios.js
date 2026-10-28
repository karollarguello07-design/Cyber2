import api from './api';

export async function obtenerMiCuenta() {
  const respuesta = await api.get('/usuarios/mi-cuenta/');
  return respuesta.data;
}

export async function actualizarMiCuenta(datos) {
  const respuesta = await api.patch('/usuarios/mi-cuenta/', datos);
  return respuesta.data;
}
