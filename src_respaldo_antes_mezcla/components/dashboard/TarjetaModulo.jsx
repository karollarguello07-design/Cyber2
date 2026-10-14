function TarjetaModulo({ icono, numeroModulo, colorEtiqueta, titulo, descripcion, progreso }) {
  return (
    <div className="tarjeta-modulo">
      <div className="tarjeta-modulo-icono">{icono}</div>
      <span
        className="tarjeta-modulo-etiqueta"
        style={{ color: colorEtiqueta, borderColor: colorEtiqueta }}
      >
        {numeroModulo}
      </span>
      <h3 className="tarjeta-modulo-titulo">{titulo}</h3>
      <p className="tarjeta-modulo-descripcion">{descripcion}</p>

      {progreso > 0 ? (
        <div className="tarjeta-modulo-progreso-contenedor">
          <div className="tarjeta-modulo-barra-fondo">
            <div
              className="tarjeta-modulo-barra-relleno"
              style={{ width: `${progreso}%` }}
            ></div>
          </div>
          <span className="tarjeta-modulo-progreso-texto">{progreso}% completado</span>
        </div>
      ) : (
        <span className="tarjeta-modulo-progreso-texto">Por comenzar</span>
      )}
    </div>
  );
}

export default TarjetaModulo;
