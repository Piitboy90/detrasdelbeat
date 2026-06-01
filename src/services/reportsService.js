import { supabase } from '@/lib/supabase';

export const reportsService = {
  async createReport(reportData) {
    try {
      // Validate auth
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('Usuario no autenticado');

      const { data, error } = await supabase
        .from('reports')
        .insert([reportData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      if (error.message && (error.message.includes('JWT') || error.message.includes('sub claim'))) {
        throw new Error('Sesión inválida. Por favor recarga la página.');
      }
      console.error('Error in createReport:', error);
      throw error;
    }
  }
};