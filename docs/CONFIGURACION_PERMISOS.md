# Configuración de Permisos en PocketBase

## Problema Actual

El error `403 (Forbidden): Only admins can perform this action` indica que las colecciones en PocketBase están configuradas para permitir acceso solo a administradores.

## Solución: Configurar Reglas de Acceso

### 1. Acceder al Admin de PocketBase

1. Ve a tu instancia de PocketBase: `https://back-gimbo.onrender.com/_/`
2. Inicia sesión como administrador

### 2. Configurar Reglas para la Colección "clases"

1. Ve a **Collections** → **clases**
2. Haz clic en **API Rules**
3. Configura las siguientes reglas:

#### List/Search Rule (Ver todas las clases)
```javascript
// Permitir a usuarios autenticados ver clases activas
@request.auth.id != "" && activa = true
```

#### View Rule (Ver una clase específica)
```javascript
// Permitir a usuarios autenticados ver cualquier clase
@request.auth.id != ""
```

#### Create Rule (Crear clases)
```javascript
// Solo administradores y managers pueden crear clases
@request.auth.role = "admin" || @request.auth.role = "manager"
```

#### Update Rule (Actualizar clases)
```javascript
// Solo administradores y managers pueden actualizar clases
@request.auth.role = "admin" || @request.auth.role = "manager"
```

#### Delete Rule (Eliminar clases)
```javascript
// Solo administradores pueden eliminar clases
@request.auth.role = "admin"
```

### 3. Configurar Reglas para la Colección "reservas_clase"

#### List/Search Rule
```javascript
// Usuarios pueden ver sus propias reservas, staff puede ver todas
@request.auth.id != "" && (socio = @request.auth.id || @request.auth.role != "")
```

#### View Rule
```javascript
// Usuarios pueden ver sus propias reservas, staff puede ver todas
@request.auth.id != "" && (socio = @request.auth.id || @request.auth.role != "")
```

#### Create Rule
```javascript
// Usuarios autenticados pueden crear reservas
@request.auth.id != ""
```

#### Update Rule
```javascript
// Solo el socio dueño de la reserva o staff puede actualizarla
@request.auth.id != "" && (socio = @request.auth.id || @request.auth.role != "")
```

#### Delete Rule
```javascript
// Solo el socio dueño de la reserva o staff puede eliminarla
@request.auth.id != "" && (socio = @request.auth.id || @request.auth.role != "")
```

### 4. Configurar Reglas para la Colección "socios"

#### List/Search Rule
```javascript
// Staff puede ver todos los socios, socios solo pueden verse a sí mismos
@request.auth.id != "" && (@request.auth.role != "" || id = @request.auth.id)
```

#### View Rule
```javascript
// Staff puede ver cualquier socio, socios solo pueden verse a sí mismos
@request.auth.id != "" && (@request.auth.role != "" || id = @request.auth.id)
```

#### Create Rule
```javascript
// Solo staff puede crear socios
@request.auth.role = "admin" || @request.auth.role = "manager" || @request.auth.role = "receptionist"
```

#### Update Rule
```javascript
// Staff puede actualizar cualquier socio, socios pueden actualizar sus propios datos
@request.auth.id != "" && (@request.auth.role != "" || id = @request.auth.id)
```

#### Delete Rule
```javascript
// Solo administradores pueden eliminar socios
@request.auth.role = "admin"
```

## Estructura de Roles Sugerida

### En la colección "users"
Agregar un campo `role` con las siguientes opciones:
- `admin`: Acceso completo
- `manager`: Gestión de gimnasio (sin eliminar datos críticos)
- `trainer`: Instructor (ver clases, reservas)
- `receptionist`: Recepcionista (gestión de socios, pagos)
- `member`: Socio (acceso limitado a sus propios datos)

## Validación de Cambios

1. Guarda los cambios en cada colección
2. Recarga la aplicación frontend
3. Verifica que las operaciones CRUD funcionen correctamente

## Reglas Alternativas (Más Permisivas para Testing)

Si necesitas hacer pruebas rápidas, puedes usar reglas más permisivas temporalmente:

### Para todas las operaciones en modo desarrollo:
```javascript
// SOLO PARA DESARROLLO - NO USAR EN PRODUCCIÓN
@request.auth.id != ""
```

**⚠️ IMPORTANTE:** Estas reglas permisivas solo deben usarse en desarrollo. En producción, usa las reglas específicas por rol.

## Troubleshooting

### Error 403 persiste después de configurar reglas
1. Verifica que el usuario esté correctamente autenticado
2. Confirma que el campo `role` existe en el usuario
3. Revisa los logs de PocketBase para ver qué regla está fallando

### Usuario sin rol definido
Si un usuario no tiene rol, puedes asignarle uno por defecto o crear una regla que maneje usuarios sin rol:
```javascript
@request.auth.id != "" && (@request.auth.role != "" || @request.auth.verified = true)
```
