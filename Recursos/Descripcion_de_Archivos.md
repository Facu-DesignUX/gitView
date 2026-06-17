## 📋 Descripción Detallada de Archivos
### `index.html`
```html
Responsabilidad: Punto de entrada y estructura HTML semántica

Contendrá:
• Meta tags (viewport, charset, SEO)
• Links a CDNs (Axios, Marked, Highlight.js)
• Contenedor raíz (#app)
• Scripts de inicialización
```

### `src/api/github.js`
```javascript
Clase: GitHubAPI

Métodos:
  • constructor(baseURL, headers)
  • async fetchRepoInfo(owner, repo)          → Datos del repo
  • async fetchContents(owner, repo, path)    → Estructura de carpetas
  • async fetchFile(owner, repo, path)        → Contenido de archivo
  • async buildTree(owner, repo, path, depth) → Árbol recursivo

Responsabilidad: ÚNICA - Comunicación con GitHub API
```

### `src/api/requests.js`
```javascript
Responsabilidad: Configuración centralizada de Axios

Exporta:
  • API instance (axios configurado)
  • Interceptores de respuesta
  • Manejo de errores HTTP
```

### `src/modules/tree-renderer.js`
```javascript
Clase: TreeRenderer

Métodos:
  • constructor(container)
  • render(items, depth)        → Dibuja árbol en DOM
  • toggle(nodeId)              → Expande/colapsa
  • addEventListeners()         → Clicks en nodos
  • clear()                     → Limpia el DOM

Responsabilidad: Renderizar estructura visual del árbol
```

### `src/modules/markdown-parser.js`
```javascript
Clase: MarkdownParser

Métodos:
  • static parse(content)        → Markdown → HTML
  • static highlight(code, lang) → Syntax highlighting
  • static sanitize(html)        → XSS protection

Responsabilidad: Procesar Markdown y resaltar código
```

### `src/modules/file-loader.js`
```javascript
Clase: FileLoader

Métodos:
  • async load(owner, repo, path)    → Obtiene contenido de archivo
  • getCached(path)                  → Obtiene del caché local
  • setCached(path, content)         → Guarda en caché

Responsabilidad: Cargar archivos con manejo de caché
```

### `src/modules/repo-info.js`
```javascript
Clase: RepoInfo

Métodos:
  • constructor(data)
  • getMetadata()        → Retorna metadatos formateados
  • getLanguage()        → Lenguaje principal
  • getStats()           → Stars, forks, watchers
  • getDescription()     → Descripción del repo

Responsabilidad: Procesar información del repositorio
```

### `src/modules/cache-manager.js`
```javascript
Clase: CacheManager

Métodos:
  • set(key, value, ttl)  → Guarda en localStorage
  • get(key)              → Obtiene de localStorage
  • clear(key)            → Borra una entrada
  • isExpired(key)        → Verifica expiración

Responsabilidad: Gestionar caché local inteligente
```

### `src/ui/components/header.js`
```javascript
Clase: Header

Métodos:
  • constructor(container)
  • render()             → Dibuja header
  • getInputValue()      → Obtiene URL del input
  • setLoading(bool)     → Muestra/oculta loader
  • onLoad(callback)     → Evento cuando presionan cargar

Responsabilidad: Componente de encabezado (input + botón)
```

### `src/ui/components/tree-panel.js`
```javascript
Clase: TreePanel

Métodos:
  • constructor(container)
  • show(items)          → Muestra árbol
  • hide()               → Oculta panel
  • clear()              → Limpia contenido
  • onNodeClick(callback) → Evento cuando seleccionan nodo

Responsabilidad: Panel lateral izquierdo
```

### `src/ui/components/details-panel.js`
```javascript
Clase: DetailsPanel

Métodos:
  • constructor(container)
  • showRepoInfo(data)   → Muestra información del repo
  • showReadme(html)     → Muestra README parseado
  • showFilePreview(html, filename) → Muestra preview de archivo
  • clear()              → Limpia panel

Responsabilidad: Panel derecho con información
```

### `src/ui/components/preview-modal.js`
```javascript
Clase: PreviewModal

Métodos:
  • constructor(container)
  • open(content, title) → Abre preview
  • close()              → Cierra preview
  • onClose(callback)    → Evento cuando cierra

Responsabilidad: Modal para previsualizaciones amplias
```

### `src/ui/components/loader.js`
```javascript
Clase: Loader

Métodos:
  • show(message)        → Muestra spinner
  • hide()               → Oculta spinner
  • setMessage(msg)      → Cambia mensaje

Responsabilidad: Indicador de carga
```

### `src/ui/styles/base.css`
```css
Contiene:
• Reset de estilos
• Tipografía global
• Variables CSS
• Estilos base de elementos HTML
```

### `src/ui/styles/layout.css`
```css
Contiene:
• Grid principal (2 columnas)
• Flexbox utilities
• Dimensiones de paneles
• Espaciado general
```

### `src/ui/styles/tree.css`
```css
Contiene:
• Estilos del árbol jerárquico
• Indentación de niveles
• Iconos de carpeta/archivo
• Efectos hover y active
```

### `src/ui/styles/markdown.css`
```css
Contiene:
• Estilos para elementos Markdown
• Headings (h1-h6)
• Párrafos, listas, tablas
• Bloques de código
```

### `src/ui/styles/theme.css`
```css
Contiene:
• Paleta de colores
• Modo claro/oscuro
• Variables CSS para temas
```

### `src/ui/styles/responsive.css`
```css
Contiene:
• Media queries
• Ajustes para mobile
• Ajustes para tablet
```

### `src/ui/utils/dom-utils.js`
```javascript
Funciones:
  • createElement(tag, classes, attrs) → Crea elemento con atributos
  • addEvent(el, event, handler)       → Agrega listener
  • removeEvent(el, event, handler)    → Remueve listener
  • addClass(el, className)            → Agrega clase
  • removeClass(el, className)         → Remueve clase
  • toggleClass(el, className)         → Toggle clase
  • setAttr(el, obj)                   → Set múltiples atributos
  • empty(el)                          → Limpia contenido

Responsabilidad: Utilidades para manipular DOM
```

### `src/ui/utils/file-icons.js`
```javascript
Objeto: FILE_ICONS

Contiene mapping de extensiones → iconos:
  • .md → 📝
  • .js → 🟨
  • .json → { }
  • .css → 🎨
  • .html → 🌐
  • .cs → 🟦
  • .sln → 📦
  • (y más...)

Función:
  • getIcon(filename) → Retorna emoji/icono

Responsabilidad: Determinar icono por tipo de archivo
```

### `src/ui/utils/string-utils.js`
```javascript
Funciones:
  • truncate(str, length)     → Acorta strings
  • formatFileSize(bytes)     → Convierte bytes a KB/MB
  • slugify(str)              → Convierte a slug
  • capitalize(str)           → Primera mayúscula
  • escapeHtml(str)           → Escapa HTML para XSS

Responsabilidad: Utilidades de procesamiento de strings
```

### `src/state/store.js`
```javascript
Clase: Store

Métodos:
  • setState(updates)    → Actualiza estado
  • getState()          → Obtiene estado actual
  • subscribe(listener) → Se suscribe a cambios
  • unsubscribe(listener) → Desuscribirse

Estado contiene:
  {
    currentRepo: { owner, repo, name, ... },
    treeData: [...],
    selectedFile: null,
    loading: false,
    error: null,
    cache: {}
  }

Responsabilidad: Único fuente de verdad (state management)
```

### `src/state/events.js`
```javascript
Clase: EventEmitter

Métodos:
  • on(event, handler)    → Escucha evento
  • emit(event, data)     → Dispara evento
  • off(event, handler)   → Remueve listener
  • once(event, handler)  → Listener de una vez

Eventos:
  • repo:loaded
  • file:selected
  • tree:expanded
  • error:occurred

Responsabilidad: Comunicación entre módulos
```

### `src/config/constants.js`
```javascript
Constantes:
  • API_BASE_URL
  • RATE_LIMIT_REQUESTS
  • MAX_TREE_DEPTH
  • CACHE_EXPIRY_TIME
  • MAX_FILE_SIZE
  • SUPPORTED_EXTENSIONS
```

### `src/config/api-config.js`
```javascript
Configuración:
  • GitHub API endpoints
  • Headers por defecto
  • Timeouts
  • Reintentos
```

### `src/config/ui-config.js`
```javascript
Configuración:
  • Tamaños de paneles
  • Velocidades de animación
  • Mensajes de usuario
  • Temas disponibles
```

### `src/index.js`
```javascript
Responsabilidad: Inicialización y orquestación

Hace:
  1. Importa todos los módulos
  2. Inicializa componentes
  3. Configura event listeners
  4. Configura event emitters
  5. Renderiza interfaz inicial
  6. Establece puntos de entrada del usuario
```
