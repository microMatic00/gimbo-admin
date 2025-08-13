# Manejo de solicitudes en PocketBase

Este documento proporciona orientación sobre cómo manejar correctamente las solicitudes a PocketBase para evitar errores de autocancelación.

## Problema: ClientResponseError 0: The request was autocancelled

El SDK de PocketBase JS tiene un mecanismo de autocancelación que automáticamente cancela solicitudes previas cuando se hace una nueva solicitud similar. Esto puede causar errores como:

```
ClientResponseError 0: The request was autocancelled. 
You can find more info in https://github.com/pocketbase/js-sdk#auto-cancellation.
```

Estos errores suelen aparecer en la consola y ocurren cuando:

1. Se realizan múltiples solicitudes similares en sucesión rápida
2. Un componente se desmonta antes de que se complete una solicitud
3. Una ruta cambia mientras las solicitudes están pendientes

## Solución implementada

Hemos implementado un sistema mejorado para manejar estas solicitudes utilizando AbortControllers y opciones personalizadas:

### 1. En PocketBaseService

La clase `PocketBaseService` ha sido mejorada con:

- Un registro de controladores de cancelación (`abortControllers`)
- Soporte para desactivar la autocancelación (`$autoCancel: false`)
- Claves de cancelación personalizadas (`$cancelKey`)
- Manejo de errores específico para ignorar errores de cancelación
- Un método `abortAll()` para limpiar todas las solicitudes pendientes

### 2. En componentes

Los componentes que realizan solicitudes a PocketBase deben:

- Desactivar la autocancelación cuando sea apropiado
- Usar claves de cancelación únicas
- Limpiar las solicitudes pendientes cuando se desmonten

## Ejemplo de uso

```jsx
// Crear una instancia del servicio
const miServicio = new MiColeccionService();

// En un useEffect
useEffect(() => {
  const cargarDatos = async () => {
    try {
      const resultado = await miServicio.getAll({
        $autoCancel: false,
        $cancelKey: `mi-operacion-${Date.now()}`
      });
      // Procesar resultado
    } catch (err) {
      if (err.name !== 'AbortError') {
        // Manejar errores que no sean de cancelación
      }
    }
  };

  cargarDatos();

  // Función de limpieza
  return () => {
    miServicio.abortAll();
  };
}, [dependencias]);
```

## Consideraciones

- **Rendimiento**: Desactivar la autocancelación puede causar solicitudes innecesarias si no se manejan correctamente. Asegúrate de cancelar manualmente las solicitudes cuando ya no sean relevantes.

- **Errores**: Siempre verifica si un error es de tipo `AbortError` antes de mostrar mensajes de error al usuario.

- **Claves de cancelación**: Usa claves de cancelación descriptivas y únicas para facilitar la depuración.

## Referencias

- [Documentación oficial de PocketBase JS SDK](https://github.com/pocketbase/js-sdk#auto-cancellation)
- [MDN: AbortController](https://developer.mozilla.org/es/docs/Web/API/AbortController)
