import { useState, useEffect } from 'react';
import { obtenerAtaques } from '../../services/honeypot';
import './PanelAtaques.css';

function UltimosIntentos() {
  const [ataques, setAtaques] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      try {
        const datos = await obtenerAtaques();
        setAtaques(datos);
      } catch (err) {
        setAtaques([]);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  if (cargando) {
    return (
      <section className="panel-ataques">
        <p className="panel-ataques-cargando">Cargando últimos intentos...</p>
      </section>
    );
  }

  return (
    <section className="panel-ataques">
      <div className="panel-ataques-encabezado">
        <h2>🕒 Últimos intentos de acceso</h2>
      </div>
      {ataques.length === 0 ? (
        <p className="panel-ataques-vacio">Aún no se han registrado intentos.</p>
      ) : (
        <table className="tabla-ultimos-intentos">
          <thead>
            <tr>
              <th>Fecha/Hora</th>
              <th>IP origen</th>
              <th>Usuario</th>
              <th>Contraseña</th>
              <th>Tipo de ataque</th>
            </tr>
          </thead>
          <tbody>
            {ataques.map((ataque) => (
              <tr key={ataque.id}>
                <td>{new Date(ataque.timestamp_evento).toLocaleString('es-CO')}</td>
                <td>{ataque.ip_origen}</td>
                <td>{ataque.usuario_probado || '—'}</td>
                <td>{ataque.contrasena_probada || '—'}</td>
                <td>{ataque.tipo_ataque_nombre || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default UltimosIntentos;
