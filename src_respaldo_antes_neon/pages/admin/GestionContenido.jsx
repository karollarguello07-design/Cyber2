import Layout from '../../components/layout/Layout';
import './PanelAdmin.css';

const enlacesGestion = [
  { texto: '🎯 Gestionar Tipos de Ataque', ruta: 'retos_puntuacion/tipoataque/' },
  { texto: '📋 Gestionar Plantillas de Reto', ruta: 'retos_puntuacion/plantillareto/' },
  { texto: '⚔️ Gestionar Retos', ruta: 'retos_puntuacion/reto/' },
  { texto: '❓ Gestionar Preguntas Quiz', ruta: 'retos_puntuacion/preguntaquiz/' },
  { texto: '🏅 Gestionar Insignias', ruta: 'retos_puntuacion/insignia/' },
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
                {enlace.texto}
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
