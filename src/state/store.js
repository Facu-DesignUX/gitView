// src/state/store.js
import { globalEvents } from './events.js';

class Store {
    constructor() {
        this.state = {
            currentRepo: null, // Datos del repositorio actual
            treeData: null,    // Estructura de carpetas
            selectedFile: null,// Archivo .md seleccionado para preview
            loading: false,    // Estado de carga global
            error: null        // Mensaje de error si algo falla
        };
    }

    // Obtener estado actual
    getState() {
        return this.state;
    }

    // Actualizar estado (fusiona los cambios y avisa a los componentes)
    setState(updates) {
        this.state = { ...this.state, ...updates };
        // Emitimos un evento global para que la UI se entere del cambio
        globalEvents.emit('state:changed', this.state);
    }
}

// Instancia global
export const store = new Store();
