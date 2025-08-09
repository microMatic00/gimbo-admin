import React from "react";
import {
  UserGroupIcon,
  CreditCardIcon,
  ChartBarIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";
import Card from "../components/Card";
import { estadisticas } from "../data/mockData";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Dashboard = () => {
  // Colores para gráficas
  const COLORS = [
    "#FF5A1F",
    "#10B981",
    "#3B82F6",
    "#8B5CF6",
    "#EC4899",
    "#F59E0B",
    "#6366F1",
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          title="Socios Activos"
          value={estadisticas.sociosActivos}
          icon={<UserGroupIcon className="text-white" />}
          color="primary"
          percentage="8%"
          isUp={true}
        />
        <Card
          title="Ingresos del Mes"
          value={`$${estadisticas.ingresosMes.toLocaleString()}`}
          icon={<CreditCardIcon className="text-white" />}
          color="secondary"
          percentage="5%"
          isUp={true}
        />
        <Card
          title="Asistencia Diaria Promedio"
          value={estadisticas.asistenciaPromedioDiaria}
          icon={<ClipboardDocumentCheckIcon className="text-white" />}
          color="info"
          percentage="3%"
          isUp={false}
        />
        <Card
          title="Ventas de Productos"
          value={`$${estadisticas.ventasProductosMes.toLocaleString()}`}
          icon={<ChartBarIcon className="text-white" />}
          color="warning"
          percentage="12%"
          isUp={true}
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ingresos Mensuales - Línea */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Ingresos Mensuales</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={estadisticas.ingresosMensuales}
                margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [
                    `$${value.toLocaleString()}`,
                    "Ingresos",
                  ]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="ingresos"
                  stroke="#FF5A1F"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Asistencia Semanal - Barras */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Asistencia Semanal</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={estadisticas.asistenciaSemanal}
                margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dia" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="cantidad" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribución de Planes - Pie */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Distribución de Planes</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={estadisticas.distribucionPlanes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="cantidad"
                >
                  {estadisticas.distribucionPlanes.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [value, name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Horarios Pico - Barras */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Horarios Pico</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={estadisticas.horariosPico}
                margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="horario" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="promedio" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Resumen de Actividades Recientes */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Actividades Recientes</h2>
        <div className="space-y-4">
          <div className="flex items-center border-l-4 border-primary pl-3">
            <div className="ml-3">
              <p className="text-sm font-medium">
                Carlos Rodríguez registró asistencia
              </p>
              <p className="text-xs text-gray-500">Hoy, 08:45</p>
            </div>
          </div>
          <div className="flex items-center border-l-4 border-secondary pl-3">
            <div className="ml-3">
              <p className="text-sm font-medium">
                Nueva venta de producto: Proteína Whey 1kg
              </p>
              <p className="text-xs text-gray-500">Hoy, 10:30</p>
            </div>
          </div>
          <div className="flex items-center border-l-4 border-blue-500 pl-3">
            <div className="ml-3">
              <p className="text-sm font-medium">
                Clase de Yoga: 12/15 cupos reservados
              </p>
              <p className="text-xs text-gray-500">Para mañana, 09:00</p>
            </div>
          </div>
          <div className="flex items-center border-l-4 border-amber-500 pl-3">
            <div className="ml-3">
              <p className="text-sm font-medium">
                Nuevo socio registrado: Valentina Díaz
              </p>
              <p className="text-xs text-gray-500">Ayer, 16:20</p>
            </div>
          </div>
          <div className="flex items-center border-l-4 border-red-500 pl-3">
            <div className="ml-3">
              <p className="text-sm font-medium">
                Alerta: Stock bajo en Pre-Entreno 300g
              </p>
              <p className="text-xs text-gray-500">Ayer, 18:45</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
