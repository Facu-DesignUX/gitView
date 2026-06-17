// src/ui/utils/file-icons.js

/**
 * Devuelve el nombre del icono de Feather basado en el tipo y extensión del archivo
 */
export function getFileIcon(filename, type) {
    if (type === 'dir') return 'folder';
    
    const ext = filename.split('.').pop().toLowerCase();
    
    // Mapeo de extensiones comunes a iconos de Feather
    const iconMap = {
        'md': 'file-text',
        'txt': 'file-text',
        'js': 'code',
        'ts': 'code',
        'html': 'layout',
        'css': 'pen-tool',
        'json': 'database',
        'png': 'image',
        'jpg': 'image',
        'svg': 'image',
        'gitignore': 'eye-off',
        'lock': 'lock'
    };

    return iconMap[ext] || 'file'; // 'file' es el ícono genérico por defecto
}
