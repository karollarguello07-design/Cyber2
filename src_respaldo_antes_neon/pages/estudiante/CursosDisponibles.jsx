import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { obtenerCursos, inscribirseACurso } from '../../services/cursos';
import './CursosDisponibles.css';

function CursosDisponibles() {
  const [cursos, setCursos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const [inscribiendoId, setInscribiendoId] = useState(null);

  useEffect(() => {
    cargarCursos();
  }, []);

  async function cargarCursos() {
    setCargando(true);
    setError('');
    try {
      const datos = await obtenerCursos();
      setCursos(datos);
    } catch (err) {
      setError('No se pudieron cargar los cursos. Intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  }

  async function manejarInscripcion(cursoId) {
    setInscribiendoId(cursoId);
    setError('');
    setMensajeExito('');
    try {
      await inscribirseACurso(cursoId);
      setMensajeExito('¡Inscripción exitosa!');
      await cargarCursos();
    } catch (err) {
      const detalle = err.response?.data?.curso?.[0] || 'No se pudo completar la inscripción.';
      setError(detalle);
    } finally {
      setInscribiendoId(null);
    }
  }

  return (
    <Layout>
      <div className="cursos-pagina">
        <h1>Cursos disponibles</h1>
        <p className="cursos-subtitulo">Elige un curso para comenzar tu aprendizaje</p>

        {error && <div className="cursos-alerta cursos-alerta-error">{error}</div>}
        {mensajeExito && <div className="cursos-alerta cursos-alerta-exito">{mensajeExito}</div>}

        {cargando ? (
          <p className="cursos-cargando">Cargando cursos...</p>
        ) : cursos.length === 0 ? (
          <p className="cursos-cargando">No hay cursos disponibles por el momento.</p>
        ) : (
          <div className="cursos-grid">
            {cursos.map((curso) => (
              <div key={curso.id} className="curso-tarjeta">
                <h3>{curso.nombre}</h3>
                <p className="curso-descripcion">{curso.descripcion || 'Sin descripción'}</p>
                <p className="curso-profesor">Profesor: {curso.profesor_nombre}</p>
                <p className={curso.cupo_disponible > 0 ? 'curso-cupo-ok' : 'curso-cupo-lleno'}>
                  {curso.cupo_disponible > 0
                    ? `${curso.cupo_disponible} cupos disponibles`
                    : 'Cupo lleno'}
                </p>
                <button
                  className="curso-boton"
                  disabled={curso.cupo_disponible <= 0 || inscribiendoId === curso.id}
                  onClick={() => manejarInscripcion(curso.id)}
                >
                  {inscribiendoId === curso.id ? 'Inscribiendo...' : 'Inscribirme'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default CursosDisponibles;
