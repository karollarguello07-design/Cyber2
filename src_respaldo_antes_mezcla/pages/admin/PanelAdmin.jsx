import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import './PanelAdmin.css';

const accesos = [
  { icono: '📊', texto: 'Estadísticas', ruta: '/admin/reportes' },
  { icono: '👥', texto: 'Usuarios', ruta: '/admin/usuarios' },
  { icono: '📚', texto: 'Estadisticas Acadèmicas', ruta: '/admin/reportes' },
  { icono: '🎯', texto: 'Gestión de Contenido', ruta: '/admin/contenido' },
];

function PanelAdmin() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="panel-admin">
        <h1>Panel de Administración</h1>
        <p className="panel-admin-subtexto">Selecciona una sección para continuar</p>

        <div className="panel-admin-accesos">
          {accesos.map((acceso) => (
            <button
              key={acceso.texto}
              className="tarjeta-acceso"
              onClick={() => navigate(acceso.ruta)}
            >
              <span className="tarjeta-acceso-icono">{acceso.icono}</span>
              <span className="tarjeta-acceso-texto">{acceso.texto}</span>
            </button>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default PanelAdmin;
