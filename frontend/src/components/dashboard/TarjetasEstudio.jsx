import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './TarjetasEstudio.css';

const NIVELES_PELIGRO = {
  1: { emoji: '🟢', texto: 'Bajo', clase: 'peligro-bajo' },
  2: { emoji: '🟡', texto: 'Medio', clase: 'peligro-medio' },
  3: { emoji: '🔴', texto: 'Alto', clase: 'peligro-alto' },
};

function TarjetasEstudio({ tarjetas, moduloId }) {
  const { usuario } = useAuth();
  const claveAlmacen = `tarjetas_dominadas_${usuario?.username}_${moduloId}`;

  const [indice, setIndice] = useState(0);
  const [volteada, setVolteada] = useState(false);
  const [dominadas, setDominadas] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(claveAlmacen)) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(claveAlmacen, JSON.stringify(dominadas));
  }, [dominadas, claveAlmacen]);

  const tarjeta = tarjetas[indice];
  const peligro = NIVELES_PELIGRO[tarjeta.peligro] || NIVELES_PELIGRO[1];
  const estaDominada = dominadas.includes(tarjeta.id);
  const cantidadDominadas = tarjetas.filter((t) => dominadas.includes(t.id)).length;

  function irA(nuevoIndice) {
    setVolteada(false);
    setIndice(nuevoIndice);
  }

  function alternarDominada() {
    setDominadas((prev) =>
      prev.includes(tarjeta.id)
        ? prev.filter((id) => id !== tarjeta.id)
        : [...prev, tarjeta.id]
    );
  }

  function manejarTecla(evento) {
    if (evento.key === 'Enter' || evento.key === ' ') {
      evento.preventDefault();
      setVolteada(!volteada);
    }
  }

  return (
    <div className="tarjetas-estudio">
      <div className="tarjetas-encabezado">
        <span>Tarjeta {indice + 1} de {tarjetas.length}</span>
        <span className="tarjetas-contador-dominadas">✅ {cantidadDominadas} dominadas</span>
      </div>

      <div className="tarjetas-puntos">
        {tarjetas.map((t, i) => (
          <button
            key={t.id}
            title={t.titulo}
            aria-label={`Ir a ${t.titulo}`}
            className={
              'tarjetas-punto' +
              (i === indice ? ' activo' : '') +
              (dominadas.includes(t.id) ? ' dominada' : '')
            }
            onClick={() => irA(i)}
          />
        ))}
      </div>

      <div
        className={'tarjeta-volteable' + (volteada ? ' volteada' : '')}
        onClick={() => setVolteada(!volteada)}
        onKeyDown={manejarTecla}
        role="button"
        tabIndex={0}
      >
        <div className="tarjeta-interior">
          <div className="tarjeta-cara tarjeta-frente">
            {tarjeta.solo_teoria && (
              <span className="tarjeta-etiqueta-teoria">📘 Solo teoría</span>
            )}
            <span className="tarjeta-icono-grande">{tarjeta.icono}</span>
            <h3>{tarjeta.titulo}</h3>
            <p className="tarjeta-analogia">“{tarjeta.analogia}”</p>
            <span className={`tarjeta-peligro ${peligro.clase}`}>
              {peligro.emoji} Peligro: {peligro.texto}
            </span>
            <span className="tarjeta-pista">👆 Toca para ver el detalle</span>
          </div>

          <div className="tarjeta-cara tarjeta-reverso">
            <h4>{tarjeta.icono} {tarjeta.titulo}</h4>
            <div className="tarjeta-bloque">
              <strong>🧠 ¿Qué es?</strong>
              <p>{tarjeta.que_es}</p>
            </div>
            <div className="tarjeta-bloque">
              <strong>🐝 ¿Cómo lo ve Cowrie?</strong>
              <p>{tarjeta.como_se_ve}</p>
            </div>
            <div className="tarjeta-bloque tarjeta-bloque-defensa">
              <strong>🛡️ Cómo defenderte</strong>
              <p>{tarjeta.como_defenderse}</p>
            </div>
            <span className="tarjeta-pista">👆 Toca para volver</span>
          </div>
        </div>
      </div>

      <div className="tarjetas-controles">
        <button disabled={indice === 0} onClick={() => irA(indice - 1)}>
          ← Anterior
        </button>
        <button
          className={'tarjetas-boton-entendi' + (estaDominada ? ' activo' : '')}
          onClick={alternarDominada}
        >
          {estaDominada ? '✓ Dominada' : 'Ya lo entendí'}
        </button>
        <button disabled={indice === tarjetas.length - 1} onClick={() => irA(indice + 1)}>
          Siguiente →
        </button>
      </div>

      {cantidadDominadas === tarjetas.length && (
        <div className="tarjetas-felicitacion">
          🎉 ¡Dominaste todas las tarjetas de este módulo!
        </div>
      )}
    </div>
  );
}

export default TarjetasEstudio;
