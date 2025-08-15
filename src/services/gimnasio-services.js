import { PocketBaseService } from "../lib/pocketbase-service";

// Servicio para la gestión de socios
export class SociosService extends PocketBaseService {
  constructor() {
    super("socios");
  }

  // Método personalizado para buscar socios por nombre o documento
  async buscarSocios(termino) {
    return this.getAll({
      filter: `Nombre~"${termino}" || documento~"${termino}" || email~"${termino}"`,
      sort: "Nombre",
    });
  }

  // Método personalizado para obtener socios con membresías activas
  async getSociosActivos() {
    return this.getAll({
      filter: 'estado_socio="Activo"',
      sort: "Nombre",
    });
  }

  // Método para obtener socios con pagos pendientes
  async getSociosConPagosPendientes() {
    const fechaHoy = new Date().toISOString().split("T")[0];
    return this.getAll({
      filter: `fecha_vencimiento<"${fechaHoy}" && estado_socio="Activo"`,
      sort: "fecha_vencimiento",
      expand: "membresia",
    });
  }

  // Método para obtener un socio con su membresía
  async getSocioConMembresia(socioId) {
    return this.getById(socioId, {
      expand: "membresia",
    });
  }
}

// Servicio para la gestión de pagos
export class PagosService extends PocketBaseService {
  constructor() {
    super("pagos");
  }

  // Método para obtener pagos de un socio específico
  async getPagosBySocio(socioId) {
    return this.getAll({
      filter: `socio="${socioId}"`,
      sort: "fecha_pago desc",
      expand: "socio,membresia",
    });
  }

  // Método para obtener pagos por período
  async getPagosPorPeriodo(fechaInicio, fechaFin) {
    return this.getAll({
      filter: `fecha_pago>="${fechaInicio}" && fecha_pago<="${fechaFin}"`,
      sort: "fecha_pago desc",
      expand: "socio",
    });
  }

  // Método para registrar un pago de membresía
  async registrarPagoMembresia(
    socioId,
    membresiaId,
    monto,
    metodoPago,
    notas = ""
  ) {
    const data = {
      socio: socioId,
      fecha_pago: new Date().toISOString().split("T")[0],
      field: "Membresia",
      membresia: membresiaId,
      monto: monto,
      metodo_pago: metodoPago,
      estado: "Completado",
      notas: notas,
    };

    return this.create(data);
  }

  // Crea un pago garantizando única vigencia por socio o renovando
  async createOrRenew({
    socioId,
    membresiaId,
    pagoData = {},
    mode = "allow",
  } = {}) {
    // usar servicios auxiliares
    const sociosService = new SociosService();
    const membresiasService = new MembresiasService();

    const socio = await sociosService.getById(socioId).catch(() => null);
    const membresia = membresiaId
      ? await membresiasService.getById(membresiaId).catch(() => null)
      : socio?.membresia || null;

    if (!socio) throw new Error("Socio no encontrado");
    if (!membresia) throw new Error("Membresía no encontrada");

    const duracion =
      membresia?.duracio_dias ||
      membresia?.duracion ||
      membresia?.duracion_dias ||
      membresia?.dias ||
      0;

    const today = new Date();
    const currentExpiry = socio?.fecha_vencimiento
      ? new Date(socio.fecha_vencimiento)
      : null;

    const addDays = (d, days) => {
      const r = new Date(d);
      r.setDate(r.getDate() + Number(days));
      return r;
    };

    // Nuevo comportamiento: por defecto permitimos pagar en cualquier momento.
    // Si la vigencia actual está en el futuro, sumamos días a la fecha existente.
    // Si no hay vigencia o está vencida, empezamos desde hoy.
    let newExpiry;
    if (currentExpiry && currentExpiry > today) {
      if (mode === "prevent") {
        // modo legacy: evitar pago si ya hay vigencia
        throw new Error(
          `El socio ya tiene una membresía vigente hasta ${
            currentExpiry.toISOString().split("T")[0]
          }`
        );
      }

      // Sumar duración a la fecha de vencimiento actual
      newExpiry = addDays(currentExpiry, duracion);
    } else {
      // Empezar la vigencia desde hoy
      newExpiry = addDays(today, duracion);
    }

    const payload = {
      ...pagoData,
      socio: socioId,
      membresia: membresiaId,
      fecha_pago: pagoData.fecha_pago || today.toISOString().split("T")[0],
      field: pagoData.field || "Membresia",
      estado: pagoData.estado || "Completado",
    };

    const createdPago = await this.create(payload);

    // Actualizar socio
    await sociosService.update(socioId, {
      fecha_vencimiento: newExpiry.toISOString().split("T")[0],
      membresia: membresiaId,
      planActivo: membresia?.nombre || "",
    });

    return {
      pago: createdPago,
      nuevaFechaVencimiento: newExpiry.toISOString().split("T")[0],
    };
  }
}

// Servicio para la gestión de asistencias
export class AsistenciasService extends PocketBaseService {
  constructor() {
    super("asistencias");
  }

  // Método para registrar una nueva asistencia
  async registrarAsistencia(socioId, claseId = null, registradoPorId = null) {
    const now = new Date();
    const data = {
      socio: socioId,
      fecha_hora_entrada: now.toISOString(),
      clase: claseId,
      registrado_por: registradoPorId,
    };

    return this.create(data);
  }

  // Método para registrar salida
  async registrarSalida(asistenciaId) {
    const now = new Date();
    return this.update(asistenciaId, {
      fecha_hora_salida: now.toISOString(),
    });
  }

  // Método para obtener asistencias de un socio
  async getAsistenciasBySocio(socioId) {
    return this.getAll({
      filter: `socio="${socioId}"`,
      sort: "fecha_hora_entrada desc",
      expand: "clase,socio",
    });
  }

  // Método para obtener asistencias por día
  async getAsistenciasPorDia(fecha) {
    const fechaInicio = `${fecha}T00:00:00.000Z`;
    const fechaFin = `${fecha}T23:59:59.999Z`;

    return this.getAll({
      filter: `fecha_hora_entrada>="${fechaInicio}" && fecha_hora_entrada<="${fechaFin}"`,
      expand: "socio,clase",
      sort: "fecha_hora_entrada",
    });
  }
}

// Servicio para la gestión de clases
export class ClasesService extends PocketBaseService {
  constructor() {
    super("clases");
  }

  // Método para obtener clases por día de la semana
  async getClasesPorDia(diaSemana) {
    return this.getAll({
      filter: `dia_semana="${diaSemana}"`,
      sort: "hora_inicio",
    });
  }

  // Método para obtener clases de un instructor específico
  async getClasesPorInstructor(nombreInstructor) {
    return this.getAll({
      filter: `instructor~"${nombreInstructor}"`,
      sort: "dia_semana,hora_inicio",
    });
  }

  // Método para obtener clases activas
  async getClasesActivas() {
    return this.getAll({
      filter: "activa=true",
      sort: "dia_semana,hora_inicio",
    });
  }
}

// Servicio para la gestión de reservas de clases
export class ReservasClaseService extends PocketBaseService {
  constructor() {
    super("reservas_clase");
  }

  // Método para crear una reserva
  async crearReserva(socioId, claseId, fecha) {
    const data = {
      socio: socioId,
      clase: claseId,
      fecha: fecha,
      estado: "Confirmada",
      creado_en: new Date().toISOString(),
    };

    return this.create(data);
  }

  // Método para cancelar una reserva
  async cancelarReserva(reservaId) {
    return this.update(reservaId, {
      estado: "Cancelada",
    });
  }

  // Método para marcar asistencia
  async marcarAsistencia(reservaId) {
    return this.update(reservaId, {
      estado: "Asistió",
    });
  }

  // Método para obtener reservas de un socio
  async getReservasBySocio(socioId) {
    return this.getAll({
      filter: `socio="${socioId}"`,
      sort: "fecha desc",
      expand: "clase,socio",
    });
  }

  // Método para obtener reservas para una clase específica en una fecha
  async getReservasPorClaseYFecha(claseId, fecha) {
    return this.getAll({
      filter: `clase="${claseId}" && fecha="${fecha}"`,
      expand: "socio",
      sort: "creado_en",
    });
  }
}

// Servicio para la gestión de membresías
export class MembresiasService extends PocketBaseService {
  constructor() {
    super("membresias");
  }

  // Método para obtener membresías activas
  async getMembresiasActivas() {
    return this.getAll({
      filter: "activa=true",
      sort: "precio",
    });
  }

  // Método para calcular fecha de vencimiento basada en una membresía
  calcularFechaVencimiento(fechaInicio, duracionDias) {
    const fecha = new Date(fechaInicio);
    fecha.setDate(fecha.getDate() + parseInt(duracionDias));
    return fecha.toISOString().split("T")[0];
  }
}
