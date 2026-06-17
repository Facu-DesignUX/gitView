// src/index.js
import { GitHubAPI } from './api/github.js';
import { store } from './state/store.js';
import { DetailsPanel } from './ui/components/details-panel.js';
import { TreePanel } from './ui/components/tree-panel.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializar los íconos de Feather
    feather.replace();

    // Inicializar Componentes de UI reactivos
    const detailsPanel = new DetailsPanel('details-panel');
    const treePanel = new TreePanel('tree-panel');

    // Lógica del Redimensionador (Resizer)
    const resizer = document.getElementById('resizer');
    const leftSide = document.getElementById('tree-panel');
    let isResizing = false;

    resizer.addEventListener('mousedown', (e) => {
        isResizing = true;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none'; // Evita seleccionar texto al arrastrar
    });

    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        
        // Calculamos el ancho basado en la posición del mouse
        // Restamos el offset izquierdo del contenedor principal para obtener el ancho real
        const containerOffset = leftSide.parentElement.getBoundingClientRect().left;
        let newWidth = e.clientX - containerOffset - 10; // 10px de compensación por gaps
        
        // Límites para no romper la interfaz
        if (newWidth < 200) newWidth = 200; // Mínimo
        if (newWidth > 600) newWidth = 600; // Máximo
        
        leftSide.style.flex = `0 0 ${newWidth}px`;
    });

    document.addEventListener('mouseup', () => {
        if (isResizing) {
            isResizing = false;
            document.body.style.cursor = 'default';
            document.body.style.userSelect = 'auto';
        }
    });

    // 2. Lógica del Modo Claro / Oscuro
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const themeIcon = themeToggleBtn.querySelector('i');
    const hljsTheme = document.getElementById('hljs-theme');

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        
        if (currentTheme === 'light') {
            htmlElement.setAttribute('data-theme', 'dark');
            themeIcon.setAttribute('data-feather', 'sun');
            hljsTheme.href = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css";
        } else {
            htmlElement.setAttribute('data-theme', 'light');
            themeIcon.setAttribute('data-feather', 'moon');
            hljsTheme.href = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-light.min.css";
        }
        feather.replace();
    });

    // 3. Lógica inicial de búsqueda (Stage 3)
    const searchBtn = document.getElementById('search-btn');
    const repoInput = document.getElementById('repo-input');

    searchBtn.addEventListener('click', async () => {
        const repoPath = repoInput.value.trim();
        if (!repoPath) {
            alert('Por favor ingresa un repositorio, ej: facebook/react');
            return;
        }

        const parts = repoPath.split('/');
        if (parts.length !== 2 || parts[0] === '' || parts[1] === '') {
            alert('El formato debe ser: usuario/repositorio (ej: facebook/react)');
            return;
        }

        const [owner, repo] = parts;
        
        try {
            // Actualizamos estado a "cargando" para que toda la UI se entere
            store.setState({ loading: true, error: null });
            
            searchBtn.disabled = true;
            searchBtn.innerHTML = '<i data-feather="loader"></i> Cargando...';
            feather.replace();

            // Petición en paralelo: info general + raíz de carpetas
            const [repoData, treeData] = await Promise.all([
                GitHubAPI.fetchRepoInfo(owner, repo),
                GitHubAPI.fetchContents(owner, repo, '')
            ]);
            
            // Enviamos todo al Store. ¡Los paneles se actualizarán automáticamente!
            store.setState({ currentRepo: repoData, treeData: treeData, loading: false });

        } catch (error) {
            console.error(error);
            store.setState({ loading: false, error: error.message });
            alert(`❌ Error: No se encontró el repositorio "${owner}/${repo}". Verifica que exista.`);
        } finally {
            searchBtn.disabled = false;
            searchBtn.innerHTML = '<i data-feather="search"></i> Explorar';
            feather.replace();
        }
    });
});
