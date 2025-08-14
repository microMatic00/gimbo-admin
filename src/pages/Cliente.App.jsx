import React from "react";
import ClientView from "./pages/ClientView";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Mock data (replace with real data or props)
const user = {
  nombre: "Ana López",
  membresia: "Oro",
  fechaIngreso: "2023-11-10",
  avatar: "/images/avatar-default.png",
  progreso: "Subió 5kg en press banca este mes",
};

const rutina = [
  { dia: "Lunes", ejercicio: "Press banca", sets: 4, reps: 10, peso: "40kg" },
  { dia: "Miércoles", ejercicio: "Sentadillas", sets: 4, reps: 12, peso: "60kg" },
  { dia: "Viernes", ejercicio: "Peso muerto", sets: 4, reps: 8, peso: "70kg" },
];

const pago = {
  estado: "Al día", // "Pendiente de pago", "Deuda"
  ultimoPago: "2025-07-30",
  proximoVencimiento: "2025-08-30",
  monto: "$45",
};

const ClientViewPage = () => (
  <div className="flex min-h-screen">
    <div className="sidebar relative bg-white w-64 h-full shadow-md">
      {/* Sidebar content */}
    </div>
    <main className="flex-1">
      <div className="p-4 md:p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Mi Perfil</h1>

        {/* Perfil */}
        <div className="flex items-center gap-6 mb-6">
          <img
            src={user.avatar}
            alt="Avatar"
            className="w-20 h-20 rounded-full border-2 border-gray-200 object-cover"
          />
          <div>
            <h2 className="text-xl font-semibold">{user.nombre}</h2>
            <p className="text-gray-500">Membresía: {user.membresia}</p>
            <p className="text-gray-500">Miembro desde: {user.fechaIngreso}</p>
            <p className="text-green-600 font-medium">{user.progreso}</p>
          </div>
        </div>

        {/* Estado de pago */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">Estado de pago</p>
            <p className={`text-lg font-bold ${
              pago.estado === "Al día"
                ? "text-green-600"
                : pago.estado === "Pendiente de pago"
                ? "text-yellow-600"
                : "text-red-600"
            }`}>{pago.estado}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Último pago</p>
            <p className="text-lg font-bold">{pago.ultimoPago}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Próximo vencimiento</p>
            <p className="text-lg font-bold">{pago.proximoVencimiento}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Monto</p>
            <p className="text-lg font-bold">{pago.monto}</p>
          </div>
        </div>

        {/* Rutina */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h3 className="text-lg font-semibold mb-4">Mi Rutina</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-center">
              <thead>
                <tr>
                  <th className="py-2 px-4">Día</th>
                  <th className="py-2 px-4">Ejercicio</th>
                  <th className="py-2 px-4">Series</th>
                  <th className="py-2 px-4">Reps</th>
                  <th className="py-2 px-4">Peso</th>
                </tr>
              </thead>
              <tbody>
                {rutina.map((item, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="py-2 px-4">{item.dia}</td>
                    <td className="py-2 px-4">{item.ejercicio}</td>
                    <td className="py-2 px-4">{item.sets}</td>
                    <td className="py-2 px-4">{item.reps}</td>
                    <td className="py-2 px-4">{item.peso}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Progreso */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-lg font-semibold mb-2">Historial de progreso</h3>
          <p className="text-gray-600">¡Sigue así! Puedes ver tu progreso mensual aquí pronto.</p>
        </div>
      </div>
    </main>
  </div>
);

const App = () => (
  <Router>
    <Routes>
      <Route path="/cliente" element={<ClientViewPage />} />
      {/* Otras rutas */}
    </Routes>
  </Router>
);

export default App;