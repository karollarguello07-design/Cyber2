import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { restablecerContrasena } from '../../services/passwordReset';
import './Login.css';

function RestablecerContrasena() {
  const navigate = useNavigate();
  const [parametros] = useSearchParams();
  const uid = parametros.get('uid');
  const token = parametros.get('token');

  const [contrasena, setContrasena] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setError('');

    if (contrasena.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (contrasena !== confirmacion) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setCargando(true);
    try {
      await restablecerContrasena(uid, token, contrasena);
      setExito(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.response?.data?.error || 'El enlace no es válido o ya expiró.');
    } finally {
      setCargando(false);
    }
  }

  if (!uid || !token) {
    return (
      <div className="login-contenedor">
        <div className="login-formulario">
          <h1>Cyber<span>Edu</span></h1>
          <div className="login-error">
            Este enlace no es válido. Pide uno nuevo desde "¿Olvidaste tu contraseña?".
          </div>
          <p className="login-link">
            <Link to="/olvide-contrasena">Solicitar un nuevo enlace</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-contenedor">
      <form className="login-formulario" onSubmit={manejarEnvio}>
        <h1>Cyber<span>Edu</span></h1>
        <p className="login-subtitulo">Crea tu contraseña nueva</p>

        {exito ? (
          <div className="login-exito">
            ¡Contraseña actualizada! Te llevamos al inicio de sesión...
          </div>
        ) : (
          <>
            {error && <div className="login-error">{error}</div>}

            <label htmlFor="contrasena">Contraseña nueva</label>
            <input
              id="contrasena"
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />

            <label htmlFor="confirmacion">Confirma la contraseña</label>
            <input
              id="confirmacion"
              type="password"
              value={confirmacion}
              onChange={(e) => setConfirmacion(e.target.value)}
              required
            />

            <button type="submit" disabled={cargando}>
              {cargando ? 'Guardando...' : 'Guardar contraseña nueva'}
            </button>
          </>
        )}
      </form>
    </div>
  );
}

export default RestablecerContrasena;
