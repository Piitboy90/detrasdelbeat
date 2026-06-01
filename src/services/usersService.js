import { supabase } from '@/lib/supabase';
import { toHttps } from '@/utils/urlSecurity.js';

export const usersService = {
  async getUserByUsername(username) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .ilike('username', username)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }
      
      if (data) {
        data.avatar_url = toHttps(data.avatar_url);
      }
      return data;
    } catch (error) {
      console.error('Error in getUserByUsername:', error);
      throw error;
    }
  },

  async getProfileById(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      if (data) {
        data.avatar_url = toHttps(data.avatar_url);
      }
      return data;
    } catch (error) {
      console.error('Error in getProfileById:', error);
      throw error;
    }
  },

  async updateProfile(userId, updates) {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('Usuario no autenticado');

      const payload = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('profiles')
        .update(payload)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        data.avatar_url = toHttps(data.avatar_url);
      }
      return data;
    } catch (error) {
      if (error.message && (error.message.includes('JWT') || error.message.includes('sub claim'))) {
        throw new Error('Sesión inválida. Por favor recarga la página.');
      }
      console.error('Error in updateProfile:', error);
      throw error;
    }
  },

  async checkUsernameAvailable(username, currentUserId = null) {
    try {
      let query = supabase
        .from('profiles')
        .select('user_id')
        .ilike('username', username);

      if (currentUserId) {
        query = query.neq('user_id', currentUserId);
      }

      const { data, error } = await query.maybeSingle();

      if (error) throw error;
      return !data;
    } catch (error) {
      console.error('Error in checkUsernameAvailable:', error);
      return false;
    }
  },

  async getUserStats(userId) {
    try {
      const { count: postsCount, error: postsError } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (postsError) throw postsError;

      const { data: posts, error: fetchError } = await supabase
        .from('posts')
        .select('id')
        .eq('user_id', userId);

      if (fetchError) throw fetchError;

      let likesCount = 0;
      if (posts && posts.length > 0) {
        const postIds = posts.map(p => p.id);
        const { count, error: likesError } = await supabase
          .from('likes')
          .select('*', { count: 'exact', head: true })
          .in('post_id', postIds);

        if (likesError) throw likesError;
        likesCount = count || 0;
      }

      return {
        postsCount: postsCount || 0,
        likesCount: likesCount || 0
      };
    } catch (error) {
      console.error('Error in getUserStats:', error);
      return { postsCount: 0, likesCount: 0 };
    }
  }
};