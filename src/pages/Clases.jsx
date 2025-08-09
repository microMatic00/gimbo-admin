import React, { useState } from "react";
import ModalForm from "../components/ModalForm";
import Table from "../components/Table";
import { clases, reservas, socios } from "../data/mockData";
import {
  CalendarIcon,
  PlusCircleIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const Clases = () => {
  const [activeTab, setActiveTab] = useState("clases"); // clases, reservas
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentClase, setCurrentClase] = useState(null);
  const [isReservaModalOpen, setIsReservaModalOpen] = useState(false);
  const [selectedClase, setSelectedClase] = useState(null);
  const [clasesList, setClasesList] = useState(clases);
  const [reservasList, setReservasList] = useState(reservas);

  // Columnas para la tabla de clases
  const clasesColumns = [
    { key: "nombre", header: "Nombre" },
    { key: "instructor", header: "Instructor" },
    { key: "dias", header: "Días" },
    { key: "horario", header: "Horario" },
    {
      key: "cupoMaximo",
      header: "Cupo",
      render: (item) => {
        // Calcular las reservas actuales para esta clase
        const reservasDeLaClase = reservasList.filter(
          (r) => r.claseId === item.id
        );
        return `${reservasDeLaClase.length}/${item.cupoMaximo}`;
      },
    },
  ];

  // Columnas para la tabla de reservas
  const reservasColumns = [
    {
      key: "socioId",
      header: "Socio",
      render: (item) => {
        const socio = socios.find((s) => s.id === item.socioId);
        return socio ? socio.nombre : "Desconocido";
      },
    },
    {
      key: "claseId",
      header: "Clase",
      render: (item) => {
        const clase = clases.find((c) => c.id === item.claseId);
        return clase ? clase.nombre : "Desconocida";
      },
    },
    {
      key: "fecha",
      header: "Fecha",
      render: (item) => formatDate(item.fecha),
    },
    {
      key: "asistio",
      header: "Estado",
      render: (item) => {
        if (item.asistio === true) {
          return (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Asistió
            </span>
          );
        } else if (item.asistio === false) {
          return (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              No Asistió
            </span>
          );
        } else {
          return (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Pendiente
            </span>
          );
        }
      },
    },
  ];

  // Formato de fecha
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  // Abrir el modal para crear una nueva clase
  const handleAddNew = () => {
    setCurrentClase(null);
    setIsModalOpen(true);
  };

  // Abrir el modal para editar una clase
  const handleEditClase = (clase) => {
    setCurrentClase(clase);
    setIsModalOpen(true);
  };

  // Abrir el modal para hacer una reserva
  const handleReservar = (clase) => {
    setSelectedClase(clase);
    setIsReservaModalOpen(true);
  };

  // Manejar el envío del formulario de clase
  const handleClaseSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const claseData = {
      id: currentClase?.id || clasesList.length + 1,
      nombre: formData.get("nombre"),
      instructor: formData.get("instructor"),
      dias: formData.get("dias"),
      horario: formData.get("horario"),
      cupoMaximo: parseInt(formData.get("cupoMaximo")),
      descripcion: formData.get("descripcion"),
    };

    if (currentClase) {
      // Actualizar clase existente
      setClasesList(
        clasesList.map((clase) =>
          clase.id === currentClase.id ? claseData : clase
        )
      );
    } else {
      // Agregar nueva clase
      setClasesList([...clasesList, claseData]);
    }

    setIsModalOpen(false);
  };

  // Manejar el envío del formulario de reserva
  const handleReservaSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const reservaData = {
      id: reservasList.length + 1,
      socioId: parseInt(formData.get("socioId")),
      claseId: selectedClase.id,
      fecha: formData.get("fecha"),
      asistio: null,
    };

    // Agregar nueva reserva
    setReservasList([...reservasList, reservaData]);
    setIsReservaModalOpen(false);
  };

  // Manejar la eliminación de una clase
  const handleDeleteClase = (clase) => {
    if (window.confirm(`¿Está seguro de eliminar la clase ${clase.nombre}?`)) {
      setClasesList(clasesList.filter((c) => c.id !== clase.id));
    }
  };

  // Manejar la eliminación de una reserva
  const handleDeleteReserva = (reserva) => {
    if (window.confirm("¿Está seguro de eliminar esta reserva?")) {
      setReservasList(reservasList.filter((r) => r.id !== reserva.id));
    }
  };

  // Renderizar la tabla según la pestaña activa
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "clases":
        return (
          <>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <h2 className="text-lg font-semibold">
                Administración de Clases
              </h2>
              <button
                onClick={handleAddNew}
                className="btn btn-primary mt-2 md:mt-0 flex items-center"
              >
                <PlusCircleIcon className="h-5 w-5 mr-2" />
                Nueva Clase
              </button>
            </div>
            <Table
              columns={clasesColumns}
              data={clasesList}
              onEdit={handleEditClase}
              onDelete={handleDeleteClase}
            />
          </>
        );
      case "reservas":
        return (
          <>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <h2 className="text-lg font-semibold">
                Administración de Reservas
              </h2>
              <button
                onClick={() => setActiveTab("clases")}
                className="btn btn-primary mt-2 md:mt-0 flex items-center"
              >
                <UserGroupIcon className="h-5 w-5 mr-2" />
                Ver Clases para Reservar
              </button>
            </div>
            <Table
              columns={reservasColumns}
              data={reservasList}
              onEdit={() => {}} // No editamos reservas
              onDelete={handleDeleteReserva}
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
        <h1 className="text-2xl font-bold text-gray-800">Agenda de Clases</h1>
      </div>

      {/* Resumen de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-light text-primary mr-4">
              <CalendarIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Total Clases
              </h3>
              <p className="text-xl font-bold">{clasesList.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-secondary-light text-secondary mr-4">
              <UserGroupIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Reservas Activas
              </h3>
              <p className="text-xl font-bold">
                {reservasList.filter((r) => r.asistio === null).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <PlusCircleIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Clase Más Popular
              </h3>
              <p className="text-xl font-bold">Zumba</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs de navegación */}
      <div className="mb-4 border-b border-gray-200">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <button
              className={`inline-block p-4 ${
                activeTab === "clases"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("clases")}
            >
              Clases
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block p-4 ${
                activeTab === "reservas"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("reservas")}
            >
              Reservas
            </button>
          </li>
        </ul>
      </div>

      {/* Vista del Calendario (Calendario visual simple) */}
      {activeTab === "clases" && (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">Calendario Semanal</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2 bg-gray-50">Horario</th>
                  <th className="border p-2 bg-gray-50">Lunes</th>
                  <th className="border p-2 bg-gray-50">Martes</th>
                  <th className="border p-2 bg-gray-50">Miércoles</th>
                  <th className="border p-2 bg-gray-50">Jueves</th>
                  <th className="border p-2 bg-gray-50">Viernes</th>
                  <th className="border p-2 bg-gray-50">Sábado</th>
                  <th className="border p-2 bg-gray-50">Domingo</th>
                </tr>
              </thead>
              <tbody>
                {[
                  "08:00 - 09:00",
                  "09:00 - 10:00",
                  "10:00 - 11:00",
                  "18:00 - 19:00",
                  "19:00 - 20:00",
                ].map((horario, index) => (
                  <tr key={index}>
                    <td className="border p-2 font-medium">{horario}</td>
                    {[
                      "Lunes",
                      "Martes",
                      "Miércoles",
                      "Jueves",
                      "Viernes",
                      "Sábado",
                      "Domingo",
                    ].map((dia, idx) => {
                      // Buscamos si hay clases en este horario y día
                      const clasesEnHorario = clasesList.filter(
                        (c) => c.horario === horario && c.dias.includes(dia)
                      );

                      return (
                        <td key={idx} className="border p-2">
                          {clasesEnHorario.map((clase, i) => (
                            <div
                              key={i}
                              className="p-1 rounded mb-1 text-xs cursor-pointer hover:opacity-75"
                              style={{
                                backgroundColor: getClaseColor(clase.id),
                              }}
                              onClick={() => handleReservar(clase)}
                            >
                              <div className="font-semibold">
                                {clase.nombre}
                              </div>
                              <div>{clase.instructor}</div>
                            </div>
                          ))}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Haga clic en una clase para hacer una reserva.
          </div>
        </div>
      )}

      {/* Contenido de la pestaña activa */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        {renderActiveTabContent()}
      </div>

      {/* Modal para crear/editar clase */}
      <ModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentClase ? "Editar Clase" : "Nueva Clase"}
        onSubmit={handleClaseSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="nombre"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nombre de la Clase
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              className="form-input"
              defaultValue={currentClase?.nombre || ""}
              required
            />
          </div>
          <div>
            <label
              htmlFor="instructor"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Instructor
            </label>
            <input
              id="instructor"
              name="instructor"
              type="text"
              className="form-input"
              defaultValue={currentClase?.instructor || ""}
              required
            />
          </div>
          <div>
            <label
              htmlFor="dias"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Días
            </label>
            <input
              id="dias"
              name="dias"
              type="text"
              className="form-input"
              placeholder="Ej: Lunes, Miércoles y Viernes"
              defaultValue={currentClase?.dias || ""}
              required
            />
          </div>
          <div>
            <label
              htmlFor="horario"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Horario
            </label>
            <input
              id="horario"
              name="horario"
              type="text"
              className="form-input"
              placeholder="Ej: 18:00 - 19:00"
              defaultValue={currentClase?.horario || ""}
              required
            />
          </div>
          <div>
            <label
              htmlFor="cupoMaximo"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Cupo Máximo
            </label>
            <input
              id="cupoMaximo"
              name="cupoMaximo"
              type="number"
              min="1"
              className="form-input"
              defaultValue={currentClase?.cupoMaximo || "15"}
              required
            />
          </div>
          <div className="md:col-span-2">
            <label
              htmlFor="descripcion"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Descripción
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              rows="3"
              className="form-input"
              defaultValue={currentClase?.descripcion || ""}
              required
            />
          </div>
        </div>
      </ModalForm>

      {/* Modal para hacer una reserva */}
      <ModalForm
        isOpen={isReservaModalOpen}
        onClose={() => setIsReservaModalOpen(false)}
        title={`Reserva para ${selectedClase?.nombre || ""}`}
        onSubmit={handleReservaSubmit}
      >
        <div className="mb-4">
          <div className="p-3 bg-gray-50 rounded-lg mb-4">
            <p className="text-sm">
              <strong>Clase:</strong> {selectedClase?.nombre}
            </p>
            <p className="text-sm">
              <strong>Instructor:</strong> {selectedClase?.instructor}
            </p>
            <p className="text-sm">
              <strong>Horario:</strong> {selectedClase?.horario}
            </p>
            <p className="text-sm">
              <strong>Días:</strong> {selectedClase?.dias}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
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
          </div>
        </div>
      </ModalForm>
    </div>
  );
};

// Función para generar colores para las clases basados en su ID
const getClaseColor = (id) => {
  const colors = [
    "#FF5A1F", // primary
    "#10B981", // secondary
    "#3B82F6", // blue
    "#8B5CF6", // purple
    "#EC4899", // pink
  ];
  return colors[(id - 1) % colors.length];
};

export default Clases;
