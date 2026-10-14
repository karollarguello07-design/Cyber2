import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { obtenerMiPerfil, obtenerMiHistorial } from '../../services/retos';
import './MiProgreso.css';

function MiProgreso() {
  const [perfil, setPerfil] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargar() {
      try {
        const [datosPerfil, datosHistorial] = await Promise.all([
          obtenerMiPerfil(),
          obtenerMiHistorial(),
        ]);
        setPerfil(datosPerfil);
        setHistorial(datosHistorial);
      } catch (err) {
        setError('No se pudo cargar tu información de progreso.');
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  if (cargando) {
    return (
      <Layout>
        <p className="mi-progreso-cargando">Cargando tu progreso...</p>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="mi-progreso-error">{error}</div>
      </Layout>
    );
  }

  const porcentajeAciertos =
    perfil.total_intentos > 0
      ? Math.round((perfil.total_retos_correctos / perfil.total_intentos) * 100)
      : 0;

  return (
    <Layout>
      <div className="mi-progreso-pagina">
        <h1>📊 Mi Progreso Detallado</h1>
        <p className="mi-progreso-subtitulo">
          Un resumen completo de tu avance en CyberEdu
        </p>

        <div className="mi-progreso-resumen">
          <TarjetaEstadistica etiqueta="XP Total" valor={perfil.xp_total} color="#4ade80" />
          <TarjetaEstadistica etiqueta="Nivel actual" valor={perfil.nivel_nombre} color="#22d3ee" />
          <TarjetaEstadistica
            etiqueta="Retos correctos"
            valor={`${perfil.total_retos_correctos} / ${perfil.total_intentos}`}
            color="#fbbf24"
          />
          <TarjetaEstadistica
            etiqueta="% de aciertos"
            valor={`${porcentajeAciertos}%`}
            color="#f87171"
          />
        </div>

        {perfil.xp_siguiente_nivel && (
          <div className="mi-progreso-siguiente-nivel">
            <div className="siguiente-nivel-info">
              <span>Progreso hacia "{perfil.xp_siguiente_nivel.nombre_siguiente}"</span>
              <span>
                {perfil.xp_total} / {perfil.xp_siguiente_nivel.xp_requerido} XP
                {' '}(faltan {perfil.xp_siguiente_nivel.xp_faltante})
              </span>
            </div>
            <div className="siguiente-nivel-barra-fondo">
              <div
                className="siguiente-nivel-barra-relleno"
                style={{
                  width: `${Math.min(
                    (perfil.xp_total / perfil.xp_siguiente_nivel.xp_requerido) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        )}

        <div className="mi-progreso-insignias">
          <h2>🎖️ Insignias obtenidas ({perfil.insignias.length})</h2>
          {perfil.insignias.length === 0 ? (
            <p className="mi-progreso-vacio">Aún no has obtenido ninguna insignia.</p>
          ) : (
            <div className="insignias-lista">
              {perfil.insignias.map((insignia) => (
                <div key={insignia.nombre} className="insignia-chip">
                  🎖️ {insignia.nombre}
                  <span className="insignia-fecha">
                    {new Date(insignia.fecha).toLocaleDateString('es-CO')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mi-progreso-historial">
          <h2>📜 Historial de intentos</h2>
          {historial.length === 0 ? (
            <p className="mi-progreso-vacio">Aún no has respondido ningún reto.</p>
          ) : (
            <table className="historial-tabla">
              <thead>
                <tr>
                  <th>Reto</th>
                  <th>Resultado</th>
                  <th>XP</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {historial.map((intento) => (
                  <tr key={intento.id}>
                    <td>{intento.reto_titulo}</td>
                    <td>
                      <span className={intento.es_correcto ? 'resultado-ok' : 'resultado-error'}>
                        {intento.es_correcto ? '✓ Correcto' : '✗ Incorrecto'}
                      </span>
                    </td>
                    <td>+{intento.xp_otorgado}</td>
                    <td>{new Date(intento.fecha_intento).toLocaleString('es-CO')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
}

function TarjetaEstadistica({ etiqueta, valor, color }) {
  return (
    <div className="estadistica-tarjeta">
      <p className="estadistica-etiqueta">{etiqueta}</p>
      <p className="estadistica-valor" style={{ color }}>{valor}</p>
    </div>
  );
}

export default MiProgreso;
