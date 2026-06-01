import { supabase } from '@/lib/supabase';

export const likesService = {
  async getLikes(postId) {
    try {
      const { count, error } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId);

      if (error) throw error;
      return count;
    } catch (error) {
      console.error('Error in getLikes:', error);
      throw error;
    }
  },

  async hasUserLiked(postId, userId) {
    try {
      // Use getSession for read checks to avoid strict getUser() errors on public pages
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return false;

      const { data, error } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    } catch (error) {
      // Fail silently for read checks
      return false;
    }
  },

  async addLike(postId, userId) {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('Usuario no autenticado');

      const { error } = await supabase
        .from('likes')
        .insert([{ post_id: postId, user_id: userId }]);
      if (error) throw error;
      return true;
    } catch (error) {
      if (error.message && (error.message.includes('JWT') || error.message.includes('sub claim'))) {
        throw new Error('Sesión inválida. Por favor recarga la página.');
      }
      console.error('Error in addLike:', error);
      throw error;
    }
  },

  async removeLike(postId, userId) {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('Usuario no autenticado');

      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);
      if (error) throw error;
      return true;
    } catch (error) {
      if (error.message && (error.message.includes('JWT') || error.message.includes('sub claim'))) {
        throw new Error('Sesión inválida. Por favor recarga la página.');
      }
      console.error('Error in removeLike:', error);
      throw error;
    }
  }
};