export function handleSupabaseError(error) {
  if (!error) return "Error desconocido.";
  
  console.error("[Supabase Error]", error);

  const message = error.message || error.error_description || "";
  const code = error.code || "";

  // Auth / Session Errors
  if (message.includes('JWT') || message.includes('sub claim') || message.includes('Auth session missing')) {
    return "Sesión inválida o expirada. Por favor, inicia sesión de nuevo.";
  }
  if (message.includes('Invalid login credentials')) {
    return "Correo electrónico o contraseña incorrectos.";
  }
  if (message.includes('Email not confirmed')) {
    return "Por favor confirma tu correo electrónico antes de iniciar sesión.";
  }
  if (message.includes('User already registered')) {
    return "Este usuario ya está registrado.";
  }

  // Database / Network Errors
  if (code === 'PGRST116') {
    return "No se encontraron datos.";
  }
  if (code === '42501' || message.includes('RLS') || message.includes('row-level security')) {
    return "No tienes permisos para realizar esta acción.";
  }
  if (message === 'Failed to fetch' || message.includes('network') || message.includes('Network')) {
    return "Error de red. Verifica tu conexión a internet.";
  }

  return message || "Ha ocurrido un error inesperado al conectar con el servidor.";
}