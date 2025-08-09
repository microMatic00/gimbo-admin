import React, { useState } from "react";
import Table from "../components/Table";
import Card from "../components/Card";
import ModalForm from "../components/ModalForm";
import { staff, horarios } from "../data/mockData";
import {
  UserIcon,
  UserPlusIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

const Staff = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [showModal, setShowModal] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);

  // Columnas para la tabla de personal
  const columnasPersonal = [
    { header: "ID", accessor: "id" },
    { header: "Nombre", accessor: "nombre" },
    { header: "Rol", accessor: "rol" },
    { header: "Email", accessor: "email" },
    { header: "Teléfono", accessor: "telefono" },
    { header: "Fecha Contratación", accessor: "fechaContratacion" },
    {
      header: "Estado",
      accessor: "estado",
      cell: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === "Activo"
              ? "bg-green-100 text-green-800"
              : value === "De Vacaciones"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  // Columnas para la tabla de horarios
  const columnasHorarios = [
    { header: "ID", accessor: "id" },
    { header: "Empleado", accessor: "empleado" },
    { header: "Día", accessor: "dia" },
    { header: "Hora Inicio", accessor: "horaInicio" },
    { header: "Hora Fin", accessor: "horaFin" },
    { header: "Área", accessor: "area" },
  ];

  // Campos para el formulario de staff
  const camposFormulario = [
    { name: "nombre", label: "Nombre Completo", type: "text", required: true },
    {
      name: "rol",
      label: "Rol",
      type: "select",
      options: [
        "Entrenador",
        "Recepcionista",
        "Limpieza",
        "Administrativo",
        "Nutricionista",
      ],
      required: true,
    },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "telefono", label: "Teléfono", type: "tel", required: true },
    {
      name: "fechaContratacion",
      label: "Fecha de Contratación",
      type: "date",
      required: true,
    },
    { name: "direccion", label: "Dirección", type: "text" },
    {
      name: "estado",
      label: "Estado",
      type: "select",
      options: ["Activo", "De Vacaciones", "Inactivo"],
      required: true,
    },
    { name: "observaciones", label: "Observaciones", type: "textarea" },
  ];

  // Función para manejar la edición de un miembro del staff
  const handleEdit = (staffMember) => {
    setCurrentStaff(staffMember);
    setShowModal(true);
  };

  // Función para manejar la eliminación de un miembro del staff
  const handleDelete = (id) => {
    console.log(`Eliminar miembro con ID: ${id}`);
    // Aquí iría la lógica para eliminar un miembro del staff
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (formData) => {
    if (currentStaff) {
      console.log("Staff editado:", formData);
    } else {
      console.log("Nuevo staff:", formData);
    }
    setShowModal(false);
    setCurrentStaff(null);
  };

  // Estadísticas para las tarjetas
  const estadisticas = [
    {
      titulo: "Total Personal",
      valor: staff.length,
      icono: <UserIcon className="h-8 w-8" />,
      color: "primary",
    },
    {
      titulo: "Entrenadores",
      valor: staff.filter((s) => s.rol === "Entrenador").length,
      icono: <UserIcon className="h-8 w-8" />,
      color: "success",
    },
    {
      titulo: "Horarios Semanales",
      valor: horarios.length,
      icono: <CalendarIcon className="h-8 w-8" />,
      color: "info",
    },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark dark:text-light mb-2">
          Staff
        </h1>
        <p className="text-dark-light dark:text-light-darker">
          Gestiona el personal y los horarios del gimnasio.
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {estadisticas.map((stat, index) => (
          <Card
            key={index}
            title={stat.titulo}
            value={stat.valor}
            icon={stat.icono}
            color={stat.color}
          />
        ))}
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <button
              className={`inline-block p-4 rounded-t-lg ${
                activeTab === "personal"
                  ? "text-primary border-b-2 border-primary"
                  : "hover:text-primary hover:border-primary"
              }`}
              onClick={() => setActiveTab("personal")}
            >
              Personal
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block p-4 rounded-t-lg ${
                activeTab === "horarios"
                  ? "text-primary border-b-2 border-primary"
                  : "hover:text-primary hover:border-primary"
              }`}
              onClick={() => setActiveTab("horarios")}
            >
              Horarios
            </button>
          </li>
        </ul>
      </div>

      {/* Contenido según tab activo */}
      <div className="bg-white dark:bg-dark-light shadow-md rounded-lg overflow-hidden">
        <div className="p-4 flex justify-between items-center border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold">
            {activeTab === "personal"
              ? "Listado de Personal"
              : "Horarios de Trabajo"}
          </h2>
          {activeTab === "personal" && (
            <button
              onClick={() => {
                setCurrentStaff(null);
                setShowModal(true);
              }}
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center"
            >
              <UserPlusIcon className="h-5 w-5 mr-2" />
              Nuevo Personal
            </button>
          )}
        </div>

        {/* Tabla de datos */}
        {activeTab === "personal" ? (
          <Table
            data={staff}
            columns={columnasPersonal}
            onEdit={handleEdit}
            onDelete={handleDelete}
            searchable={true}
            pagination={true}
          />
        ) : (
          <Table
            data={horarios}
            columns={columnasHorarios}
            searchable={true}
            pagination={true}
          />
        )}
      </div>

      {/* Modal para crear/editar personal */}
      <ModalForm
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setCurrentStaff(null);
        }}
        title={currentStaff ? "Editar Personal" : "Nuevo Personal"}
        fields={camposFormulario}
        initialValues={currentStaff || {}}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Staff;
