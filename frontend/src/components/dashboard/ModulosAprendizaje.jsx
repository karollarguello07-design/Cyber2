import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerModulos } from '../../services/lecciones';
import './ModulosAprendizaje.css';

const coloresPorIndice = ['#f87171', '#fbbf24', '#fb923c', '#4ade80', '#22d3ee', '#a78bfa'];

function ModulosAprendizaje() {
  const navigate = useNavigate();
  const [modulos, setModulos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [pestaña, setPestaña] = useState('basico');

  useEffect(() => {
    async function cargar() {
      try {
        const datos = await obtenerModulos();
        setModulos(datos);
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

  return (
    <section className="modulos-seccion">
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
          {modulosFiltrados.map((modulo, indice) => (
            <div
              key={modulo.id}
              className="tarjeta-modulo"
              onClick={() => navigate(`/modulos/${modulo.id}`)}
            >
              <div className="tarjeta-modulo-icono">{modulo.icono}</div>
              <span
                className="tarjeta-modulo-etiqueta"
                style={{
                  color: coloresPorIndice[indice % coloresPorIndice.length],
                  borderColor: coloresPorIndice[indice % coloresPorIndice.length],
                }}
              >
                MÓDULO {indice + 1}
              </span>
              <h3 className="tarjeta-modulo-titulo">{modulo.nombre}</h3>
              <p className="tarjeta-modulo-descripcion">{modulo.descripcion}</p>

              {modulo.progreso_porcentaje > 0 ? (
                <div className="tarjeta-modulo-progreso-contenedor">
                  <div className="tarjeta-modulo-barra-fondo">
                    <div
                      className="tarjeta-modulo-barra-relleno"
                      style={{ width: `${modulo.progreso_porcentaje}%` }}
                    ></div>
                  </div>
                  <span className="tarjeta-modulo-progreso-texto">
                    {modulo.progreso_porcentaje}% completado
                  </span>
                </div>
              ) : (
                <span className="tarjeta-modulo-progreso-texto">
                  {modulo.tarjetas && modulo.tarjetas.length > 0
                    ? `🃏 ${modulo.tarjetas.length} tarjetas de estudio`
                    : 'Por comenzar'}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default ModulosAprendizaje;
