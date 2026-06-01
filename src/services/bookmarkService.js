import { supabase } from '@/lib/supabase';

export const bookmarkService = {
  /**
   * Check if a specific user has bookmarked a specific post
   * @param {string} postId 
   * @param {string} userId 
   * @returns {Promise<boolean>}
   */
  async hasUserBookmarked(postId, userId) {
    if (!userId || !postId) return false;
    
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error checking bookmark status:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Unexpected error in hasUserBookmarked:', error);
      return false;
    }
  },

  /**
   * Add a bookmark for a user
   * @param {string} postId 
   * @param {string} userId 
   */
  async addBookmark(postId, userId) {
    if (!userId) throw new Error('User ID is required');

    const { error } = await supabase
      .from('bookmarks')
      .insert([{ post_id: postId, user_id: userId }]);

    if (error) throw error;
    return true;
  },

  /**
   * Remove a bookmark for a user
   * @param {string} postId 
   * @param {string} userId 
   */
  async removeBookmark(postId, userId) {
    if (!userId) throw new Error('User ID is required');

    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  },

  /**
   * Get all posts bookmarked by a user
   * @param {string} userId 
   */
  async getBookmarkedPosts(userId) {
    if (!userId) return [];

    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select(`
          post_id,
          posts:post_id (
            *,
            likes (count),
            comments (count),
            profiles:user_id (username, avatar_url)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bookmarked posts:', error);
        return [];
      }

      // Filter out any null posts (e.g. if a post was deleted but bookmark remains)
      return data
        .map(item => item.posts)
        .filter(post => post !== null);
    } catch (error) {
      console.error('Error in getBookmarkedPosts:', error);
      return [];
    }
  }
};