// src/api/requests.js

// Creamos una instancia de Axios con configuración base
// Nota: Axios ya está disponible globalmente porque lo cargamos por CDN en index.html
export const githubApiInstance = axios.create({
    baseURL: 'https://api.github.com',
    headers: {
        'Accept': 'application/vnd.github.v3+json',
        // 'Authorization': 'Bearer TU_TOKEN_AQUI' // Se puede agregar después si necesitas más límite
    },
    timeout: 10000 // 10 segundos de límite
});

// Interceptor para manejar errores globalmente de forma limpia
githubApiInstance.interceptors.response.use(
    response => response,
    error => {
        const mensaje = error.response?.data?.message || error.message;
        console.error('GitHub API Error:', mensaje);
        return Promise.reject(error);
    }
);
