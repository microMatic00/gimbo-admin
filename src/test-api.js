// Archivo temporal para probar las llamadas a la API

import pb from "./lib/pocketbase.js";
import { ClasesService } from "./services/gimnasio-services.js";

// Función de prueba para verificar la conexión
export const testApiConnection = async () => {
  console.log("🧪 === PRUEBA DE CONEXIÓN API ===");
  console.log("📡 PocketBase URL:", pb.baseUrl);
  console.log("🔑 Auth Store válido:", pb.authStore.isValid);
  console.log("👤 Usuario autenticado:", pb.authStore.model);

  try {
    // Prueba 1: Verificar que el servidor responde
    console.log("🔍 Probando conexión básica...");
    const healthCheck = await fetch(pb.baseUrl + "/api/health");
    console.log("💓 Health check status:", healthCheck.status);

    // Prueba 2: Listar colecciones (requiere auth)
    console.log("📋 Probando listado de colecciones...");
    const collections = await pb.collections.getList(1, 10);
    console.log(
      "📚 Colecciones encontradas:",
      collections.items.map((c) => c.name)
    );

    // Prueba 3: Intentar obtener clases directamente
    console.log("🏃‍♀️ Probando obtener clases directamente...");
    const clasesDirecto = await pb.collection("clases").getList(1, 10);
    console.log("✅ Clases (directo):", clasesDirecto);

    // Prueba 4: Usar el servicio
    console.log("🛠️ Probando con el servicio ClasesService...");
    const clasesService = new ClasesService();
    const clasesServicio = await clasesService.getAll();
    console.log("✅ Clases (servicio):", clasesServicio);
  } catch (error) {
    console.error("❌ Error en las pruebas:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
};

// Función para probar solo si hay autenticación
export const testWithAuth = async () => {
  if (!pb.authStore.isValid) {
    console.log("⚠️ Usuario no autenticado - omitiendo pruebas");
    return;
  }

  await testApiConnection();
};
