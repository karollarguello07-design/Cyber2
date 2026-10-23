import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { obtenerMisLogros } from '../../services/logros';
import './MisLogros.css';

function formatearFecha(fecha) {
  if (!fecha) return '';
  return new Date(fecha).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function MisLogros() {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargar() {
      try {
        setDatos(await obtenerMisLogros());
      } catch (err) {
        setError('No se pudieron cargar tus logros. Si llevas rato en la app, cierra sesión y vuelve a entrar.');
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  if (cargando) {
    return (
      <Layout>
        <p className="logros-cargando">Cargando tus logros...</p>
      </Layout>
    );
  }

  if (error || !datos) {
    return (
      <Layout>
        <div className="logros-error">{error}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="logros-pagina">
        <h1>🏆 Mis Logros</h1>
        <p className="logros-subtitulo">Todo lo que has conseguido en tu camino de ciberseguridad</p>

        <div className="logros-stats">
          <div className="logros-stat">
            <span className="logros-stat-valor">{datos.xp_total}</span>
            <span className="logros-stat-etiqueta">XP total</span>
          </div>
          <div className="logros-stat">
            <span className="logros-stat-valor">{datos.nivel_nombre || '—'}</span>
            <span className="logros-stat-etiqueta">Nivel {datos.numero_nivel}</span>
          </div>
          <div className="logros-stat">
            <span className="logros-stat-valor">{datos.total_retos_correctos}/{datos.total_retos}</span>
            <span className="logros-stat-etiqueta">Retos completados</span>
          </div>
          <div className="logros-stat">
            <span className="logros-stat-valor">{datos.porcentaje_aciertos}%</span>
            <span className="logros-stat-etiqueta">Aciertos</span>
          </div>
        </div>

        <section className="logros-seccion">
          <h2>🎖️ Insignias <span className="logros-contador">{datos.insignias_obtenidas}/{datos.insignias_totales}</span></h2>
          <div className="logros-insignias-grid">
            {datos.insignias.map((insignia) => (
              <div
                key={insignia.id}
                className={'logros-insignia' + (insignia.obtenida ? ' obtenida' : ' bloqueada')}
              >
                <span className="logros-insignia-icono">{insignia.obtenida ? insignia.icono : '🔒'}</span>
                <h3>{insignia.nombre}</h3>
                <p>{insignia.descripcion}</p>
                {insignia.obtenida && (
                  <span className="logros-insignia-fecha">Obtenida el {formatearFecha(insignia.fecha)}</span>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="logros-seccion">
          <h2>📜 Línea de tiempo</h2>
          {datos.linea_tiempo.length === 0 ? (
            <p className="logros-vacio">Aún no tienes actividad registrada. ¡Resuelve tu primer reto!</p>
          ) : (
            <div className="logros-timeline">
              {datos.linea_tiempo.map((item, i) => (
                <div key={i} className="logros-timeline-item">
                  <span className="logros-timeline-icono">
                    {item.tipo === 'insignia' ? '🎖️' : '✅'}
                  </span>
                  <div className="logros-timeline-cuerpo">
                    <strong>{item.titulo}</strong>
                    <span className="logros-timeline-detalle">
                      {item.tipo === 'insignia' ? 'Nueva insignia' : `Reto completado · +${item.xp} XP`}
                    </span>
                  </div>
                  <span className="logros-timeline-fecha">{formatearFecha(item.fecha)}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}

export default MisLogros;
