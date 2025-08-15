import React, { useState, useEffect, useRef } from 'react';
import pb from '../lib/pocketbase';

const PocketbaseStatus = () => {
  const [status, setStatus] = useState('desconectado');
  const [isLoading, setIsLoading] = useState(true);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    const checkConnection = async () => {
      // Cancelar cualquier solicitud anterior
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // Crear un nuevo AbortController
      abortControllerRef.current = new AbortController();
      
      try {
        // Intentamos una conexión básica con PocketBase con opciones de no autocancelación
        await pb.health.check({
          $autoCancel: false,
          $cancelKey: `health-check-${Date.now()}`,
          signal: abortControllerRef.current.signal
        });
        setStatus('conectado');
      } catch (error) {
        // Solo mostramos el error si no es por una cancelación intencional
        if (error.name !== 'AbortError') {
          console.error('Error de conexión a PocketBase:', error);
          setStatus('error');
        }
      } finally {
        if (abortControllerRef.current) {
          setIsLoading(false);
        }
      }
    };

    checkConnection();
    
    // Verificar la conexión cada 30 segundos
    const interval = setInterval(checkConnection, 30000);
    
    return () => {
      clearInterval(interval);
      // Cancelar cualquier solicitud pendiente cuando se desmonte el componente
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium">
      <div 
        className={`w-2 h-2 mr-2 rounded-full ${
          isLoading ? 'bg-yellow-500' : 
          status === 'conectado' ? 'bg-green-500' : 'bg-red-500'
        }`}
      />
      <span>
        {isLoading ? 'Verificando DB...' : 
         status === 'conectado' ? 'DB Conectada' : 'Error de DB'}
      </span>
    </div>
  );
};

export default PocketbaseStatus;