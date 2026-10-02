import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { obtenerModulos, marcarLeccionCompletada } from '../../services/lecciones';
import './VerLeccion.css';

function VerLeccion() {
  const { leccionId } = useParams();
  const navigate = useNavigate();
  const [leccion, setLeccion] = useState(null);
  const [moduloId, setModuloId] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [marcando, setMarcando] = useState(false);

  useEffect(() => {
    cargar();
  }, [leccionId]);

  async function cargar() {
    setCargando(true);
    try {
      const modulos = await obtenerModulos();
      for (const modulo of modulos) {
        const encontrada = modulo.lecciones.find((l) => l.id === Number(leccionId));
        if (encontrada) {
          setLeccion(encontrada);
          setModuloId(modulo.id);
          break;
        }
      }
    } catch (err) {
      setError('No se pudo cargar la lección.');
    } finally {
      setCargando(false);
    }
  }

  async function manejarCompletar() {
    setMarcando(true);
    try {
      await marcarLeccionCompletada(leccionId);
      await cargar();
    } catch (err) {
      setError('No se pudo marcar como completada.');
    } finally {
      setMarcando(false);
    }
  }

  if (cargando) {
    return (
      <Layout>
        <p className="ver-leccion-cargando">Cargando lección...</p>
      </Layout>
    );
  }

  if (error || !leccion) {
    return (
      <Layout>
        <div className="ver-leccion-error">{error || 'Lección no encontrada.'}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="ver-leccion-pagina">
        <button className="ver-leccion-volver" onClick={() => navigate(`/modulos/${moduloId}`)}>
          ← Volver al módulo
        </button>
        <h1>{leccion.titulo}</h1>

        {leccion.dato_curioso && (
          <div className="ver-leccion-dato-curioso">
            {leccion.dato_curioso}
          </div>
        )}

        <div className="ver-leccion-contenido">{leccion.contenido}</div>


        {leccion.completada ? (
          <div className="ver-leccion-badge-ok">✓ Ya completaste esta lección</div>
        ) : (
          <button
            className="ver-leccion-boton"
            onClick={manejarCompletar}
            disabled={marcando}
          >
            {marcando ? 'Guardando...' : 'Marcar como completada'}
          </button>
        )}
      </div>
    </Layout>
  );
}

export default VerLeccion;
