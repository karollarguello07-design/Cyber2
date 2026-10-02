import { NavLink } from 'react-router-dom';

const itemsMenu = [
  { texto: 'Inicio', ruta: '/dashboard' },
  { texto: 'Cursos Disponibles', ruta: '/cursos-disponibles' },
  { texto: 'Mis Cursos', ruta: '/mis-cursos' },
  { texto: 'Retos', ruta: '/retos' },
  { texto: 'Ataques Reales', ruta: '/ataques' },
  { texto: 'Quiz', ruta: '/quiz' },
];

const itemsHerramientas = [
  { texto: 'Mi Progreso', ruta: '/progreso' },
  { texto: 'Logros', ruta: '/logros' },
  { texto: 'Ajustes', ruta: '/ajustes' },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <p className="sidebar-titulo">Menú principal</p>
      <nav>
        {itemsMenu.map((item) => (
          <NavLink
            key={item.ruta}
            to={item.ruta}
            className={({ isActive }) => 'sidebar-link' + (isActive ? ' activo' : '')}
          >
            {item.texto}
          </NavLink>
        ))}
      </nav>

      <p className="sidebar-titulo">Herramientas</p>
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
    </aside>
  );
}

export default Sidebar;
