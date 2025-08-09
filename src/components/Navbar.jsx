import React, { useState, useEffect } from "react";
import {
  BellIcon,
  Cog6ToothIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("darkMode") === "true" ||
        window.matchMedia("(prefers-color-scheme: dark)").matches
      );
    }
    return false;
  });

  // Obtener el título de la página actual basado en la ruta
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/") return "Dashboard";
    return path.charAt(1).toUpperCase() + path.slice(2).replace(/-/g, " ");
  };

  // Efecto para aplicar el tema oscuro
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // Función para cambiar el tema
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="bg-white dark:bg-dark shadow-sm h-16 flex items-center justify-between px-4 md:px-6 lg:ml-64 z-10">
      <h1 className="text-xl font-bold text-dark dark:text-light">
        {getPageTitle()}
      </h1>

      <div className="hidden md:flex items-center bg-gray-100 dark:bg-dark-light rounded-md px-3 py-2 flex-1 mx-4 max-w-md">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Buscar..."
          className="bg-transparent border-none focus:outline-none focus:ring-0 w-full text-sm dark:text-light-dark"
        />
      </div>

      <div className="flex items-center space-x-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-light transition-colors"
        >
          {darkMode ? (
            <SunIcon className="h-6 w-6 text-yellow-300" />
          ) : (
            <MoonIcon className="h-6 w-6 text-dark-light" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-light"
          >
            <BellIcon className="h-6 w-6 text-dark-light dark:text-light-darker" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-primary rounded-full"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark rounded-md shadow-lg py-2 z-20">
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-sm font-semibold text-gray-600 dark:text-light-darker">
                  Notificaciones
                </h2>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-light border-l-4 border-primary">
                  <p className="text-sm font-medium dark:text-light">
                    Vencimiento de membresía
                  </p>
                  <p className="text-xs text-gray-500 dark:text-light-darker">
                    Juan Pérez - Vence en 3 días
                  </p>
                </div>
                <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-light">
                  <p className="text-sm font-medium dark:text-light">
                    Nueva reserva de clase
                  </p>
                  <p className="text-xs text-gray-500 dark:text-light-darker">
                    Yoga - 15:00 hs
                  </p>
                </div>
                <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-light">
                  <p className="text-sm font-medium dark:text-light">
                    Producto bajo stock
                  </p>
                  <p className="text-xs text-gray-500 dark:text-light-darker">
                    Proteína XYZ - 2 unidades
                  </p>
                </div>
              </div>
              <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                <button className="text-primary text-sm hover:underline w-full text-center">
                  Ver todas las notificaciones
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-light">
          <Cog6ToothIcon className="h-6 w-6 text-dark-light dark:text-light-darker" />
        </button>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2"
          >
            <UserCircleIcon className="h-8 w-8 text-dark-light dark:text-light-darker" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark rounded-md shadow-lg py-1 z-20">
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-light-darker hover:bg-gray-100 dark:hover:bg-dark-light"
              >
                Mi Perfil
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-light-darker hover:bg-gray-100 dark:hover:bg-dark-light"
              >
                Configuración
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-light-darker hover:bg-gray-100 dark:hover:bg-dark-light"
              >
                Cerrar Sesión
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
