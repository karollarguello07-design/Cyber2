import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../context/AuthContext';
import { obtenerRanking } from '../../services/ranking';
import './Ranking.css';

function Ranking() {
  const { usuario } = useAuth();
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargar() {
      try {
        setDatos(await obtenerRanking());
      } catch (err) {
        setError('No se pudo cargar el ranking. Si llevas rato en la app, cierra sesión y vuelve a entrar.');
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  if (cargando) {
    return (
      <Layout>
        <p className="ranking-cargando">Cargando el ranking de tu curso...</p>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="ranking-error">{error}</div>
      </Layout>
    );
  }

  if (!datos || !datos.mi_posicion) {
    return (
      <Layout>
        <div className="ranking-pagina">
          <h1>🏅 Ranking</h1>
          <p className="ranking-vacio">
            {datos?.detalle || 'Aún no estás inscrito en ningún curso.'}
          </p>
        </div>
      </Layout>
    );
  }

  const top3 = datos.top_10.slice(0, 3);
  const resto = datos.top_10.slice(3, 10);
  const miAlias = usuario?.alias;
  const estoyEnTop10 = datos.top_10.some((f) => f.alias === miAlias);
  const [primero, segundo, tercero] = top3;

  return (
    <Layout>
      <div className="ranking-pagina">
        <h1>🏅 Ranking</h1>
        <p className="ranking-subtitulo">{datos.curso_nombre} · por XP acumulado</p>

        <div className="ranking-aviso">
          🔒 Por privacidad, aquí solo se muestra el alias de cada estudiante. Puedes cambiar
          el tuyo o dejar de aparecer en el ranking desde "Notificaciones".
        </div>

        {top3.length === 0 ? (
          <p className="ranking-vacio">Todavía no hay estudiantes con XP en este curso.</p>
        ) : (
          <>
            <div className="ranking-podio">
              {segundo && <FilaPodio fila={segundo} puesto={2} propio={segundo.alias === miAlias} />}
              {primero && <FilaPodio fila={primero} puesto={1} propio={primero.alias === miAlias} />}
              {tercero && <FilaPodio fila={tercero} puesto={3} propio={tercero.alias === miAlias} />}
            </div>

            {resto.length > 0 && (
              <div className="ranking-lista">
                {resto.map((fila, i) => (
                  <FilaLista
                    key={fila.alias}
                    fila={fila}
                    puesto={i + 4}
                    propio={fila.alias === miAlias}
                  />
                ))}
              </div>
            )}
          </>
        )}

        <div className={'ranking-mi-posicion' + (estoyEnTop10 ? ' ranking-mi-posicion-discreta' : '')}>
          <h2>📍 Tu posición</h2>
          <div className="ranking-mi-posicion-cuerpo">
            <span className="ranking-mi-posicion-puesto">
              #{datos.mi_posicion.puesto}
              <span className="ranking-mi-posicion-total"> de {datos.mi_posicion.total_estudiantes}</span>
            </span>
            <div className="ranking-mi-posicion-datos">
              <span>{datos.mi_posicion.alias}</span>
              <span>{datos.mi_posicion.nivel_nombre || 'Sin nivel'}</span>
              <span>{datos.mi_posicion.xp_total} XP</span>
              <span>🎖️ {datos.mi_posicion.insignias_count}</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function FilaPodio({ fila, puesto, propio }) {
  const medallas = { 1: '🥇', 2: '🥈', 3: '🥉' };
  return (
    <div className={`ranking-podio-columna ranking-podio-${puesto}` + (propio ? ' ranking-fila-propia' : '')}>
      <span className="ranking-podio-medalla">{medallas[puesto]}</span>
      <div className="ranking-podio-tarjeta">
        <span className="ranking-podio-alias">{fila.alias}</span>
        <span className="ranking-podio-nivel">{fila.nivel_nombre || 'Sin nivel'}</span>
        <span className="ranking-podio-xp">{fila.xp_total} XP</span>
        <span className="ranking-podio-insignias">🎖️ {fila.insignias_count}</span>
      </div>
    </div>
  );
}

function FilaLista({ fila, puesto, propio }) {
  return (
    <div className={'ranking-fila' + (propio ? ' ranking-fila-propia' : '')}>
      <span className="ranking-fila-puesto">#{puesto}</span>
      <span className="ranking-fila-alias">{fila.alias}</span>
      <span className="ranking-fila-nivel">{fila.nivel_nombre || 'Sin nivel'}</span>
      <span className="ranking-fila-xp">{fila.xp_total} XP</span>
      <span className="ranking-fila-insignias">🎖️ {fila.insignias_count}</span>
    </div>
  );
}

export default Ranking;
