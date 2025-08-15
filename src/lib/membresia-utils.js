// Utilidades para cálculo de vencimientos y fechas de membresía
export const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + Number(days));
  return d;
};

export const getExpirationDate = (socio) => {
  // Si ya existe fecha_vencimiento, usarla
  if (socio?.fecha_vencimiento) return new Date(socio.fecha_vencimiento);

  // Intentar obtener la membresía expandida o directa
  const membresia = socio?.expand?.membresia || socio?.membresia || null;

  const duracion =
    membresia?.duracio_dias ||
    membresia?.duracion ||
    membresia?.duracion_dias ||
    membresia?.duracionDias ||
    membresia?.dias;

  const fechaInscripcion = socio?.fecha_inscripcion || socio?.fechaRegistro || socio?.fecha_registro;

  if (fechaInscripcion && duracion) {
    return addDays(new Date(fechaInscripcion), Number(duracion));
  }

  return null;
};

export const getVencimientoStatus = (socio) => {
  const exp = getExpirationDate(socio);
  if (!exp) return null;
  const today = new Date();
  const diffDays = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return "Vencido";
  if (diffDays <= 7) return "Próximo a vencer";
  return "Activo";
};
