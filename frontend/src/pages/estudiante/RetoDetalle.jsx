import { useState } from 'react';
import './RetoDetalle.css';

const ICONOS_POR_PALABRA = [
  ['fuerza bruta', '🔨'],
  ['diccionario', '📖'],
  ['nmap', '📡'],
  ['después de entrar', '🚪'],
  ['descarga', '⬇️'],
  ['credenciales filtradas', '🔑'],
  ['explorando el sistema', '🕵️'],
  ['quién más usa', '👥'],
  ['ejecutando un script', '💣'],
  ['botnet', '🤖'],
  ['acceso a largo plazo', '🧷'],
  ['otros equipos', '🧭'],
  ['minar', '⛏️'],
];

const COLOR_POR_NIVEL = {
  reconocimiento: '#5dff7a',
  dentro_sistema: '#ffd23f',
  avanzado: '#ff4d5e',
};

const NOMBRE_NIVEL = {
  reconocimiento: '🟢 Nivel 1 · Reconocimiento',
  dentro_sistema: '🟡 Nivel 2 · Dentro del sistema',
  avanzado: '🔴 Nivel 3 · Avanzado',
};

function obtenerIcono(titulo) {
  const t = titulo.toLowerCase();
  const coincide = ICONOS_POR_PALABRA.find(([palabra]) => t.includes(palabra));
  return coincide ? coincide[1] : '🗡️';
}

function esComando(parrafo) {
  const linea = parrafo.trim();
  if (!linea || linea.includes('\n') || linea.length > 160) return false;
  return /^[a-z0-9]/.test(linea);
}

function parsearPasos(texto) {
  if (!texto) return { pasos: [], notaFinal: '' };
  const parrafos = texto
    .replace(/\r\n/g, '\n')
    .split(/\n\s*\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const pasos = [];
  let contexto = [];

  for (const p of parrafos) {
    if (esComando(p)) {
      pasos.push({ contexto: contexto.join(' '), comando: p });
      contexto = [];
    } else {
      contexto.push(p);
    }
  }

  return { pasos, notaFinal: contexto.join(' ') };
}

function RetoDetalle({
  reto,
  seleccionPorPregunta,
  resultadoPorPregunta,
  intentosPorPregunta,
  maxIntentos,
  enviando,
  onSeleccionar,
  onReintentar,
  onRepetirReto,
  onVolver,
  onSiguiente,
  nivelNuevo,
  onCerrarNivelNuevo,
}) {
  const [hechos, setHechos] = useState({});
  const [copiado, setCopiado] = useState(null);

  const color = COLOR_POR_NIVEL[reto.nivel_dificultad] || '#39ff88';
  const icono = obtenerIcono(reto.titulo);
  const { pasos, notaFinal } = parsearPasos(reto.instrucciones_practica);

  function alternarHecho(i) {
    setHechos((prev) => ({ ...prev, [i]: !prev[i] }));
  }

  function manejarCopiar(comando, i) {
    navigator.clipboard?.writeText(comando).catch(() => {});
    setCopiado(i);
    setTimeout(() => setCopiado(null), 1500);
  }

  const todasAcertadas = reto.preguntas.every((p) => resultadoPorPregunta[p.id]?.es_correcto);
  const algunaAgotada = reto.preguntas.some((p) => resultadoPorPregunta[p.id]?.agotado);

  return (
    <div className="reto-detalle">
      {nivelNuevo && (
        <div className="nivel-nuevo-overlay" onClick={onCerrarNivelNuevo}>
          <div className="nivel-nuevo-tarjeta" onClick={(e) => e.stopPropagation()}>
            <span className="nivel-nuevo-emoji">🏆</span>
            <h2>¡Subiste de nivel!</h2>
            <p className="nivel-nuevo-nombre">{nivelNuevo}</p>
            <button onClick={onCerrarNivelNuevo}>¡Genial, seguir! →</button>
          </div>
        </div>
      )}

      <button className="reto-volver" onClick={onVolver}>
        ← Volver al camino
      </button>

      <div className="reto-detalle-cabecera" style={{ '--color-reto': color }}>
        <span className="reto-detalle-icono">{icono}</span>
        <div className="reto-detalle-textos">
          <span className="reto-detalle-nivel">{NOMBRE_NIVEL[reto.nivel_dificultad]}</span>
          <h2>{reto.titulo}</h2>
          <p className="reto-detalle-descripcion">{reto.descripcion}</p>
        </div>
        <span className="reto-detalle-xp">+{reto.xp_recompensa} XP</span>
      </div>

      {reto.instrucciones_practica && (
        <div className="reto-practica" style={{ '--color-reto': color }}>
          <h3>🧪 Practica tú mismo</h3>

          {reto.credenciales_practica && (
            <div className="reto-practica-credenciales">
              <strong>🔑 Credenciales:</strong> {reto.credenciales_practica}
            </div>
          )}

          {pasos.length > 0 ? (
            <div className="reto-pasos">
              {pasos.map((paso, i) => (
                <div key={i} className={'reto-paso' + (hechos[i] ? ' reto-paso-hecho' : '')}>
                  <div className="reto-paso-numero">{i + 1}</div>
                  <div className="reto-paso-cuerpo">
                    {paso.contexto && <p className="reto-paso-texto">{paso.contexto}</p>}
                    <div className="reto-paso-comando-fila">
                      <code className="reto-paso-comando">{paso.comando}</code>
                      <button className="reto-paso-copiar" onClick={() => manejarCopiar(paso.comando, i)}>
                        {copiado === i ? '✓ Copiado' : '📋 Copiar'}
                      </button>
                    </div>
                    <label className="reto-paso-check">
                      <input type="checkbox" checked={!!hechos[i]} onChange={() => alternarHecho(i)} />
                      Ya lo hice
                    </label>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <pre className="reto-practica-instrucciones">{reto.instrucciones_practica}</pre>
          )}

          {notaFinal && <p className="reto-practica-nota">📌 {notaFinal}</p>}
        </div>
      )}

      {todasAcertadas && (
        <button className="reto-boton-siguiente" style={{ '--color-reto': color }} onClick={onSiguiente}>
          Siguiente reto →
        </button>
      )}

      {algunaAgotada && (
        <button className="reto-boton-repetir" onClick={onRepetirReto}>
          🔁 Repetir este reto
        </button>
      )}

      {reto.preguntas.map((pregunta) => {
        const resultado = resultadoPorPregunta[pregunta.id];
        const seleccion = seleccionPorPregunta[pregunta.id];
        const intentos = intentosPorPregunta[pregunta.id] || 0;
        const bloqueada = !!resultado && !resultado.reintentar;

        return (
          <div key={pregunta.id} className="pregunta-bloque" style={{ '--color-reto': color }}>
            <h3>{pregunta.enunciado}</h3>
            <div className="pregunta-opciones">
              {pregunta.opciones.map((opcion) => {
                let clase = 'pregunta-opcion';
                if (resultado && opcion.id === seleccion) {
                  clase += resultado.es_correcto ? ' correcta' : ' incorrecta';
                }
                return (
                  <button
                    key={opcion.id}
                    className={clase}
                    disabled={bloqueada || enviando}
                    onClick={() => onSeleccionar(pregunta, opcion)}
                  >
                    {opcion.texto_opcion}
                  </button>
                );
              })}
            </div>

            {resultado && resultado.es_correcto && (
              <div className="pregunta-celebracion">
                <span className="pregunta-celebracion-emoji">🎉</span>
                <span>¡Correcto! +{resultado.xp_otorgado} XP</span>
              </div>
            )}

            {resultado && resultado.reintentar && (
              <div className="pregunta-feedback-reintentar">
                <p>
                  ❌ Respuesta incorrecta. Inténtalo de nuevo
                  {' '}(te queda {maxIntentos - intentos} {maxIntentos - intentos === 1 ? 'intento' : 'intentos'}).
                </p>
                <button onClick={() => onReintentar(pregunta.id)}>Intentar de nuevo</button>
              </div>
            )}

            {resultado && resultado.agotado && (
              <div className="pregunta-feedback-agotado">
                <p>😕 Usaste tus {maxIntentos} intentos. Repite el reto para volver a probar desde el inicio.</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default RetoDetalle;
