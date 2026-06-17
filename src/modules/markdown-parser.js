// src/modules/markdown-parser.js

export class MarkdownParser {
    static parse(content) {
        // Asegurarnos de que las librerías estén cargadas desde el CDN
        if (typeof marked === 'undefined' || typeof hljs === 'undefined') {
            return "<p>Error: Librerías de Markdown no cargadas.</p>";
        }

        // Configuramos Marked para que use Highlight.js al encontrar bloques de código
        marked.setOptions({
            highlight: function (code, lang) {
                const language = hljs.getLanguage(lang) ? lang : 'plaintext';
                return hljs.highlight(code, { language }).value;
            },
            gfm: true,     // Activa Github Flavored Markdown (tablas, listas, etc)
            breaks: true   // Los saltos de línea se convierten en <br>
        });

        // Convertir Markdown a HTML
        return marked.parse(content);
    }
}
