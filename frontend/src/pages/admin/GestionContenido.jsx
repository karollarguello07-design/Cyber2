import Layout from '../../components/layout/Layout';
import './PanelAdmin.css';

const enlacesGestion = [
  {
    texto: '🎯 Gestionar Tipos de Ataque',
    descripcion: 'Crea y edita las categorías de ataques usadas en los retos.',
    ruta: 'retos_puntuacion/tipoataque/',
  },
  {
    texto: '📋 Gestionar Plantillas de Reto',
    descripcion: 'Define las plantillas base que se usan para generar retos.',
    ruta: 'retos_puntuacion/plantillareto/',
  },
  {
    texto: '⚔️ Gestionar Retos',
    descripcion: 'Crea, edita o elimina los retos disponibles para los estudiantes.',
    ruta: 'retos_puntuacion/reto/',
  },
  {
    texto: '❓ Gestionar Preguntas Quiz',
    descripcion: 'Administra el banco de preguntas usado en los quiz.',
    ruta: 'retos_puntuacion/preguntaquiz/',
  },
  {
    texto: '🏅 Gestionar Insignias',
    descripcion: 'Configura las insignias que los estudiantes pueden obtener.',
    ruta: 'retos_puntuacion/insignia/',
  },
];

function construirUrlAdmin(rutaModelo) {
  return `http://${window.location.hostname}:8001/admin/${rutaModelo}`;
}

function GestionContenido() {
  return (
    <Layout>
      <div className="panel-admin">
        <h1>🎯 Gestión de Contenido</h1>
        <p className="panel-admin-subtexto">
          Administra el catálogo educativo desde el panel de Django
        </p>

        <div className="panel-admin-seccion">
          <div className="panel-admin-botones-gestion">
            {enlacesGestion.map((enlace) => (
              <button
                key={enlace.ruta}
                className="boton-gestion"
                onClick={() => window.open(construirUrlAdmin(enlace.ruta), '_blank')}
              >
                <span className="boton-gestion-titulo">{enlace.texto}</span>
                <span className="boton-gestion-desc">{enlace.descripcion}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="panel-admin-seccion">
          <button
            className="boton-gestion boton-panel-django"
            onClick={() => window.open(`http://${window.location.hostname}:8001/admin/`, '_blank')}
          >
            🔧 Abrir Panel Django Completo
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default GestionContenido;

