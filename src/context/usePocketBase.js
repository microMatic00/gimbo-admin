import { useContext } from 'react';
import PocketBaseContext from './PocketBaseContext';

// Hook personalizado para usar el contexto de PocketBase
export const usePocketBase = () => {
  const context = useContext(PocketBaseContext);
  if (context === undefined) {
    throw new Error('usePocketBase debe ser usado dentro de un PocketBaseProvider');
  }
  return context;
};
