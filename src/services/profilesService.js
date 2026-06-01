import { supabase } from '@/lib/supabase';

export const profilesService = {
  async getProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in getProfile:', error);
      throw error;
    }
  },

  async updateProfile(userId, updates) {
    try {
      // Validate auth
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('Usuario no autenticado');

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      if (error.message && (error.message.includes('JWT') || error.message.includes('sub claim'))) {
        throw new Error('Sesión inválida. Por favor recarga la página.');
      }
      console.error('Error in updateProfile:', error);
      throw error;
    }
  }
};