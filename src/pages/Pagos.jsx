import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import ModalForm from "../components/ModalForm";
import { usePocketBase } from "../context/usePocketBase";

import {
  CurrencyDollarIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";

const Pagos = () => {
  const { pb } = usePocketBase();
  const [pagosList, setPagosList] = useState([]);
  const [sociosList, setSociosList] = useState([]);
  const [planesList, setPlanesList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPago, setCurrentPago] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [pagoToDelete, setPagoToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState("pagos"); // pagos, planes, vencimientos
  const [loading, setLoading] = useState(true);

  // Efecto para cargar datos iniciales desde PocketBase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Cargar pagos
        const pagosResult = await pb.collection("pagos").getList(1, 50, {
          sort: "-fecha_pago",
          expand: "socio,membresia",
        });
        setPagosList(pagosResult.items);

        // Cargar socios
        const sociosResult = await pb.collection("socios").getList(1, 100, {
          sort: "Nombre",
        });
        setSociosList(sociosResult.items);

        // Cargar planes (membresias) - quitamos el filtro por activa para ver todos los planes
        const planesResult = await pb.collection("membresias").getList(1, 100, {
          sort: "precio",
        });
        setPlanesList(planesResult.items);

        // Verificar los planes cargados
        console.log("Planes cargados:", planesResult.items);

        setLoading(false);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [pb]);

  // Columnas para la tabla de pagos
  const pagoColumns = [
    {
      key: "socio",
      header: "Socio",
      render: (item) => {
        return item.expand?.socio ? item.expand.socio.Nombre : "Desconocido";
      },
    },
    {
      key: "membresia",
      header: "Plan",
      render: (item) => {
        return item.expand?.membresia
          ? item.expand.membresia.nombre
          : "Desconocido";
      },
    },
    {
      key: "monto",
      header: "Monto",
      render: (item) => `$${item.monto.toLocaleString()}`,
    },
    {
      key: "fecha_pago",
      header: "Fecha",
      render: (item) => formatDate(item.fecha_pago),
    },
    {
      key: "metodo_pago",
      header: "Método de Pago",
    },
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
    {
      key: "comprobante",
      header: "Comprobante",
      render: (item) => (item.comprobante ? "✓" : "-"),
    },
  ];

  // Columnas para la tabla de planes
  const planesColumns = [
    { key: "nombre", header: "Nombre" },
    {
      key: "precio",
      header: "Precio",
      render: (item) => `$${item.precio.toLocaleString()}`,
    },
    {
      key: "duracio_dias",
      header: "Duración",
      render: (item) => `${item.duracio_dias} días`,
    },
    {
      key: "descripcion",
      header: "Descripción",
      render: (item) =>
        item.descripcion
          ? item.descripcion.substring(0, 50) +
            (item.descripcion.length > 50 ? "..." : "")
          : "",
    },
    {
      key: "activa",
      header: "Estado",
      render: (item) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.activa
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {item.activa ? "Activo" : "Inactivo"}
        </span>
      ),
    },
  ];

  // Datos de vencimientos (calculados de los socios)
  const [vencimientos, setVencimientos] = useState([]);

  // Efecto para calcular vencimientos basados en los socios
  useEffect(() => {
    if (sociosList.length === 0) return;

    const hoy = new Date();
    const resultados = sociosList
      .filter((socio) => socio.fecha_vencimiento) // solo aquellos con fecha de vencimiento
      .map((socio) => {
        const fechaVencimiento = new Date(socio.fecha_vencimiento);
        const diasRestantes = Math.ceil(
          (fechaVencimiento - hoy) / (1000 * 60 * 60 * 24)
        );
        const estado =
          diasRestantes < 0
            ? "Vencido"
            : diasRestantes <= 7
            ? "Próximo a vencer"
            : "Activo";

        return {
          id: socio.id,
          nombre: socio.Nombre,
          plan: socio.expand?.membresia?.nombre || "Desconocido",
          estado: estado,
          fechaVencimiento: socio.fecha_vencimiento,
          diasRestantes: diasRestantes,
        };
      })
      .filter(
        (socio) =>
          socio.estado === "Próximo a vencer" || socio.estado === "Vencido"
      );

    setVencimientos(resultados);
  }, [sociosList]);

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

  // Calcular ingresos del mes actual
  const calcularIngresosMes = (pagos) => {
    const hoy = new Date();
    const primerDiaDelMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

    return pagos
      .filter((pago) => {
        const fechaPago = new Date(pago.fecha_pago);
        return fechaPago >= primerDiaDelMes && fechaPago <= hoy;
      })
      .reduce((total, pago) => total + pago.monto, 0);
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
  const confirmDelete = async () => {
    try {
      await pb.collection("pagos").delete(pagoToDelete.id);
      setPagosList(pagosList.filter((pago) => pago.id !== pagoToDelete.id));
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error al eliminar el pago:", error);
      alert("Error al eliminar el pago: " + error.message);
    }
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      // Preparar los datos del pago según la estructura de PocketBase
      const pagoData = {
        socio: formData.get("socioId"),
        membresia: formData.get("planId"),
        monto: parseFloat(formData.get("monto")),
        fecha_pago: formData.get("fecha"),
        metodo_pago: formData.get("metodo"),
        estado: formData.get("estado"),
        field: "Membresia", // Tipo de pago (definido en la colección)
        notas: `Comprobante: ${formData.get("comprobante")}`,
      };

      if (currentPago) {
        // Actualizar pago existente
        await pb.collection("pagos").update(currentPago.id, pagoData);

        // Actualizar la lista local
        setPagosList(
          pagosList.map((pago) =>
            pago.id === currentPago.id ? { ...pago, ...pagoData } : pago
          )
        );
      } else {
        console.log("Enviando datos de nuevo pago:", pagoData);

        // Agregar nuevo pago
        const createdPago = await pb.collection("pagos").create(pagoData);

        console.log("Pago creado:", createdPago);

        // Obtener el pago creado con sus relaciones expandidas
        const newPago = await pb.collection("pagos").getOne(createdPago.id, {
          expand: "socio,membresia",
        });

        console.log("Pago con relaciones expandidas:", newPago);

        // Actualizar la lista local
        setPagosList([newPago, ...pagosList]);

        // Si corresponde, actualizar la fecha de vencimiento del socio
        if (pagoData.field === "Membresia") {
          const socio = sociosList.find((s) => s.id === pagoData.socio);
          const membresia = planesList.find((p) => p.id === pagoData.membresia);

          if (socio && membresia) {
            const fechaPago = new Date(pagoData.fecha_pago);
            const fechaVencimiento = new Date(fechaPago);
            fechaVencimiento.setDate(
              fechaVencimiento.getDate() + membresia.duracio_dias
            );

            await pb.collection("socios").update(socio.id, {
              membresia: membresia.id,
              fecha_vencimiento: fechaVencimiento.toISOString().split("T")[0],
              estado_socio: "Activo",
            });
          }
        }
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error al guardar el pago:", error);
      alert("Error al guardar el pago: " + error.message);
    }
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
              data={planesList}
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
          <p className="text-2xl font-bold">
            ${calcularIngresosMes(pagosList).toLocaleString()}
          </p>
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
              defaultValue={currentPago?.socio || ""}
              required
            >
              <option value="">Seleccionar Socio</option>
              {sociosList.map((socio) => (
                <option key={socio.id} value={socio.id}>
                  {socio.Nombre}
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
              defaultValue={currentPago?.membresia || ""}
              required
            >
              <option value="">Seleccionar Plan</option>
              {planesList && planesList.length > 0 ? (
                planesList.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.nombre} - ${plan.precio}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  Cargando planes...
                </option>
              )}
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
                currentPago?.fecha_pago ||
                new Date().toISOString().split("T")[0]
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
              defaultValue={currentPago?.metodo_pago || ""}
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
