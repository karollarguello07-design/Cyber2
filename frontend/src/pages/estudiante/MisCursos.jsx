import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { obtenerMisInscripciones } from '../../services/cursos';
import './MisCursos.css';

function MisCursos() {
  const [inscripciones, setInscripciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargar() {
      try {
        const datos = await obtenerMisInscripciones();
        setInscripciones(datos);
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
      <div className="mis-cursos-pagina">
        <h1>Mis Cursos</h1>
        <p className="mis-cursos-subtitulo">Cursos en los que estás inscrito actualmente</p>

        {error && <div className="mis-cursos-error">{error}</div>}

        {cargando ? (
          <p className="mis-cursos-cargando">Cargando...</p>
        ) : inscripciones.length === 0 ? (
          <p className="mis-cursos-cargando">
            Aún no estás inscrito en ningún curso. Ve a "Cursos disponibles" para inscribirte.
          </p>
        ) : (
          <div className="mis-cursos-lista">
            {inscripciones.map((inscripcion) => (
              <div key={inscripcion.id} className="mi-curso-item">
                <span className="mi-curso-nombre">{inscripcion.curso_nombre}</span>
                <span className="mi-curso-fecha">
                  Inscrito el {new Date(inscripcion.fecha_inscripcion).toLocaleDateString('es-CO')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default MisCursos;
