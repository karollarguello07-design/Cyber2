import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { obtenerUsuarios, obtenerCursosAdmin } from '../../services/admin';
import './PanelAdmin.css';

function PanelAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargar() {
      try {
        const [datosUsuarios, datosCursos] = await Promise.all([
          obtenerUsuarios(),
          obtenerCursosAdmin(),
        ]);
        setUsuarios(datosUsuarios);
        setCursos(datosCursos);
      } catch (err) {
        setError('No se pudo cargar la información administrativa.');
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  if (cargando) {
    return (
      <Layout>
        <p className="panel-admin-cargando">Cargando panel administrativo...</p>
      </Layout>
    );
  }

  const totalEstudiantes = usuarios.filter((u) => u.rol === 'estudiante').length;
  const totalProfesores = usuarios.filter((u) => u.rol === 'profesor').length;

  return (
    <Layout>
      <div className="panel-admin">
        <h1>Panel de Administración</h1>

        {error && <div className="panel-admin-error">{error}</div>}

        <div className="panel-admin-resumen">
          <TarjetaResumen etiqueta="Total usuarios" valor={usuarios.length} />
          <TarjetaResumen etiqueta="Estudiantes" valor={totalEstudiantes} />
          <TarjetaResumen etiqueta="Profesores" valor={totalProfesores} />
          <TarjetaResumen etiqueta="Cursos" valor={cursos.length} />
        </div>

        <div className="panel-admin-seccion">
          <h2>Usuarios registrados</h2>
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

        <div className="panel-admin-seccion">
          <h2>Cursos</h2>
          <table className="admin-tabla">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Profesor</th>
                <th>Cupo</th>
              </tr>
            </thead>
            <tbody>
              {cursos.map((c) => (
                <tr key={c.id}>
                  <td>{c.nombre}</td>
                  <td>{c.profesor_nombre}</td>
                  <td>{c.cupo_disponible} / {c.cupo_maximo} disponibles</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

function TarjetaResumen({ etiqueta, valor }) {
  return (
    <div className="resumen-tarjeta">
      <p className="resumen-etiqueta">{etiqueta}</p>
      <p className="resumen-valor">{valor}</p>
    </div>
  );
}

export default PanelAdmin;
