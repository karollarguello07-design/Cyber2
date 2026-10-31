import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Navbar({ tema, alternarTema }) {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const inicialUsuario = usuario?.username?.charAt(0).toUpperCase() || '?';

  return (
    <header className="navbar">
      <div className="navbar-logo">
        <span className="navbar-logo-icono">🛡️</span>
        Cyber<span className="navbar-logo-acento">Edu</span>
      </div>

      <nav className="navbar-links">
        <NavLinkSimple texto="Inicio" />
      </nav>

      <div className="navbar-usuario">
        <button
          className="navbar-toggle-tema"
          onClick={alternarTema}
          title={tema === 'oscuro' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          {tema === 'oscuro' ? '☀️' : '🌙'}
        </button>

        <button className="navbar-mi-perfil" onClick={() => navigate('/mi-perfil')}>
          <span className="navbar-avatar">{inicialUsuario}</span>
          Mi Perfil
        </button>

        <button className="navbar-logout" onClick={logout}>
          Salir
        </button>
      </div>
    </header>
  );
}

function NavLinkSimple({ texto }) {
  return <span className="navbar-link-texto">{texto}</span>;
}

export default Navbar;
