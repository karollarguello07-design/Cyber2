import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerModulos } from '../../services/lecciones';
import { obtenerQuizModulos } from '../../services/quiz';
import './ModulosAprendizaje.css';

const coloresPorIndice = ['#ff4d5e', '#ffd23f', '#ff9d2e', '#39ff88', '#3aa8ff', '#b388ff'];

function ModulosAprendizaje() {
  const navigate = useNavigate();
  const [modulos, setModulos] = useState([]);
  const [quizPorModulo, setQuizPorModulo] = useState({});
  const [cargando, setCargando] = useState(true);
  const [pestaña, setPestaña] = useState('basico');

  useEffect(() => {
    async function cargar() {
      try {
        const [datos, quiz] = await Promise.all([
          obtenerModulos(),
          obtenerQuizModulos().catch(() => []),
        ]);
        setModulos(datos);
        setQuizPorModulo(Object.fromEntries(quiz.map((q) => [q.id, q])));
      } catch (err) {
        setModulos([]);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  const modulosFiltrados = modulos.filter((m) =>
    pestaña === 'avanzado' ? m.nivel === 'avanzado' : m.nivel !== 'avanzado'
  );

  function abrir(modulo) {
    navigate(`/modulos/${modulo.id}`);
  }

  return (
    <section className="modulos-seccion" id="modulos-aprendizaje">
      <div className="modulos-encabezado">
        <h2>📘 Módulos de aprendizaje</h2>
        <div className="modulos-pestañas">
          <button
            className={'modulos-pestaña' + (pestaña === 'basico' ? ' activa' : '')}
            onClick={() => setPestaña('basico')}
          >
            Básico
          </button>
          <button
            className={'modulos-pestaña' + (pestaña === 'avanzado' ? ' activa' : '')}
            onClick={() => setPestaña('avanzado')}
          >
            🔬 Avanzado
          </button>
        </div>
      </div>

      {cargando ? (
        <p className="modulos-cargando">Cargando módulos...</p>
      ) : modulosFiltrados.length === 0 ? (
        <p className="modulos-cargando">
          {pestaña === 'avanzado'
            ? 'Aún no hay módulos avanzados disponibles.'
            : 'No hay módulos disponibles.'}
        </p>
      ) : (
        <div className="modulos-carrusel">
          {modulosFiltrados.map((modulo, indice) => {
            const quiz = quizPorModulo[modulo.id];
            const progreso = quiz ? quiz.porcentaje : modulo.progreso_porcentaje;
            const cantidadTarjetas = modulo.tarjetas ? modulo.tarjetas.length : 0;
            const color = coloresPorIndice[indice % coloresPorIndice.length];
            const etiquetaBoton =
              progreso >= 100 ? '✓ Completado · repasar' : progreso > 0 ? 'Continuar →' : 'Empezar →';

            return (
              <div
                key={modulo.id}
                className="mod-card"
                style={{ '--acento': color }}
                role="button"
                tabIndex={0}
                onClick={() => abrir(modulo)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    abrir(modulo);
                  }
                }}
              >
                <div className="mod-card-cabecera">
                  <span className="mod-card-numero">MÓDULO {indice + 1}</span>
                  <span className="mod-card-icono">{modulo.icono}</span>
                </div>

                <div className="mod-card-cuerpo">
                  <h3 className="mod-card-titulo">{modulo.nombre}</h3>
                  <p className="mod-card-descripcion">{modulo.descripcion}</p>

                  <div className="mod-card-chips">
                    {cantidadTarjetas > 0 && (
                      <span className="mod-card-chip">🃏 {cantidadTarjetas} tarjetas</span>
                    )}
                    {quiz && (
                      <span className="mod-card-chip">🎯 {quiz.correctas}/{quiz.total} acertadas</span>
                    )}
                  </div>

                  <div className="mod-card-progreso">
                    <div className="mod-card-barra">
                      <div className="mod-card-barra-relleno" style={{ width: `${progreso}%` }}></div>
                    </div>
                    <span>{progreso > 0 ? `${progreso}% completado` : 'Por comenzar'}</span>
                  </div>

                  <span className="mod-card-boton">{etiquetaBoton}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default ModulosAprendizaje;
