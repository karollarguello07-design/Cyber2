import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { obtenerUsuarios, obtenerCursosAdmin } from '../../services/admin';
import { obtenerEstadisticasAtaques } from '../../services/honeypot';
import './PanelAdmin.css';

function Reportes() {
  const [usuarios, setUsuarios] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [statsAtaques, setStatsAtaques] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargar() {
      try {
        const [datosUsuarios, datosCursos, datosAtaques] = await Promise.all([
          obtenerUsuarios(),
          obtenerCursosAdmin(),
          obtenerEstadisticasAtaques(),
        ]);
        setUsuarios(datosUsuarios);
        setCursos(datosCursos);
        setStatsAtaques(datosAtaques);
      } catch (err) {
        setError('No se pudo cargar la información de reportes.');
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  if (cargando) {
    return (
      <Layout>
        <p className="panel-admin-cargando">Cargando reportes...</p>
      </Layout>
    );
  }

  const totalEstudiantes = usuarios.filter((u) => u.rol === 'estudiante').length;
  const totalProfesores = usuarios.filter((u) => u.rol === 'profesor').length;

  return (
    <Layout>
      <div className="panel-admin">
        <h1>📊 Reportes</h1>
        {error && <div className="panel-admin-error">{error}</div>}

        <div className="panel-admin-resumen">
          <TarjetaResumen etiqueta="Total usuarios" valor={usuarios.length} />
          <TarjetaResumen etiqueta="Estudiantes" valor={totalEstudiantes} />
          <TarjetaResumen etiqueta="Profesores" valor={totalProfesores} />
          <TarjetaResumen etiqueta="Cursos" valor={cursos.length} />
        </div>

        {statsAtaques && (
          <div className="panel-admin-resumen">
            <TarjetaResumen etiqueta="Ataques hoy" valor={statsAtaques.ataques_hoy} />
            <TarjetaResumen etiqueta="Ataques histórico" valor={statsAtaques.total_ataques} />
          </div>
        )}

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

export default Reportes;
