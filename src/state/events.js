// src/state/events.js

export class EventEmitter {
    constructor() {
        this.events = {};
    }

    // Suscribirse a un evento
    on(event, listener) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }

    // Emitir un evento
    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(listener => listener(data));
        }
    }
}

// Exportamos una única instancia global para usarla en toda la aplicación
export const globalEvents = new EventEmitter();
