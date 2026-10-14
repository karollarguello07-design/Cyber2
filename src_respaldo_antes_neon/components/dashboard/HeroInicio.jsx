import './HeroInicio.css';

const estadisticas = [
  { valor: '2,847', etiqueta: 'Ataques hoy' },
  { valor: '12', etiqueta: 'Lecciones' },
  { valor: '94%', etiqueta: 'Satisfacción' },
];

function HeroInicio() {
  return (
    <section className="hero">
      <div className="hero-texto">
        <span className="hero-badge">
          <span className="hero-badge-punto"></span>
          PLATAFORMA ACTIVA — HONEYPOT EN VIVO
        </span>

        <h1 className="hero-titulo">
          Aprende <span className="hero-acento">Ciberseguridad</span><br />
          de Forma Interactiva
        </h1>

        <p className="hero-descripcion">
          Explora ataques reales capturados por nuestro honeypot Cowrie,
          practica con simulaciones y conviértete en el guardián de la red.
        </p>

        <div className="hero-botones">
          <button className="hero-boton-primario">▶ Comenzar ahora</button>
          <button className="hero-boton-secundario">Ver ataques en vivo →</button>
        </div>

        <div className="hero-estadisticas">
          {estadisticas.map((item) => (
            <div key={item.etiqueta} className="hero-estadistica">
              <span className="hero-estadistica-valor">{item.valor}</span>
              <span className="hero-estadistica-etiqueta">{item.etiqueta}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="hero-terminal">
        <div className="hero-terminal-linea">[2026-07-14 14:32:07]</div>
        <div className="hero-terminal-alerta">⚠ ALERTA SSH brute-force</div>
        <div className="hero-terminal-linea">IP: 185.220.101.42</div>
        <div className="hero-terminal-linea">User: root Pass: 123456</div>
        <div className="hero-terminal-linea">País: RU — Intentos: 147</div>
        <div className="hero-terminal-ok">✓ Honeypot activo — capturando</div>
      </div>
    </section>
  );
}

export default HeroInicio;
