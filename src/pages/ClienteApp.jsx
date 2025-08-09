import React, { useState } from "react";
import Card from "../components/Card";
import {
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  UsersIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";

const ClienteApp = () => {
  const [activeTab, setActiveTab] = useState("app");

  // Datos de ejemplo para mostrar en las tarjetas
  const estadisticasApp = [
    {
      titulo: "Descargas Totales",
      valor: "2.4k",
      icono: <DevicePhoneMobileIcon className="h-8 w-8" />,
      color: "primary",
    },
    {
      titulo: "Usuarios Activos",
      valor: "1.8k",
      icono: <UsersIcon className="h-8 w-8" />,
      color: "success",
    },
    {
      titulo: "Crecimiento Mensual",
      valor: "+15%",
      icono: <ArrowTrendingUpIcon className="h-8 w-8" />,
      color: "info",
    },
  ];

  const estadisticasWeb = [
    {
      titulo: "Visitas Mensuales",
      valor: "5.2k",
      icono: <GlobeAltIcon className="h-8 w-8" />,
      color: "primary",
    },
    {
      titulo: "Usuarios Registrados",
      valor: "823",
      icono: <UsersIcon className="h-8 w-8" />,
      color: "success",
    },
    {
      titulo: "Conversión",
      valor: "7.3%",
      icono: <ArrowTrendingUpIcon className="h-8 w-8" />,
      color: "info",
    },
  ];

  // Características de la app
  const caracteristicasApp = [
    {
      nombre: "Reservas de Clases",
      descripcion:
        "Los socios pueden reservar su lugar en las clases y recibir notificaciones de recordatorio.",
      icono: "🗓️",
    },
    {
      nombre: "Seguimiento de Progreso",
      descripcion:
        "Los socios pueden registrar sus entrenamientos y ver su progreso a lo largo del tiempo.",
      icono: "📈",
    },
    {
      nombre: "Pagos Móviles",
      descripcion:
        "Renovación de membresía y pagos de servicios adicionales desde la aplicación.",
      icono: "💳",
    },
    {
      nombre: "Comunicación",
      descripcion:
        "Chat directo con entrenadores y notificaciones push sobre novedades del gimnasio.",
      icono: "💬",
    },
  ];

  // Características de la web
  const caracteristicasWeb = [
    {
      nombre: "Información del Gimnasio",
      descripcion: "Horarios, ubicación, instalaciones y servicios ofrecidos.",
      icono: "🏢",
    },
    {
      nombre: "Blog de Fitness",
      descripcion:
        "Artículos sobre entrenamiento, nutrición y bienestar general.",
      icono: "📝",
    },
    {
      nombre: "Planes y Precios",
      descripcion:
        "Información detallada sobre los diferentes planes y promociones.",
      icono: "💰",
    },
    {
      nombre: "Registro Online",
      descripcion:
        "Formulario para nuevos socios y sistema de reserva de visita inicial.",
      icono: "✏️",
    },
  ];

  // Próximas funcionalidades
  const proximasCaracteristicas = [
    "Rutinas personalizadas",
    "Integración con wearables",
    "Tienda online",
    "Comunidad social interna",
    "Sistema de logros y gamificación",
    "Asesoramiento nutricional",
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark dark:text-light mb-2">
          Cliente App/Web
        </h1>
        <p className="text-dark-light dark:text-light-darker">
          Administra y visualiza la información de la aplicación móvil y sitio
          web para clientes.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <button
              className={`inline-block p-4 rounded-t-lg ${
                activeTab === "app"
                  ? "text-primary border-b-2 border-primary"
                  : "hover:text-primary hover:border-primary"
              }`}
              onClick={() => setActiveTab("app")}
            >
              Aplicación Móvil
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block p-4 rounded-t-lg ${
                activeTab === "web"
                  ? "text-primary border-b-2 border-primary"
                  : "hover:text-primary hover:border-primary"
              }`}
              onClick={() => setActiveTab("web")}
            >
              Sitio Web
            </button>
          </li>
        </ul>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {(activeTab === "app" ? estadisticasApp : estadisticasWeb).map(
          (stat, index) => (
            <Card
              key={index}
              title={stat.titulo}
              value={stat.valor}
              icon={stat.icono}
              color={stat.color}
            />
          )
        )}
      </div>

      {/* Características principales */}
      <div className="bg-white dark:bg-dark-light shadow-md rounded-lg overflow-hidden mb-8">
        <div className="p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold">Características principales</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(activeTab === "app"
              ? caracteristicasApp
              : caracteristicasWeb
            ).map((feature, index) => (
              <div
                key={index}
                className="flex p-4 bg-gray-50 dark:bg-dark rounded-lg"
              >
                <div className="text-3xl mr-4">{feature.icono}</div>
                <div>
                  <h3 className="font-bold text-lg mb-2">{feature.nombre}</h3>
                  <p className="text-dark-light dark:text-light-darker">
                    {feature.descripcion}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mockups / Previews */}
      <div className="bg-white dark:bg-dark-light shadow-md rounded-lg overflow-hidden mb-8">
        <div className="p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold">
            {activeTab === "app"
              ? "Mockups de la Aplicación"
              : "Previews del Sitio Web"}
          </h2>
        </div>
        <div className="p-6 flex justify-center items-center">
          <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-8 text-center w-full">
            <p className="text-dark-light dark:text-light-darker">
              Aquí se mostrarían capturas de pantalla o mockups del{" "}
              {activeTab === "app" ? "diseño de la aplicación" : "sitio web"}.
            </p>
            <button className="mt-4 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg">
              Ver Diseños
            </button>
          </div>
        </div>
      </div>

      {/* Próximas funcionalidades */}
      <div className="bg-white dark:bg-dark-light shadow-md rounded-lg overflow-hidden">
        <div className="p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold">Próximas funcionalidades</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {proximasCaracteristicas.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-dark rounded-lg p-4 flex items-center"
              >
                <div className="h-3 w-3 rounded-full bg-primary mr-3"></div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <button className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg">
              Sugerir Nueva Funcionalidad
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClienteApp;
