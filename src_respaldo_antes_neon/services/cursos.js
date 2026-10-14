import api from './api';

export async function obtenerCursos() {
  const respuesta = await api.get('/cursos/');
  return respuesta.data;
}

export async function obtenerMisInscripciones() {
  const respuesta = await api.get('/mis-inscripciones/');
  return respuesta.data;
}

export async function inscribirseACurso(cursoId) {
  const respuesta = await api.post('/inscripciones/', { curso: cursoId });
  return respuesta.data;
}
