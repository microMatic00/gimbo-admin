import React, { useState, useEffect, useMemo } from "react";
import ModalForm from "../components/ModalForm";
import Table from "../components/Table";
import { useToast } from "../hooks/useToast";
import { usePocketBase } from "../context/usePocketBase";
import {
  ClasesService,
  ReservasClaseService,
  SociosService,
} from "../services/gimnasio-services";
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

  // Estados para datos desde PocketBase
  const [clasesList, setClasesList] = useState([]);
  const [reservasList, setReservasList] = useState([]);
  const [sociosList, setSociosList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { push: showToast } = useToast();
  const { pb, currentUser, isAuthenticated } = usePocketBase();

  // Instancias de servicios con useMemo para evitar recreación
  // Nota: Estos servicios ya tienen acceso a la instancia pb global
  const clasesService = useMemo(() => new ClasesService(), []);
  const reservasService = useMemo(() => new ReservasClaseService(), []);
  const sociosService = useMemo(() => new SociosService(), []);

  // Función para generar colores únicos para cada clase (MEJORADA)
  const getClaseColor = useMemo(() => {
    const colors = [
      "#3B82F6", // blue-500
      "#10B981", // emerald-500
      "#F59E0B", // amber-500
      "#EF4444", // red-500
      "#8B5CF6", // violet-500
      "#06B6D4", // cyan-500
      "#84CC16", // lime-500
      "#F97316", // orange-500
      "#EC4899", // pink-500
      "#6366F1", // indigo-500
      "#14B8A6", // teal-500
      "#A855F7", // purple-500
      "#DC2626", // red-600
      "#059669", // emerald-600
      "#D97706", // amber-600
      "#7C3AED", // violet-600
      "#0891B2", // cyan-600
      "#65A30D", // lime-600
      "#EA580C", // orange-600
      "#BE185D", // pink-600
      "#4F46E5", // indigo-600
      "#0D9488", // teal-600
      "#9333EA", // purple-600
      "#B91C1C", // red-700
      "#047857", // emerald-700
      "#B45309", // amber-700
    ];

    // Función de hash más robusta
    const hashString = (str) => {
      let hash = 0;
      if (str.length === 0) return hash;

      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convertir a 32-bit integer
      }

      return Math.abs(hash);
    };

    return (claseId) => {
      // Usar hash más robusto en lugar de parseInt base 36
      const hash = hashString(claseId);
      const index = hash % colors.length;
      return colors[index];
    };
  }, []);

  // Cargar datos al montar el componente
  useEffect(() => {
    // Función para cargar todos los datos
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Verificar si el usuario está autenticado
        if (!isAuthenticated) {
          setError("Usuario no autenticado");
          return;
        }

        // Ejecutar pruebas de API (removido - ya no necesario)
        console.log("🔄 Iniciando carga de datos...");
        console.log("Usuario actual:", currentUser);
        console.log("Token válido:", isAuthenticated);
        console.log(
          "PocketBase URL:",
          import.meta.env.VITE_POCKETBASE_URL || "URL por defecto"
        );
        console.log("PocketBase instance:", pb.baseUrl);

        const [clasesData, reservasData, sociosData] = await Promise.all([
          clasesService.getClasesActivas(),
          reservasService.getAll({ expand: "socio,clase" }),
          sociosService.getSociosActivos(),
        ]);

        setClasesList(clasesData.items || []);
        setReservasList(reservasData.items || []);
        setSociosList(sociosData.items || []);
      } catch (err) {
        console.error("Error cargando datos:", err);

        if (err.status === 403) {
          setError(
            "No tienes permisos para acceder a esta información. Las reglas de PocketBase requieren permisos de administrador."
          );
          showToast("Error de permisos: Contacta al administrador", "error");
        } else if (err.status === 401) {
          setError("Sesión expirada. Por favor, inicia sesión nuevamente.");
          showToast("Sesión expirada", "error");
        } else {
          setError(`Error al cargar los datos: ${err.message}`);
          showToast(`Error: ${err.message}`, "error");
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();

    return () => {
      // Cancelar peticiones al desmontar
      clasesService.abortAll();
      reservasService.abortAll();
      sociosService.abortAll();
    };
  }, [
    clasesService,
    reservasService,
    sociosService,
    showToast,
    currentUser,
    isAuthenticated,
    pb.baseUrl,
  ]);

  // Función para recargar datos manualmente
  const handleRetry = async () => {
    // Función para cargar todos los datos
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Verificar si el usuario está autenticado
        if (!isAuthenticated) {
          setError("Usuario no autenticado");
          return;
        }

        console.log("Usuario actual:", currentUser);
        console.log("Token válido:", isAuthenticated);
        console.log(
          "PocketBase URL:",
          import.meta.env.VITE_POCKETBASE_URL || "URL por defecto"
        );

        const [clasesData, reservasData, sociosData] = await Promise.all([
          clasesService.getClasesActivas(),
          reservasService.getAll({ expand: "socio,clase" }),
          sociosService.getSociosActivos(),
        ]);

        setClasesList(clasesData.items || []);
        setReservasList(reservasData.items || []);
        setSociosList(sociosData.items || []);
      } catch (err) {
        console.error("Error cargando datos:", err);

        if (err.status === 403) {
          setError(
            "No tienes permisos para acceder a esta información. Las reglas de PocketBase requieren permisos de administrador."
          );
          showToast("Error de permisos: Contacta al administrador", "error");
        } else if (err.status === 401) {
          setError("Sesión expirada. Por favor, inicia sesión nuevamente.");
          showToast("Sesión expirada", "error");
        } else {
          setError(`Error al cargar los datos: ${err.message}`);
          showToast(`Error: ${err.message}`, "error");
        }
      } finally {
        setLoading(false);
      }
    };

    await loadData();
  };

  // Columnas para la tabla de clases
  const clasesColumns = [
    { key: "nombre", header: "Nombre" },
    { key: "instructor", header: "Instructor" },
    {
      key: "dia_semana",
      header: "Días",
      render: (item) => {
        // dia_semana es un array de strings con comillas
        if (Array.isArray(item.dia_semana)) {
          return item.dia_semana.map((dia) => dia.replace(/"/g, "")).join(", ");
        }
        return item.dia_semana || "";
      },
    },
    {
      key: "horario",
      header: "Horario",
      render: (item) => {
        const duracion = item.duracion_minutos || 60;
        const inicio = item.hora_inicio || "";
        if (inicio) {
          // Calcular hora fin basada en duración
          const [horas, minutos] = inicio.split(":").map(Number);
          const inicioMinutos = horas * 60 + minutos;
          const finMinutos = inicioMinutos + duracion;
          const horaFin = Math.floor(finMinutos / 60);
          const minutosFin = finMinutos % 60;
          const horaFinFormatted = `${horaFin
            .toString()
            .padStart(2, "0")}:${minutosFin.toString().padStart(2, "0")}`;
          return `${inicio} - ${horaFinFormatted}`;
        }
        return "";
      },
    },
    {
      key: "capacidad_maxima",
      header: "Cupo",
      render: (item) => {
        // Calcular las reservas actuales para esta clase
        const reservasDeLaClase = reservasList.filter(
          (r) => r.clase === item.id
        );
        return `${reservasDeLaClase.length}/${item.capacidad_maxima || "N/A"}`;
      },
    },
    {
      key: "nivel",
      header: "Nivel",
      render: (item) => item.nivel?.replace(/"/g, "") || "Todos",
    },
  ];

  // Columnas para la tabla de reservas
  const reservasColumns = [
    {
      key: "socio",
      header: "Socio",
      render: (item) => {
        // Si tenemos expand, usar el nombre expandido
        if (item.expand?.socio) {
          return (
            item.expand.socio.Nombre ||
            item.expand.socio.nombre ||
            "Desconocido"
          );
        }
        // Fallback: buscar en la lista local
        const socio = sociosList.find((s) => s.id === item.socio);
        return socio?.Nombre || socio?.nombre || "Desconocido";
      },
    },
    {
      key: "clase",
      header: "Clase",
      render: (item) => {
        // Si tenemos expand, usar el nombre expandido
        if (item.expand?.clase) {
          return item.expand.clase.nombre || "Desconocida";
        }
        // Fallback: buscar en la lista local
        const clase = clasesList.find((c) => c.id === item.clase);
        return clase?.nombre || "Desconocida";
      },
    },
    {
      key: "fecha",
      header: "Fecha",
      render: (item) => formatDate(item.fecha),
    },
    {
      key: "estado",
      header: "Estado",
      render: (item) => {
        const estado = item.estado;
        if (estado === "Asistió") {
          return (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Asistió
            </span>
          );
        } else if (estado === "Cancelada") {
          return (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Cancelada
            </span>
          );
        } else {
          return (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Confirmada
            </span>
          );
        }
      },
    },
  ];

  // Función para generar horarios dinámicamente basados en las clases
  const generateScheduleSlots = () => {
    const slots = new Set();

    // Agregar horarios de las clases existentes
    clasesList.forEach((clase) => {
      if (clase.hora_inicio && clase.duracion_minutos) {
        const duracion = clase.duracion_minutos || 60;
        const inicio = clase.hora_inicio;
        const [horas, minutos] = inicio.split(":").map(Number);
        const inicioMinutos = horas * 60 + minutos;
        const finMinutos = inicioMinutos + duracion;
        const horaFin = Math.floor(finMinutos / 60);
        const minutosFin = finMinutos % 60;
        const horaFinFormatted = `${horaFin
          .toString()
          .padStart(2, "0")}:${minutosFin.toString().padStart(2, "0")}`;
        const horarioCompleto = `${inicio} - ${horaFinFormatted}`;
        slots.add(horarioCompleto);
      }
    });

    // Agregar algunos horarios comunes si no hay clases
    if (slots.size === 0) {
      return [
        "06:00 - 07:00",
        "07:00 - 08:00",
        "08:00 - 09:00",
        "09:00 - 10:00",
        "10:00 - 11:00",
        "17:00 - 18:00",
        "18:00 - 19:00",
        "19:00 - 20:00",
        "20:00 - 21:00",
      ];
    }

    // Convertir a array y ordenar
    return Array.from(slots).sort((a, b) => {
      const timeA = a.split(" - ")[0];
      const timeB = b.split(" - ")[0];
      return timeA.localeCompare(timeB);
    });
  };

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
  const handleClaseSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // Obtener días seleccionados (múltiples checkboxes)
    const diasSeleccionados = [];
    const checkboxes = e.target.querySelectorAll(
      'input[name="dia_semana"]:checked'
    );
    checkboxes.forEach((checkbox) => {
      diasSeleccionados.push(`"${checkbox.value}"`);
    });

    // Validar que se haya seleccionado al menos un día
    if (diasSeleccionados.length === 0) {
      showToast("Debe seleccionar al menos un día de la semana", "error");
      return;
    }

    const claseData = {
      nombre: formData.get("nombre"),
      instructor: formData.get("instructor"),
      dia_semana: diasSeleccionados, // Array de días
      hora_inicio: formData.get("hora_inicio"),
      duracion_minutos: parseInt(formData.get("duracion_minutos")) || 60,
      capacidad_maxima: parseInt(formData.get("capacidad_maxima")) || 15,
      descripcion: formData.get("descripcion") || "",
      nivel: `"${formData.get("nivel") || "Todos"}"`, // Agregar comillas dobles
      activa: true,
    };

    console.log("📝 Datos de clase a enviar:", claseData);
    console.log("📅 Días seleccionados:", diasSeleccionados);
    console.log(
      "🏷️ Nivel con formato:",
      `"${formData.get("nivel") || "Todos"}"`
    );

    try {
      if (currentClase) {
        // Actualizar clase existente
        console.log("🔄 Actualizando clase existente...");
        const updatedClase = await clasesService.update(
          currentClase.id,
          claseData
        );
        setClasesList(
          clasesList.map((clase) =>
            clase.id === currentClase.id ? updatedClase : clase
          )
        );
        showToast("Clase actualizada exitosamente", "success");
      } else {
        // Agregar nueva clase
        console.log("➕ Creando nueva clase...");
        const newClase = await clasesService.create(claseData);
        console.log("✅ Clase creada:", newClase);
        setClasesList([...clasesList, newClase]);
        showToast("Clase creada exitosamente", "success");
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("❌ Error al guardar clase:", err);
      showToast(`Error al guardar la clase: ${err.message}`, "error");
    }
  };

  // Manejar el envío del formulario de reserva
  const handleReservaSubmit = async (e) => {
    e.preventDefault();
    console.log("🔄 handleReservaSubmit iniciado");

    const formData = new FormData(e.target);
    console.log("📋 FormData obtenido:", {
      socioId: formData.get("socioId"),
      fecha: formData.get("fecha"),
      selectedClase: selectedClase?.id,
    });

    const reservaData = {
      socio: formData.get("socioId"),
      clase: selectedClase.id,
      fecha: formData.get("fecha"),
      // Eliminamos el campo estado
    };

    console.log("📝 Datos de reserva a enviar:", reservaData);

    // Validaciones
    if (!reservaData.socio) {
      console.error("❌ Error: No se seleccionó un socio");
      showToast("Por favor selecciona un socio", "error");
      return;
    }

    if (!reservaData.fecha) {
      console.error("❌ Error: No se seleccionó una fecha");
      showToast("Por favor selecciona una fecha", "error");
      return;
    }

    try {
      console.log("🚀 Llamando a reservasService.crearReserva...");
      const newReserva = await reservasService.crearReserva(
        reservaData.socio,
        reservaData.clase,
        reservaData.fecha
      );
      console.log("✅ Reserva creada exitosamente:", newReserva);

      // Agregar nueva reserva a la lista con expand si es posible
      const reservaConExpand = {
        ...newReserva,
        expand: {
          socio: sociosList.find((s) => s.id === reservaData.socio),
          clase: selectedClase,
        },
      };

      setReservasList([...reservasList, reservaConExpand]);
      setIsReservaModalOpen(false);
      showToast("Reserva creada exitosamente", "success");
    } catch (err) {
      console.error("❌ Error al crear reserva:", err);
      console.error("❌ Error details:", {
        message: err.message,
        status: err.status,
        data: err.data,
      });
      showToast(`Error al crear la reserva: ${err.message}`, "error");
    }
  };

  // Manejar la eliminación de una clase
  const handleDeleteClase = async (clase) => {
    if (window.confirm(`¿Está seguro de eliminar la clase ${clase.nombre}?`)) {
      try {
        await clasesService.delete(clase.id);
        setClasesList(clasesList.filter((c) => c.id !== clase.id));
        showToast("Clase eliminada exitosamente", "success");
      } catch (err) {
        console.error("Error al eliminar clase:", err);
        showToast("Error al eliminar la clase", "error");
      }
    }
  };

  // Manejar la eliminación de una reserva
  const handleDeleteReserva = async (reserva) => {
    if (window.confirm("¿Está seguro de eliminar esta reserva?")) {
      try {
        await reservasService.delete(reserva.id);
        setReservasList(reservasList.filter((r) => r.id !== reserva.id));
        showToast("Reserva eliminada exitosamente", "success");
      } catch (err) {
        console.error("Error al eliminar reserva:", err);
        showToast("Error al eliminar la reserva", "error");
      }
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

      {/* Mostrar loading o error */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold">Error de conexión</p>
              <p>{error}</p>
              <p className="text-sm mt-2">
                Para solucionar este problema, revisa la{" "}
                <a
                  href="#"
                  className="underline text-red-800"
                  onClick={(e) => {
                    e.preventDefault();
                    window.open("/docs/CONFIGURACION_PERMISOS.md", "_blank");
                  }}
                >
                  documentación de permisos
                </a>
              </p>
            </div>
            <button
              onClick={handleRetry}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
              disabled={loading}
            >
              {loading ? "Cargando..." : "Reintentar"}
            </button>
          </div>
        </div>
      )}

      {!loading && !error && (
        <>
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
                    {generateScheduleSlots().map((horario, index) => (
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
                          const clasesEnHorario = clasesList.filter((c) => {
                            // Verificar si el día está en el array dia_semana
                            const diasClase = Array.isArray(c.dia_semana)
                              ? c.dia_semana.map((d) => d.replace(/"/g, ""))
                              : [];

                            // Verificar si la clase es del día actual
                            if (!diasClase.includes(dia)) {
                              return false;
                            }

                            // Calcular el horario de la clase
                            const duracion = c.duracion_minutos || 60;
                            const inicio = c.hora_inicio || "";
                            if (inicio) {
                              const [horas, minutos] = inicio
                                .split(":")
                                .map(Number);
                              const inicioMinutos = horas * 60 + minutos;
                              const finMinutos = inicioMinutos + duracion;
                              const horaFin = Math.floor(finMinutos / 60);
                              const minutosFin = finMinutos % 60;
                              const horaFinFormatted = `${horaFin
                                .toString()
                                .padStart(2, "0")}:${minutosFin
                                .toString()
                                .padStart(2, "0")}`;
                              const horaClase = `${inicio} - ${horaFinFormatted}`;

                              return horaClase === horario;
                            }
                            return false;
                          });

                          return (
                            <td key={idx} className="border p-2 min-h-16">
                              {clasesEnHorario.map((clase, i) => (
                                <div
                                  key={i}
                                  className="p-2 rounded mb-1 text-xs cursor-pointer hover:opacity-75 transition-opacity"
                                  style={{
                                    backgroundColor: getClaseColor(clase.id),
                                    color: "white",
                                  }}
                                  onClick={() => handleReservar(clase)}
                                  title={`${clase.nombre} - ${
                                    clase.instructor
                                  } (Nivel: ${
                                    clase.nivel?.replace(/"/g, "") || "Todos"
                                  })`}
                                >
                                  <div className="font-semibold">
                                    {clase.nombre}
                                  </div>
                                  <div className="text-xs opacity-90">
                                    {clase.instructor}
                                  </div>
                                  <div className="text-xs opacity-75">
                                    {clase.capacidad_maxima
                                      ? `Cap: ${clase.capacidad_maxima}`
                                      : ""}
                                  </div>
                                </div>
                              ))}
                              {clasesEnHorario.length === 0 && (
                                <div className="h-12 flex items-center justify-center text-gray-300 text-xs">
                                  Sin clases
                                </div>
                              )}
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
        </>
      )}

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

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Días de la Semana
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                "Lunes",
                "Martes",
                "Miércoles",
                "Jueves",
                "Viernes",
                "Sábado",
                "Domingo",
              ].map((dia) => {
                const isChecked =
                  currentClase?.dia_semana?.includes(`"${dia}"`) || false;
                return (
                  <label key={dia} className="flex items-center">
                    <input
                      type="checkbox"
                      name="dia_semana"
                      value={dia}
                      defaultChecked={isChecked}
                      className="rounded border-gray-300 text-primary focus:ring-primary mr-2"
                    />
                    <span className="text-sm">{dia}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <label
              htmlFor="hora_inicio"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Hora de Inicio
            </label>
            <input
              id="hora_inicio"
              name="hora_inicio"
              type="time"
              className="form-input"
              defaultValue={currentClase?.hora_inicio || ""}
              required
            />
          </div>
          <div>
            <label
              htmlFor="duracion_minutos"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Duración (minutos)
            </label>
            <input
              id="duracion_minutos"
              name="duracion_minutos"
              type="number"
              min="15"
              step="15"
              className="form-input"
              defaultValue={currentClase?.duracion_minutos || "60"}
              required
            />
          </div>
          <div>
            <label
              htmlFor="capacidad_maxima"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Capacidad Máxima
            </label>
            <input
              id="capacidad_maxima"
              name="capacidad_maxima"
              type="number"
              min="1"
              className="form-input"
              defaultValue={currentClase?.capacidad_maxima || "15"}
              required
            />
          </div>
          <div>
            <label
              htmlFor="nivel"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nivel
            </label>
            <select
              id="nivel"
              name="nivel"
              className="form-input"
              defaultValue={currentClase?.nivel?.replace(/"/g, "") || "Todos"}
            >
              <option value="Principiante">Principiante</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
              <option value="Todos">Todos los niveles</option>
            </select>
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
              placeholder="Descripción de la clase..."
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
              <strong>Horario:</strong> {selectedClase?.hora_inicio} (
              {selectedClase?.duracion_minutos || 60} min)
            </p>
            <p className="text-sm">
              <strong>Días:</strong>{" "}
              {Array.isArray(selectedClase?.dia_semana)
                ? selectedClase.dia_semana
                    .map((d) => d.replace(/"/g, ""))
                    .join(", ")
                : selectedClase?.dia_semana || ""}
            </p>
            <p className="text-sm">
              <strong>Nivel:</strong>{" "}
              {selectedClase?.nivel?.replace(/"/g, "") || "Todos"}
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
                {sociosList.map((socio) => (
                  <option key={socio.id} value={socio.id}>
                    {socio.Nombre || socio.nombre || "Sin nombre"}
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

export default Clases;
