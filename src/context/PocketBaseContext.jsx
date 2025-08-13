import React, { createContext, useState, useEffect, useRef } from 'react';
import pb from '../lib/pocketbase';

// Crear el contexto
const PocketBaseContext = createContext();

// Proveedor del contexto
export const PocketBaseProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(pb.authStore.model);
  const [isAuthenticated, setIsAuthenticated] = useState(pb.authStore.isValid);
  const [loading, setLoading] = useState(true);
  
  // Usar useRef para mantener una referencia al callback
  // y asegurarnos de que podemos limpiarlo correctamente
  const authChangeCallback = useRef(null);

  // Efecto para escuchar cambios en la autenticación
  useEffect(() => {
    // Callback para actualizar el estado cuando cambia la autenticación
    const onAuthChange = (token, model) => {
      setIsAuthenticated(pb.authStore.isValid);
      setCurrentUser(model);
    };
    
    // Guardar la referencia al callback
    authChangeCallback.current = onAuthChange;

    // Suscribirse a los cambios de autenticación
    pb.authStore.onChange(onAuthChange);

    // Verificar la autenticación inicial
    setLoading(false);

    // Limpiar la suscripción al desmontar
    return () => {
      // En PocketBase 0.26.2, no existe offChange
      // Reemplazamos el callback con una función vacía
      pb.authStore.onChange(() => {});
      // También limpiamos la referencia
      authChangeCallback.current = null;
    };
  }, []);

  // Función de login
  const login = async (email, password) => {
    try {
      // En PocketBase 0.26.2 la función authWithPassword devuelve
      // un objeto con los campos token y record
      const authData = await pb
        .collection('users')
        .authWithPassword(email, password);
      
      // Actualizar el estado local explícitamente
      setCurrentUser(authData.record);
      setIsAuthenticated(true);
      
      return { success: true, user: authData.record };
    } catch (error) {
      console.error("Error de autenticación:", error);
      return { success: false, error: error.message || "Error al iniciar sesión" };
    }
  };

  // Función de logout
  const logout = () => {
    pb.authStore.clear();
    // Actualizar el estado local explícitamente después de logout
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  // Función para registrar un nuevo usuario
  const register = async (userData) => {
    try {
      const record = await pb.collection('users').create(userData);
      return { success: true, user: record };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Valores expuestos en el contexto
  const value = {
    pb,
    currentUser,
    isAuthenticated,
    loading,
    login,
    logout,
    register
  };

  return (
    <PocketBaseContext.Provider value={value}>
      {children}
    </PocketBaseContext.Provider>
  );
};

export default PocketBaseContext;
