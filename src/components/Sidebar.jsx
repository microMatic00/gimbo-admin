import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  UserGroupIcon,
  CreditCardIcon,
  ClipboardDocumentCheckIcon,
  ChartPieIcon,
  CalendarIcon,
  ShoppingCartIcon,
  UserIcon,
  DevicePhoneMobileIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const menuItems = [
  { name: "Dashboard", path: "/", icon: HomeIcon },
  { name: "Socios", path: "/socios", icon: UserGroupIcon },
  { name: "Pagos", path: "/pagos", icon: CreditCardIcon },
  { name: "Asistencia", path: "/asistencia", icon: ClipboardDocumentCheckIcon },
  { name: "Reportes", path: "/reportes", icon: ChartPieIcon },
  { name: "Clases", path: "/clases", icon: CalendarIcon },
  { name: "Inventario", path: "/inventario", icon: ShoppingCartIcon },
  { name: "Staff", path: "/staff", icon: UserIcon },
  { name: "Cliente App", path: "/cliente-app", icon: DevicePhoneMobileIcon },
];

const Sidebar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 z-40 w-full bg-dark p-4">
        <button
          onClick={toggleMobileMenu}
          className="text-white hover:text-primary-light"
        >
          {mobileMenuOpen ? (
            <XMarkIcon className="h-8 w-8" />
          ) : (
            <Bars3Icon className="h-8 w-8" />
          )}
        </button>
      </div>

      {/* Sidebar for desktop */}
      <div
        className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-dark text-white transform transition-transform duration-300 ease-in-out
        ${
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
      `}
      >
        <div className="p-6">
          <div className="flex items-center justify-center mb-8">
            <h2 className="text-2xl font-bold text-primary">GIMBO</h2>
          </div>

          <nav>
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`
                        flex items-center px-4 py-3 rounded-lg transition-colors
                        ${
                          isActive
                            ? "bg-primary text-white"
                            : "text-light-darker hover:bg-dark-light"
                        }
                      `}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="bg-dark-light rounded-lg p-4 text-sm text-light-darker">
            <p className="font-semibold">Gimbo Admin v1.0</p>
            <p>© {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-20 bg-black bg-opacity-50"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
