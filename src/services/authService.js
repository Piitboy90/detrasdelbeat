import { supabase } from '@/lib/supabase';

export const authService = {
  /**
   * Safely gets the current user, handling JWT errors
   * @returns {Promise<any|null>}
   */
  async getCurrentUser() {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      
      if (!session?.user) return null;
      
      // Validate critical claims
      if (!session.user.id) {
        console.warn('Session invalid: missing user ID');
        return null;
      }

      // Double check with getUser to ensure token is valid on server
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      
      return user;
    } catch (err) {
      // Handle JWT errors gracefully
      if (err.message && (err.message.includes('JWT') || err.message.includes('sub claim'))) {
        console.warn('Auth token invalid, treating as logged out');
        return null;
      }
      console.warn('Auth check failed:', err.message);
      return null;
    }
  },

  /**
   * Resets password for the given email
   * @param {string} email 
   * @returns {Promise<{data: any, error: any}>}
   */
  async resetPasswordForEmail(email) {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { data, error };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  /**
   * Login with email and password
   */
  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  /**
   * Maps technical Supabase errors to user-friendly Spanish messages
   * @param {Error|string} error 
   * @returns {string}
   */
  getFriendlyErrorMessage(error) {
    if (!error) return null;
    
    const message = typeof error === 'string' ? error : error.message || 'Unknown error';

    // Map specific errors
    if (message.includes('Invalid login credentials')) {
      return "Email o contraseña incorrectos. Prueba de nuevo o usa 'Olvidé mi contraseña'.";
    }
    
    if (message.includes('Email not confirmed')) {
      return "Tu email no ha sido confirmado. Por favor revisa tu bandeja de entrada.";
    }

    if (message.includes('User not found')) {
      return "No existe una cuenta registrada con este correo electrónico.";
    }

    // Default fallback
    return message;
  }
};