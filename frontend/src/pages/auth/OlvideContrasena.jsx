import { useState } from 'react';
import { Link } from 'react-router-dom';
import { solicitarReset } from '../../services/passwordReset';
import './Login.css';

function OlvideContrasena() {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setError('');
    setCargando(true);
    try {
      await solicitarReset(email);
      setEnviado(true);
    } catch (err) {
      setError('No se pudo procesar la solicitud. Intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="login-contenedor">
      <form className="login-formulario" onSubmit={manejarEnvio}>
        <h1>Cyber<span>Edu</span></h1>
        <p className="login-subtitulo">Recupera el acceso a tu cuenta</p>

        {enviado ? (
          <div className="login-exito">
            Si ese correo está registrado, te enviamos un enlace para restablecer tu
            contraseña. Revisa tu bandeja de entrada (y la carpeta de spam).
          </div>
        ) : (
          <>
            {error && <div className="login-error">{error}</div>}

            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button type="submit" disabled={cargando}>
              {cargando ? 'Enviando...' : 'Enviar enlace de recuperación'}
            </button>
          </>
        )}

        <p className="login-link">
          <Link to="/login">← Volver a iniciar sesión</Link>
        </p>
      </form>
    </div>
  );
}

export default OlvideContrasena;
