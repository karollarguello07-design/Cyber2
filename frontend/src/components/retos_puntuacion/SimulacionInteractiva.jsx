import { useState } from 'react';
import './SimulacionInteractiva.css';

const logAtaque = [
  { texto: '[14:31:02] Nueva conexión: 185.220.101.42:52741', tipo: 'normal' },
  { texto: '[14:31:03] Protocolo: SSH-2.0-libssh2', tipo: 'normal' },
  { texto: '[14:31:04] Intento #1 user=root pass=123456', tipo: 'normal' },
  { texto: '[14:31:04] Intento #2 user=root pass=password', tipo: 'normal' },
  { texto: '[14:31:05] Intento #3 user=admin pass=admin123', tipo: 'normal' },
  { texto: '[14:31:05] ⚠ 147 intentos en 3 segundos', tipo: 'alerta' },
  { texto: '[14:31:06] Intento #148 user=root pass=toor', tipo: 'normal' },
  { texto: '[14:31:07] ✓ Honeypot captura credenciales', tipo: 'ok' },
];

const datosAtaque = [
  { etiqueta: 'IP atacante:', valor: '185.220.101.42' },
  { etiqueta: 'País origen:', valor: 'Rusia (RU)' },
  { etiqueta: 'Intentos/seg:', valor: '49 intentos/s' },
  { etiqueta: 'Puerto atacado:', valor: '22 (SSH)' },
  { etiqueta: 'Herramienta:', valor: 'libssh2 (bot)' },
];

const opciones = [
  { letra: 'A', texto: 'Bloquear la IP en el firewall y revisar si hay accesos exitosos previos', correcta: true },
  { letra: 'B', texto: 'Ignorar el evento, probablemente es una falsa alarma', correcta: false },
  { letra: 'C', texto: 'Cambiar el puerto SSH a 2222 como única medida de defensa', correcta: false },
  { letra: 'D', texto: 'Apagar el servidor para detener el ataque', correcta: false },
];

function SimulacionInteractiva() {
  const [seleccionada, setSeleccionada] = useState(null);

  function manejarSeleccion(opcion) {
    if (seleccionada) return;
    setSeleccionada(opcion);
  }

  return (
    <section className="simulacion">
      <div className="simulacion-encabezado">
        <h2>🗡️ Simulación interactiva</h2>
        <a href="#" className="simulacion-ver-mas">Ver más escenarios →</a>
      </div>

      <div className="simulacion-tarjeta">
        <div className="simulacion-titulo-escenario">
          <span>Escenario #07 — Acceso SSH Sospechoso</span>
          <span className="simulacion-alerta-activa">● Alerta activa</span>
        </div>

        <div className="simulacion-contenido">
          <div className="simulacion-terminal">
            <p className="simulacion-terminal-ruta">▶ /var/log/cowrie/cowrie.log — tiempo real</p>
            {logAtaque.map((linea, i) => (
              <p key={i} className={`simulacion-terminal-linea simulacion-${linea.tipo}`}>
                {linea.texto}
              </p>
            ))}
          </div>

          <div className="simulacion-pregunta">
            <h3>¿Qué tipo de ataque está ocurriendo y cuál es la mejor respuesta?</h3>
            <p className="simulacion-contexto">
              Analiza el log de la izquierda. El atacante viene de la IP{' '}
              <strong>185.220.101.42</strong> (nodo Tor conocido) y realiza cientos de intentos por segundo.
            </p>

            <div className="simulacion-datos">
              {datosAtaque.map((dato) => (
                <div key={dato.etiqueta} className="simulacion-dato">
                  <span>{dato.etiqueta}</span>
                  <strong>{dato.valor}</strong>
                </div>
              ))}
            </div>

            <div className="simulacion-opciones">
              {opciones.map((opcion) => {
                let clase = 'simulacion-opcion';
                if (seleccionada) {
                  if (opcion.letra === seleccionada.letra) {
                    clase += opcion.correcta ? ' correcta' : ' incorrecta';
                  } else if (opcion.correcta) {
                    clase += ' correcta';
                  }
                }
                return (
                  <button
                    key={opcion.letra}
                    className={clase}
                    onClick={() => manejarSeleccion(opcion)}
                  >
                    <span className="simulacion-opcion-letra">{opcion.letra}</span>
                    {opcion.texto}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SimulacionInteractiva;
