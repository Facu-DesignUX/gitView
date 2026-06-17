# 🚀 Planes de Escalabilidad: GitHub RepoExplorer

Este documento recopila ideas y propuestas de alto valor para futuras iteraciones (Etapa 6 en adelante) del proyecto **GitHub RepoExplorer**. El objetivo de estas funcionalidades es llevar la aplicación de un visor de código avanzado a una herramienta de análisis de repositorios completa y profesional, manteniendo siempre la estética **Neumórfica** y la arquitectura **SPA en Vanilla JS**.

---

## 1. Diagramador de Arquitectura (Grafo Interactivo 2D) 🕸️

**Descripción:**
Una nueva pestaña o modo de visualización que reemplace el árbol de carpetas tradicional por un mapa mental o grafo interconectado (Node Graph).

**Implementación técnica:**
- Utilizar el endpoint recursivo de GitHub (`GET /repos/{owner}/{repo}/git/trees/{sha}?recursive=1`) para descargar toda la estructura del proyecto en una sola petición súper rápida.
- Usar **HTML5 Canvas** o **SVG** (con una librería ligera o matemáticas puras) para dibujar nodos donde la carpeta raíz está en el centro y las subcarpetas orbitan a su alrededor.
- **Interactividad:** El usuario podrá hacer zoom (scroll), arrastrar la vista (pan) y hacer clic en los nodos para expandir ramas o abrir archivos directamente en el visor de la derecha.

**Valor aportado:**
Permite a los desarrolladores comprender la magnitud, complejidad y estructura de un proyecto gigantesco (como React o Linux) en un solo vistazo visual.

---

## 2. Dashboard de Estadísticas Neumórfico 📊

**Descripción:**
Aprovechar el estado "vacío" del panel derecho (cuando el usuario abre un repositorio pero aún no ha hecho clic en ningún archivo) para mostrar un Panel de Control rico en datos.

**Implementación técnica:**
- Consultar el endpoint de lenguajes (`GET /repos/{owner}/{repo}/languages`) para obtener los bytes de código por cada lenguaje.
- Diseñar **Gráficos de Barras de Progreso** horizontales usando CSS puro (sin librerías externas). Se crearían pistas "hundidas" (inset shadow) que se llenarían con barras de colores vibrantes y animaciones suaves (`transition: width 1s ease`).
- Agregar tarjetas Neumórficas adicionales con datos útiles extraídos de la API: Top contribuidores, fecha del último commit, cantidad de *issues* abiertos, etc.

**Valor aportado:**
Convierte un espacio desaprovechado en una infografía interactiva que brinda un resumen vital de las tecnologías que usa el repositorio.

---

## 3. Buscador de Archivos Global (Filtro Instantáneo) 🔍

**Descripción:**
Una barra de búsqueda Neumórfica (hundida) ubicada justo encima del árbol de carpetas izquierdo, que permita encontrar archivos instantáneamente en todo el proyecto.

**Implementación técnica:**
- Dado que en la Etapa 5 ya implementamos un sistema de Caché local eficiente, el buscador puede filtrar la estructura del árbol de carpetas en tiempo real (Typeahead) con JavaScript puro.
- A medida que el usuario escribe, el `TreeRenderer` oculta los nodos que no coinciden con la búsqueda, dejando a la vista únicamente la ruta directa hacia los archivos relevantes.

**Valor aportado:**
Ahorra muchísimo tiempo al navegar por repositorios con miles de archivos, imitando la funcionalidad `Ctrl + P` de los editores de código modernos como VS Code.
