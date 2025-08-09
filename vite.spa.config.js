// Este archivo garantiza que todas las rutas del SPA funcionen en desarrollo local
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "",
  server: {
    port: 5173,
    strictPort: false,
    open: true,
  },
});
