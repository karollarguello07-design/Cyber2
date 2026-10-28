import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { obtenerReglasPuntuacion } from '../../services/reglas';
import './ComoFunciona.css';

function ComoFunciona() {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargar() {
      try {
        setDatos(await obtenerReglasPuntuacion());
      } catch (err) {
        setError('No se pudieron cargar las reglas de puntuación. Si llevas rato en la app, cierra sesión y vuelve a entrar.');
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  if (cargando) {
    return (
      <Layout>
        <p className="como-funciona-cargando">Cargando...</p>
      </Layout>
    );
  }

  if (error || !datos) {
    return (
      <Layout>
        <div className="como-funciona-error">{error}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="como-funciona-pagina">
        <h1>📐 ¿Cómo funciona la puntuación?</h1>
        <p className="como-funciona-subtitulo">
          Todo lo que necesitas saber sobre el XP, los niveles, las insignias y el ranking
        </p>

        <section className="como-funciona-seccion">
          <h2>⭐ Cómo se gana XP</h2>
          <div className="como-funciona-xp-grid">
            <div className="como-funciona-xp-tarjeta">
              <span className="como-funciona-xp-icono">🗡️</span>
              <strong>{datos.xp_por_reto} XP</strong>
              <span>por cada reto, la primera vez que lo aciertas</span>
            </div>
            <div className="como-funciona-xp-tarjeta">
              <span className="como-funciona-xp-icono">🎯</span>
              <strong>{datos.xp_por_pregunta_quiz} XP</strong>
              <span>por cada pregunta del Quiz, la primera vez que la aciertas</span>
            </div>
          </div>
          <p className="como-funciona-nota">
            Volver a responder algo que ya acertaste te deja seguir practicando, pero no suma XP de nuevo.
          </p>
        </section>

        <section className="como-funciona-seccion">
          <h2>📊 Niveles</h2>
          <div className="como-funciona-niveles">
            {datos.niveles.map((nivel) => (
              <div key={nivel.numero_nivel} className="como-funciona-nivel-fila">
                <span className="como-funciona-nivel-numero">{nivel.numero_nivel}</span>
                <span className="como-funciona-nivel-nombre">{nivel.nombre_nivel}</span>
                <span className="como-funciona-nivel-rango">
                  {nivel.xp_maximo != null
                    ? `${nivel.xp_minimo} – ${nivel.xp_maximo} XP`
                    : `${nivel.xp_minimo}+ XP`}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="como-funciona-seccion">
          <h2>🎖️ Insignias ({datos.insignias.length})</h2>
          <div className="como-funciona-insignias-grid">
            {datos.insignias.map((insignia) => (
              <div key={insignia.nombre} className="como-funciona-insignia">
                <span className="como-funciona-insignia-icono">{insignia.icono}</span>
                <h3>{insignia.nombre}</h3>
                <p>{insignia.descripcion}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="como-funciona-seccion">
          <h2>🗺️ El camino de retos</h2>
          <p className="como-funciona-texto">
            Los {datos.total_retos} retos están organizados en 3 niveles de dificultad, del más
            fácil al más avanzado. Cada reto se desbloquea solo cuando completas el anterior —
            el primero de cada nivel siempre está disponible.
          </p>
          <div className="como-funciona-grupos">
            {datos.grupos_camino.map((grupo) => (
              <div key={grupo.clave} className="como-funciona-grupo">
                <strong>{grupo.nombre}</strong>
                <span>{grupo.cantidad} retos</span>
              </div>
            ))}
          </div>
        </section>

        <section className="como-funciona-seccion">
          <h2>🏅 El ranking y tu privacidad</h2>
          <p className="como-funciona-texto">
            El ranking de tu curso muestra solo tu <strong>alias</strong> (un seudónimo), nunca
            tu nombre real ni tu usuario — así nadie más puede ver tu desempeño expuesto
            públicamente. Puedes cambiar tu alias o desactivar tu aparición en el ranking en
            cualquier momento desde "Notificaciones".
          </p>
        </section>
      </div>
    </Layout>
  );
}

export default ComoFunciona;
