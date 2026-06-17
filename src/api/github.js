// src/api/github.js
import { githubApiInstance } from './requests.js';

// Caché en memoria para evitar llamadas redundantes a la API
const apiCache = new Map();

export class GitHubAPI {
    /**
     * Obtiene la información principal de un repositorio
     */
    static async fetchRepoInfo(owner, repo) {
        const cacheKey = `repo_${owner}_${repo}`;
        if (apiCache.has(cacheKey)) return apiCache.get(cacheKey);

        try {
            const response = await githubApiInstance.get(`/repos/${owner}/${repo}`);
            apiCache.set(cacheKey, response.data);
            return response.data;
        } catch (error) {
            throw new Error(`No se pudo obtener información de ${owner}/${repo}`);
        }
    }

    /**
     * Obtiene el contenido de un directorio en el repositorio
     */
    static async fetchContents(owner, repo, path = '') {
        const cacheKey = `dir_${owner}_${repo}_${path}`;
        if (apiCache.has(cacheKey)) return apiCache.get(cacheKey);

        try {
            const response = await githubApiInstance.get(`/repos/${owner}/${repo}/contents/${path}`);
            apiCache.set(cacheKey, response.data);
            return response.data;
        } catch (error) {
            throw new Error(`No se pudo cargar el directorio ${path}`);
        }
    }
}
