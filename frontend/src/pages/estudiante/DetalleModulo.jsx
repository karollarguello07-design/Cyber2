import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { obtenerModulos } from '../../services/lecciones';
import './DetalleModulo.css';
import phishingImg from '../../assets/ilustraciones/phishing.svg';
import contrasenasImg from '../../assets/ilustraciones/contrasenas.svg';
import ataquesRedImg from '../../assets/ilustraciones/ataques-red.svg';
import proteccionDatosImg from '../../assets/ilustraciones/proteccion-datos.svg';

const ilustracionesPorModulo = {
  'Phishing e Ingeniería Social': phishingImg,
  'Contraseñas Seguras': contrasenasImg,
  'Ataques de Red': ataquesRedImg,
  'Protección de Datos': proteccionDatosImg,
};

function DetalleModulo() {
  const { moduloId } = useParams();
  const navigate = useNavigate();
  const [modulo, setModulo] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargar() {
      try {
        const modulos = await obtenerModulos();
        const encontrado = modulos.find((m) => m.id === Number(moduloId));
        if (!encontrado) {
          setError('Módulo no encontrado.');
        } else {
          setModulo(encontrado);
        }
      } catch (err) {
        setError('No se pudo cargar el módulo.');
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, [moduloId]);

  if (cargando) {
    return (
      <Layout>
        <p className="detalle-modulo-cargando">Cargando módulo...</p>
      </Layout>
    );
  }

  if (error || !modulo) {
    return (
      <Layout>
        <div className="detalle-modulo-error">{error}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="detalle-modulo-pagina">
        <button className="detalle-modulo-volver" onClick={() => navigate('/dashboard')}>
          ← Volver al inicio
        </button>
	
        <div className="detalle-modulo-encabezado">
          <img
            src={ilustracionesPorModulo[modulo.nombre]}
            alt={modulo.nombre}
            className="detalle-modulo-ilustracion"
          />
          <div>
            <h1>{modulo.nombre}</h1>
            <p className="detalle-modulo-descripcion">{modulo.descripcion}</p>
            <p className="detalle-modulo-progreso">
              Progreso: {modulo.progreso_porcentaje}% completado
            </p>
          </div>
        </div>	

        <p className="detalle-modulo-descripcion">{modulo.descripcion}</p>
        <p className="detalle-modulo-progreso">
          Progreso: {modulo.progreso_porcentaje}% completado
        </p>

        {modulo.lecciones.length === 0 ? (
          <p className="detalle-modulo-vacio">Aún no hay lecciones cargadas para este módulo.</p>
        ) : (
          <div className="lecciones-lista">
            {modulo.lecciones.map((leccion) => (
              <Link
                key={leccion.id}
                to={`/lecciones/${leccion.id}`}
                className="leccion-item"
              >
                <span>{leccion.titulo}</span>
                {leccion.completada ? (
                  <span className="leccion-check">✓ Completada</span>
                ) : (
                  <span className="leccion-pendiente">Pendiente</span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default DetalleModulo;
