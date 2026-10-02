import api from './api';

export async function obtenerMisCursosProfesor() {
  const respuesta = await api.get('/profesor/mis-cursos/');
  return respuesta.data;
}
