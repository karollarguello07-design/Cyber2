import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../context/AuthContext';
import { obtenerMisCursosProfesor } from '../../services/profesor';
import './PanelProfesor.css';

function PanelProfesor() {
  const { usuario } = useAuth();
  const [cursos, setCursos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargar() {
      try {
        const datos = await obtenerMisCursosProfesor();
        setCursos(datos);
      } catch (err) {
        setError('No se pudieron cargar tus cursos.');
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  return (
    <Layout>
      <div className="panel-profesor">
        <h1>Panel del Profesor</h1>
        <p className="panel-profesor-subtitulo">Bienvenido, {usuario.username}</p>

        {error && <div className="panel-profesor-error">{error}</div>}

        {cargando ? (
          <p className="panel-profesor-cargando">Cargando tus cursos...</p>
        ) : cursos.length === 0 ? (
          <p className="panel-profesor-cargando">No tienes cursos asignados todavía.</p>
        ) : (
          cursos.map((curso) => (
            <div key={curso.id} className="curso-profesor-tarjeta">
              <h2>{curso.nombre}</h2>
              <p className="curso-profesor-meta">
                {curso.estudiantes.length} / {curso.cupo_maximo} estudiantes inscritos
              </p>

              {curso.estudiantes.length === 0 ? (
                <p className="panel-profesor-vacio">Aún no hay estudiantes inscritos.</p>
              ) : (
                <table className="estudiantes-tabla">
                  <thead>
                    <tr>
                      <th>Estudiante</th>
                      <th>Nivel</th>
                      <th>XP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {curso.estudiantes.map((est) => (
                      <tr key={est.id}>
                        <td>{est.username}</td>
                        <td>{est.nivel_nombre}</td>
                        <td>{est.xp_total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ))
        )}
      </div>
    </Layout>
  );
}

export default PanelProfesor;
