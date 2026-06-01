import { supabase } from '@/lib/supabase';

export const requestsService = {
  async getRequests(userId) {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching requests:', error);
      throw error;
    }
  },

  async getAllRequests() {
    try {
      // Typically requires admin privileges via RLS
      const { data, error } = await supabase
        .from('requests')
        .select(`
          *,
          profiles:user_id (username, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching all requests:', error);
      throw error;
    }
  },

  async getRequest(id) {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select(`
          *,
          profiles:user_id (username, avatar_url)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching request:', error);
      throw error;
    }
  },

  async createRequest(requestData) {
    try {
      // Validate auth
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('Usuario no autenticado');

      const { data, error } = await supabase
        .from('requests')
        .insert([requestData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      if (error.message && (error.message.includes('JWT') || error.message.includes('sub claim'))) {
        throw new Error('Sesión inválida. Por favor recarga la página.');
      }
      console.error('Error creating request:', error);
      throw error;
    }
  },

  async updateRequest(id, updates) {
    try {
      // Validate auth
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('Usuario no autenticado');

      const { data, error } = await supabase
        .from('requests')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      if (error.message && (error.message.includes('JWT') || error.message.includes('sub claim'))) {
        throw new Error('Sesión inválida. Por favor recarga la página.');
      }
      console.error('Error updating request:', error);
      throw error;
    }
  },

  async deleteRequest(id) {
    try {
      // Validate auth
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('Usuario no autenticado');

      const { error } = await supabase
        .from('requests')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      if (error.message && (error.message.includes('JWT') || error.message.includes('sub claim'))) {
        throw new Error('Sesión inválida. Por favor recarga la página.');
      }
      console.error('Error deleting request:', error);
      throw error;
    }
  }
};