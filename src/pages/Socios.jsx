import React, { useState, useEffect, useRef } from "react";
import Table from "../components/Table";
import ModalForm from "../components/ModalForm";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import { SociosService } from "../services/gimnasio-services";
import { usePocketBase } from "../context/usePocketBase";

const Socios = () => {
  const [sociosList, setSociosList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSocio, setCurrentSocio] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [socioToDelete, setSocioToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isAuthenticated } = usePocketBase();
  // Reutilizar una única instancia del servicio dentro del componente
  const sociosServiceRef = useRef(new SociosService());

  // Cargar socios desde PocketBase
  useEffect(() => {
    const sociosService = sociosServiceRef.current;
    const cargarSocios = async () => {
      try {
        if (isAuthenticated) {
          setIsLoading(true);
          const resultado = await sociosService.getAll({
            sort: "Nombre",
            expand: "membresia",
            $autoCancel: false,
            $cancelKey: `socios-getAll-${Date.now()}`,
          });
          setSociosList(resultado.items);
        }
      } catch (err) {
        // Solo mostrar errores que no sean de cancelación
        if (err.name !== "AbortError") {
          console.error("Error al cargar socios:", err);
          setError("No se pudieron cargar los socios. Inténtalo de nuevo.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    cargarSocios();

    // Limpiar las solicitudes pendientes cuando se desmonte el componente
    return () => {
      sociosService.abortAll();
    };
  }, [isAuthenticated]);

  // Columnas para la tabla
  // Utilidades para calcular vencimientos a partir de la membresía
  const addDays = (date, days) => {
    const d = new Date(date);
    d.setDate(d.getDate() + Number(days));
    return d;
  };

  const getExpirationDate = (socio) => {
    // Si ya existe fecha_vencimiento, usarla
    if (socio?.fecha_vencimiento) return new Date(socio.fecha_vencimiento);

    // Intentar obtener la membresía expandida o directa
    const membresia = socio?.expand?.membresia || socio?.membresia || null;

    const duracion =
      membresia?.duracio_dias ||
      membresia?.duracion ||
      membresia?.duracion_dias ||
      membresia?.duracionDias ||
      membresia?.dias;

    const fechaInscripcion = socio?.fecha_inscripcion || socio?.fechaRegistro || socio?.fecha_registro;

    if (fechaInscripcion && duracion) {
      return addDays(new Date(fechaInscripcion), Number(duracion));
    }

    return null;
  };

  const getVencimientoStatus = (socio) => {
    const exp = getExpirationDate(socio);
    if (!exp) return null;
    const today = new Date();
    const diffDays = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return "Vencido";
    if (diffDays <= 7) return "Próximo a vencer";
    return "Activo";
  };

  // Columnas para la tabla
  const columns = [
    { key: "Nombre", header: "Nombre" },
    { key: "documento", header: "Documento" },
    { key: "email", header: "Email" },
    { key: "telefono", header: "Teléfono" },
    {
      key: "membresia",
      header: "Membresía",
      render: (item) => (
        <span>{item.expand?.membresia?.nombre || item.membresia?.nombre || "Sin membresía"}</span>
      ),
    },
    {
      key: "estado_socio",
      header: "Estado",
      render: (item) => {
        const vencStatus = getVencimientoStatus(item);
        const status = vencStatus || item.estado_socio || "Inactivo";
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              status === "Activo"
                ? "bg-green-100 text-green-800"
                : status === "Vencido"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {status}
          </span>
        );
      },
    },
    {
      key: "fecha_vencimiento",
      header: "Vencimiento",
      render: (item) =>
        getExpirationDate(item) ? formatDate(getExpirationDate(item)) : "Sin definir",
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
  const confirmDelete = async () => {
    try {
      setIsLoading(true);
      const sociosService = sociosServiceRef.current;
      await sociosService.delete(socioToDelete.id);

      // Recargar la lista de socios
      const resultado = await sociosService.getAll({ sort: "Nombre" });
      setSociosList(resultado.items);
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error("Error al eliminar socio:", err);
      setError("No se pudo eliminar el socio. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const sociosService = sociosServiceRef.current;
    // Adaptar a la estructura de colecciones existente
    const socioData = {
      Nombre: formData.get("nombre"),
      documento: formData.get("dni"),
      tipo_documento: "DNI",
      email: formData.get("email"),
      telefono: formData.get("telefono"),
      fecha_inscripcion:
        formData.get("fechaRegistro") || new Date().toISOString().split("T")[0],
      fecha_nacimiento:
        formData.get("fechaNacimiento") ||
        new Date().toISOString().split("T")[0],
      estado_socio: formData.get("estado") === "Activo" ? "Activo" : "Inactivo",
      genero: formData.get("genero") || "Otro",
      direccion: formData.get("direccion") || "",
      notas: formData.get("observaciones") || "",
    };

    try {
      setIsLoading(true);
      if (currentSocio) {
        // Actualizar socio existente
        await sociosService.update(currentSocio.id, socioData);
      } else {
        // Crear nuevo socio
        await sociosService.create(socioData);
      }

      // Recargar la lista de socios
      const resultado = await sociosService.getAll({ sort: "Nombre" });
      setSociosList(resultado.items);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error al guardar socio:", err);
      setError("No se pudo guardar el socio. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
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

      {/* Mensajes de estado */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
          <button
            className="text-sm underline mt-2"
            onClick={() => setError(null)}
          >
            Cerrar
          </button>
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Resumen de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Socios</h3>
          <p className="text-2xl font-bold">{sociosList.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Socios Activos</h3>
          <p className="text-2xl font-bold">
            {sociosList.filter((s) => s.estado_socio === "Activo").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">
              Próximos a Vencer
            </h3>
            <p className="text-2xl font-bold">
              {sociosList.filter((s) => getVencimientoStatus(s) === "Próximo a vencer").length}
            </p>
        </div>
      </div>

      {/* Tabla de socios */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        {!isLoading && sociosList.length > 0 ? (
          <Table
            columns={columns}
            data={sociosList}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : !isLoading && sociosList.length === 0 ? (
          <div className="text-center p-10 bg-gray-50 dark:bg-dark-light rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">
              No hay socios registrados
            </p>
            <button
              onClick={handleAddNew}
              className="mt-4 btn btn-primary btn-sm"
            >
              Añadir el primer socio
            </button>
          </div>
        ) : null}
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
          {/* <div>
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
          <div> */}
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
