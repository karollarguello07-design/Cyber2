import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Login.css';
import { useNavigate, Link, useLocation } from 'react-router-dom';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const registroExitoso = location.state?.registroExitoso;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setError('');
    setCargando(true);

    try {
      const usuarioLogueado = await login(username, password);
      if (usuarioLogueado.rol === 'admin') {
        navigate('/admin');
      } else if (usuarioLogueado.rol === 'profesor') {
        navigate('/profesor');
      } else {
        navigate('/dashboard');
      }
 

    } catch (err) {
      setError('Usuario o contraseña incorrectos');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="login-contenedor">
      <form className="login-formulario" onSubmit={manejarEnvio}>
        <h1>Cyber<span>Edu</span></h1>
        <p className="login-subtitulo">Inicia sesión para continuar aprendiendo</p>

       {registroExitoso && (
          <div className="login-exito">¡Cuenta creada! Ya puedes iniciar sesión.</div>
        )}
        {error && <div className="login-error">{error}</div>}

        <label htmlFor="username">Usuario</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={cargando}>
          {cargando ? 'Ingresando...' : 'Iniciar sesión'}
        </button>
         <p className="login-link">
          ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
