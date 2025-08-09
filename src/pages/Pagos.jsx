import React, { useState } from "react";
import Table from "../components/Table";
import ModalForm from "../components/ModalForm";
import { pagos, socios, planes } from "../data/mockData";
import {
  CurrencyDollarIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";

const Pagos = () => {
  const [pagosList, setPagosList] = useState(pagos);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPago, setCurrentPago] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [pagoToDelete, setPagoToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState("pagos"); // pagos, planes, vencimientos

  // Columnas para la tabla de pagos
  const pagoColumns = [
    {
      key: "socioId",
      header: "Socio",
      render: (item) => {
        const socio = socios.find((s) => s.id === item.socioId);
        return socio ? socio.nombre : "Desconocido";
      },
    },
    {
      key: "planId",
      header: "Plan",
      render: (item) => {
        const plan = planes.find((p) => p.id === item.planId);
        return plan ? plan.nombre : "Desconocido";
      },
    },
    {
      key: "monto",
      header: "Monto",
      render: (item) => `$${item.monto.toLocaleString()}`,
    },
    {
      key: "fecha",
      header: "Fecha",
      render: (item) => formatDate(item.fecha),
    },
    { key: "metodo", header: "Método de Pago" },
    {
      key: "estado",
      header: "Estado",
      render: (item) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.estado === "Completado"
              ? "bg-green-100 text-green-800"
              : item.estado === "Pendiente"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {item.estado}
        </span>
      ),
    },
    { key: "comprobante", header: "Comprobante" },
  ];

  // Columnas para la tabla de planes
  const planesColumns = [
    { key: "nombre", header: "Nombre" },
    {
      key: "precio",
      header: "Precio",
      render: (item) => `$${item.precio.toLocaleString()}`,
    },
    { key: "duracion", header: "Duración" },
    { key: "descripcion", header: "Descripción" },
    {
      key: "activo",
      header: "Estado",
      render: (item) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.activo
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {item.activo ? "Activo" : "Inactivo"}
        </span>
      ),
    },
  ];

  // Datos de vencimientos (mock)
  const vencimientos = socios
    .filter(
      (socio) =>
        socio.estado === "Próximo a vencer" || socio.estado === "Vencido"
    )
    .map((socio) => ({
      id: socio.id,
      nombre: socio.nombre,
      plan: socio.planActivo,
      estado: socio.estado,
      fechaVencimiento:
        socio.estado === "Vencido" ? "2025-07-31" : "2025-08-15",
      diasRestantes: socio.estado === "Vencido" ? -9 : 6,
    }));

  // Columnas para la tabla de vencimientos
  const vencimientosColumns = [
    { key: "nombre", header: "Socio" },
    { key: "plan", header: "Plan" },
    {
      key: "fechaVencimiento",
      header: "Fecha de Vencimiento",
      render: (item) => formatDate(item.fechaVencimiento),
    },
    {
      key: "diasRestantes",
      header: "Estado",
      render: (item) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.diasRestantes < 0
              ? "bg-red-100 text-red-800"
              : item.diasRestantes <= 7
              ? "bg-yellow-100 text-yellow-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {item.diasRestantes < 0
            ? `Vencido hace ${Math.abs(item.diasRestantes)} días`
            : `${item.diasRestantes} días restantes`}
        </span>
      ),
    },
  ];

  // Formato de fecha
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  // Abrir el modal para crear un nuevo pago
  const handleAddNew = () => {
    setCurrentPago(null);
    setIsModalOpen(true);
  };

  // Abrir el modal para editar un pago
  const handleEdit = (pago) => {
    setCurrentPago(pago);
    setIsModalOpen(true);
  };

  // Abrir el modal de confirmación para eliminar un pago
  const handleDelete = (pago) => {
    setPagoToDelete(pago);
    setIsDeleteModalOpen(true);
  };

  // Confirmar la eliminación del pago
  const confirmDelete = () => {
    setPagosList(pagosList.filter((pago) => pago.id !== pagoToDelete.id));
    setIsDeleteModalOpen(false);
  };

  // Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const pagoData = {
      id: currentPago?.id || pagosList.length + 1,
      socioId: parseInt(formData.get("socioId")),
      planId: parseInt(formData.get("planId")),
      monto: parseFloat(formData.get("monto")),
      fecha: formData.get("fecha"),
      metodo: formData.get("metodo"),
      estado: formData.get("estado"),
      comprobante: formData.get("comprobante"),
    };

    if (currentPago) {
      // Actualizar pago existente
      setPagosList(
        pagosList.map((pago) => (pago.id === currentPago.id ? pagoData : pago))
      );
    } else {
      // Agregar nuevo pago
      setPagosList([...pagosList, pagoData]);
    }

    setIsModalOpen(false);
  };

  // Manejar la generación de reporte
  const handleGenerateReport = () => {
    // En una implementación real, esto generaría un PDF o Excel
    alert("Generando reporte de pagos...");
  };

  // Renderizar la tabla según la pestaña activa
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "pagos":
        return (
          <>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <h2 className="text-lg font-semibold">Registro de Pagos</h2>
              <div className="flex space-x-2 mt-2 md:mt-0">
                <button
                  onClick={handleAddNew}
                  className="btn btn-primary flex items-center"
                >
                  <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                  Nuevo Pago
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
              columns={pagoColumns}
              data={pagosList}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </>
        );
      case "planes":
        return (
          <>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <h2 className="text-lg font-semibold">Gestión de Planes</h2>
              <button className="btn btn-primary mt-2 md:mt-0">
                Nuevo Plan
              </button>
            </div>
            <Table
              columns={planesColumns}
              data={planes}
              onEdit={() => {}} // En una implementación completa, esto abriría un modal
              onDelete={() => {}}
            />
          </>
        );
      case "vencimientos":
        return (
          <>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <h2 className="text-lg font-semibold">Control de Vencimientos</h2>
              <button
                onClick={handleGenerateReport}
                className="btn btn-outline flex items-center mt-2 md:mt-0"
              >
                <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                Exportar
              </button>
            </div>
            <Table
              columns={vencimientosColumns}
              data={vencimientos}
              onEdit={() => {}} // En vez de editar, podría renovar
              onDelete={() => {}}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Pagos</h1>
      </div>

      {/* Resumen de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">
            Ingresos del Mes
          </h3>
          <p className="text-2xl font-bold">$185,000</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">
            Pagos Registrados
          </h3>
          <p className="text-2xl font-bold">{pagosList.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Planes Vencidos</h3>
          <p className="text-2xl font-bold">
            {vencimientos.filter((v) => v.diasRestantes < 0).length}
          </p>
        </div>
      </div>

      {/* Tabs de navegación */}
      <div className="mb-4 border-b border-gray-200">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <button
              className={`inline-block p-4 ${
                activeTab === "pagos"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("pagos")}
            >
              Registro de Pagos
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block p-4 ${
                activeTab === "planes"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("planes")}
            >
              Gestión de Planes
            </button>
          </li>
          <li>
            <button
              className={`inline-block p-4 ${
                activeTab === "vencimientos"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("vencimientos")}
            >
              Control de Vencimientos
            </button>
          </li>
        </ul>
      </div>

      {/* Contenido de la pestaña activa */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        {renderActiveTabContent()}
      </div>

      {/* Modal para crear/editar pago */}
      <ModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentPago ? "Editar Pago" : "Nuevo Pago"}
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="socioId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Socio
            </label>
            <select
              id="socioId"
              name="socioId"
              className="form-input"
              defaultValue={currentPago?.socioId || ""}
              required
            >
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
              htmlFor="planId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Plan
            </label>
            <select
              id="planId"
              name="planId"
              className="form-input"
              defaultValue={currentPago?.planId || ""}
              required
            >
              <option value="">Seleccionar Plan</option>
              {planes.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.nombre} - ${plan.precio}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="monto"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Monto
            </label>
            <input
              id="monto"
              name="monto"
              type="number"
              step="0.01"
              className="form-input"
              defaultValue={currentPago?.monto || ""}
              required
            />
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
              defaultValue={
                currentPago?.fecha || new Date().toISOString().split("T")[0]
              }
              required
            />
          </div>
          <div>
            <label
              htmlFor="metodo"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Método de Pago
            </label>
            <select
              id="metodo"
              name="metodo"
              className="form-input"
              defaultValue={currentPago?.metodo || ""}
              required
            >
              <option value="">Seleccionar Método</option>
              <option value="Efectivo">Efectivo</option>
              <option value="Tarjeta de crédito">Tarjeta de Crédito</option>
              <option value="Tarjeta de débito">Tarjeta de Débito</option>
              <option value="Transferencia bancaria">
                Transferencia Bancaria
              </option>
            </select>
          </div>
          <div>
            <label
              htmlFor="estado"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Estado
            </label>
            <select
              id="estado"
              name="estado"
              className="form-input"
              defaultValue={currentPago?.estado || "Completado"}
              required
            >
              <option value="Completado">Completado</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="comprobante"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nº Comprobante
            </label>
            <input
              id="comprobante"
              name="comprobante"
              type="text"
              className="form-input"
              defaultValue={
                currentPago?.comprobante ||
                `FACT-2025-${(pagosList.length + 1)
                  .toString()
                  .padStart(4, "0")}`
              }
              required
            />
          </div>
        </div>
      </ModalForm>

      {/* Modal de confirmación para eliminar */}
      <ModalForm
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmar Eliminación"
        onSubmit={confirmDelete}
        submitButtonText="Eliminar"
        size="sm"
      >
        <p className="mb-4">
          ¿Está seguro de que desea eliminar el pago con comprobante{" "}
          <span className="font-medium">{pagoToDelete?.comprobante}</span>?
        </p>
        <p className="text-sm text-red-600">
          Esta acción no se puede deshacer.
        </p>
      </ModalForm>
    </div>
  );
};

export default Pagos;
