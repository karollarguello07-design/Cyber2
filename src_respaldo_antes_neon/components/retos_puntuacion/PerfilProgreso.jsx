import { useState, useEffect } from 'react';
import { obtenerMiPerfil } from '../../services/retos';
import './PerfilProgreso.css';

const temasProgreso = [
  { nombre: 'Phishing', porcentaje: 0 },
  { nombre: 'Contraseñas', porcentaje: 0 },
  { nombre: 'Ataques de Red', porcentaje: 0 },
  { nombre: 'Protección de Datos', porcentaje: 0 },
];

const catalogoLogros = [
  { nombre: 'Primer paso', icono: '🎖️' },
  { nombre: 'Anti-Phishing', icono: '🎧' },
  { nombre: 'Guardián', icono: '🛡️' },
  { nombre: 'Experto SSH', icono: '🔒' },
  { nombre: 'Quiz Master', icono: '🏆' },
  { nombre: 'Análisis Pro', icono: '🔍' },
  { nombre: 'Cowrie Analyst', icono: '🐝' },
  { nombre: 'Maestro Cyber', icono: '👑' },
];

function PerfilProgreso({ usuario }) {
  const [perfil, setPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      try {
        const datos = await obtenerMiPerfil();
        setPerfil(datos);
      } catch (err) {
        setPerfil(null);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  if (cargando) {
    return (
      <section className="progreso-seccion">
        <p className="progreso-cargando">Cargando tu progreso...</p>
      </section>
    );
  }

  const xpTotal = perfil?.xp_total ?? 0;
  const nombreNivel = perfil?.nivel_nombre ?? 'Aprendiz';
  const insigniasObtenidas = perfil?.insignias?.map((i) => i.nombre) ?? [];

  const logros = catalogoLogros.map((logro) => ({
    ...logro,
    obtenido: insigniasObtenidas.includes(logro.nombre),
  }));
  const totalObtenidos = logros.filter((l) => l.obtenido).length;

  return (
    <section className="progreso-seccion">
      <div className="progreso-encabezado">
        <h2>📊 Mi progreso</h2>
      </div>

      <div className="progreso-grid">
        <TarjetaProgresoGeneral temas={temasProgreso} />
        <TarjetaLogros logros={logros} obtenidos={totalObtenidos} />
        <TarjetaPuntuacion xpTotal={xpTotal} />
      </div>

      <div className="perfil-lateral">
        <p className="perfil-lateral-titulo">Tu perfil</p>
        <p className="perfil-lateral-nombre">{usuario.username}</p>
        <p className="perfil-lateral-nivel">
          {nombreNivel} &nbsp; {xpTotal} XP
        </p>
      </div>
    </section>
  );
}

function TarjetaProgresoGeneral({ temas }) {
  const promedio = Math.round(
    temas.reduce((suma, t) => suma + t.porcentaje, 0) / temas.length
  );

  return (
    <div className="progreso-tarjeta">
      <p className="progreso-tarjeta-etiqueta">
        Progreso por tema <span className="progreso-nota">(próximamente)</span>
      </p>

      <div className="progreso-circulo-contenedor">
        <svg viewBox="0 0 100 100" className="progreso-circulo-svg">
          <circle cx="50" cy="50" r="42" className="progreso-circulo-fondo" />
          <circle
            cx="50" cy="50" r="42"
            className="progreso-circulo-relleno"
            style={{ strokeDasharray: `${promedio * 2.64} 264` }}
          />
        </svg>
        <div className="progreso-circulo-texto">
          <strong>{promedio}%</strong>
          <span>completado</span>
        </div>
      </div>

      {temas.map((tema) => (
        <div key={tema.nombre} className="progreso-tema">
          <div className="progreso-tema-info">
            <span>{tema.nombre}</span>
            <span>{tema.porcentaje}%</span>
          </div>
          <div className="progreso-tema-barra-fondo">
            <div className="progreso-tema-barra-relleno" style={{ width: `${tema.porcentaje}%` }}></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TarjetaLogros({ logros, obtenidos }) {
  return (
    <div className="progreso-tarjeta">
      <p className="progreso-tarjeta-etiqueta">Logros obtenidos</p>
      <p className="progreso-logros-numero">
        {obtenidos}<span>/{logros.length}</span>
      </p>
      <p className="progreso-logros-subtexto">logros desbloqueados</p>

      <div className="progreso-logros-grid">
        {logros.map((logro) => (
          <span
            key={logro.nombre}
            className={'progreso-logro-chip' + (logro.obtenido ? ' obtenido' : ' bloqueado')}
          >
            {logro.obtenido ? logro.icono : '🔒'} {logro.nombre}
          </span>
        ))}
      </div>
    </div>
  );
}

function TarjetaPuntuacion({ xpTotal }) {
  return (
    <div className="progreso-tarjeta">
      <p className="progreso-tarjeta-etiqueta">Puntuación acumulada</p>
      <p className="progreso-puntuacion-numero">{xpTotal}</p>
      <p className="progreso-logros-subtexto">puntos XP totales</p>
    </div>
  );
}

export default PerfilProgreso;
