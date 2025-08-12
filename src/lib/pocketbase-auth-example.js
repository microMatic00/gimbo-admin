// Este archivo es solo para referencia y pruebas
// No se incluye en la aplicación

import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

// Documentación para la versión 0.26.2 de PocketBase
// La API del authStore:
// 
// authStore.onChange: Añade un listener para cambios en la autenticación
// - En esta versión, parece que no hay un método offChange
// 
// Para la versión 0.26.2, la forma correcta de gestionar los listeners es:
// 1. Guardar la referencia al callback en una variable
const callback = () => {
  console.log('Auth state changed');
};

// 2. Añadir el listener
pb.authStore.onChange(callback);

// 3. Para "eliminar" el listener, no hay método offChange, pero podemos:
// a) Añadir un nuevo callback vacío que reemplace al anterior
pb.authStore.onChange(() => {});

// O alternativamente:
// b) Usar una librería de eventos personalizada si necesitamos más control
