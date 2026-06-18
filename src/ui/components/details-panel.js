import { globalEvents } from '../../state/events.js';
import { store } from '../../state/store.js';
import { FileLoader } from '../../modules/file-loader.js';
import { MarkdownParser } from '../../modules/markdown-parser.js';
import { getFileIcon } from '../utils/file-icons.js';

export class DetailsPanel {
    constructor(containerId) {
        this.container = document.getElementById(containerId);

        // Escuchamos los cambios en el estado global
        globalEvents.on('state:changed', (state) => {
            // Si hay un archivo seleccionado, mostramos la previsualización
            if (state.selectedFile) {
                this.showFilePreview(state.selectedFile);
            }
            // Si no hay archivo pero sí un repo, mostramos la info del repo
            else if (state.currentRepo) {
                this.showRepoInfo(state.currentRepo);
            }
        });
    }

    showRepoInfo(repo) {
        // Generamos el HTML usando los datos reales de la API
        const html = `
            <div class="repo-info-view">
                <div class="repo-header">
                    <h2><i data-feather="book"></i> ${repo.name}</h2>
                    <span class="badge ${repo.visibility}">${repo.visibility}</span>
                </div>
                
                <p class="repo-description">${repo.description || 'Sin descripción disponible para este repositorio.'}</p>
                
                <div class="repo-stats" style="margin-bottom: 10px;">
                    <div class="neumorphic-stat" title="Estrellas"><i data-feather="star"></i> <span>${repo.stargazers_count}</span></div>
                    <div class="neumorphic-stat" title="Forks"><i data-feather="git-branch"></i> <span>${repo.forks_count}</span></div>
                    <div class="neumorphic-stat" title="Watchers"><i data-feather="eye"></i> <span>${repo.subscribers_count}</span></div>
                    ${repo.language ? `<div class="neumorphic-stat" title="Lenguaje"><i data-feather="code"></i> <span>${repo.language}</span></div>` : ''}
                    <div class="neumorphic-stat" title="Última actualización"><i data-feather="calendar"></i> <span>${new Date(repo.updated_at).toLocaleDateString()}</span></div>
                </div>
                
                <h3 style="margin: 10px 0 5px 0; font-size: 1rem; color: var(--text-muted);">Accesos Directos</h3>
                <div class="repo-stats">
                    <!-- Accesos directos interactivos a GitHub -->
                    <a href="${repo.owner.html_url}" target="_blank" class="neumorphic-stat clickable" title="Perfil del Dueño">
                        <i data-feather="github"></i> <span>${repo.owner.login}</span>
                    </a>
                    <a href="${repo.html_url}" target="_blank" class="neumorphic-stat clickable" title="Abrir Repositorio">
                        <i data-feather="external-link"></i> <span>Abrir</span>
                    </a>
                    <a href="${repo.html_url}/branches" target="_blank" class="neumorphic-stat clickable" title="Ver todas las ramas (Branches)">
                        <i data-feather="git-branch"></i> <span>Ramas</span>
                    </a>
                    <a href="https://github.com/${repo.full_name}/archive/refs/heads/${repo.default_branch}.zip" class="neumorphic-stat clickable" title="Descargar todo el repositorio en formato .zip">
                        <i data-feather="download"></i> <span>Descargar ZIP</span>
                    </a>
                    ${repo.has_issues ? `
                    <a href="${repo.html_url}/issues" target="_blank" class="neumorphic-stat clickable" title="Ver problemas e issues reportados">
                        <i data-feather="alert-circle"></i> <span>Issues</span>
                    </a>` : ''}
                </div>

                <h3 style="margin: 15px 0 5px 0; font-size: 1rem; color: var(--text-muted);">Clonar Repositorio</h3>
                <div class="repo-stats">
                    <button class="neumorphic-stat clickable clone-btn" data-clipboard="${repo.clone_url}" title="Copiar URL HTTPS">
                        <i data-feather="copy"></i> <span>HTTPS</span>
                    </button>
                    <button class="neumorphic-stat clickable clone-btn" data-clipboard="${repo.ssh_url}" title="Copiar URL SSH">
                        <i data-feather="copy"></i> <span>SSH</span>
                    </button>
                    <button class="neumorphic-stat clickable clone-btn" data-clipboard="gh repo clone ${repo.full_name}" title="Copiar comando de GitHub CLI">
                        <i data-feather="terminal"></i> <span>GitHub CLI</span>
                    </button>
                </div>
            </div>
        `;

        this.container.innerHTML = html;
        if (window.feather) feather.replace();

        // Lógica de copia al portapapeles para los botones de clonar
        const cloneBtns = this.container.querySelectorAll('.clone-btn');
        cloneBtns.forEach(btn => {
            btn.addEventListener('click', async () => {
                try {
                    const textToCopy = btn.getAttribute('data-clipboard');
                    await navigator.clipboard.writeText(textToCopy);
                    
                    const originalHTML = btn.innerHTML;
                    btn.innerHTML = '<i data-feather="check" style="color: var(--accent-color);"></i> <span>Copiado!</span>';
                    feather.replace();
                    
                    setTimeout(() => {
                        btn.innerHTML = originalHTML;
                        feather.replace();
                    }, 2000);
                } catch (err) {
                    console.error('Error al copiar: ', err);
                }
            });
        });
    }

    async showFilePreview(fileItem) {
        // 1. Pantalla de carga
        this.container.innerHTML = `
            <div class="panel-placeholder">
                <i data-feather="loader" style="animation: spin 1s linear infinite;"></i>
                <p>Cargando ${fileItem.name}...</p>
            </div>
        `;
        if (window.feather) feather.replace();

        try {
            // 2. Descargar contenido remoto
            const rawContent = await FileLoader.load(fileItem.download_url);

            // 3. Procesar según el tipo de archivo
            let htmlContent = '';
            const ext = fileItem.name.split('.').pop().toLowerCase();
            const isMarkdown = ext === 'md';

            if (isMarkdown) {
                htmlContent = MarkdownParser.parse(rawContent);
            } else {
                // Si es código puro, lo envolvemos en etiquetas markdown para que Highlight.js lo decore
                const codeBlock = '```' + ext + '\n' + rawContent + '\n```';
                htmlContent = MarkdownParser.parse(codeBlock);
            }

            // 4. Renderizar Visor Neumórfico
            const iconName = getFileIcon(fileItem.name, fileItem.type);
            const isIsolatedMode = new URLSearchParams(window.location.search).has('file');
            
            const popoutOrRestoreBtnHTML = isIsolatedMode 
                ? `<button id="restore-app-btn" class="neumorphic-btn icon-btn" title="Mostrar explorador completo">
                       <i data-feather="sidebar"></i>
                   </button>`
                : `<button id="popout-btn" class="neumorphic-btn icon-btn" title="Abrir en nueva pestaña">
                       <i data-feather="external-link"></i>
                   </button>`;

            this.container.innerHTML = `
                <div style="display: flex; flex-direction: column; height: 100%; min-width: 0;">
                    <div class="markdown-header">
                        <h3><i data-feather="${iconName}"></i> ${fileItem.name}</h3>
                        <div style="display: flex; gap: 10px;">
                            ${popoutOrRestoreBtnHTML}
                            <button id="copy-btn" class="neumorphic-btn icon-btn" title="Copiar código">
                                <i data-feather="copy"></i>
                            </button>
                            <button id="fullscreen-btn" class="neumorphic-btn icon-btn" title="Pantalla completa">
                                <i data-feather="maximize"></i>
                            </button>
                            <button id="close-preview-btn" class="neumorphic-btn icon-btn" title="Cerrar vista previa">
                                <i data-feather="x"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="markdown-container ${!isMarkdown ? 'pure-code' : ''}">
                        ${htmlContent}
                    </div>
                </div>
            `;

            if (window.feather) feather.replace();

            // Forzar a Highlight.js a pintar los colores una vez que el HTML está en pantalla
            if (window.hljs) {
                this.container.querySelectorAll('pre code').forEach((block) => {
                    hljs.highlightElement(block);
                });
            }

            // 5. Lógica de los botones
            if (isIsolatedMode) {
                document.getElementById('restore-app-btn')?.addEventListener('click', () => {
                    // Restaurar la cabecera y el panel izquierdo quitando los display: none directos
                    document.querySelector('.header').style.display = '';
                    document.getElementById('tree-panel').style.display = '';
                    document.getElementById('resizer').style.display = '';
                    
                    // Modificamos la URL para salir del modo aislado (sin recargar la página)
                    const url = new URL(window.location.href);
                    url.searchParams.delete('file');
                    window.history.pushState({}, '', url);
                    
                    // Recargamos solo la UI de este visor para que cambie el botón a external-link
                    this.showFilePreview(fileItem);
                });
            } else {
                document.getElementById('popout-btn')?.addEventListener('click', () => {
                    const repoInfo = store.getState().currentRepo;
                    if (repoInfo && fileItem.path) {
                        const url = new URL(window.location.href);
                        url.searchParams.set('repo', repoInfo.full_name);
                        url.searchParams.set('file', fileItem.path);
                        window.open(url.href, '_blank');
                    }
                });
            }

            document.getElementById('close-preview-btn').addEventListener('click', () => {
                store.setState({ selectedFile: null });
                this.container.classList.remove('fullscreen'); // Salir de fullscreen si estaba activo
            });

            document.getElementById('copy-btn').addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(rawContent);
                    const copyBtn = document.getElementById('copy-btn');
                    copyBtn.innerHTML = '<i data-feather="check" style="color: var(--accent-color);"></i>';
                    feather.replace();
                    setTimeout(() => {
                        copyBtn.innerHTML = '<i data-feather="copy"></i>';
                        feather.replace();
                    }, 2000);
                } catch (err) {
                    console.error('Error al copiar: ', err);
                }
            });

            document.getElementById('fullscreen-btn').addEventListener('click', () => {
                const isFullscreen = this.container.classList.toggle('fullscreen');
                const fsBtn = document.getElementById('fullscreen-btn');
                if (isFullscreen) {
                    fsBtn.innerHTML = '<i data-feather="minimize"></i>';
                    fsBtn.title = 'Salir de pantalla completa';
                } else {
                    fsBtn.innerHTML = '<i data-feather="maximize"></i>';
                    fsBtn.title = 'Pantalla completa';
                }
                feather.replace();
            });

        } catch (error) {
            console.error(error);
            this.container.innerHTML = `
                <div class="panel-placeholder" style="color: #f56565;">
                    <i data-feather="alert-circle"></i>
                    <p>Error al descargar el archivo remoto.</p>
                    <br>
                    <button class="neumorphic-btn" id="close-preview-btn">Volver</button>
                </div>
            `;
            if (window.feather) feather.replace();
            document.getElementById('close-preview-btn').addEventListener('click', () => {
                store.setState({ selectedFile: null });
            });
        }
    }
}
