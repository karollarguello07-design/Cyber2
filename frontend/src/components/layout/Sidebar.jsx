import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const itemsMenuEstudiante = [
  { texto: 'Inicio', ruta: '/dashboard' },
  { texto: 'Cursos Disponibles', ruta: '/cursos-disponibles' },
  { texto: 'Mis Cursos', ruta: '/mis-cursos' },
  { texto: 'Retos', ruta: '/retos' },
  { texto: 'Ataques Reales', ruta: '/ataques' },
  { texto: 'Quiz', ruta: '/quiz' },
];

const itemsHerramientasEstudiante = [
  { texto: 'Mi Progreso', ruta: '/progreso' },
  { texto: 'Logros', ruta: '/logros' },
  { texto: 'Notificaciones', ruta: '/ajustes' },
];

const itemsMenuProfesor = [
  { texto: 'Panel del Profesor', ruta: '/profesor' },
  { texto: 'Ataques Reales', ruta: '/ataques' },
];

const itemsHerramientasProfesor = [
  { texto: 'Ajustes', ruta: '/ajustes' },
];

const itemsMenuAdmin = [
  { texto: 'Inicio', ruta: '/admin' },
  { texto: 'Usuarios Registrados', ruta: '/admin/usuarios' },
  { texto: 'Gestión de Contenido', ruta: '/admin/contenido' },
  { texto: 'Reportes', ruta: '/admin/reportes' },
];

const itemsHerramientasAdmin = [
  { texto: 'Ajustes', ruta: '/ajustes' },
];

function Sidebar() {
  const { usuario } = useAuth();

  let itemsMenu = itemsMenuEstudiante;
  let itemsHerramientas = itemsHerramientasEstudiante;

  if (usuario?.rol === 'profesor') {
    itemsMenu = itemsMenuProfesor;
    itemsHerramientas = itemsHerramientasProfesor;
  } else if (usuario?.rol === 'admin') {
    itemsMenu = itemsMenuAdmin;
    itemsHerramientas = itemsHerramientasAdmin;
  }

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
