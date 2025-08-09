import React, { useState } from "react";
import Table from "../components/Table";
import ModalForm from "../components/ModalForm";
import { asistencias, socios } from "../data/mockData";
import {
  UserPlusIcon,
  ChartBarIcon,
  DocumentArrowDownIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Asistencia = () => {
  const [asistenciasList, setAsistenciasList] = useState(asistencias);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("registro"); // registro, estadisticas

  // Columnas para la tabla
  const columns = [
    {
      key: "socioId",
      header: "Socio",
      render: (item) => {
        const socio = socios.find((s) => s.id === item.socioId);
        return socio ? socio.nombre : "Desconocido";
      },
    },
    {
      key: "fecha",
      header: "Fecha",
      render: (item) => formatDate(item.fecha),
    },
    { key: "hora", header: "Hora" },
  ];

  // Formato de fecha
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  // Datos para estadísticas
  const asistenciaPorDia = [
    { dia: "Lunes", cantidad: 38 },
    { dia: "Martes", cantidad: 45 },
    { dia: "Miércoles", cantidad: 52 },
    { dia: "Jueves", cantidad: 49 },
    { dia: "Viernes", cantidad: 58 },
    { dia: "Sábado", cantidad: 32 },
    { dia: "Domingo", cantidad: 15 },
  ];

  const asistenciaPorHora = [
    { horario: "06:00 - 08:00", cantidad: 24 },
    { horario: "08:00 - 10:00", cantidad: 18 },
    { horario: "10:00 - 12:00", cantidad: 12 },
    { horario: "12:00 - 14:00", cantidad: 15 },
    { horario: "14:00 - 16:00", cantidad: 10 },
    { horario: "16:00 - 18:00", cantidad: 22 },
    { horario: "18:00 - 20:00", cantidad: 35 },
    { horario: "20:00 - 22:00", cantidad: 28 },
  ];

  // Abrir el modal para registrar nueva asistencia
  const handleAddNew = () => {
    setIsModalOpen(true);
  };

  // Mostrar el modal de QR
  const handleShowQR = () => {
    setIsQRModalOpen(true);
  };

  // Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const asistenciaData = {
      id: asistenciasList.length + 1,
      socioId: parseInt(formData.get("socioId")),
      fecha: formData.get("fecha"),
      hora: formData.get("hora"),
    };

    // Agregar nueva asistencia
    setAsistenciasList([...asistenciasList, asistenciaData]);
    setIsModalOpen(false);
  };

  // Manejar la generación de reporte
  const handleGenerateReport = () => {
    // En una implementación real, esto generaría un PDF o Excel
    alert("Generando reporte de asistencias...");
  };

  // Renderizar la tabla según la pestaña activa
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "registro":
        return (
          <>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <h2 className="text-lg font-semibold">Registro de Asistencias</h2>
              <div className="flex space-x-2 mt-2 md:mt-0">
                <button
                  onClick={handleAddNew}
                  className="btn btn-primary flex items-center"
                >
                  <UserPlusIcon className="h-5 w-5 mr-2" />
                  Registrar Asistencia
                </button>
                <button
                  onClick={handleShowQR}
                  className="btn btn-secondary flex items-center"
                >
                  <QrCodeIcon className="h-5 w-5 mr-2" />
                  Mostrar QR
                </button>
                <button
                  onClick={handleGenerateReport}
                  className="btn btn-outline flex items-center"
                >
                  <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                  Exportar
                </button>
              </div>
            </div>
            <Table
              columns={columns}
              data={asistenciasList}
              onEdit={() => {}} // No es necesario editar asistencias
              onDelete={() => {}} // No es necesario eliminar asistencias
            />
          </>
        );
      case "estadisticas":
        return (
          <>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <h2 className="text-lg font-semibold">
                Estadísticas de Asistencia
              </h2>
              <button
                onClick={handleGenerateReport}
                className="btn btn-outline flex items-center mt-2 md:mt-0"
              >
                <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                Exportar
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Asistencia por Día */}
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-md font-semibold mb-4">
                  Asistencia por Día de la Semana
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={asistenciaPorDia}
                      margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="dia" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="cantidad" fill="#FF5A1F" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Asistencia por Franja Horaria */}
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-md font-semibold mb-4">
                  Asistencia por Franja Horaria
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={asistenciaPorHora}
                      margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="horario" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="cantidad" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Resumen de datos adicionales */}
              <div className="bg-white p-4 rounded-lg shadow-sm lg:col-span-2">
                <h3 className="text-md font-semibold mb-4">Resumen del Mes</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-gray-500">Total Asistencias</p>
                    <p className="text-xl font-bold">289</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-gray-500">Promedio Diario</p>
                    <p className="text-xl font-bold">42</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-gray-500">Día más concurrido</p>
                    <p className="text-xl font-bold">Viernes</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-gray-500">Horario Pico</p>
                    <p className="text-xl font-bold">18:00 - 20:00</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Control de Asistencia
        </h1>
      </div>

      {/* Resumen de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Hoy</h3>
          <p className="text-2xl font-bold">24 asistencias</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Esta Semana</h3>
          <p className="text-2xl font-bold">156 asistencias</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Este Mes</h3>
          <p className="text-2xl font-bold">642 asistencias</p>
        </div>
      </div>

      {/* Tabs de navegación */}
      <div className="mb-4 border-b border-gray-200">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <button
              className={`inline-block p-4 ${
                activeTab === "registro"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("registro")}
            >
              Registro de Asistencias
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block p-4 ${
                activeTab === "estadisticas"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("estadisticas")}
            >
              Estadísticas
            </button>
          </li>
        </ul>
      </div>

      {/* Contenido de la pestaña activa */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        {renderActiveTabContent()}
      </div>

      {/* Modal para registrar asistencia */}
      <ModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Registrar Asistencia"
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label
              htmlFor="socioId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Socio
            </label>
            <select id="socioId" name="socioId" className="form-input" required>
              <option value="">Seleccionar Socio</option>
              {socios.map((socio) => (
                <option key={socio.id} value={socio.id}>
                  {socio.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="fecha"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Fecha
            </label>
            <input
              id="fecha"
              name="fecha"
              type="date"
              className="form-input"
              defaultValue={new Date().toISOString().split("T")[0]}
              required
            />
          </div>
          <div>
            <label
              htmlFor="hora"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Hora
            </label>
            <input
              id="hora"
              name="hora"
              type="time"
              className="form-input"
              defaultValue={new Date().toTimeString().slice(0, 5)}
              required
            />
          </div>
        </div>
      </ModalForm>

      {/* Modal para mostrar código QR */}
      <ModalForm
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        title="Código QR para Registro de Asistencia"
        onSubmit={(e) => {
          e.preventDefault();
          setIsQRModalOpen(false);
        }}
        submitButtonText="Cerrar"
      >
        <div className="flex flex-col items-center">
          <div className="bg-gray-200 p-4 rounded-lg mb-4 text-center">
            {/* En una implementación real, aquí iría un componente que genera un QR */}
            <div className="w-64 h-64 mx-auto bg-white p-4 flex items-center justify-center">
              <QrCodeIcon className="h-48 w-48 text-dark" />
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Escanear para registrar asistencia
            </p>
          </div>
          <p className="text-center text-sm text-gray-600">
            Los socios pueden escanear este código QR con la app móvil para
            registrar su asistencia automáticamente.
          </p>
        </div>
      </ModalForm>
    </div>
  );
};

export default Asistencia;
