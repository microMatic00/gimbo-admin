import React, { useState } from "react";
import {
  ChartPieIcon,
  DocumentArrowDownIcon,
  TableCellsIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import { socios, asistencias, pagos, ventas } from "../data/mockData";

const Reportes = () => {
  const [reportType, setReportType] = useState("");
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });
  const [format, setFormat] = useState("pdf");
  const [loading, setLoading] = useState(false);
  const [generatedReports, setGeneratedReports] = useState([
    {
      id: 1,
      name: "Informe Mensual de Socios",
      type: "socios",
      date: "2025-07-31",
      format: "pdf",
      size: "1.2 MB",
    },
    {
      id: 2,
      name: "Reporte de Ventas Q2",
      type: "ventas",
      date: "2025-06-30",
      format: "excel",
      size: "3.5 MB",
    },
    {
      id: 3,
      name: "Estadísticas de Asistencia Junio",
      type: "asistencias",
      date: "2025-06-30",
      format: "pdf",
      size: "2.1 MB",
    },
    {
      id: 4,
      name: "Balance de Pagos 2025-H1",
      type: "pagos",
      date: "2025-06-30",
      format: "excel",
      size: "4.2 MB",
    },
  ]);

  // Lista de tipos de reportes
  const reportTypes = [
    {
      id: "socios",
      name: "Socios",
      icon: ChartPieIcon,
      description:
        "Informe detallado de socios activos, nuevos registros y bajas",
    },
    {
      id: "asistencias",
      name: "Asistencias",
      icon: CalendarDaysIcon,
      description:
        "Estadísticas de asistencia diaria, semanal y por franjas horarias",
    },
    {
      id: "pagos",
      name: "Pagos",
      icon: DocumentArrowDownIcon,
      description: "Reporte financiero de pagos, planes y vencimientos",
    },
    {
      id: "ventas",
      name: "Ventas",
      icon: TableCellsIcon,
      description: "Informe de ventas de productos y estado del inventario",
    },
  ];

  // Generar un reporte
  const handleGenerateReport = () => {
    setLoading(true);

    // Simulamos una generación de reporte con un timeout
    setTimeout(() => {
      const reportTypeName = reportTypes.find((r) => r.id === reportType)?.name;

      // Añadir el nuevo reporte generado a la lista
      const newReport = {
        id: generatedReports.length + 1,
        name: `${reportTypeName} - ${formatDate(
          dateRange.start
        )} al ${formatDate(dateRange.end)}`,
        type: reportType,
        date: new Date().toISOString().split("T")[0],
        format: format,
        size: (Math.random() * 3 + 0.5).toFixed(1) + " MB",
      };

      setGeneratedReports([newReport, ...generatedReports]);
      setLoading(false);

      // Mostrar alerta de éxito
      alert(`Reporte generado con éxito: ${newReport.name}`);
    }, 1500);
  };

  // Formatear fecha para mostrar
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  // Iconos según formato
  const getFormatIcon = (format) => {
    switch (format) {
      case "pdf":
        return (
          <svg
            className="h-5 w-5 text-red-600"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12.8,4.8H19.6V24H4.4V0H12.8ZM14,1.2V4.8H17.6Z" />
          </svg>
        );
      case "excel":
        return (
          <svg
            className="h-5 w-5 text-green-600"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M14,1.2V4.8H17.6Z M12.8,4.8H19.6V24H4.4V0H12.8Z M8.8,13.2L10.4,16.8L12,13.2H14L11.6,18L14,22.8H12L10.4,19.2L8.8,22.8H6.8L9.2,18L6.8,13.2Z" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Obtener resumen de datos para mostrar en las tarjetas
  const getSummaryData = () => {
    return {
      socios: {
        total: socios.length,
        activos: socios.filter((s) => s.estado === "Activo").length,
        inactivos: socios.filter((s) => s.estado === "Vencido").length,
      },
      asistencias: {
        total: asistencias.length,
        promedioDiario: Math.round(asistencias.length / 7),
        ultimaSemana: 45,
      },
      pagos: {
        total: pagos.reduce((sum, p) => sum + p.monto, 0),
        count: pagos.length,
        pendientes: 0,
      },
      ventas: {
        total: ventas.reduce((sum, v) => sum + v.monto, 0),
        count: ventas.length,
        productosVendidos: ventas.reduce((sum, v) => sum + v.cantidad, 0),
      },
    };
  };

  const summaryData = getSummaryData();

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Reportes</h1>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-light text-primary mr-4">
              <UserPlusIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Socios</h3>
              <p className="text-xl font-bold">{summaryData.socios.total}</p>
              <p className="text-xs text-gray-500">
                {summaryData.socios.activos} activos
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-secondary-light text-secondary mr-4">
              <CalendarIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Asistencias</h3>
              <p className="text-xl font-bold">
                {summaryData.asistencias.total}
              </p>
              <p className="text-xs text-gray-500">
                Prom. {summaryData.asistencias.promedioDiario}/día
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <CreditCardIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Pagos</h3>
              <p className="text-xl font-bold">
                ${summaryData.pagos.total.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">
                {summaryData.pagos.count} transacciones
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-amber-100 text-amber-600 mr-4">
              <ShoppingCartIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Ventas</h3>
              <p className="text-xl font-bold">
                ${summaryData.ventas.total.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">
                {summaryData.ventas.productosVendidos} productos
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Generador de reportes */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Generador de Reportes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {reportTypes.map((type) => (
            <button
              key={type.id}
              className={`border p-4 rounded-lg flex flex-col items-center text-center transition-all ${
                reportType === type.id
                  ? "border-primary bg-primary-light"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => setReportType(type.id)}
            >
              <type.icon
                className={`h-10 w-10 mb-2 ${
                  reportType === type.id ? "text-primary" : "text-gray-500"
                }`}
              />
              <h3
                className={`font-medium ${
                  reportType === type.id ? "text-primary" : "text-gray-700"
                }`}
              >
                {type.name}
              </h3>
              <p className="text-xs text-gray-500 mt-1">{type.description}</p>
            </button>
          ))}
        </div>

        {reportType && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Inicial
              </label>
              <input
                type="date"
                className="form-input"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange({ ...dateRange, start: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Final
              </label>
              <input
                type="date"
                className="form-input"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange({ ...dateRange, end: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Formato
              </label>
              <select
                className="form-input"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
              >
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
              </select>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            className={`btn btn-primary flex items-center ${
              loading ? "opacity-75 cursor-wait" : ""
            }`}
            onClick={handleGenerateReport}
            disabled={!reportType || loading}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generando...
              </>
            ) : (
              <>
                <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                Generar Reporte
              </>
            )}
          </button>
        </div>
      </div>

      {/* Reportes generados */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Reportes Generados</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tamaño
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {generatedReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getFormatIcon(report.format)}
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {report.name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {report.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(report.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-primary hover:text-primary-dark">
                      <DocumentArrowDownIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Agregamos los iconos que faltan para este componente
import {
  UserPlusIcon,
  CreditCardIcon,
  ShoppingCartIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

export default Reportes;
