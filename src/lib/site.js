/**
 * URL publica del sitio, en un unico lugar.
 *
 * El valor real viene de VITE_SITE_URL (ver .env y las variables de Railway).
 * El valor de reserva evita que se genere una URL vacia si la variable falta
 * en el build: una URL rota es peor que una desactualizada.
 *
 * Siempre sin barra final, para poder concatenar `${SITE_URL}/loquesea`.
 */
export const SITE_URL =
  import.meta.env.VITE_SITE_URL || 'https://detrasdelbeat-production.up.railway.app';

/** Construye una URL absoluta a partir de una ruta relativa. */
export const absoluteUrl = (path = '/') =>
  `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
