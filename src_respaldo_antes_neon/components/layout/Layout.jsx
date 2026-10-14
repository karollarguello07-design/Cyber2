import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import './Layout.css';

function Layout({ children }) {
  const [tema, setTema] = useState(() => localStorage.getItem('tema') || 'oscuro');

  useEffect(() => {
    document.documentElement.setAttribute('data-tema', tema);
    localStorage.setItem('tema', tema);
  }, [tema]);

  function alternarTema() {
    setTema((actual) => (actual === 'oscuro' ? 'claro' : 'oscuro'));
  }

  return (
    <div className="layout-contenedor">
      <Navbar tema={tema} alternarTema={alternarTema} />
      <div className="layout-cuerpo">
        <Sidebar />
        <main className="layout-contenido">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
