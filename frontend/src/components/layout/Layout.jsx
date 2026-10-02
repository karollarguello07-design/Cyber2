import Navbar from './Navbar';
import Sidebar from './Sidebar';
import './Layout.css';

function Layout({ children }) {
  return (
    <div className="layout-contenedor">
      <Navbar />
      <div className="layout-cuerpo">
        <Sidebar />
        <main className="layout-contenido">{children}</main>
      </div>
    </div>
  );
}

export default Layout;

