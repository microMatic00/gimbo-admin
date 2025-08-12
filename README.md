# GIMBO Admin - Gestión de Gimnasios

![GIMBO Admin](https://via.placeholder.com/1200x400.png?text=GIMBO+Admin)

## Acerca del Proyecto

GIMBO Admin es una aplicación web para la gestión integral de gimnasios, desarrollada con React y Tailwind CSS. Proporciona una interfaz moderna y responsiva para administrar socios, pagos, asistencias, clases, inventario, personal y más.

## Características Principales

- **Dashboard**: Visualización de métricas clave y actividad reciente
- **Gestión de Socios**: Alta, baja y modificación de miembros
- **Pagos**: Control de planes, pagos y vencimientos
- **Asistencia**: Registro y estadísticas de asistencia
- **Clases**: Programación de clases y gestión de reservas
- **Reportes**: Generación de informes personalizados
- **Inventario**: Control de productos y ventas
- **Staff**: Administración del personal y horarios
- **Cliente App/Web**: Gestión de la aplicación móvil y sitio web

## Tecnologías Utilizadas

- **React**: Biblioteca JavaScript para construir interfaces de usuario
- **React Router**: Enrutamiento para aplicaciones React
- **Tailwind CSS**: Framework CSS utilitario
- **Heroicons**: Conjunto de iconos SVG
- **Recharts**: Biblioteca de gráficos para React
- **Headless UI**: Componentes UI sin estilos
- **React-to-PDF / jsPDF**: Generación de documentos PDF
- **PocketBase**: Base de datos y backend con API autogenerada

## Requisitos

- Node.js 16.x o superior
- npm 8.x o superior

## Instalación

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/tuusuario/gimbo-admin.git
   cd gimbo-admin
   ```

2. Instalar dependencias (asegúrate de tener las versiones específicas para evitar incompatibilidades):

   ```bash
   npm install
   npm install react-router-dom@6.22.1
   npm install tailwindcss@3.3.5 postcss autoprefixer
   npm install pocketbase
   ```

   **Nota sobre dependencias**: Es importante usar la versión 3.3.5 de Tailwind CSS para evitar incompatibilidades con otras dependencias del proyecto. Versiones más recientes pueden causar problemas de compilación.

3. Iniciar el servidor de desarrollo:

   ```bash
   # Modo estándar
   npm run dev

   # Modo compatible con Single Page Application (recomendado si hay problemas de routing)
   npm run spa

   # O usar directamente Vite
   npx vite
   ```

4. Abrir la URL local que se muestra en la terminal

   La URL será similar a: http://localhost:5173/ (o puerto alternativo)

5. **Importante:** Cuando accedas, asegúrate de usar la URL base exacta que muestra la terminal.

   La aplicación utiliza HashRouter para evitar problemas de routing, por lo que las rutas internas funcionarán con el formato: `/#/socios`, `/#/pagos`, etc.
   
6. **Configuración de PocketBase**:

   Sigue las instrucciones en el archivo [POCKETBASE.md](./POCKETBASE.md) para configurar el backend.

   **Solución a problemas de routing (Error 404):**

   Si experimentas problemas de routing (error 404), intenta estos pasos:

   ```bash
   # Navega al directorio del proyecto (ajusta la ruta según tu sistema)
   cd /ruta/a/gimbo-admin

   # Inicia el servidor en modo SPA especial
   npx vite --config vite.spa.config.js
   ```

   Esto iniciará un servidor con una configuración especial que maneja correctamente las rutas SPA.

El servidor de desarrollo se iniciará y mostrará una URL local donde puedes acceder a la aplicación. El puerto puede variar (5173, 5174, 5175...) si otros procesos están usando puertos anteriores. Asegúrate de usar exactamente la URL que muestra la terminal.

## Estructura del Proyecto

```
gimbo-admin/
├── public/               # Archivos públicos
├── src/                  # Código fuente
│   ├── assets/           # Recursos estáticos (imágenes, fuentes)
│   ├── components/       # Componentes reutilizables
│   ├── context/          # Contextos de React (ej. PocketBaseContext)
│   ├── data/             # Datos de ejemplo (mock)
│   ├── lib/              # Utilidades y servicios base
│   ├── pages/            # Páginas/vistas de la aplicación
│   ├── services/         # Servicios específicos de negocio
│   ├── App.jsx           # Componente principal
│   ├── config.js         # Configuración global
│   ├── index.css         # Estilos globales
│   └── main.jsx          # Punto de entrada
├── .gitignore            # Archivos ignorados por Git
├── index.html            # Plantilla HTML
├── package.json          # Dependencias y scripts
├── postcss.config.js     # Configuración de PostCSS
└── tailwind.config.js    # Configuración de Tailwind CSS
```

## Personalización

### Temas

La aplicación incluye un tema claro y oscuro con acentos de color personalizables desde `tailwind.config.js`:

- **Color primario**: Naranja (`#FF5A1F`)
- **Color secundario**: Verde (`#10B981`)

### Componentes Reutilizables

- **Card**: Tarjetas para mostrar métricas
- **Table**: Tabla de datos con búsqueda y paginación
- **ModalForm**: Formularios modales para crear/editar registros
- **Sidebar**: Barra lateral de navegación
- **Navbar**: Barra superior con búsqueda y notificaciones

## Créditos

Desarrollado por GIMBO Team - 2024

---

## Screenshots

![Dashboard](https://via.placeholder.com/800x600.png?text=Dashboard)
![Socios](https://via.placeholder.com/800x600.png?text=Socios)
![Clases](https://via.placeholder.com/800x600.png?text=Clases)
