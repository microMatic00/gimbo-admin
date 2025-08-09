import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

// Importación de páginas
import Dashboard from "./pages/Dashboard";
import Socios from "./pages/Socios";
import Pagos from "./pages/Pagos";
import Asistencia from "./pages/Asistencia";
import Reportes from "./pages/Reportes";
import Clases from "./pages/Clases";
import Inventario from "./pages/Inventario";
import Staff from "./pages/Staff";
import ClienteApp from "./pages/ClienteApp";

import "./App.css";

function App() {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-dark">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-dark pt-16 lg:pt-0 lg:pl-64">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/socios" element={<Socios />} />
            <Route path="/pagos" element={<Pagos />} />
            <Route path="/asistencia" element={<Asistencia />} />
            <Route path="/reportes" element={<Reportes />} />
            <Route path="/clases" element={<Clases />} />
            <Route path="/inventario" element={<Inventario />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/cliente-app" element={<ClienteApp />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
