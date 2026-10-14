import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { obtenerUsuarios } from '../../services/admin';
import './PanelAdmin.css';

function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargar() {
      try {
        const datos = await obtenerUsuarios();
        setUsuarios(datos);
      } catch (err) {
        setError('No se pudieron cargar los usuarios.');
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  if (cargando) {
    return (
      <Layout>
        <p className="panel-admin-cargando">Cargando usuarios...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="panel-admin">
        <h1>👥 Usuarios Registrados</h1>
        {error && <div className="panel-admin-error">{error}</div>}

        <div className="panel-admin-seccion">
          <table className="admin-tabla">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Activo</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td>{u.username}</td>
                  <td>{u.email || '—'}</td>
                  <td><span className={`rol-chip rol-${u.rol}`}>{u.rol}</span></td>
                  <td>{u.is_active ? '✓' : '✗'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

export default GestionUsuarios;
