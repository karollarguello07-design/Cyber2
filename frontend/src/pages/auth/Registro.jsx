import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import './Registro.css';

function Registro() {
  const navigate = useNavigate();
  const [formulario, setFormulario] = useState({
    username: '',
    email: '',
    password: '',
    rol: 'estudiante',
  });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  function manejarCambio(evento) {
    const { name, value } = evento.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setError('');
    setCargando(true);

    try {
      await api.post('/usuarios/registro/', formulario);
      navigate('/login', { state: { registroExitoso: true } });
    } catch (err) {
      const datos = err.response?.data;
      const primerError = datos ? Object.values(datos)[0]?.[0] : null;
      setError(primerError || 'No se pudo completar el registro.');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="registro-contenedor">
      <form className="registro-formulario" onSubmit={manejarEnvio}>
        <h1>Cyber<span>Edu</span></h1>
        <p className="registro-subtitulo">Crea tu cuenta para comenzar</p>

        {error && <div className="registro-error">{error}</div>}

        <label htmlFor="username">Usuario</label>
        <input
          id="username" name="username" type="text"
          value={formulario.username} onChange={manejarCambio} required
        />

        <label htmlFor="email">Correo</label>
        <input
          id="email" name="email" type="email"
          value={formulario.email} onChange={manejarCambio} required
        />

        <label htmlFor="password">Contraseña</label>
        <input
          id="password" name="password" type="password" minLength={8}
          value={formulario.password} onChange={manejarCambio} required
        />

        <label htmlFor="rol">Soy</label>
        <select id="rol" name="rol" value={formulario.rol} onChange={manejarCambio}>
          <option value="estudiante">Estudiante</option>
          <option value="profesor">Profesor</option>
        </select>

        <button type="submit" disabled={cargando}>
          {cargando ? 'Creando cuenta...' : 'Registrarme'}
        </button>

        <p className="registro-link">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </div>
  );
}

export default Registro;
