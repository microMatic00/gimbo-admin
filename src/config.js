// Configuración global de la aplicación

// Información básica
export const APP_NAME = "Gimbo Admin";
export const APP_VERSION = "1.0.0";
export const APP_DESCRIPTION = "Sistema de administración para gimnasios";

// API (simulada)
export const API_BASE_URL = "https://api.gimbo.ejemplo.com";

// Funciones de utilidad

/**
 * Formatea una fecha a formato local
 * @param {string|Date} date - Fecha a formatear
 * @param {object} options - Opciones de formato
 * @returns {string} Fecha formateada
 */
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };

  const dateObj = date instanceof Date ? date : new Date(date);

  if (isNaN(dateObj)) {
    return "Fecha inválida";
  }

  return dateObj.toLocaleDateString("es-ES", { ...defaultOptions, ...options });
};

/**
 * Formatea un valor monetario
 * @param {number} amount - Cantidad a formatear
 * @param {string} currency - Código de moneda (default: ARS)
 * @returns {string} Cantidad formateada
 */
export const formatCurrency = (amount, currency = "ARS") => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

/**
 * Calcula el estado de una membresía
 * @param {string} endDate - Fecha de finalización de la membresía
 * @returns {object} Información sobre el estado
 */
export const getMembershipStatus = (endDate) => {
  const end = new Date(endDate);
  const today = new Date();
  const diffTime = end - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { status: "Vencido", color: "danger" };
  } else if (diffDays <= 7) {
    return { status: "Próximo a vencer", color: "warning" };
  } else {
    return { status: "Activo", color: "success" };
  }
};

/**
 * Genera un ID único
 * @returns {string} ID único
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

// Configuración de notificaciones
export const NOTIFICATION_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
};

// Roles de usuario
export const USER_ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  TRAINER: "trainer",
  RECEPTIONIST: "receptionist",
};

// Rutas principales
export const ROUTES = {
  DASHBOARD: "/",
  SOCIOS: "/socios",
  PAGOS: "/pagos",
  ASISTENCIA: "/asistencia",
  REPORTES: "/reportes",
  CLASES: "/clases",
  INVENTARIO: "/inventario",
  STAFF: "/staff",
  CLIENTE_APP: "/cliente-app",
};
