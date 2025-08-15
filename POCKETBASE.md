# Configuración de PocketBase para GIMBO Admin

Este documento explica cómo utilizar una instancia existente de PocketBase como backend para GIMBO Admin.

## 1. Uso de una instancia existente de PocketBase

Para este proyecto, estamos utilizando una instalación de PocketBase ya existente en otro proyecto. Esto nos permite compartir la misma base de datos y evitar duplicidades.

1. Asegúrate de que tu instancia de PocketBase esté ejecutándose:

```bash
# Navega al directorio donde tienes tu instalación existente de PocketBase
cd /ruta/a/tu/pocketbase

# Inicia PocketBase si no está corriendo
./pocketbase serve  # Linux/macOS
# o
pocketbase.exe serve  # Windows
```

La instancia de PocketBase debe estar accesible en [http://127.0.0.1:8090](http://127.0.0.1:8090).

## 2. Configuración del Panel de Administración

1. Accede a [http://127.0.0.1:8090/_/](http://127.0.0.1:8090/_/).
2. Crea una cuenta de administrador.

## 3. Estructura de Colecciones Existentes

La base de datos existente ya contiene las siguientes colecciones que utilizaremos en nuestro proyecto:

### Colección: users (colección de autenticación)

- **Campos estándar**: email, username, password
- **Campos adicionales**:
  - `name` (text)
  - `avatar` (file)

### Colección: socios

- `Nombre` (text, required)
- `email` (email, required)
- `telefono` (text)
- `documento` (text)
- `tipo_documento` (select): ["DNI", "Pasaporte", "Otro"]
- `fecha_nacimiento` (date, required)
- `genero` (select): ["Masculino", "Femenino", "Otro"]
- `direccion` (text)
- `estado_socio` (select, required): ["Activo", "Inactivo", "Suspendido"]
- `fecha_inscripcion` (date, required)
- `notas` (editor)
- `foto_carnet` (file)
- `membresia` (relation): referencia a la colección "membresias"
- `fecha_vencimiento` (date)

### Colección: membresias

- `nombre` (text, required)
- `descripcion` (editor)
- `precio` (number, required)
- `duracio_dias` (number, required)
- `activa` (boolean)
- `beneficios` (json)
- `color` (text)

### Colección: asistencias

- `socio` (relation, required): referencia a la colección "socios"
- `fecha_hora_entrada` (date, required)
- `fecha_hora_salida` (date)
- `clase` (relation): referencia a la colección "clases"
- `notas` (text)
- `registrado_por` (relation): referencia a la colección "users"

### Colección: clases

- `nombre` (text, required)
- `descripcion` (editor)
- `instructor` (text, required)
- `dia_semana` (select, required): ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
- `hora_inicio` (text, required)
- `duracion_minutos` (number, required)
- `capacidad_maxima` (number)
- `activa` (boolean)
- `nivel` (select): ["Principiante", "Intermedio", "Avanzado", "Todos"]

### Colección: reservas_clase

- `clase` (relation, required): referencia a la colección "clases"
- `socio` (relation, required): referencia a la colección "socios"
- `fecha` (date, required)
- `estado` (select, required): ["Confirmada", "Cancelada", "Asistió", "Faltó"]
- `creado_en` (date)

### Colección: pagos

- `socio` (relation, required): referencia a la colección "socios"
- `fecha_pago` (date, required)
- `field` (select, required): ["Membresia", "Producto", "Clase Especial", "Otro"]
- `membresia` (relation): referencia a la colección "membresias"
- `monto` (number, required)
- `metodo_pago` (select, required): ["Efectivo", "Tarjeta", "Transferencia", "Otro"]
- `comprobante` (file)
- `usuario` (relation): referencia a la colección "users"
- `estado` (select, required): ["Completado", "Pendiente", "Cancelado"]
- `notas` (text)

### Colección: productos

- `nobre` (text, required) [nota: tiene un error tipográfico, debería ser "nombre"]
- `descripcion` (editor)
- `precio` (number, required)
- `categoria` (select, required): ["Bebida", "Suplemento", "Ropa", "Accesorio", "Otro"]
- `stock` (number, required)
- `activo` (boolean)

### Colección: venta_productos

- `socio` (relation): referencia a la colección "socios"
- `fecha` (date, required)
- `productos` (json)
- `total` (number, required)
- `metodo_pago` (select): ["Efectivo", "Tarjeta", "Transferencia", "Otro"]
- `vendedor` (relation): referencia a la colección "users"
- `estado` (select): ["Completada", "Cancelada"]

### Colección: rutinas

- `nombre` (text, required)
- `descripcion` (editor)
- `nivel` (select): ["Principiante", "Intermedio", "Avanzado"]
- `ejercicios` (json)
- `creador` (relation): referencia a la colección "users"
- `imagen` (file)
- `activa` (boolean)

### Colección: rutinas_asignadas

- `socio` (relation, required): referencia a la colección "socios"
- `rutina` (relation, required): referencia a la colección "rutinas"
- `fecha_asignacion` (date, required)
- `fecha_finalizacion` (date, required)
- `notas` (editor)
- `asignado_por` (relation): referencia a la colección "users"

### Colección: inventario

- `nombre` (text, required)
- `descripcion` (editor)
- `categiria` (select): ["Máquina", "Peso libre", "Cardio", "Accesorio", "Complemento", "Otro"]
- `cantidad` (number)
- `precio_unitario` (number)
- `fecha_compra` (date)
- `proveedor` (text)
- `estado` (select): ["Nuevo", "Bueno", "Regular", "Necesita reparación", "Fuera de servicio"]
- `cod_inventario` (text)
- `notas_mantenimiento` (editor)
- `ultima_revision` (date)
- `proxima_revision` (date)

### Colección: mantenimientos

- `equipo` (relation, required): referencia a la colección "inventario"
- `fecha` (date, required)
- `tipo` (select): ["Preventivo", "Correctivo", "Limpieza"]
- `descripcion` (editor, required)
- `costo` (number)
- `responsable` (text)
- `estado` (select): ["Pendiente", "En proceso", "Completado", "Cancelado"]
- `notas` (editor)

## 4. Permisos Existentes

La base de datos ya tiene configurados los siguientes permisos para las colecciones:

- Colección "users":
  - Ver: Solo el propio usuario (`id = @request.auth.id`)
  - Actualizar: Solo el propio usuario (`id = @request.auth.id`)
  - Eliminar: Solo el propio usuario (`id = @request.auth.id`)

- Colección "socios":
  - Ver: Usuarios autenticados (`@request.auth.id != ""`)
  - Crear: Usuarios autenticados (`@request.auth.id != ""`)
  - Actualizar: Usuarios autenticados (`@request.auth.id != ""`)
  - Eliminar: Usuarios autenticados (`@request.auth.id != ""`)

- Colecciones como "pagos", "asistencias", "inventario", "mantenimientos", etc.:
  - Ver: Usuarios autenticados (`@request.auth.id != ""`)
  - Crear: Usuarios autenticados (`@request.auth.id != ""`)
  - Actualizar: Usuarios autenticados (`@request.auth.id != ""`)
  - Eliminar: Usuarios autenticados (`@request.auth.id != ""`)

Si necesitas refinar los permisos para tu aplicación, puedes modificarlos en la interfaz de administración de PocketBase.

## 5. Configuración Adicional para el Proyecto

### Verificación de CORS

Asegúrate de que tu instancia existente de PocketBase tenga configurado CORS para permitir solicitudes desde tu aplicación GIMBO Admin. Si tienes problemas, ve a "Settings > API" en la interfaz de administración de PocketBase y añade tu dominio de frontend (por ejemplo, `http://localhost:5173`) a la lista de dominios permitidos.

### Verificación de Credenciales

Asegúrate de tener un usuario válido en la colección "users" de PocketBase para poder iniciar sesión en la aplicación GIMBO Admin.

## Uso en el Proyecto

La API de PocketBase está configurada para ser accesible en:

- API Base: `http://127.0.0.1:8090/api/`
- Autenticación: `http://127.0.0.1:8090/api/collections/users/auth-with-password`
- Colecciones: `http://127.0.0.1:8090/api/collections/{coleccion}`

El cliente de JavaScript ya está configurado en nuestra aplicación para usar esta URL base en `src/lib/pocketbase.js`.

## Integración en GIMBO Admin

### Servicios y Modelos

Hemos implementado servicios específicos para cada entidad principal de la aplicación:

- `SociosService`: Gestión de socios del gimnasio
- `MembresiasService`: Gestión de planes y membresías
- `AsistenciasService`: Control de entrada/salida y asistencia
- `ClasesService`: Programación y gestión de clases
- `ReservasClaseService`: Gestión de reservas para clases
- `PagosService`: Registro y control de pagos

Todos estos servicios extienden una clase base `PocketBaseService` que proporciona métodos comunes CRUD.

### Archivos de Referencia

Se han creado archivos JSON de ejemplo en `src/data/` para facilitar el desarrollo:

- `ejemplo-socio.json`: Estructura de un socio
- `ejemplo-membresia.json`: Estructura de una membresía
- `ejemplo-asistencia.json`: Estructura de un registro de asistencia

### Flujos de Trabajo Comunes

1. **Registro de socios**:
   - Crear un socio en la colección `socios`
   - Asignar una membresía de la colección `membresias`
   - Registrar el pago en la colección `pagos`

2. **Control de asistencia**:
   - Registrar entradas/salidas en la colección `asistencias`
   - Consultar historial de asistencia por socio o por fecha

3. **Gestión de clases**:
   - Crear clases en la colección `clases`
   - Gestionar reservas en la colección `reservas_clase`

## Consideraciones de uso compartido

Al utilizar la misma instancia de PocketBase para varios proyectos:

1. **Evita conflictos**: Asegúrate de que las modificaciones de un proyecto no afecten al funcionamiento del otro.

2. **Backups regulares**: Es recomendable hacer copias de seguridad frecuentes copiando el directorio `pb_data`.

3. **Actualizaciones coordinadas**: Si actualizas PocketBase, asegúrate de probar todos los proyectos que dependen de esa instancia.

4. **Separación de datos**: Si en algún momento los proyectos evolucionan en direcciones diferentes, considera crear instancias separadas.
