import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import {
  obtenerQuizModulos,
  obtenerPreguntasModulo,
  responderPregunta,
} from '../../services/quiz';
import './Quiz.css';

function mezclar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function Quiz() {
  const navigate = useNavigate();
  const [modulos, setModulos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const [activo, setActivo] = useState(null);
  const [indice, setIndice] = useState(0);
  const [resultado, setResultado] = useState(null);
  const [incorrectas, setIncorrectas] = useState([]);
  const [enviando, setEnviando] = useState(false);
  const [xpGanado, setXpGanado] = useState(0);
  const [terminado, setTerminado] = useState(false);

  const pregunta = activo ? activo.preguntas[indice] : null;
  const opciones = useMemo(
    () => (pregunta ? mezclar(pregunta.opciones) : []),
    [pregunta?.id]
  );

  useEffect(() => {
    cargarModulos();
  }, []);

  async function cargarModulos() {
    setCargando(true);
    try {
      setModulos(await obtenerQuizModulos());
    } catch (err) {
      setError('No se pudo cargar el quiz. Si dejaste la sesión abierta mucho tiempo, cierra sesión y vuelve a entrar.');
    } finally {
      setCargando(false);
    }
  }

  async function iniciar(moduloId) {
    setError('');
    try {
      const datos = await obtenerPreguntasModulo(moduloId);
      const primeraPendiente = datos.preguntas.findIndex((p) => !p.ya_acertada);
      setActivo(datos);
      setIndice(primeraPendiente === -1 ? 0 : primeraPendiente);
      setResultado(null);
      setIncorrectas([]);
      setXpGanado(0);
      setTerminado(false);
    } catch (err) {
      setError('No se pudo cargar el quiz de este módulo.');
    }
  }

  async function elegir(opcion) {
    if (enviando || resultado) return;
    setEnviando(true);
    try {
      const r = await responderPregunta(pregunta.id, opcion.id);
      if (r.es_correcta) {
        setResultado(r);
        setXpGanado((x) => x + r.xp_otorgado);
        setActivo((prev) => ({
          ...prev,
          preguntas: prev.preguntas.map((p) =>
            p.id === pregunta.id ? { ...p, ya_acertada: true } : p
          ),
        }));
      } else {
        setIncorrectas((prev) => [...prev, opcion.id]);
      }
    } catch (err) {
      setError('No se pudo registrar tu respuesta.');
    } finally {
      setEnviando(false);
    }
  }

  function siguiente() {
    if (indice < activo.preguntas.length - 1) {
      setIndice(indice + 1);
      setResultado(null);
      setIncorrectas([]);
    } else {
      setTerminado(true);
    }
  }

  function volver() {
    setActivo(null);
    setError('');
    cargarModulos();
  }

  if (activo && terminado) {
    const acertadas = activo.preguntas.filter((p) => p.ya_acertada).length;
    return (
      <Layout>
        <div className="quiz-pagina">
          <div className="quiz-final">
            <span className="quiz-final-icono">🏁</span>
            <h2>¡Quiz terminado!</h2>
            <p>{activo.modulo.icono} {activo.modulo.nombre}</p>
            <div className="quiz-final-datos">
              <div>
                <strong>{acertadas} / {activo.preguntas.length}</strong>
                <span>acertadas</span>
              </div>
              <div>
                <strong>+{xpGanado}</strong>
                <span>XP en esta sesión</span>
              </div>
            </div>
            <div className="quiz-botones">
              <button className="quiz-boton-secundario" onClick={() => iniciar(activo.modulo.id)}>
                Repetir
              </button>
              <button className="quiz-boton-primario" onClick={volver}>
                Volver a los quizzes
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (activo) {
    const hayFallo = incorrectas.length > 0 && !resultado;
    const esUltima = indice === activo.preguntas.length - 1;
    return (
      <Layout>
        <div className="quiz-pagina">
          <button className="quiz-volver" onClick={volver}>← Volver a los quizzes</button>

          <div className="quiz-cabecera">
            <h2>{activo.modulo.icono} {activo.modulo.nombre}</h2>
            <span className="quiz-xp">⭐ +{xpGanado} XP en esta sesión</span>
          </div>

          <div className="quiz-puntos">
            {activo.preguntas.map((p, i) => (
              <span
                key={p.id}
                className={
                  'quiz-punto' +
                  (p.ya_acertada ? ' acertada' : '') +
                  (i === indice ? ' actual' : '')
                }
              />
            ))}
          </div>

          <div className="quiz-tarjeta">
            <p className="quiz-numero">
              Pregunta {indice + 1} de {activo.preguntas.length} · {pregunta.xp} XP
              {pregunta.ya_acertada && !resultado && ' · ✅ ya la acertaste (sin XP extra)'}
            </p>
            <h3 className="quiz-enunciado">{pregunta.enunciado}</h3>

            <div className="quiz-opciones">
              {opciones.map((op, i) => {
                let clase = 'quiz-opcion';
                if (incorrectas.includes(op.id)) clase += ' incorrecta';
                if (resultado && resultado.opcion_correcta_id === op.id) clase += ' correcta';
                return (
                  <button
                    key={op.id}
                    className={clase}
                    disabled={!!resultado || incorrectas.includes(op.id) || enviando}
                    onClick={() => elegir(op)}
                  >
                    <span className="quiz-opcion-letra">{String.fromCharCode(65 + i)}</span>
                    {op.texto}
                  </button>
                );
              })}
            </div>

            {hayFallo && (
              <div className="quiz-feedback quiz-feedback-error">
                <p>🤔 Casi. Repasa la tarjeta de estudio de este módulo y vuelve a intentar.</p>
                <button
                  className="quiz-boton-secundario"
                  onClick={() => navigate(`/modulos/${activo.modulo.id}`)}
                >
                  Ver las tarjetas
                </button>
              </div>
            )}

            {resultado && (
              <div className="quiz-feedback quiz-feedback-ok">
                <p className="quiz-feedback-titulo">
                  {resultado.xp_otorgado > 0
                    ? `🎉 ¡Correcto! +${resultado.xp_otorgado} XP`
                    : '✅ ¡Correcto! (ya la habías acertado, sin XP extra)'}
                </p>
                {resultado.explicacion && <p>{resultado.explicacion}</p>}
                <button className="quiz-boton-primario" onClick={siguiente}>
                  {esUltima ? 'Ver resultado' : 'Siguiente →'}
                </button>
              </div>
            )}
          </div>

          {error && <div className="quiz-error">{error}</div>}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="quiz-pagina">
        <h1>🎯 Quiz</h1>
        <p className="quiz-subtitulo">
          Responde preguntas de cada módulo y gana XP la primera vez que aciertes.
        </p>

        {error && <div className="quiz-error">{error}</div>}

        {cargando ? (
          <p className="quiz-subtitulo">Cargando...</p>
        ) : modulos.length === 0 ? (
          <p className="quiz-subtitulo">Aún no hay preguntas disponibles.</p>
        ) : (
          <div className="quiz-lista">
            {modulos.map((m) => (
              <button key={m.id} className="quiz-modulo" onClick={() => iniciar(m.id)}>
                <span className="quiz-modulo-icono">{m.icono}</span>
                <div className="quiz-modulo-info">
                  <h3>{m.nombre}</h3>
                  <p>{m.correctas} de {m.total} acertadas</p>
                  <div className="quiz-barra-fondo">
                    <div className="quiz-barra-relleno" style={{ width: `${m.porcentaje}%` }}></div>
                  </div>
                </div>
                <span className="quiz-modulo-cta">
                  {m.porcentaje === 100 ? '✓ Completado' : m.correctas > 0 ? 'Continuar →' : 'Empezar →'}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Quiz;
