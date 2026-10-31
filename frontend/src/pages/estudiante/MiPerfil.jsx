import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { obtenerMiCuenta, actualizarMiCuenta } from '../../services/usuarios';
import { obtenerMisLogros } from '../../services/logros';
import './MiPerfil.css';

function MiPerfil() {
  const [cuenta, setCuenta] = useState(null);
  const [logros, setLogros] = useState(null);
  const [cargando, setCargando] = useState(true);

  const [aliasEditado, setAliasEditado] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  useEffect(() => {
    cargar();
  }, []);

  async function cargar() {
    try {
      const [datosCuenta, datosLogros] = await Promise.all([
        obtenerMiCuenta(),
        obtenerMisLogros().catch(() => null),
      ]);
      setCuenta(datosCuenta);
      setAliasEditado(datosCuenta.alias || '');
      setFirstName(datosCuenta.first_name || '');
      setLastName(datosCuenta.last_name || '');
      setEmail(datosCuenta.email || '');
      setLogros(datosLogros);
    } catch (err) {
      setError('No se pudo cargar tu perfil. Si llevas rato en la app, cierra sesión y vuelve a entrar.');
    } finally {
      setCargando(false);
    }
  }

  async function manejarGuardar(evento) {
    evento.preventDefault();
    setGuardando(true);
    setError('');
    setExito('');
    try {
      const actualizado = await actualizarMiCuenta({
        alias: aliasEditado.trim(),
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
      });
      setCuenta(actualizado);
      setExito('¡Perfil actualizado!');
    } catch (err) {
      const datos = err.response?.data || {};
      const mensaje = datos.alias?.[0] || datos.email?.[0] || datos.first_name?.[0] || datos.last_name?.[0] || 'No se pudo guardar.';
      setError(mensaje);
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) {
    return (
      <Layout>
        <p className="miperfil-cargando">Cargando tu perfil...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="miperfil-pagina">
        <h1>👤 Mi Perfil</h1>

        {logros && (
          <div className="miperfil-tarjeta-presentacion">
            <div className="miperfil-avatar">{cuenta.alias?.[0] || '?'}</div>
            <div className="miperfil-presentacion-datos">
              <strong>{cuenta.alias}</strong>
              <span>{logros.nivel_nombre || 'Sin nivel'}</span>
            </div>
            <div className="miperfil-presentacion-stats">
              <div>
                <span className="miperfil-stat-valor">{logros.xp_total}</span>
                <span className="miperfil-stat-etiqueta">XP</span>
              </div>
              <div>
                <span className="miperfil-stat-valor">{logros.insignias_obtenidas}/{logros.insignias_totales}</span>
                <span className="miperfil-stat-etiqueta">Insignias</span>
              </div>
              <div>
                <span className="miperfil-stat-valor">{logros.total_retos_correctos}/{logros.total_retos}</span>
                <span className="miperfil-stat-etiqueta">Retos</span>
              </div>
            </div>
          </div>
        )}

        <div className="miperfil-tarjeta">
          <h2>Datos de la cuenta</h2>

          {error && <div className="miperfil-error">{error}</div>}
          {exito && <div className="miperfil-exito">{exito}</div>}

          <form onSubmit={manejarGuardar}>
            <div className="miperfil-campo">
              <label>Usuario</label>
              <input type="text" value={cuenta.username} disabled />
            </div>

            <div className="miperfil-campo">
              <label>Rol</label>
              <input type="text" value={cuenta.rol} disabled />
            </div>

            <div className="miperfil-campo">
              <label htmlFor="alias">Alias (visible en el ranking)</label>
              <input
                id="alias"
                type="text"
                value={aliasEditado}
                onChange={(e) => setAliasEditado(e.target.value)}
                maxLength={20}
              />
            </div>

            <div className="miperfil-fila">
              <div className="miperfil-campo">
                <label htmlFor="firstName">Nombre</label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="miperfil-campo">
                <label htmlFor="lastName">Apellido</label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="miperfil-campo">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button type="submit" disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default MiPerfil;
