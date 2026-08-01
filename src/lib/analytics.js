/**
 * Envoltorio de analitica.
 *
 * Tres reglas de diseno:
 *
 * 1. Nunca romper la app. Un adblocker, una red caida o una CSP mal
 *    configurada dejan la analitica sin cargar. Eso no puede tumbar un
 *    registro ni un envio de solicitud, asi que todo va en try/catch y se
 *    comprueba que la herramienta exista antes de llamarla.
 *
 * 2. En desarrollo no se envia nada. Se imprime por consola para poder ver
 *    que un evento se dispara donde toca sin ensuciar los datos reales.
 *
 * 3. Las paginas vistas NO se gestionan aqui. El script de Plausible ya
 *    parchea history.pushState y escucha popstate, asi que cuenta solo las
 *    navegaciones de la SPA. Anadir un seguimiento manual duplicaria cada
 *    visita.
 */

const isDev = import.meta.env.DEV;

/**
 * Deduce la seccion de la web desde la URL actual.
 *
 * Existe porque componentes como PostCard se reutilizan en /feed, /u/:usuario
 * y /saved: pasar la ubicacion a mano en cada sitio se desincronizaria en
 * cuanto el componente se use en una pagina nueva.
 *
 * @returns {string}
 */
export function ubicacionActual() {
  try {
    const ruta = window.location.pathname;
    if (ruta === '/') return 'home';
    if (ruta.startsWith('/feed')) return 'feed';
    if (ruta.startsWith('/post/')) return 'post';
    if (ruta.startsWith('/u/')) return 'perfil';
    if (ruta.startsWith('/saved')) return 'guardados';
    return ruta;
  } catch (_) {
    return 'desconocida';
  }
}

/**
 * Registra un evento de negocio.
 *
 * @param {string} nombreEvento  Nombre del objetivo (ej. 'login_ok').
 * @param {Object} [propiedades] Datos adicionales (ej. { id_post: '123' }).
 */
export function track(nombreEvento, propiedades = {}) {
  if (!nombreEvento) return;

  if (isDev) {
    console.log('[analytics]', nombreEvento, propiedades);
    return;
  }

  try {
    if (typeof window === 'undefined') return;

    const tieneProps = Object.keys(propiedades).length > 0;

    // Plausible
    if (typeof window.plausible === 'function') {
      window.plausible(nombreEvento, tieneProps ? { props: propiedades } : undefined);
      return;
    }

    // Google Analytics 4, por si algun dia se cambia de herramienta
    if (typeof window.gtag === 'function') {
      window.gtag('event', nombreEvento, propiedades);
    }
  } catch (_) {
    // Silencio deliberado: la analitica es accesoria y jamas debe
    // interrumpir lo que el usuario estaba haciendo.
  }
}

export default track;
