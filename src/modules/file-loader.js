// src/modules/file-loader.js

// Caché en memoria para archivos fuente
const fileCache = new Map();

export class FileLoader {
    /**
     * Descarga el texto crudo de un archivo usando su URL directa (download_url)
     */
    static async load(downloadUrl) {
        if (!downloadUrl) throw new Error("No hay URL de descarga disponible");
        
        // Si ya descargamos este archivo antes, lo devolvemos al instante
        if (fileCache.has(downloadUrl)) {
            return fileCache.get(downloadUrl);
        }
        
        try {
            // Como solo queremos el texto (código o markdown), usamos el axios global
            const response = await window.axios.get(downloadUrl);
            
            // Axios a veces parsea JSON automáticamente. Si el archivo era .json, lo volvemos string
            let content = response.data;
            if (typeof content === 'object') {
                content = JSON.stringify(content, null, 2);
            }
            
            // Guardamos en caché
            fileCache.set(downloadUrl, content);
            return content;
        } catch (error) {
            throw new Error('Error al descargar el archivo remoto.');
        }
    }
}
