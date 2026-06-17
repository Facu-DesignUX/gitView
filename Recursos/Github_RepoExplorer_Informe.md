# 📚 GitHub Repo Explorer - Documentación Técnica Completa
## 🎯 Descripción General
**GitHub Repo Explorer** es una aplicación web interactiva que permite visualizar la estructura completa de cualquier repositorio de GitHub de forma intuitiva y organizada.
### Características principales:
- 📁 Exploración visual de estructura de carpetas
- 🌳 Árbol jerárquico expandible/colapsable
- 📝 Vista previa de archivos Markdown
- 📊 Panel de información del repositorio (stars, lenguaje, descripción)
- 🎨 Interfaz responsiva y moderna
- ⚡ Carga rápida sin autenticación (60 requests/hora)
- 🔍 Soporte para múltiples proveedores (escalable a GitLab, Bitbucket)
---
## 🔧 Recursos Utilizados
### Librerías Externas (Seguras y Estables)
| Librería | Versión | Tamaño | Función | CDN |
|----------|---------|--------|---------|-----|
| **Axios** | v1.6.1+ | 14kb | Requests HTTP a API GitHub | cdnjs.cloudflare.com |
| **Marked** | v11.1.1+ | 37kb | Parsear Markdown → HTML | cdnjs.cloudflare.com |
| **Highlight.js** | v11.9.0+ | 50kb | Syntax highlighting para código | cdnjs.cloudflare.com |
| **Feather Icons** (opcional) | v2.0+ | 3kb | Iconos SVG ligeros | cdnjs.cloudflare.com |
### Tecnologías Base
- **HTML5** - Estructura semántica
- **CSS3** - Grid layout, Flexbox, CSS Variables
- **JavaScript Vanilla (ES6+)** - Sin frameworks, máxima escalabilidad
- **GitHub REST API v3** - Datos públicos sin autenticación
### Recursos de Límites (NO son problema)
```
API Requests:      60 requests/hora (sin autenticación)
                   → Problema: ❌ NO (1-2 usos/día)

DOM Nodes:         ~10,000 sin lag perceptible
                   → Problema: ⚠️ Posible con repos >5k archivos
                   → Solución: Lazy loading (profundidad máx 3)

Bundle Size:       ~100kb gzipped (totales)
                   → Problema: ❌ NO (pequeño)

Memoria RAM:       No hay límite aparente en navegadores modernos
                   → Problema: ❌ NO (caché inteligente)

Tiempo Carga:      <2 segundos promedio
                   → Problema: ❌ NO
```

---

## 🏗️ Arquitectura General

La aplicación sigue el patrón **modular basado en responsabilidades** (separation of concerns):

```
┌─────────────────────────────────────────────────────┐
│                   index.html                        │
│            (Punto de entrada + Layout)              │
└──────────────────┬──────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
    ┌───▼────────┐     ┌─────▼────────┐
    │  index.js  │     │  styles.css  │
    │(Inicializ) │     │  (Estilos)   │
    └───┬────────┘     └──────────────┘
        │
   ┌────┴─────────────────────┬──────────────────┐
   │                          │                  │
┌──▼─────────┐        ┌───────▼────────┐   ┌────▼─────┐
│   api/     │        │    modules/    │   │   ui/    │
│(Datos)     │        │ (Procesos)     │   │(Interfaz)│
└────────────┘        └────────────────┘   └──────────┘
   │                          │                  │
   ├─ github.js              ├─ tree-renderer.js│
   │ (Llamadas API)          │ (Render árbol)  │
   │                         │                 ├─ components/
   └─ requests.js           ├─ markdown-parser.js│
     (Config axios)         │ (Parsear MD)     │
                            │                 ├─ styles/
                            ├─ file-loader.js │
                            │ (Cargar archivos)│
                            │                 └─ utils/
                            ├─ repo-info.js   │
                            │ (Info repo)      │
                            │                 │
                            └─ cache-manager.js
                              (Caché local)
                            
   ┌──────────────────────────────────────────┐
   │            state/ (Estado Global)        │
   ├──────────────────────────────────────────┤
   │ ├─ store.js (Manejo de estado)          │
   │ └─ events.js (Event Emitter)            │
   └──────────────────────────────────────────┘
   
   ┌──────────────────────────────────────────┐
   │            config/ (Configuración)      │
   ├──────────────────────────────────────────┤
   │ ├─ constants.js (Constantes globales)   │
   │ ├─ api-config.js (Config API GitHub)    │
   │ └─ ui-config.js (Config UI)             │
   └──────────────────────────────────────────┘
```

---

## 📁 Estructura de Carpetas

```
repo-explorer/
│
├── 📄 index.html                    # Página principal (HTML semántico)
├── 📄 package.json                  # Metadatos del proyecto
├── 📄 README.md                     # Guía de uso para usuarios
├── 📄 ARCHITECTURE.md               # Este documento
│
├── 📁 src/                          # Código fuente principal
│   │
│   ├── 📁 api/                      # Capa de datos - Comunicación con APIs
│   │   ├── 📄 github.js             # Clase GitHubAPI - Métodos para GitHub
│   │   └── 📄 requests.js           # Configuración de Axios
│   │
│   ├── 📁 modules/                  # Lógica de negocio - Procesos principales
│   │   ├── 📄 tree-renderer.js      # Renderizar árbol de directorios
│   │   ├── 📄 markdown-parser.js    # Parsear y renderizar Markdown
│   │   ├── 📄 file-loader.js        # Cargar contenido de archivos
│   │   ├── 📄 repo-info.js          # Procesar información del repositorio
│   │   └── 📄 cache-manager.js      # Gestión de caché local
│   │
│   ├── 📁 ui/                       # Capa de presentación
│   │   ├── 📁 components/           # Componentes reutilizables
│   │   │   ├── 📄 header.js         # Componente header (input + botones)
│   │   │   ├── 📄 tree-panel.js     # Panel lateral izquierdo (árbol)
│   │   │   ├── 📄 details-panel.js  # Panel derecho (información)
│   │   │   ├── 📄 preview-modal.js  # Modal/overlay para previsualizaciones
│   │   │   └── 📄 loader.js         # Componente de carga (spinner)
│   │   │
│   │   ├── 📁 styles/               # Estilos CSS modulares
│   │   │   ├── 📄 base.css          # Estilos globales y reset
│   │   │   ├── 📄 layout.css        # Grid, Flexbox, estructura
│   │   │   ├── 📄 tree.css          # Estilos específicos del árbol
│   │   │   ├── 📄 markdown.css      # Estilos para contenido Markdown
│   │   │   ├── 📄 theme.css         # Temas (luz/oscuro, colores)
│   │   │   └── 📄 responsive.css    # Media queries y responsive
│   │   │
│   │   └── 📁 utils/                # Utilidades de UI
│   │       ├── 📄 dom-utils.js      # Funciones auxiliares para DOM
│   │       ├── 📄 file-icons.js     # Iconos según tipo de archivo
│   │       └── 📄 string-utils.js   # Funciones de strings
│   │
│   ├── 📁 state/                    # Gestión de estado
│   │   ├── 📄 store.js              # Store central (estado global)
│   │   └── 📄 events.js             # Event Emitter para comunicación
│   │
│   ├── 📁 config/                   # Configuración
│   │   ├── 📄 constants.js          # Constantes globales
│   │   ├── 📄 api-config.js         # Configuración de APIs
│   │   └── 📄 ui-config.js          # Configuración de UI
│   │
│   └── 📄 index.js                  # Punto de entrada (inicialización)
│
├── 📁 assets/                       # Recursos estáticos
│   ├── 📁 icons/                    # Iconos personalizados (opcional)
│   └── 📁 images/                   # Imágenes (logo, etc)
│
└── 📁 docs/                         # Documentación adicional
    ├── 📄 API_REFERENCE.md          # Referencia de APIs y funciones
    ├── 📄 CONTRIBUTING.md           # Guía para contribuir
    └── 📄 DEPLOYMENT.md             # Guía de despliegue
---

## ⚙️ Funcionalidades Principales

### 1. **Cargar Repositorio**
```
Usuario ingresa URL → Validación → GitHubAPI.fetchRepoInfo() 
→ Store.setState() → RepoInfo.process() 
→ DetailsPanel.showRepoInfo() → Carga árbol en paralelo
```

### 2. **Explorar Árbol de Directorios**
```
Click en carpeta → TreeRenderer.toggle() 
→ GitHubAPI.fetchContents(path) → Cache-check
→ TreeRenderer.render(children) → Expande en UI
```

### 3. **Vista Previa de Markdown**
```
Click en .md → FileLoader.load() 
→ MarkdownParser.parse() → MarkdownParser.highlight()
→ DetailsPanel.showFilePreview() → Renderiza HTML
```

### 4. **Información del Repositorio**
```
API retorna data → RepoInfo.process() 
→ Formato: Lenguaje, Stars, Forks, Watchers
→ DetailsPanel.showRepoInfo()
```

### 5. **Caché Local**
```
Primer fetch → CacheManager.set() 
→ localStorage (validez: 1 hora)
→ Próximo acceso → CacheManager.get() (sin request)
```

### 6. **Manejo de Errores**
```
Error de API → EventEmitter.emit('error:occurred')
→ Store.setState({ error: msg })
→ DetailsPanel.showError() → Toast notification
```

---

## 🧩 Modularidad Explicada

### **Principio: Cada módulo hace UNA cosa bien**

#### Ventajas de esta modularidad:

1. **Testabilidad**
   ```javascript
   // Puedes testear TreeRenderer sin GitHubAPI
   const renderer = new TreeRenderer(mockContainer);
   renderer.render(mockItems);
   expect(renderer.getNodeCount()).toBe(10);
   ```

2. **Reusabilidad**
   ```javascript
   // MarkdownParser se puede usar en cualquier contexto
   const html = MarkdownParser.parse(content);
   ```

3. **Mantenibilidad**
   ```javascript
   // Cambiar Marked.js por otro parser es fácil:
   // Solo cambias 1 línea en markdown-parser.js
   // Nada más se ve afectado
   ```

4. **Escalabilidad**
   ```javascript
   // Agregar soporte para GitLab:
   // 1. Creas src/api/gitlab.js
   // 2. Creas una interfaz común
   // 3. El resto del código no cambia
   ```

### **Capas de la Aplicación:**

```
┌─────────────────────────────────────────┐
│      PRESENTACIÓN (UI)                  │
│  Components + Styles + Utils            │
├─────────────────────────────────────────┤
│      LÓGICA DE NEGOCIO (Modules)        │
│  Parser, Renderer, Loader               │
├─────────────────────────────────────────┤
│      DATOS (API)                        │
│  GitHub API, Requests                   │
├─────────────────────────────────────────┤
│      ESTADO (Store + Events)            │
│  Single source of truth                 │
├─────────────────────────────────────────┤
│      CONFIGURACIÓN (Config)             │
│  Constantes y settings                  │
└─────────────────────────────────────────┘
```

---

## 🎨 Interfaz de Usuario

### **Layout Principal (Grid 2 columnas)**

```
┌──────────────────────────────────────────────────────┐
│           HEADER (280px + resto)                     │
│  [github.com/usuario/repo] [Explorar] [Theme]       │
├─────────────────────┬────────────────────────────────┤
│                     │                                 │
│   TREE PANEL        │    DETAILS PANEL               │
│   (280px, scroll)   │    (resto, scroll)             │
│                     │                                 │
│  📁 CommerX         │  CommerX                       │
│  ├─ 📁 Domain       │  ⭐ 1.2k  🔀 234  👁️ 56      │
│  ├─ 📁 App          │  📘 C#                        │
│  ├─ 📁 Tests        │                                │
│  └─ 📄 README.md    │  📖 README:                    │
│                     │  [Contenido parseado]         │
│                     │                                │
│                     │  • Lista               _close  │
│                     │  • De contenidos       (X)     │
│                     │  • Del README                  │
│                     │                                │
└─────────────────────┴────────────────────────────────┘
```

### **Interacciones Principales**

```
INPUT URL
  ↓
[Cargar] BUTTON
  ↓
VALIDACIÓN
  ├─ ✅ URL válida → SPINNER (cargando)
  └─ ❌ URL inválida → ERROR MESSAGE

CLICK CARPETA
  ↓
[EXPANDIR] con animación
  ↓
CARGAR HIJOS
  └─ Sub-carpetas indentadas

CLICK ARCHIVO .MD
  ↓
[PREVIEW] en panel derecho
  ↓
MARKDOWN PARSEADO
  ├─ Headings formateados
  ├─ Código con highlighting
  ├─ Links clickeables
  └─ Botón [X] para volver a repo info

HOVER ARCHIVO
  ↓
HIGHLIGHT item (background color)
  └─ Cursor cambiar a pointer
```

### **Estados Visuales**

```
LOADING:
  • Spinner en header
  • Mensaje "Cargando estructura..."

SUCCESS:
  • Árbol visible
  • Repo info en panel derecho
  • README cargado

ERROR:
  • Mensaje de error en rojo
  • Opción para reintentar

EMPTY:
  • "Ingresa una URL para explorar"
  • Icono de carpeta vacía
```

---

## 🔄 Flujo de Datos

### **Flujo Principal: Cargar Repositorio**

```
USER INTERACTION
  │
  ├─ Input URL en header
  └─ Click "Explorar"
         │
         ▼
    VALIDATION
      │
      ├─ ✅ Válida
      │   └─ Continúa
      │
      └─ ❌ Inválida
          └─ Error en DetailsPanel
         │
         ▼
    HEADER.setLoading(true)
    Spinner visible
         │
         ▼
    GITHUB API
      │
      ├─ fetchRepoInfo(owner, repo)
      │   └─ Datos: name, stars, language, etc.
      │
      ├─ fetchContents(owner, repo, '')  [PARALELO]
      │   └─ Raíz: carpetas y archivos
      │
      └─ buildTree(owner, repo, '', 0)   [RECURSIVO]
          └─ Profundidad max = 3
         │
         ▼
    CACHE CHECK
      │
      ├─ ¿Existe en caché?
      │   ├─ ✅ Sí → Retorna cached
      │   └─ ❌ No → Continúa request
         │
         ▼
    STORE.setState({
      currentRepo: data,
      treeData: tree,
      loading: false
    })
         │
         ▼
    EVENT EMITTER
    emit('repo:loaded', data)
         │
         ▼
    UI UPDATES
      │
      ├─ TREE PANEL
      │   └─ TreeRenderer.render(tree)
      │
      ├─ DETAILS PANEL
      │   ├─ RepoInfo.showMetadata()
      │   └─ MarkdownParser.parse(README)
      │
      └─ HEADER.setLoading(false)
         │
         ▼
    READY FOR INTERACTION
```

### **Flujo Secundario: Expandir Carpeta**

```
USER CLICK en carpeta
         │
         ▼
    TREE PANEL
    TreeRenderer.toggle(nodeId)
         │
         ▼
    ANIMACIÓN CSS
    Rotate icono ▶ → ▼
         │
         ▼
    EVENT LISTENER
    onFolderExpand(path)
         │
         ▼
    CACHE CHECK
      │
      ├─ ¿En caché? → fetch local
      └─ ¿No? → GITHUB API
         │
         ▼
    API REQUEST
    fetchContents(owner, repo, path)
         │
         ▼
    TREE RENDERER
    render(children, level+1)
         │
         ▼
    DOM UPDATED
    Carpeta expandida con hijos
```

### **Flujo Terciario: Ver Preview .md**

```
USER CLICK en archivo .md
         │
         ▼
    DETAILS PANEL
    showLoading()
         │
         ▼
    FILE LOADER
    load(owner, repo, path)
         │
         ▼
    CACHE CHECK
      │
      ├─ En caché → return inmediato
      └─ No caché → GITHUB API
         │
         ▼
    MARKDOWN PARSER
    parse(content)
      │
      ├─ Marked.js → HTML
      └─ Highlight.js → Code blocks
         │
         ▼
    DETAILS PANEL
    showFilePreview(html, filename)
         │
         ▼
    RENDER HTML
      │
      ├─ Headings
      ├─ Párrafos
      ├─ Código con colores
      ├─ Links
      └─ Botón [X] para volver
         │
         ▼
    CLICK [X]
         │
         ▼
    DETAILS PANEL
    showRepoInfo()
```

---

## 🎯 Plan de Desarrollo por Etapas

En lugar de crear todo de golpe y lidiar con términos abstractos, construiremos la aplicación de forma iterativa y práctica. Así aseguramos que cada pieza funcione antes de pasar a la siguiente.

### Etapa 1: Fundación y Conexión API (MVP Core)
- **Objetivo**: Conectar con GitHub y traer datos básicos.
- **Archivos clave**: `index.html`, `src/api/github.js`, `src/api/requests.js`, `src/index.js`.
- **Qué haremos**:
  1. Estructura HTML básica (input, botones, paneles vacíos).
  2. Configurar Axios con CDNs.
  3. Implementar `fetchRepoInfo` para hacer la primera llamada a la API y ver la respuesta en consola.

### Etapa 2: Estado y UI Básica
- **Objetivo**: Empezar a darle vida a la interfaz.
- **Archivos clave**: `src/state/store.js`, `src/ui/components/header.js`, `src/ui/components/details-panel.js`, `src/ui/styles/base.css`.
- **Qué haremos**:
  1. Implementar el Store para manejar cuándo está cargando, si hay error o si se cargó un repo.
  2. Mostrar en pantalla (Details Panel) la información básica del repositorio (nombre, estrellas, lenguaje).

### Etapa 3: El Árbol de Carpetas (Tree Rendering)
- **Objetivo**: Ver la estructura del código como en un IDE.
- **Archivos clave**: `src/modules/tree-renderer.js`, `src/ui/components/tree-panel.js`, `src/ui/styles/tree.css`.
- **Qué haremos**:
  1. Usar la API de GitHub para pedir la raíz del repo (`fetchContents`).
  2. Renderizar visualmente las carpetas y archivos.
  3. Hacer que las carpetas se puedan clickear para expandir/colapsar.

### Etapa 4: Visor de Markdown y Código
- **Objetivo**: Poder leer el README y archivos `.md`.
- **Archivos clave**: `src/modules/markdown-parser.js`, `src/modules/file-loader.js`, `src/ui/styles/markdown.css`.
- **Qué haremos**:
  1. Integrar **Marked.js** y **Highlight.js**.
  2. Al clickear un archivo `.md` en el árbol, descargarlo y renderizarlo en el panel derecho.

### Etapa 5: Caché y Pulido (Toques Finales)
- **Objetivo**: Hacer que la app sea rápida y se vea increíble.
- **Archivos clave**: `src/modules/cache-manager.js`, `src/ui/styles/theme.css`, `src/ui/styles/responsive.css`.
- **Qué haremos**:
  1. Guardar las respuestas en localStorage para que navegar sea instantáneo (sin gastar cuota de API).
  2. Refinar el diseño visual (colores, hover, modo oscuro).

---

## 🎨 Estilo Gráfico: Neumorfismo (Soft UI)

Para que el explorador tenga un aspecto premium y moderno, utilizaremos **Neumorfismo** como lenguaje de diseño principal. Este estilo se caracteriza por interfaces limpias y suaves donde los elementos parecen extruidos o tallados en el propio fondo de la página.

### Conceptos Clave del Diseño

1. **Color Monocromático Base**
   El secreto del neumorfismo es que el color de fondo de la página y el color de fondo de los elementos (paneles, botones) es **exactamente el mismo**. El volumen se crea puramente a través de sombras.

2. **Sombras Dobles (Extrusión)**
   Para lograr que un panel o botón parezca que "sale" de la pantalla, aplicamos dos sombras opuestas mediante CSS `box-shadow`:
   - Una sombra **oscura** hacia abajo y a la derecha.
   - Una sombra **clara** (casi blanca) hacia arriba y a la izquierda (funcionando como un reflejo de luz).
   ```css
   /* Ejemplo de Extrusión (Paneles y Botones) */
   .neumorphic-panel {
       background-color: #e0e5ec;
       box-shadow: 
           9px 9px 16px rgb(163,177,198,0.6), 
           -9px -9px 16px rgba(255,255,255, 0.5);
   }
   ```

3. **Efecto Hundido (Inset)**
   Para elementos donde el usuario introduce datos (como el `input` de búsqueda) o donde visualizamos contenido (el visor de Markdown), usaremos un relieve hundido. Se logra añadiendo la propiedad `inset` a las sombras.
   ```css
   /* Ejemplo de Hundido (Inputs y Visor de Código) */
   .neumorphic-input {
       background-color: #e0e5ec;
       box-shadow: 
           inset 6px 6px 10px 0 rgba(163,177,198, 0.7),
           inset -6px -6px 10px 0 rgba(255,255,255, 0.8);
   }
   ```

4. **Acentos de Color**
   Ya que la base es monocromática, usaremos acentos vibrantes (gradientes de azul/cian o naranja/rojo) **solo** para los elementos interactivos o seleccionados (ej: el archivo actual abierto en el árbol o el botón principal de acción).

5. **Feather Icons**
   Para acompañar este estilo sin sobrecargar visualmente, utilizaremos la librería **Feather Icons** mediante CDN. Al ser íconos basados puramente en líneas finas (stroke) y no en relleno (fill), complementan perfectamente las sombras suaves del neumorfismo.

6. **Modo Claro / Oscuro (Theme Toggle)**
   El cambio entre modo claro y oscuro se logrará cambiando un atributo `data-theme` en el `<body>`. Esto actualizará instantáneamente las variables CSS de fondo y sombras. Para la visualización de código, Highlight.js no se romperá: simplemente intercambiaremos su hoja de estilos (ej. de `github.css` a `github-dark.css`) mediante JavaScript cuando se presione el botón (ícono de luna/sol).

### Implementación en la Estructura

- **`styles/theme.css`**: Aquí definiremos las variables CSS (`--bg-color`, `--shadow-dark`, `--shadow-light`) para poder mantener la consistencia en toda la app y facilitar la creación de un modo oscuro neumórfico en el futuro.
- **Header y Paneles**: Usarán el efecto de extrusión normal.
- **Input de Búsqueda y Panel de Preview (.md)**: Usarán el efecto de hundido (inset) para simular pantallas o ranuras.