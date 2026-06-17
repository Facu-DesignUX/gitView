// src/ui/components/tree-panel.js
import { globalEvents } from '../../state/events.js';
import { TreeRenderer } from '../../modules/tree-renderer.js';

export class TreePanel {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.renderer = null;
        
        // Escucha cambios en el store global
        globalEvents.on('state:changed', (state) => {
            if (state.loading) {
                this.showLoading();
            } else if (state.treeData) {
                this.showTree(state.treeData);
            }
        });
    }

    showLoading() {
        this.container.innerHTML = `
            <div class="panel-placeholder">
                <i data-feather="loader" style="animation: spin 1s linear infinite;"></i>
                <p>Cargando estructura...</p>
            </div>
        `;
        if (window.feather) feather.replace();
    }

    showTree(items) {
        // Limpiamos y creamos un contenedor para el árbol
        this.container.innerHTML = '<div class="tree-container"></div>';
        const treeContainer = this.container.querySelector('.tree-container');
        
        // Delegamos el dibujado real al módulo Renderer
        this.renderer = new TreeRenderer(treeContainer);
        this.renderer.renderRoot(items);
    }
}
