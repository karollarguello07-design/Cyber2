import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const itemsMenuEstudiante = [
  { texto: 'Inicio', ruta: '/dashboard' },
  { texto: 'Cursos Disponibles', ruta: '/cursos-disponibles' },
  { texto: 'Retos', ruta: '/retos' },
  { texto: 'Ataques Reales', ruta: '/ataques' },
  { texto: 'Cuestionarios', ruta: '/quiz' },
  { texto: 'Ranking', ruta: '/ranking' },
];

const itemsHerramientasEstudiante = [
  { texto: 'Mi Progreso', ruta: '/progreso' },
  { texto: 'Logros', ruta: '/logros' },
  { texto: '¿Cómo funciona?', ruta: '/como-funciona' },
  { texto: 'Notificaciones', ruta: '/ajustes' },
];

const itemsMenuProfesor = [
  { texto: 'Panel del Profesor', ruta: '/profesor' },
  { texto: 'Ataques Reales', ruta: '/ataques' },
];

const itemsHerramientasProfesor = [];

const itemsMenuAdmin = [
  { texto: 'Inicio', ruta: '/admin' },
  {
    texto: 'Usuarios Registrados',
    ruta: '/admin/usuarios',
  submenu: [
  { texto: 'Agregar Usuario', ruta: '/admin/usuarios?accion=agregar' },
  { texto: 'Editar Usuario', ruta: '/admin/usuarios?accion=modificar' },
  { texto: 'Eliminar Usuario', ruta: '/admin/usuarios?accion=eliminar' },
],
 },
  { texto: 'Gestión de Contenido', ruta: '/admin/contenido' },
  { texto: 'Reportes', ruta: '/admin/reportes' },
];

const itemsHerramientasAdmin = [
  { texto: 'Notificaciones', ruta: '/ajustes' },
];

function Sidebar() {
  const { usuario } = useAuth();
  const location = useLocation();
  const [submenuAbierto, setSubmenuAbierto] = useState(null);

  let itemsMenu = itemsMenuEstudiante;
  let itemsHerramientas = itemsHerramientasEstudiante;
  let mostrarTituloHerramientas = true;

  if (usuario?.rol === 'profesor') {
    itemsMenu = itemsMenuProfesor;
    itemsHerramientas = itemsHerramientasProfesor;
    mostrarTituloHerramientas = false;
  } else if (usuario?.rol === 'admin') {
    itemsMenu = itemsMenuAdmin;
    itemsHerramientas = itemsHerramientasAdmin;
    mostrarTituloHerramientas = false;
  }

  function alternarSubmenu(ruta) {
    setSubmenuAbierto((actual) => (actual === ruta ? null : ruta));
  }

  return (
    <aside className="sidebar">
      <p className="sidebar-titulo">Menú principal</p>
      <nav>
        {itemsMenu.map((item) => {
          if (item.submenu) {
            const estaActivo = location.pathname === item.ruta;
            const estaAbierto = submenuAbierto === item.ruta || estaActivo;
            return (
              <div key={item.ruta} className="sidebar-grupo">
                <button
                  type="button"
                  className={'sidebar-link sidebar-link-expandible' + (estaActivo ? ' activo' : '')}
                  onClick={() => alternarSubmenu(item.ruta)}
                >
                  {item.texto}
                  <span className="sidebar-flecha">{estaAbierto ? '▾' : '▸'}</span>
                </button>
                {estaAbierto && (
                  <div className="sidebar-submenu">
                    {item.submenu.map((sub) => (
                      <NavLink
                        key={sub.texto}
                        to={sub.ruta}
                        className={({ isActive }) => 'sidebar-link sidebar-sublink' + (isActive ? ' activo' : '')}
                      >
                        {sub.texto}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <NavLink
              key={item.ruta}
              to={item.ruta}
              className={({ isActive }) => 'sidebar-link' + (isActive ? ' activo' : '')}
            >
              {item.texto}
            </NavLink>
          );
        })}
      </nav>

      {itemsHerramientas.length > 0 && (
        <>
          {mostrarTituloHerramientas && (
            <p className="sidebar-titulo">Herramientas</p>
          )}
          <nav>
            {itemsHerramientas.map((item) => (
              <NavLink
                key={item.ruta}
                to={item.ruta}
                className={({ isActive }) => 'sidebar-link' + (isActive ? ' activo' : '')}
              >
                {item.texto}
              </NavLink>
            ))}
          </nav>
        </>
      )}
    </aside>
  );
}

export default Sidebar;
