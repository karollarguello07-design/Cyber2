import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import {
  generarCodigoTelegram,
  desvincularTelegram,
  obtenerEstadoTelegram,
} from '../../services/telegram';
import { obtenerMiCuenta, actualizarMiCuenta } from '../../services/usuarios';
import './Ajustes.css';

function Ajustes() {
  const [vinculado, setVinculado] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [codigo, setCodigo] = useState(null);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState('');

  const [cuenta, setCuenta] = useState(null);
  const [aliasEditado, setAliasEditado] = useState('');
  const [cargandoCuenta, setCargandoCuenta] = useState(true);
  const [guardandoAlias, setGuardandoAlias] = useState(false);
  const [errorAlias, setErrorAlias] = useState('');
  const [exitoAlias, setExitoAlias] = useState('');
  const [cambiandoVisibilidad, setCambiandoVisibilidad] = useState(false);

  useEffect(() => {
    cargarEstado();
    cargarCuenta();
  }, []);

  async function cargarEstado() {
    try {
      const datos = await obtenerEstadoTelegram();
      setVinculado(datos.vinculado);
    } catch (err) {
      setError('No se pudo consultar el estado de Telegram.');
    } finally {
      setCargando(false);
    }
  }

  async function cargarCuenta() {
    try {
      const datos = await obtenerMiCuenta();
      setCuenta(datos);
      setAliasEditado(datos.alias);
    } catch (err) {
      setErrorAlias('No se pudo cargar tu información de cuenta.');
    } finally {
      setCargandoCuenta(false);
    }
  }

  async function manejarGenerarCodigo() {
    setProcesando(true);
    setError('');
    try {
      const datos = await generarCodigoTelegram();
      setCodigo(datos.codigo);
    } catch (err) {
      setError('No se pudo generar el código.');
    } finally {
      setProcesando(false);
    }
  }

  async function manejarDesvincular() {
    setProcesando(true);
    setError('');
    try {
      await desvincularTelegram();
      setVinculado(false);
      setCodigo(null);
    } catch (err) {
      setError('No se pudo desvincular la cuenta.');
    } finally {
      setProcesando(false);
    }
  }

  async function manejarGuardarAlias(evento) {
    evento.preventDefault();
    setGuardandoAlias(true);
    setErrorAlias('');
    setExitoAlias('');
    try {
      const actualizado = await actualizarMiCuenta({ alias: aliasEditado.trim() });
      setCuenta(actualizado);
      setAliasEditado(actualizado.alias);
      setExitoAlias('¡Alias actualizado!');
    } catch (err) {
      const mensaje = err.response?.data?.alias?.[0] || 'No se pudo actualizar el alias.';
      setErrorAlias(mensaje);
    } finally {
      setGuardandoAlias(false);
    }
  }

  async function manejarCambiarVisibilidad() {
    setCambiandoVisibilidad(true);
    setErrorAlias('');
    try {
      const nuevoValor = !cuenta.visible_en_ranking;
      const actualizado = await actualizarMiCuenta({ visible_en_ranking: nuevoValor });
      setCuenta(actualizado);
    } catch (err) {
      setErrorAlias('No se pudo cambiar la visibilidad en el ranking.');
    } finally {
      setCambiandoVisibilidad(false);
    }
  }

  return (
    <Layout>
      <div className="ajustes-pagina">
        <h1>🔔 Notificaciones</h1>
        <p className="ajustes-subtitulo">Configura tus notificaciones y tu privacidad</p>

        <div className="ajustes-tarjeta">
          <h2>🎭 Tu alias en el ranking</h2>
          <p className="ajustes-descripcion">
            Por tu privacidad, en el ranking del curso solo se muestra este alias, nunca tu
            nombre real ni tu usuario. Puedes cambiarlo cuando quieras.
          </p>

          {cargandoCuenta ? (
            <p className="ajustes-cargando">Cargando...</p>
          ) : (
            <>
              {errorAlias && <div className="ajustes-error">{errorAlias}</div>}
              {exitoAlias && <div className="ajustes-exito">{exitoAlias}</div>}

              <form className="ajustes-form-alias" onSubmit={manejarGuardarAlias}>
                <input
                  type="text"
                  value={aliasEditado}
                  onChange={(e) => setAliasEditado(e.target.value)}
                  maxLength={20}
                  placeholder="Tu alias"
                  className="ajustes-input"
                />
                <button
                  type="submit"
                  className="ajustes-boton-primario"
                  disabled={guardandoAlias || aliasEditado.trim() === cuenta?.alias}
                >
                  {guardandoAlias ? 'Guardando...' : 'Guardar alias'}
                </button>
              </form>
              <p className="ajustes-ayuda">
                3 a 20 caracteres: letras, números y guiones. No puede ser igual a tu usuario
                ni a tu nombre real.
              </p>

              <div className="ajustes-switch-fila">
                <div>
                  <strong>Aparecer en el ranking</strong>
                  <p className="ajustes-switch-descripcion">
                    Si lo desactivas, dejarás de aparecer en el ranking de tu curso para los
                    demás estudiantes (tú sí sigues viendo tu propio progreso).
                  </p>
                </div>
                <button
                  type="button"
                  className={'ajustes-switch' + (cuenta?.visible_en_ranking ? ' activo' : '')}
                  onClick={manejarCambiarVisibilidad}
                  disabled={cambiandoVisibilidad}
                  aria-pressed={cuenta?.visible_en_ranking}
                >
                  <span className="ajustes-switch-circulo"></span>
                </button>
              </div>
            </>
          )}
        </div>

        {error && <div className="ajustes-error">{error}</div>}

        <div className="ajustes-tarjeta">
          <h2>Notificaciones por Telegram</h2>
          <p className="ajustes-descripcion">
            Vincula tu cuenta de Telegram para recibir notificaciones de nuevos retos,
            subidas de nivel e insignias obtenidas. Es completamente opcional y puedes
            desvincularte cuando quieras.
          </p>

          {cargando ? (
            <p className="ajustes-cargando">Cargando estado...</p>
          ) : vinculado ? (
            <div className="ajustes-vinculado">
              <span className="ajustes-badge-ok">✓ Cuenta vinculada</span>
              <button
                className="ajustes-boton-secundario"
                onClick={manejarDesvincular}
                disabled={procesando}
              >
                {procesando ? 'Desvinculando...' : 'Desvincular Telegram'}
              </button>
            </div>
          ) : (
            <div className="ajustes-no-vinculado">
              {!codigo ? (
                <button
                  className="ajustes-boton-primario"
                  onClick={manejarGenerarCodigo}
                  disabled={procesando}
                >
                  {procesando ? 'Generando...' : 'Vincular Telegram'}
                </button>
              ) : (
                <div className="ajustes-codigo-caja">
                  <p>Envía este código a nuestro bot de Telegram:</p>
                  <p className="ajustes-codigo">{codigo}</p>
                  <p className="ajustes-codigo-nota">
                    Válido por 10 minutos. Busca nuestro bot CyberEdu notificaciones  en Telegram, inícialo,
                    y envíale este código como mensaje.
                  </p>
                  <button
                    className="ajustes-boton-secundario"
                    onClick={cargarEstado}
                  >
                    Ya lo envié, verificar estado
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Ajustes;
