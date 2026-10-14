import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import TarjetasEstudio from '../../components/dashboard/TarjetasEstudio';
import { obtenerModulos } from '../../services/lecciones';
import './DetalleModulo.css';

const ilustraciones = import.meta.glob('../../assets/ilustraciones/*.svg', {
  eager: true,
  import: 'default',
});

const archivoPorModulo = {
  'Phishing e Ingeniería Social': 'phishing.svg',
  'Contraseñas Seguras': 'contrasenas.svg',
  'Ataques de Red': 'ataques-red.svg',
  'Protección de Datos': 'proteccion-datos.svg',
};

function buscarIlustracion(nombreModulo) {
  const archivo = archivoPorModulo[nombreModulo];
  if (!archivo) return null;
  const ruta = Object.keys(ilustraciones).find((r) => r.endsWith('/' + archivo));
  return ruta ? ilustraciones[ruta] : null;
}

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
        <div className="detalle-modulo-error">{error || 'Módulo no encontrado.'}</div>
      </Layout>
    );
  }

  const tieneTarjetas = modulo.tarjetas && modulo.tarjetas.length > 0;
  const tieneLecciones = modulo.lecciones && modulo.lecciones.length > 0;
  const ilustracion = buscarIlustracion(modulo.nombre);

  return (
    <Layout>
      <div className="detalle-modulo-pagina">
        <button className="detalle-modulo-volver" onClick={() => navigate('/dashboard')}>
          ← Volver al inicio
        </button>

        <div className="detalle-modulo-encabezado">
          {ilustracion ? (
            <img src={ilustracion} alt={modulo.nombre} className="detalle-modulo-ilustracion" />
          ) : (
            <div className="detalle-modulo-icono-emoji">{modulo.icono}</div>
          )}
          <div>
            <h1>{modulo.nombre}</h1>
            <p className="detalle-modulo-descripcion">{modulo.descripcion}</p>
            {tieneLecciones && (
              <p className="detalle-modulo-progreso">
                Progreso: {modulo.progreso_porcentaje}% completado
              </p>
            )}
          </div>
        </div>

        {tieneTarjetas && (
          <TarjetasEstudio tarjetas={modulo.tarjetas} moduloId={modulo.id} nivel={modulo.nivel} />
        )}

        {tieneLecciones && (
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

        {!tieneTarjetas && !tieneLecciones && (
          <p className="detalle-modulo-vacio">Aún no hay contenido cargado para este módulo.</p>
        )}
      </div>
    </Layout>
  );
}

export default DetalleModulo;
