# Autenticación con PocketBase en GIMBO Admin

Este documento describe la implementación de autenticación utilizando PocketBase en la aplicación GIMBO Admin.

## Componentes principales

### PocketBaseContext

El contexto de PocketBase (`src/context/PocketBaseContext.jsx`) proporciona las siguientes funcionalidades:

- Estado de autenticación a través de `isAuthenticated`
- Usuario actual a través de `currentUser`
- Funciones para iniciar sesión, cerrar sesión y registrar usuarios
- Manejo de eventos de cambio en la autenticación

### Flujo de autenticación

1. **Inicio de sesión**:
   - El usuario navega a `/login` y proporciona credenciales
   - El componente `Login` llama a la función `login` del contexto
   - Si es exitoso, se redirige al usuario al dashboard
   - Si falla, se muestra un mensaje de error

2. **Cierre de sesión**:
   - El usuario hace clic en "Cerrar sesión" en el Navbar
   - Se llama a la función `logout` del contexto
   - Se redirige al usuario a la pantalla de login

3. **Protección de rutas**:
   - El componente `ProtectedRoute` verifica si el usuario está autenticado
   - Si no lo está, redirige a la página de login
   - Si lo está, muestra el contenido protegido

### Adaptaciones para PocketBase v0.26.2

Se han realizado adaptaciones específicas para la versión 0.26.2 de PocketBase:

- La función `offChange` no existe en esta versión, por lo que se implementó una solución alternativa utilizando `useRef` para mantener referencias a los callbacks
- Al desmontar componentes, se reemplaza el callback de `onChange` con una función vacía para "limpiar" los oyentes anteriores
- Se actualizan explícitamente los estados de autenticación después de iniciar o cerrar sesión

## Flujo de datos

```
PocketBaseContext (proveedor global)
├── usePocketBase (hook personalizado)
│   ├── Login (componente de inicio de sesión)
│   ├── ProtectedRoute (protección de rutas)
│   ├── Navbar (muestra información de usuario y opciones)
│   └── Otros componentes que requieren autenticación
└── pb (cliente de PocketBase)
```

## Mejoras implementadas

1. Redirección automática al dashboard si el usuario ya está autenticado
2. Visualización del nombre de usuario en la barra de navegación
3. Cierre de sesión con redirección a la página de login
4. Manejo de errores en el proceso de inicio de sesión

## Consideraciones de seguridad

- El token de autenticación se almacena en `localStorage` (comportamiento predeterminado de PocketBase)
- Se recomienda implementar una expiración automática de sesiones inactivas
- Para mayor seguridad, considerar migrar a cookies con atributo HttpOnly en el futuro
