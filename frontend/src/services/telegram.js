import api from './api';

export async function generarCodigoTelegram() {
  const respuesta = await api.post('/telegram/generar-codigo/');
  return respuesta.data;
}

export async function desvincularTelegram() {
  const respuesta = await api.post('/telegram/desvincular/');
  return respuesta.data;
}

export async function obtenerEstadoTelegram() {
  const respuesta = await api.get('/telegram/estado/');
  return respuesta.data;
}
