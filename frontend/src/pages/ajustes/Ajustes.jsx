import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import {
  generarCodigoTelegram,
  desvincularTelegram,
  obtenerEstadoTelegram,
} from '../../services/telegram';
import './Ajustes.css';

function Ajustes() {
  const [vinculado, setVinculado] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [codigo, setCodigo] = useState(null);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarEstado();
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

  return (
    <Layout>
      <div className="ajustes-pagina">
        <h1>⚙️ Ajustes</h1>
        <p className="ajustes-subtitulo">Configura tus notificaciones</p>

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
