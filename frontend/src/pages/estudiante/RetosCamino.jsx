import './RetosCamino.css';

const NIVELES = [
  { clave: 'reconocimiento', titulo: '🟢 Nivel 1 · Reconocimiento', color: '#5dff7a' },
  { clave: 'dentro_sistema', titulo: '🟡 Nivel 2 · Dentro del sistema', color: '#ffd23f' },
  { clave: 'avanzado', titulo: '🔴 Nivel 3 · Avanzado', color: '#ff4d5e' },
];

function RetosCamino({ retos, onAbrir }) {
  const ordenados = [...retos].sort((a, b) => a.orden - b.orden);
  const totalCompletados = ordenados.filter((r) => r.completado).length;

  let indiceGlobal = -1;

  return (
    <div className="camino">
      <div className="camino-progreso">
        <div className="camino-progreso-barra">
          <div
            className="camino-progreso-relleno"
            style={{ width: `${(totalCompletados / ordenados.length) * 100}%` }}
          ></div>
        </div>
        <span>{totalCompletados} de {ordenados.length} retos completados</span>
      </div>

      {NIVELES.map((nivel) => {
        const retosDelNivel = ordenados.filter((r) => r.nivel_dificultad === nivel.clave);
        if (retosDelNivel.length === 0) return null;

        return (
          <div key={nivel.clave} className="camino-nivel">
            <h2 className="camino-nivel-titulo" style={{ color: nivel.color }}>
              {nivel.titulo}
            </h2>

            <div className="camino-senda">
              {retosDelNivel.map((reto, i) => {
                indiceGlobal += 1;
                const anterior = ordenados[indiceGlobal - 1];
                const desbloqueado = indiceGlobal === 0 || (anterior && anterior.completado);
                const estado = reto.completado ? 'completado' : desbloqueado ? 'disponible' : 'bloqueado';
                const alineacion = i % 2 === 0 ? 'izquierda' : 'derecha';

                return (
                  <div key={reto.id} className={`camino-fila camino-${alineacion}`}>
                    <button
                      className={`camino-nodo camino-nodo-${estado}`}
                      style={estado !== 'bloqueado' ? { '--nivel-color': nivel.color } : undefined}
                      onClick={() => estado !== 'bloqueado' && onAbrir(reto)}
                      disabled={estado === 'bloqueado'}
                    >
                      {estado === 'completado' ? '✓' : estado === 'bloqueado' ? '🔒' : '▶'}
                    </button>
                    <div className="camino-info">
                      <h3>{reto.titulo}</h3>
                      <span className="camino-xp">+{reto.xp_recompensa} XP</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default RetosCamino;
