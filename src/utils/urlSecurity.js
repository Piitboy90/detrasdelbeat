/**
 * Normaliza URLs a HTTPS
 * - http:// → https://
 * - ws:// → wss://
 * - null/undefined → ""
 * - URLs relativas → sin cambios
 */
export const toHttps = (url) => {
  if (!url) return '';
  
  // Si es URL relativa, devolver sin cambios
  if (typeof url === 'string' && (url.startsWith('/') || url.startsWith('.'))) {
    return url;
  }
  
  // Convertir http:// a https://
  if (typeof url === 'string' && url.startsWith('http://')) {
    return url.replace(/^http:\/\//, 'https://');
  }
  
  // Convertir ws:// a wss://
  if (typeof url === 'string' && url.startsWith('ws://')) {
    return url.replace(/^ws:\/\//, 'wss://');
  }
  
  return url;
};

/**
 * Valida que una URL sea segura (https o relativa)
 */
export const isSecureUrl = (url) => {
  if (!url) return true;
  if (typeof url !== 'string') return false;
  
  return (
    url.startsWith('https://') ||
    url.startsWith('wss://') ||
    url.startsWith('/') ||
    url.startsWith('.') ||
    url.startsWith('data:') ||
    url.startsWith('blob:')
  );
};