import { useState, useEffect } from 'react';
import { obtenerEstadisticasAtaques, actualizarAtaques } from '../../services/honeypot';
import './PanelAtaques.css';

function PanelAtaques() {
  const [stats, setStats] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  async function cargarEstadisticas() {
    try {
      const datos = await obtenerEstadisticasAtaques();
      setStats(datos);
    } catch (err) {
      setStats(null);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  async function manejarActualizar() {
    setActualizando(true);
    setMensaje('');
    try {
      await actualizarAtaques();
      setMensaje('Ataques actualizados correctamente.');
      window.location.reload();
    } catch (err) {
      setMensaje('No se pudo actualizar. Intenta de nuevo.');
      setActualizando(false);
    }
  }

  if (cargando) {
    return (
      <section className="panel-ataques">
        <p className="panel-ataques-cargando">Cargando estadísticas del honeypot...</p>
      </section>
    );
  }

  if (!stats || stats.total_ataques === 0) {
    return (
      <section className="panel-ataques">
        <div className="panel-ataques-encabezado">
          <h2>🐝 Panel Cowrie — Ataques en tiempo real</h2>
          <button
            className="panel-ataques-boton-actualizar"
            onClick={manejarActualizar}
            disabled={actualizando}
          >
            {actualizando ? 'Actualizando...' : '🔄 Actualizar'}
          </button>
        </div>
        <p className="panel-ataques-vacio">
          Aún no se han ingerido ataques. Da clic en "Actualizar" o ejecuta{' '}
          <code>python manage.py ingerir_cowrie</code> en el backend.
        </p>
        {mensaje && <p className="panel-ataques-mensaje">{mensaje}</p>}
      </section>
    );
  }

  return (
    <section className="panel-ataques">
      <div className="panel-ataques-encabezado">
        <h2>🐝 Panel Cowrie — Ataques en tiempo real</h2>
        <button
          className="panel-ataques-boton-actualizar"
          onClick={manejarActualizar}
          disabled={actualizando}
        >
          {actualizando ? 'Actualizando...' : '🔄 Actualizar'}
        </button>
      </div>
      {mensaje && <p className="panel-ataques-mensaje">{mensaje}</p>}

      <div className="panel-ataques-grid">
        <div className="panel-ataques-tarjeta">
          <p className="panel-ataques-etiqueta">Ataques detectados hoy</p>
          <p className="panel-ataques-numero-grande">{stats.ataques_hoy}</p>
          <p className="panel-ataques-variacion">{stats.total_ataques} en total (histórico)</p>
        </div>

        <div className="panel-ataques-tarjeta">
          <p className="panel-ataques-etiqueta">Usuarios más usados</p>
          {stats.usuarios_top.length === 0 ? (
            <p className="panel-ataques-sin-datos">Sin datos aún</p>
          ) : (
            stats.usuarios_top.map((item) => (
              <BarraRanking
                key={item.usuario_probado}
                nombre={item.usuario_probado}
                total={item.total}
                maximo={stats.usuarios_top[0].total}
                color="#fb923c"
              />
            ))
          )}
        </div>

        <div className="panel-ataques-tarjeta">
          <p className="panel-ataques-etiqueta">Contraseñas más usadas</p>
          {stats.contrasenas_top.length === 0 ? (
            <p className="panel-ataques-sin-datos">Sin datos aún</p>
          ) : (
            stats.contrasenas_top.map((item) => (
              <BarraRanking
                key={item.contrasena_probada}
                nombre={item.contrasena_probada}
                total={item.total}
                maximo={stats.contrasenas_top[0].total}
                color="#f87171"
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function BarraRanking({ nombre, total, maximo, color }) {
  const porcentaje = Math.round((total / maximo) * 100);
  return (
    <div className="barra-ranking">
      <div className="barra-ranking-info">
        <span>{nombre}</span>
        <span>{total}</span>
      </div>
      <div className="barra-ranking-fondo">
        <div
          className="barra-ranking-relleno"
          style={{ width: `${porcentaje}%`, backgroundColor: color }}
        ></div>
      </div>
    </div>
  );
}

export default PanelAtaques;
