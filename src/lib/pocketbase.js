import PocketBase from "pocketbase";
import { POCKETBASE_URL as CONFIG_PB_URL } from "../config";

// Determinar la URL de PocketBase siguiendo el orden:
// 1. Variable de entorno Vite: import.meta.env.VITE_POCKETBASE_URL
// 2. Valor en src/config.js -> POCKETBASE_URL
// 3. Fallback a localhost
const PB_URL =
  import.meta.env && import.meta.env.VITE_POCKETBASE_URL
    ? import.meta.env.VITE_POCKETBASE_URL
    : CONFIG_PB_URL || "http://127.0.0.1:8090";

// Creación de la instancia de PocketBase
export const pb = new PocketBase(PB_URL);

// Función para verificar si el usuario está autenticado
export const isAuthenticated = () => {
  return pb.authStore.isValid;
};

// Función para obtener el usuario actual
export const getCurrentUser = () => {
  return pb.authStore.model;
};

// Exportar la instancia para usarla en toda la aplicación
export default pb;
