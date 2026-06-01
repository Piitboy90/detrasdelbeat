import { supabase } from '@/lib/supabase';

export const commentsService = {
  async getCommentsByPostId(postId) {
    try {
      // 1. Fetch comments without the join first
      const { data: comments, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: false });

      if (commentsError) throw commentsError;
      if (!comments || comments.length === 0) return [];

      // 2. Extract unique user IDs from comments
      const userIds = [...new Set(comments.map(comment => comment.user_id))];

      // 3. Fetch profiles for these users manually
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, username, avatar_url')
        .in('user_id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles for comments:', profilesError);
        // Return comments without profiles if profile fetch fails, rather than crashing
        return comments.map(c => ({ ...c, profiles: null }));
      }

      // 4. Create a lookup map for profiles
      const profilesMap = (profiles || []).reduce((acc, profile) => {
        acc[profile.user_id] = profile;
        return acc;
      }, {});

      // 5. Attach profile data to each comment
      const commentsWithProfiles = comments.map(comment => ({
        ...comment,
        profiles: profilesMap[comment.user_id] || null
      }));

      return commentsWithProfiles;
    } catch (error) {
      console.error('Error in getCommentsByPostId:', error);
      throw error;
    }
  },

  async createComment(commentData) {
    try {
      // Validate auth first
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('Usuario no autenticado');

      // 1. Insert the comment
      const { data: comment, error: commentError } = await supabase
        .from('comments')
        .insert([commentData])
        .select()
        .single();

      if (commentError) throw commentError;

      // 2. Fetch the user's profile manually to return with the comment
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('user_id', commentData.user_id)
        .single();

      // Return comment with profile (or null if not found/error)
      return {
        ...comment,
        profiles: profile || null
      };
    } catch (error) {
      if (error.message && (error.message.includes('JWT') || error.message.includes('sub claim'))) {
        throw new Error('Sesión inválida. Por favor recarga la página.');
      }
      console.error('Error in createComment:', error);
      throw error;
    }
  },

  async deleteComment(commentId) {
    try {
      // Validate auth first
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('Usuario no autenticado');

      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;
      return true;
    } catch (error) {
      if (error.message && (error.message.includes('JWT') || error.message.includes('sub claim'))) {
        throw new Error('Sesión inválida. Por favor recarga la página.');
      }
      console.error('Error in deleteComment:', error);
      throw error;
    }
  }
};