import { useAuth } from '../../context/AuthContext';

function Navbar() {
  const { usuario, logout } = useAuth();

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
        <div className="navbar-avatar" title={usuario?.username}>
          {inicialUsuario}
        </div>
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
