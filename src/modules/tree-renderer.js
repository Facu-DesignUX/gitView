// src/modules/tree-renderer.js
import { GitHubAPI } from '../api/github.js';
import { store } from '../state/store.js';
import { getFileIcon } from '../ui/utils/file-icons.js';

export class TreeRenderer {
    constructor(container) {
        this.container = container;
    }

    // Renderiza la raíz inicial que recibe de la API
    renderRoot(items) {
        this.container.innerHTML = '';
        const ul = this.createList(items);
        this.container.appendChild(ul);
        feather.replace(); // Dibuja los iconos
    }

    // Crea el elemento <ul> iterando sobre los items de forma recursiva
    createList(items) {
        const ul = document.createElement('ul');
        ul.className = 'tree-list';

        // Ordenamos: primero las carpetas, luego los archivos
        items.sort((a, b) => {
            if (a.type === b.type) return a.name.localeCompare(b.name);
            return a.type === 'dir' ? -1 : 1;
        });

        items.forEach(item => {
            const li = document.createElement('li');
            li.className = 'tree-item';
            
            const label = document.createElement('div');
            label.className = 'tree-item-label';
            
            const iconName = getFileIcon(item.name, item.type);
            
            label.innerHTML = `
                <i data-feather="${iconName}"></i>
                <span>${item.name}</span>
                ${item.type === 'dir' ? '<i data-feather="chevron-right" class="chevron-icon"></i>' : ''}
            `;

            const childrenContainer = document.createElement('div');
            childrenContainer.className = 'tree-children';
            
            li.appendChild(label);
            li.appendChild(childrenContainer);

            // Manejamos el click en la carpeta o archivo
            label.addEventListener('click', async (e) => {
                e.stopPropagation();
                
                // Efecto visual de seleccionado
                document.querySelectorAll('.tree-item-label').forEach(el => el.classList.remove('active'));
                label.classList.add('active');

                if (item.type === 'dir') {
                    await this.toggleFolder(item, li, childrenContainer);
                } else if (item.type === 'file') {
                    this.selectFile(item);
                }
            });

            ul.appendChild(li);
        });

        return ul;
    }

    async toggleFolder(item, li, childrenContainer) {
        const isExpanded = li.classList.contains('expanded');
        
        if (isExpanded) {
            // Colapsar
            li.classList.remove('expanded');
        } else {
            // Expandir
            li.classList.add('expanded');
            
            // Si ya tiene hijos, no volvemos a descargar de GitHub
            if (childrenContainer.hasChildNodes()) return;

            // Mostrar "Cargando..."
            childrenContainer.innerHTML = '<div class="tree-loading"><i data-feather="loader"></i> Cargando...</div>';
            feather.replace();

            try {
                const { currentRepo } = store.getState();
                // Llamamos a la API con la ruta de esta subcarpeta
                const children = await GitHubAPI.fetchContents(currentRepo.owner.login, currentRepo.name, item.path);
                
                childrenContainer.innerHTML = ''; 
                const ul = this.createList(children);
                childrenContainer.appendChild(ul);
                feather.replace();
            } catch (error) {
                console.error(error);
                childrenContainer.innerHTML = `<div class="tree-loading" style="color: #f56565;">Error al cargar</div>`;
            }
        }
    }

    selectFile(item) {
        // Actualizamos el Store global avisando que se seleccionó un archivo
        store.setState({ selectedFile: item });
        console.log('Archivo seleccionado (se visualizará en Etapa 4):', item.path);
    }
}
