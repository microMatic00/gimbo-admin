import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import ModalForm from "../components/ModalForm";
import {
  AsistenciasService,
  SociosService,
} from "../services/gimnasio-services";
import { usePocketBase } from "../context/usePocketBase";
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
  const { currentUser } = usePocketBase();
  const [asistenciasList, setAsistenciasList] = useState([]);
  const [sociosList, setSociosList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("registro"); // registro, estadisticas
  const [socioSeleccionado, setSocioSeleccionado] = useState(null);
  const [estadoMembresiaInfo, setEstadoMembresiaInfo] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [asistenciaToDelete, setAsistenciaToDelete] = useState(null);

  // Servicios
  const asistenciasService = new AsistenciasService();
  const sociosService = new SociosService();

  // Cargar datos al montar el componente
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);

        // Crear instancias de servicios
        const asistenciasService = new AsistenciasService();
        const sociosService = new SociosService();

        // Cargar asistencias y socios en paralelo
        const [asistenciasData, sociosData] = await Promise.all([
          asistenciasService.getAll({
            expand: "socio",
            sort: "-fecha_hora_entrada",
            perPage: 100,
          }),
          sociosService.getAll({
            filter: 'estado_socio="Activo"',
            sort: "Nombre",
            perPage: 200,
          }),
        ]);

        setAsistenciasList(asistenciasData.items || []);
        setSociosList(sociosData.items || []);

        // Debug: Verificar estructura de datos
        console.log(
          "Asistencias cargadas:",
          asistenciasData.items?.slice(0, 2)
        );
        console.log("Socios cargados:", sociosData.items?.slice(0, 2));
      } catch (error) {
        console.error("Error al cargar datos:", error);
        // En caso de error, inicializar con arrays vacíos
        setAsistenciasList([]);
        setSociosList([]);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  // Columnas para la tabla
  const columns = [
    {
      key: "socio",
      header: "Socio",
      render: (item) => {
        // En PocketBase, si usamos expand, tenemos acceso directo al objeto socio
        return (
          item.expand?.socio?.Nombre || item.socio || "Socio no encontrado"
        );
      },
    },
    {
      key: "fecha_hora_entrada",
      header: "Fecha y Hora",
      render: (item) => {
        const fecha = new Date(item.fecha_hora_entrada);
        return (
          fecha.toLocaleDateString("es-ES") +
          " " +
          fecha.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
      },
    },
    {
      key: "estado_membresia",
      header: "Estado Membresía",
      render: (item) => {
        const socio = item.expand?.socio;
        if (!socio || !socio.fecha_vencimiento) {
          return (
            <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
              Sin membresía
            </span>
          );
        }

        const fechaVencimiento = new Date(socio.fecha_vencimiento);
        const fechaActual = new Date();

        fechaVencimiento.setHours(0, 0, 0, 0);
        fechaActual.setHours(0, 0, 0, 0);

        const diasRestantes = Math.ceil(
          (fechaVencimiento - fechaActual) / (1000 * 60 * 60 * 24)
        );

        if (diasRestantes < 0) {
          return (
            <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
              Vencida
            </span>
          );
        } else if (diasRestantes <= 7) {
          return (
            <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
              Por vencer
            </span>
          );
        } else {
          return (
            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
              Vigente
            </span>
          );
        }
      },
    },
    {
      key: "clase",
      header: "Clase",
      render: (item) => {
        return item.expand?.clase?.nombre || "Acceso libre";
      },
    },
  ];

  // Calcular estadísticas basadas en los datos reales
  const calcularEstadisticas = () => {
    const hoy = new Date();
    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() - hoy.getDay());
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

    const asistenciasHoy = asistenciasList.filter((asistencia) => {
      const fecha = new Date(asistencia.fecha_hora_entrada);
      return fecha.toDateString() === hoy.toDateString();
    }).length;

    const asistenciasSemana = asistenciasList.filter((asistencia) => {
      const fecha = new Date(asistencia.fecha_hora_entrada);
      return fecha >= inicioSemana;
    }).length;

    const asistenciasMes = asistenciasList.filter((asistencia) => {
      const fecha = new Date(asistencia.fecha_hora_entrada);
      return fecha >= inicioMes;
    }).length;

    return {
      hoy: asistenciasHoy,
      semana: asistenciasSemana,
      mes: asistenciasMes,
    };
  };

  const estadisticas = calcularEstadisticas();

  // Función para verificar si un socio está al día con su membresía
  const verificarEstadoMembresia = async (socioId) => {
    try {
      // Obtener información del socio con su membresía
      const socio = await sociosService.getById(socioId, {
        expand: "membresia",
      });

      // Verificar si el socio tiene una membresía asignada
      if (!socio.membresia || !socio.fecha_vencimiento) {
        return {
          valido: false,
          mensaje: "El socio no tiene una membresía activa asignada.",
        };
      }

      // Verificar si la membresía no ha vencido
      const fechaVencimiento = new Date(socio.fecha_vencimiento);
      const fechaActual = new Date();

      // Establecer horas a 0 para comparar solo fechas
      fechaVencimiento.setHours(0, 0, 0, 0);
      fechaActual.setHours(0, 0, 0, 0);

      if (fechaVencimiento < fechaActual) {
        return {
          valido: false,
          mensaje: `La membresía del socio venció el ${fechaVencimiento.toLocaleDateString(
            "es-ES"
          )}. Debe renovar su membresía para poder acceder.`,
        };
      }

      // Verificar si está próximo a vencer (dentro de 7 días)
      const diasRestantes = Math.ceil(
        (fechaVencimiento - fechaActual) / (1000 * 60 * 60 * 24)
      );

      if (diasRestantes <= 7) {
        return {
          valido: true,
          mensaje: `¡Atención! La membresía del socio vence en ${diasRestantes} día(s) (${fechaVencimiento.toLocaleDateString(
            "es-ES"
          )}).`,
          advertencia: true,
        };
      }

      return {
        valido: true,
        mensaje: `Membresía válida hasta el ${fechaVencimiento.toLocaleDateString(
          "es-ES"
        )}.`,
      };
    } catch (error) {
      console.error("Error al verificar estado de membresía:", error);
      return {
        valido: false,
        mensaje:
          "Error al verificar el estado de la membresía. Intente nuevamente.",
      };
    }
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

  // Manejar selección de socio en el formulario
  const handleSocioChange = async (event) => {
    const socioId = event.target.value;
    setSocioSeleccionado(socioId);

    if (socioId) {
      // Verificar estado de membresía del socio seleccionado
      const estadoMembresia = await verificarEstadoMembresia(socioId);
      setEstadoMembresiaInfo(estadoMembresia);
    } else {
      setEstadoMembresiaInfo(null);
    }
  };

  // Abrir el modal para registrar nueva asistencia
  const handleAddNew = () => {
    // Limpiar estados del formulario
    setSocioSeleccionado(null);
    setEstadoMembresiaInfo(null);
    setIsModalOpen(true);
  };

  // Mostrar el modal de QR
  const handleShowQR = () => {
    setIsQRModalOpen(true);
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Si hay información de membresía y no es válida, prevenir envío
    if (estadoMembresiaInfo && !estadoMembresiaInfo.valido) {
      alert(
        `❌ No se puede registrar la asistencia:\n\n${estadoMembresiaInfo.mensaje}`
      );
      return;
    }

    const formData = new FormData(e.target);

    try {
      const socioId = formData.get("socioId");
      const fecha = formData.get("fecha");
      const hora = formData.get("hora");

      // Verificar estado de membresía antes de registrar asistencia (doble verificación)
      const estadoMembresia = await verificarEstadoMembresia(socioId);

      if (!estadoMembresia.valido) {
        // Mostrar mensaje de error y no permitir el registro
        alert(
          `❌ No se puede registrar la asistencia:\n\n${estadoMembresia.mensaje}`
        );
        return;
      }

      // Si hay advertencia (próximo a vencer), mostrar confirmación
      if (estadoMembresia.advertencia) {
        const confirmar = confirm(
          `⚠️ ${estadoMembresia.mensaje}\n\n¿Desea continuar registrando la asistencia?`
        );
        if (!confirmar) {
          return;
        }
      }

      // Crear fecha y hora combinadas en formato ISO
      const fechaHora = new Date(`${fecha}T${hora}:00`).toISOString();

      // Registrar nueva asistencia en PocketBase
      await asistenciasService.create({
        socio: socioId,
        fecha_hora_entrada: fechaHora,
        registrado_por: currentUser?.id || null,
      });

      // Recargar las asistencias para mostrar la nueva
      const asistenciasData = await asistenciasService.getAll({
        expand: "socio",
        sort: "-fecha_hora_entrada",
        perPage: 100,
      });

      setAsistenciasList(asistenciasData.items || []);
      setIsModalOpen(false);
      setSocioSeleccionado(null);
      setEstadoMembresiaInfo(null);

      // Mostrar mensaje de éxito
      alert(
        `✅ Asistencia registrada exitosamente.\n\n${estadoMembresia.mensaje}`
      );
    } catch (error) {
      console.error("Error al registrar asistencia:", error);
      alert(
        `❌ Error al registrar asistencia:\n\n${
          error.message || "Error desconocido"
        }`
      );
    }
  };

  // Manejar la generación de reporte
  const handleGenerateReport = () => {
    // En una implementación real, esto generaría un PDF o Excel
    alert("Generando reporte de asistencias...");
  };

  // Abrir modal de confirmación para eliminar asistencia
  const handleDeleteAsistencia = async (asistencia) => {
    console.log("🔥 FUNCIÓN ELIMINAR LLAMADA:", asistencia); // Debug muy visible

    if (!asistencia || !asistencia.id) {
      alert("❌ Error: No se pudo identificar la asistencia a eliminar.");
      console.log("❌ Error: asistencia sin ID:", asistencia);
      return;
    }

    setAsistenciaToDelete(asistencia);
    setIsDeleteModalOpen(true);
  };

  // Confirmar la eliminación de la asistencia
  const confirmDeleteAsistencia = async () => {
    if (!asistenciaToDelete) return;

    try {
      console.log(`🗑️ Eliminando asistencia ID: ${asistenciaToDelete.id}`);

      // Eliminar la asistencia usando el servicio
      await asistenciasService.delete(asistenciaToDelete.id);

      // Recargar las asistencias para actualizar la lista
      const asistenciasData = await asistenciasService.getAll({
        expand: "socio",
        sort: "-fecha_hora_entrada",
        perPage: 100,
      });

      setAsistenciasList(asistenciasData.items || []);
      setIsDeleteModalOpen(false);
      setAsistenciaToDelete(null);

      console.log("✅ Asistencia eliminada exitosamente");
    } catch (error) {
      console.error("❌ Error al eliminar asistencia:", error);

      // Mostrar mensaje de error más específico
      let errorMessage = "Error desconocido";
      if (error.status === 404) {
        errorMessage =
          "La asistencia ya no existe o fue eliminada previamente.";
      } else if (error.status === 403) {
        errorMessage = "No tienes permisos para eliminar esta asistencia.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(`❌ Error al eliminar asistencia:\n\n${errorMessage}`);
    }
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
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <Table
                columns={columns}
                data={asistenciasList}
                onEdit={() => {}} // No es necesario editar asistencias
                onDelete={handleDeleteAsistencia} // Función para eliminar asistencias
              />
            )}
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
          <p className="text-2xl font-bold">{estadisticas.hoy} asistencias</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Esta Semana</h3>
          <p className="text-2xl font-bold">
            {estadisticas.semana} asistencias
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Este Mes</h3>
          <p className="text-2xl font-bold">{estadisticas.mes} asistencias</p>
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
        onClose={() => {
          setIsModalOpen(false);
          setSocioSeleccionado(null);
          setEstadoMembresiaInfo(null);
        }}
        title="Registrar Asistencia"
        onSubmit={handleSubmit}
        submitButtonText={
          estadoMembresiaInfo && !estadoMembresiaInfo.valido
            ? "Membresía no válida"
            : "Registrar Asistencia"
        }
      >
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
              onChange={handleSocioChange}
              value={socioSeleccionado || ""}
            >
              <option value="">Seleccionar Socio</option>
              {sociosList.map((socio) => (
                <option key={socio.id} value={socio.id}>
                  {socio.Nombre}
                </option>
              ))}
            </select>

            {/* Mostrar información del estado de la membresía */}
            {estadoMembresiaInfo && (
              <div
                className={`p-3 rounded-md text-sm mt-2 ${
                  estadoMembresiaInfo.valido
                    ? estadoMembresiaInfo.advertencia
                      ? "bg-yellow-50 text-yellow-800 border border-yellow-200"
                      : "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                <div className="flex items-start">
                  <span className="mr-2">
                    {estadoMembresiaInfo.valido
                      ? estadoMembresiaInfo.advertencia
                        ? "⚠️"
                        : "✅"
                      : "❌"}
                  </span>
                  <span>{estadoMembresiaInfo.mensaje}</span>
                </div>
              </div>
            )}
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

          {/* Botón deshabilitado si la membresía no es válida */}
          {estadoMembresiaInfo && !estadoMembresiaInfo.valido && (
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-600 text-center">
                No se puede registrar la asistencia hasta que se resuelva el
                estado de la membresía.
              </p>
            </div>
          )}
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

      {/* Modal de confirmación para eliminar asistencia */}
      <ModalForm
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmar Eliminación"
        onSubmit={confirmDeleteAsistencia}
        submitButtonText="Eliminar"
        size="sm"
      >
        <p className="mb-4">
          ¿Está seguro de que desea eliminar la asistencia de "
          <span className="font-medium">
            {asistenciaToDelete?.expand?.socio?.Nombre || "Socio desconocido"}
          </span>
          " del{" "}
          <span className="font-medium">
            {asistenciaToDelete?.fecha_hora_entrada
              ? new Date(
                  asistenciaToDelete.fecha_hora_entrada
                ).toLocaleDateString("es-ES")
              : "fecha desconocida"}
          </span>
          ?
        </p>
        <p className="text-sm text-red-600">
          Esta acción no se puede deshacer.
        </p>
      </ModalForm>
    </div>
  );
};

export default Asistencia;
