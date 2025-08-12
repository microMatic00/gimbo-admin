import pb from './pocketbase';

// Clase base para servicios de PocketBase
export class PocketBaseService {
  constructor(collectionName) {
    this.collection = collectionName;
    // Crear un controlador de aborto para cada instancia del servicio
    this.abortControllers = {};
  }

  /**
   * Obtiene todos los registros de la colección
   * @param {Object} options Opciones de consulta (filtros, ordenación, etc.)
   */
  async getAll(options = {}) {
    // Cancelar cualquier solicitud anterior para esta operación
    if (this.abortControllers['getAll']) {
      this.abortControllers['getAll'].abort();
    }
    
    // Crear un nuevo controlador de aborto
    this.abortControllers['getAll'] = new AbortController();
    
    try {
      return await pb.collection(this.collection).getList(
        options.page || 1, 
        options.perPage || 50,
        {
          filter: options.filter || '',
          sort: options.sort || '',
          expand: options.expand || '',
          $cancelKey: options.$cancelKey || 'getAll-' + this.collection,
          // Desactivar la autocancelación del SDK
          $autoCancel: options.$autoCancel !== undefined ? options.$autoCancel : false
        }
      );
    } catch (error) {
      // Solo registrar el error si no es por una cancelación intencional
      if (error.name !== 'AbortError') {
        console.error(`Error al obtener registros de ${this.collection}:`, error);
      }
      throw error;
    } finally {
      // Eliminar la referencia al controlador después de completar
      delete this.abortControllers['getAll'];
    }
  }

  /**
   * Obtiene un registro por su ID
   * @param {string} id ID del registro
   * @param {Object} options Opciones adicionales
   */
  async getById(id, options = {}) {
    // Cancelar cualquier solicitud anterior para este ID
    const opKey = `getById-${id}`;
    if (this.abortControllers[opKey]) {
      this.abortControllers[opKey].abort();
    }
    
    // Crear un nuevo controlador de aborto
    this.abortControllers[opKey] = new AbortController();
    
    try {
      const mergedOptions = {
        ...options,
        $cancelKey: options.$cancelKey || `getById-${id}-${this.collection}`,
        $autoCancel: options.$autoCancel !== undefined ? options.$autoCancel : false
      };
      
      return await pb.collection(this.collection).getOne(id, mergedOptions);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error(`Error al obtener registro ${id} de ${this.collection}:`, error);
      }
      throw error;
    } finally {
      delete this.abortControllers[opKey];
    }
  }

  /**
   * Crea un nuevo registro
   * @param {Object} data Datos del nuevo registro
   * @param {Object} options Opciones adicionales
   */
  async create(data, options = {}) {
    const opKey = 'create';
    if (this.abortControllers[opKey]) {
      this.abortControllers[opKey].abort();
    }
    
    this.abortControllers[opKey] = new AbortController();
    
    try {
      const mergedOptions = {
        ...options,
        $cancelKey: options.$cancelKey || `create-${this.collection}`,
        $autoCancel: options.$autoCancel !== undefined ? options.$autoCancel : false
      };
      
      return await pb.collection(this.collection).create(data, mergedOptions);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error(`Error al crear registro en ${this.collection}:`, error);
      }
      throw error;
    } finally {
      delete this.abortControllers[opKey];
    }
  }

  /**
   * Actualiza un registro existente
   * @param {string} id ID del registro
   * @param {Object} data Datos a actualizar
   * @param {Object} options Opciones adicionales
   */
  async update(id, data, options = {}) {
    const opKey = `update-${id}`;
    if (this.abortControllers[opKey]) {
      this.abortControllers[opKey].abort();
    }
    
    this.abortControllers[opKey] = new AbortController();
    
    try {
      const mergedOptions = {
        ...options,
        $cancelKey: options.$cancelKey || `update-${id}-${this.collection}`,
        $autoCancel: options.$autoCancel !== undefined ? options.$autoCancel : false
      };
      
      return await pb.collection(this.collection).update(id, data, mergedOptions);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error(`Error al actualizar registro ${id} en ${this.collection}:`, error);
      }
      throw error;
    } finally {
      delete this.abortControllers[opKey];
    }
  }

  /**
   * Elimina un registro
   * @param {string} id ID del registro a eliminar
   * @param {Object} options Opciones adicionales
   */
  async delete(id, options = {}) {
    const opKey = `delete-${id}`;
    if (this.abortControllers[opKey]) {
      this.abortControllers[opKey].abort();
    }
    
    this.abortControllers[opKey] = new AbortController();
    
    try {
      const mergedOptions = {
        ...options,
        $cancelKey: options.$cancelKey || `delete-${id}-${this.collection}`,
        $autoCancel: options.$autoCancel !== undefined ? options.$autoCancel : false
      };
      
      return await pb.collection(this.collection).delete(id, mergedOptions);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error(`Error al eliminar registro ${id} de ${this.collection}:`, error);
      }
      throw error;
    } finally {
      delete this.abortControllers[opKey];
    }
  }
  
  /**
   * Limpia todos los controladores de aborto activos
   * Útil cuando se desmonta un componente
   */
  abortAll() {
    Object.values(this.abortControllers).forEach(controller => {
      if (controller) {
        controller.abort();
      }
    });
    this.abortControllers = {};
  }
}
