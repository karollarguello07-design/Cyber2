import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { obtenerRetos, responderReto } from '../../services/retos';
import './Retos.css';

function Retos() {
  const [retos, setRetos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [retoActivo, setRetoActivo] = useState(null);
  const [seleccionPorPregunta, setSeleccionPorPregunta] = useState({});
  const [resultadoPorPregunta, setResultadoPorPregunta] = useState({});
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    cargarRetos();
  }, []);

  async function cargarRetos() {
    setCargando(true);
    setError('');
    try {
      const datos = await obtenerRetos();
      setRetos(datos);
    } catch (err) {
      setError('No se pudieron cargar los retos.');
    } finally {
      setCargando(false);
    }
  }

  function abrirReto(reto) {
    setRetoActivo(reto);
    setSeleccionPorPregunta({});
    setResultadoPorPregunta({});
  }

  async function manejarSeleccion(pregunta, opcion) {
    if (resultadoPorPregunta[pregunta.id]) return;

    setSeleccionPorPregunta((prev) => ({ ...prev, [pregunta.id]: opcion.id }));
    setEnviando(true);

    try {
      const resultado = await responderReto(retoActivo.id, opcion.id);
      setResultadoPorPregunta((prev) => ({ ...prev, [pregunta.id]: resultado }));
    } catch (err) {
      setError('No se pudo registrar tu respuesta.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Layout>
      <div className="retos-pagina">
        <h1>🗡️ Retos disponibles</h1>
        <p className="retos-subtitulo">
          Retos generados a partir de ataques reales capturados en tus cursos
        </p>

        {error && <div className="retos-error">{error}</div>}

        {cargando ? (
          <p className="retos-cargando">Cargando retos...</p>
        ) : retos.length === 0 ? (
          <p className="retos-cargando">
            No hay retos disponibles todavía. Deben generarse a partir de ataques capturados en tus cursos.
          </p>
        ) : !retoActivo ? (
          <div className="retos-lista">
            {retos.map((reto) => (
              <div key={reto.id} className="reto-tarjeta" onClick={() => abrirReto(reto)}>
                <h3>{reto.titulo}</h3>
                <p>{reto.descripcion}</p>
                <div className="reto-meta">
                  <span>{reto.curso_nombre}</span>
                  <span className="reto-xp">+{reto.xp_recompensa} XP</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="reto-detalle">
            <button className="reto-volver" onClick={() => setRetoActivo(null)}>
              ← Volver a la lista
            </button>

	              <h2>{retoActivo.titulo}</h2>
            <p className="reto-detalle-descripcion">{retoActivo.descripcion}</p>

            {retoActivo.instrucciones_practica && (
              <div className="reto-practica">
                <h3>🧪 Practica tú mismo</h3>
                {retoActivo.credenciales_practica && (
                  <p className="reto-practica-credenciales">
                    <strong>Credenciales:</strong> {retoActivo.credenciales_practica}
                  </p>
                )}
                <pre className="reto-practica-instrucciones">
                  {retoActivo.instrucciones_practica}
                </pre>
                <p className="reto-practica-nota">
                  Después de ejecutar el ataque, ve al Panel Cowrie y da clic en "Actualizar"
                  para ver tu intento reflejado en "Últimos intentos de acceso".
                </p>
              </div>
            )}

            {retoActivo.preguntas.map((pregunta) => {


              const resultado = resultadoPorPregunta[pregunta.id];
              const seleccion = seleccionPorPregunta[pregunta.id];

              return (
                <div key={pregunta.id} className="pregunta-bloque">
                  <h3>{pregunta.enunciado}</h3>
                  <div className="pregunta-opciones">
                    {pregunta.opciones.map((opcion) => {
                      let clase = 'pregunta-opcion';
                      if (resultado) {
                        if (opcion.id === seleccion) {
                          clase += resultado.es_correcto ? ' correcta' : ' incorrecta';
                        }
                      }
                      return (
                        <button
                          key={opcion.id}
                          className={clase}
                          disabled={!!resultado || enviando}
                          onClick={() => manejarSeleccion(pregunta, opcion)}
                        >
                          {opcion.texto_opcion}
                        </button>
                      );
                    })}
                  </div>
                  {resultado && (
                    <p className={resultado.es_correcto ? 'pregunta-feedback-ok' : 'pregunta-feedback-error'}>
                      {resultado.es_correcto
                        ? `¡Correcto! Ganaste ${resultado.xp_otorgado} XP.`
                        : 'Respuesta incorrecta. No ganaste XP esta vez.'}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Retos;
