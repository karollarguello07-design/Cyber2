import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { obtenerUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario } from '../../services/admin';
import './PanelAdmin.css';

const FORM_VACIO = { username: '', email: '', password: '', rol: 'estudiante', is_active: true };

function GestionUsuarios() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectorAbierto, setSelectorAbierto] = useState(false);
  const [accionSelector, setAccionSelector] = useState(null);
  const [busquedaSelector, setBusquedaSelector] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoModal, setModoModal] = useState('crear');
  const [usuarioEditandoId, setUsuarioEditandoId] = useState(null);
  const [formulario, setFormulario] = useState(FORM_VACIO);
  const [guardando, setGuardando] = useState(false);
  const [errorModal, setErrorModal] = useState('');

    useEffect(() => {
    cargarUsuarios();
  }, []);

  useEffect(() => {
    const accion = searchParams.get('accion');
    if (!accion) return;

    if (accion === 'agregar') {
      abrirModalCrear();
    } else if (accion === 'modificar') {
      setAccionSelector('editar');
      setBusquedaSelector('');
      setSelectorAbierto(true);
    } else if (accion === 'eliminar') {
      setAccionSelector('eliminar');
      setBusquedaSelector('');
      setSelectorAbierto(true);
    }
    setSearchParams({}, { replace: true });
  }, [searchParams]);

  function manejarSeleccion(usuario) {
    setSelectorAbierto(false);
    if (accionSelector === 'editar') {
      abrirModalEditar(usuario);
    } else if (accionSelector === 'eliminar') {
      manejarEliminar(usuario);
    }
  }
  
 const usuariosFiltrados = usuarios.filter((u) => {
    const termino = busquedaSelector.toLowerCase();
    return (
      u.username.toLowerCase().includes(termino) ||
      (u.email || '').toLowerCase().includes(termino)
    );
  });
  async function cargarUsuarios() {
    setCargando(true);
    try {
      const datos = await obtenerUsuarios();
      setUsuarios(datos);
    } catch (err) {
      setError('No se pudieron cargar los usuarios.');
    } finally {
      setCargando(false);
    }
  }

  function abrirModalCrear() {
    setModoModal('crear');
    setUsuarioEditandoId(null);
    setFormulario(FORM_VACIO);
    setErrorModal('');
    setModalAbierto(true);
  }

  function abrirModalEditar(usuario) {
    setModoModal('editar');
    setUsuarioEditandoId(usuario.id);
    setFormulario({
      username: usuario.username,
      email: usuario.email || '',
      password: '',
      rol: usuario.rol,
      is_active: usuario.is_active,
    });
    setErrorModal('');
    setModalAbierto(true);
  }

  function cerrarModal() {
    setModalAbierto(false);
  }

  function manejarCambio(evento) {
    const { name, value, type, checked } = evento.target;
    setFormulario((previo) => ({
      ...previo,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  async function manejarGuardar(evento) {
    evento.preventDefault();
    setGuardando(true);
    setErrorModal('');
    try {
      if (modoModal === 'crear') {
        await crearUsuario(formulario);
      } else {
        const datosEditar = { ...formulario };
        if (!datosEditar.password) {
          delete datosEditar.password;
        }
        await actualizarUsuario(usuarioEditandoId, datosEditar);
      }
      setModalAbierto(false);
      await cargarUsuarios();
    } catch (err) {
      const mensaje = err?.response?.data
        ? Object.values(err.response.data).flat().join(' ')
        : 'No se pudo guardar el usuario.';
      setErrorModal(mensaje);
    } finally {
      setGuardando(false);
    }
  }

  async function manejarEliminar(usuario) {
    const confirmar = window.confirm(`¿Eliminar al usuario "${usuario.username}"? Esta acción no se puede deshacer.`);
    if (!confirmar) return;
    try {
      await eliminarUsuario(usuario.id);
      await cargarUsuarios();
    } catch (err) {
      setError('No se pudo eliminar el usuario.');
    }
  }

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
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td>{u.username}</td>
                  <td>{u.email || '—'}</td>
                  <td><span className={`rol-chip rol-${u.rol}`}>{u.rol}</span></td>
                  <td>{u.is_active ? '✓' : '✗'}</td>
                  <td>
                    <div className="acciones-fila">
                      <button className="boton-accion boton-editar" onClick={() => abrirModalEditar(u)}>
                        Editar
                      </button>
                      <button className="boton-accion boton-eliminar" onClick={() => manejarEliminar(u)}>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalAbierto && (
        <div className="modal-fondo" onClick={cerrarModal}>
          <div className="modal-caja" onClick={(e) => e.stopPropagation()}>
            <h2>{modoModal === 'crear' ? 'Agregar Usuario' : 'Modificar Usuario'}</h2>

            {errorModal && <div className="panel-admin-error">{errorModal}</div>}

            <form onSubmit={manejarGuardar} className="modal-formulario">
              <label>
                Usuario
                <input
                  type="text"
                  name="username"
                  value={formulario.username}
                  onChange={manejarCambio}
                  required
                />
              </label>

              <label>
                Correo
                <input
                  type="email"
                  name="email"
                  value={formulario.email}
                  onChange={manejarCambio}
                />
              </label>

              <label>
                {modoModal === 'crear' ? 'Contraseña' : 'Nueva contraseña (opcional)'}
                <input
                  type="password"
                  name="password"
                  value={formulario.password}
                  onChange={manejarCambio}
                  required={modoModal === 'crear'}
                  minLength={8}
                />
              </label>

              <label>
                Rol
                <select name="rol" value={formulario.rol} onChange={manejarCambio}>
                  <option value="estudiante">Estudiante</option>
                  <option value="profesor">Profesor</option>
                  <option value="admin">Administrador</option>
                </select>
              </label>

              <label className="modal-checkbox">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formulario.is_active}
                  onChange={manejarCambio}
                />
                Usuario activo
              </label>

              <div className="modal-botones">
                <button type="button" className="boton-accion" onClick={cerrarModal}>
                  Cancelar
                </button>
                <button type="submit" className="boton-gestion boton-agregar" disabled={guardando}>
                  {guardando ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
 {selectorAbierto && (
        <div className="modal-fondo" onClick={() => setSelectorAbierto(false)}>
          <div className="modal-caja modal-caja-ancha" onClick={(e) => e.stopPropagation()}>
            <h2>{accionSelector === 'editar' ? 'Selecciona un usuario para modificar' : 'Selecciona un usuario para eliminar'}</h2>

            <input
              type="text"
              className="selector-buscador"
              placeholder="🔍 Buscar usuario por nombre o correo"
              value={busquedaSelector}
              onChange={(e) => setBusquedaSelector(e.target.value)}
              autoFocus
            />

            <div className="selector-tabla-contenedor">
              <table className="admin-tabla">
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Correo</th>
                    <th>Rol</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosFiltrados.map((u) => (
                    <tr key={u.id}>
                      <td>{u.username}</td>
                      <td>{u.email || '—'}</td>
                      <td><span className={`rol-chip rol-${u.rol}`}>{u.rol}</span></td>
                      <td>
                        <button className="boton-accion" onClick={() => manejarSeleccion(u)}>
                          {accionSelector === 'editar' ? 'Editar' : 'Eliminar'}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {usuariosFiltrados.length === 0 && (
                    <tr>
                      <td colSpan={4} className="selector-sin-resultados">
                        No se encontraron usuarios.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="modal-botones">
              <button type="button" className="boton-accion" onClick={() => setSelectorAbierto(false)}>
                Cancelar
              </button>
            </div>
           </div>
          </div>
          )}
        </Layout>
      );
}
export default GestionUsuarios;
