import api from './api';

export async function solicitarReset(email) {
  const respuesta = await api.post('/solicitar-reset/', { email });
  return respuesta.data;
}

export async function restablecerContrasena(uid, token, nuevaContrasena) {
  const respuesta = await api.post('/restablecer-contrasena/', {
    uid,
    token,
    nueva_contrasena: nuevaContrasena,
  });
  return respuesta.data;
}
