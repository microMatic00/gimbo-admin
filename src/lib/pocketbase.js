import PocketBase from 'pocketbase';

// Creación de la instancia de PocketBase
// URL configurada para usar la instalación existente de PocketBase
// Ajusta esta URL si tu instancia está en otra dirección
export const pb = new PocketBase('http://127.0.0.1:8090');

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
