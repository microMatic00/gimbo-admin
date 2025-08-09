import React, { useState } from "react";
import Table from "../components/Table";
import Card from "../components/Card";
import ModalForm from "../components/ModalForm";
import { productos, ventas } from "../data/mockData";
import {
  ShoppingCartIcon,
  ArchiveBoxIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

const Inventario = () => {
  const [activeTab, setActiveTab] = useState("productos");
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  // Columnas para la tabla de productos
  const columnasProductos = [
    { header: "ID", accessor: "id" },
    { header: "Producto", accessor: "nombre" },
    { header: "Categoría", accessor: "categoria" },
    { header: "Stock", accessor: "stock" },
    {
      header: "Precio",
      accessor: "precio",
      cell: (value) => `$${value.toFixed(2)}`,
    },
    { header: "Proveedor", accessor: "proveedor" },
    { header: "Último Ingreso", accessor: "ultimoIngreso" },
  ];

  // Columnas para la tabla de ventas
  const columnasVentas = [
    { header: "ID", accessor: "id" },
    { header: "Fecha", accessor: "fecha" },
    { header: "Producto", accessor: "producto" },
    { header: "Cantidad", accessor: "cantidad" },
    {
      header: "Total",
      accessor: "total",
      cell: (value) => `$${value.toFixed(2)}`,
    },
    { header: "Cliente", accessor: "cliente" },
    { header: "Vendedor", accessor: "vendedor" },
  ];

  // Campos para el formulario de productos
  const camposFormulario = [
    { name: "nombre", label: "Nombre", type: "text", required: true },
    {
      name: "categoria",
      label: "Categoría",
      type: "select",
      options: ["Suplementos", "Ropa", "Accesorios", "Bebidas", "Otros"],
      required: true,
    },
    { name: "stock", label: "Stock", type: "number", required: true },
    {
      name: "precio",
      label: "Precio",
      type: "number",
      step: "0.01",
      required: true,
    },
    { name: "proveedor", label: "Proveedor", type: "text", required: true },
    { name: "descripcion", label: "Descripción", type: "textarea" },
  ];

  // Función para manejar la edición de un producto
  const handleEdit = (product) => {
    setCurrentProduct(product);
    setShowModal(true);
  };

  // Función para manejar la eliminación de un producto
  const handleDelete = (id) => {
    console.log(`Eliminar producto con ID: ${id}`);
    // Aquí iría la lógica para eliminar un producto
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (formData) => {
    if (currentProduct) {
      console.log("Producto editado:", formData);
    } else {
      console.log("Nuevo producto:", formData);
    }
    setShowModal(false);
    setCurrentProduct(null);
  };

  // Estadísticas para las tarjetas
  const estadisticas = [
    {
      titulo: "Total Productos",
      valor: productos.length,
      icono: <ArchiveBoxIcon className="h-8 w-8" />,
      color: "primary",
    },
    {
      titulo: "Bajo Stock",
      valor: productos.filter((p) => p.stock < 10).length,
      icono: <ShoppingCartIcon className="h-8 w-8" />,
      color: "warning",
    },
    {
      titulo: "Ventas del Mes",
      valor: ventas.filter(
        (v) =>
          new Date(v.fecha) >
          new Date(new Date().setDate(new Date().getDate() - 30))
      ).length,
      icono: <ShoppingCartIcon className="h-8 w-8" />,
      color: "success",
    },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark dark:text-light mb-2">
          Inventario
        </h1>
        <p className="text-dark-light dark:text-light-darker">
          Gestiona el inventario de productos y las ventas realizadas.
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
                activeTab === "productos"
                  ? "text-primary border-b-2 border-primary"
                  : "hover:text-primary hover:border-primary"
              }`}
              onClick={() => setActiveTab("productos")}
            >
              Productos
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block p-4 rounded-t-lg ${
                activeTab === "ventas"
                  ? "text-primary border-b-2 border-primary"
                  : "hover:text-primary hover:border-primary"
              }`}
              onClick={() => setActiveTab("ventas")}
            >
              Ventas
            </button>
          </li>
        </ul>
      </div>

      {/* Contenido según tab activo */}
      <div className="bg-white dark:bg-dark-light shadow-md rounded-lg overflow-hidden">
        <div className="p-4 flex justify-between items-center border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold">
            {activeTab === "productos"
              ? "Listado de Productos"
              : "Historial de Ventas"}
          </h2>
          {activeTab === "productos" && (
            <button
              onClick={() => {
                setCurrentProduct(null);
                setShowModal(true);
              }}
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Nuevo Producto
            </button>
          )}
        </div>

        {/* Tabla de datos */}
        {activeTab === "productos" ? (
          <Table
            data={productos}
            columns={columnasProductos}
            onEdit={handleEdit}
            onDelete={handleDelete}
            searchable={true}
            pagination={true}
          />
        ) : (
          <Table
            data={ventas}
            columns={columnasVentas}
            searchable={true}
            pagination={true}
          />
        )}
      </div>

      {/* Modal para crear/editar productos */}
      <ModalForm
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setCurrentProduct(null);
        }}
        title={currentProduct ? "Editar Producto" : "Nuevo Producto"}
        fields={camposFormulario}
        initialValues={currentProduct || {}}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Inventario;
