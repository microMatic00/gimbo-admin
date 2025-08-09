import React, { useState } from "react";
import Table from "../components/Table";
import ModalForm from "../components/ModalForm";
import { socios } from "../data/mockData";
import { UserPlusIcon } from "@heroicons/react/24/outline";

const Socios = () => {
  const [sociosList, setSociosList] = useState(socios);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSocio, setCurrentSocio] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [socioToDelete, setSocioToDelete] = useState(null);

  // Columnas para la tabla
  const columns = [
    { key: "nombre", header: "Nombre" },
    { key: "dni", header: "DNI" },
    { key: "email", header: "Email" },
    { key: "telefono", header: "Teléfono" },
    {
      key: "planActivo",
      header: "Plan",
    },
    {
      key: "estado",
      header: "Estado",
      render: (item) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.estado === "Activo"
              ? "bg-green-100 text-green-800"
              : item.estado === "Vencido"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {item.estado}
        </span>
      ),
    },
    {
      key: "ultimaAsistencia",
      header: "Última Asistencia",
      render: (item) => formatDate(item.ultimaAsistencia),
    },
  ];

  // Formato de fecha
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  // Abrir el modal para crear un nuevo socio
  const handleAddNew = () => {
    setCurrentSocio(null);
    setIsModalOpen(true);
  };

  // Abrir el modal para editar un socio
  const handleEdit = (socio) => {
    setCurrentSocio(socio);
    setIsModalOpen(true);
  };

  // Abrir el modal de confirmación para eliminar un socio
  const handleDelete = (socio) => {
    setSocioToDelete(socio);
    setIsDeleteModalOpen(true);
  };

  // Confirmar la eliminación del socio
  const confirmDelete = () => {
    setSociosList(sociosList.filter((socio) => socio.id !== socioToDelete.id));
    setIsDeleteModalOpen(false);
  };

  // Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const socioData = {
      id: currentSocio?.id || sociosList.length + 1,
      nombre: formData.get("nombre"),
      dni: formData.get("dni"),
      email: formData.get("email"),
      telefono: formData.get("telefono"),
      fechaRegistro:
        formData.get("fechaRegistro") || new Date().toISOString().split("T")[0],
      planActivo: formData.get("planActivo"),
      estado: formData.get("estado"),
      ultimaAsistencia: currentSocio?.ultimaAsistencia || null,
    };

    if (currentSocio) {
      // Actualizar socio existente
      setSociosList(
        sociosList.map((socio) =>
          socio.id === currentSocio.id ? socioData : socio
        )
      );
    } else {
      // Agregar nuevo socio
      setSociosList([...sociosList, socioData]);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Socios</h1>
        <button
          onClick={handleAddNew}
          className="btn btn-primary mt-4 md:mt-0 flex items-center"
        >
          <UserPlusIcon className="h-5 w-5 mr-2" />
          Nuevo Socio
        </button>
      </div>

      {/* Resumen de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Socios</h3>
          <p className="text-2xl font-bold">{sociosList.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Socios Activos</h3>
          <p className="text-2xl font-bold">
            {sociosList.filter((s) => s.estado === "Activo").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">
            Próximos a Vencer
          </h3>
          <p className="text-2xl font-bold">
            {sociosList.filter((s) => s.estado === "Próximo a vencer").length}
          </p>
        </div>
      </div>

      {/* Tabla de socios */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <Table
          columns={columns}
          data={sociosList}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Modal para crear/editar socio */}
      <ModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentSocio ? "Editar Socio" : "Nuevo Socio"}
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="nombre"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nombre Completo
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              className="form-input"
              defaultValue={currentSocio?.nombre || ""}
              required
            />
          </div>
          <div>
            <label
              htmlFor="dni"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              DNI
            </label>
            <input
              id="dni"
              name="dni"
              type="text"
              className="form-input"
              defaultValue={currentSocio?.dni || ""}
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-input"
              defaultValue={currentSocio?.email || ""}
              required
            />
          </div>
          <div>
            <label
              htmlFor="telefono"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Teléfono
            </label>
            <input
              id="telefono"
              name="telefono"
              type="text"
              className="form-input"
              defaultValue={currentSocio?.telefono || ""}
              required
            />
          </div>
          <div>
            <label
              htmlFor="fechaRegistro"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Fecha Registro
            </label>
            <input
              id="fechaRegistro"
              name="fechaRegistro"
              type="date"
              className="form-input"
              defaultValue={
                currentSocio?.fechaRegistro ||
                new Date().toISOString().split("T")[0]
              }
              required
            />
          </div>
          <div>
            <label
              htmlFor="planActivo"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Plan Activo
            </label>
            <select
              id="planActivo"
              name="planActivo"
              className="form-input"
              defaultValue={currentSocio?.planActivo || ""}
              required
            >
              <option value="">Seleccionar Plan</option>
              <option value="Mensual Básico">Mensual Básico</option>
              <option value="Mensual Premium">Mensual Premium</option>
              <option value="Trimestral Básico">Trimestral Básico</option>
              <option value="Trimestral Premium">Trimestral Premium</option>
              <option value="Semestral Básico">Semestral Básico</option>
              <option value="Semestral Premium">Semestral Premium</option>
              <option value="Anual Full">Anual Full</option>
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
              defaultValue={currentSocio?.estado || "Activo"}
              required
            >
              <option value="Activo">Activo</option>
              <option value="Vencido">Vencido</option>
              <option value="Próximo a vencer">Próximo a vencer</option>
            </select>
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
          ¿Está seguro de que desea eliminar al socio{" "}
          <span className="font-medium">{socioToDelete?.nombre}</span>?
        </p>
        <p className="text-sm text-red-600">
          Esta acción no se puede deshacer.
        </p>
      </ModalForm>
    </div>
  );
};

export default Socios;
