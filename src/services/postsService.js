import supabase from '@/lib/supabase';
import { audioService } from '@/services/audioService';
import { toHttps } from '@/utils/urlSecurity.js';

async function mergeProfiles(posts) {
  if (!posts || posts.length === 0) return [];
  
  const userIds = [...new Set(posts.map(p => p.user_id))];
  
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('user_id, username, avatar_url, bio')
    .in('user_id', userIds);
    
  if (error) {
    console.error('Error fetching profiles for posts:', error);
    return posts.map(post => ({
      ...post,
      cover_url: toHttps(post.cover_url),
      media_url: toHttps(post.media_url),
      audio_url: toHttps(post.audio_url),
      suno_url: toHttps(post.suno_url),
      external_url: toHttps(post.external_url),
    }));
  }
  
  const profileMap = profiles.reduce((acc, profile) => {
    acc[profile.user_id] = {
      ...profile,
      avatar_url: toHttps(profile.avatar_url)
    };
    return acc;
  }, {});
  
  return posts.map(post => ({
    ...post,
    cover_url: toHttps(post.cover_url),
    media_url: toHttps(post.media_url),
    audio_url: toHttps(post.audio_url),
    suno_url: toHttps(post.suno_url),
    external_url: toHttps(post.external_url),
    profiles: profileMap[post.user_id] || null
  }));
}

export const postsService = {
  async getPosts() {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`*, likes (count), comments (count)`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return await mergeProfiles(data);
    } catch (error) {
      console.error('Error in getPosts:', error);
      throw error;
    }
  },

  async getRecentPosts(limit = 6, offset = 0) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`*, likes (count), comments (count)`)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return await mergeProfiles(data);
    } catch (error) {
      console.error('Error in getRecentPosts:', error);
      throw error;
    }
  },
  
  async getPostsByTag(tag, limit = 3) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`*, likes (count), comments (count)`)
        .contains('tags', [tag])
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return await mergeProfiles(data);
    } catch (error) {
      console.error('Error in getPostsByTag:', error);
      return [];
    }
  },

  async getWeeklyFeature() {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`*, likes (count), comments (count)`)
        .eq('weekly_feature', true)
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;
      
      const [mergedPost] = await mergeProfiles([data]);
      return mergedPost;
    } catch (error) {
      console.error('Error in getWeeklyFeature:', error);
      return null;
    }
  },

  async getLatestPost() {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`*, likes (count), comments (count)`)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;
      
      const [mergedPost] = await mergeProfiles([data]);
      return mergedPost;
    } catch (error) {
      console.error('Error in getLatestPost:', error);
      return null;
    }
  },

  async getSessionPosts(limit = null) {
    try {
      let query = supabase
        .from('posts')
        .select(`*, likes (count), comments (count)`)
        .overlaps('tags', ['sessions', 'Sessions', 'sesiones', 'Sesiones'])
        .order('created_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      } else {
        query = query.limit(1000);
      }

      const { data, error } = await query;

      if (error) throw error;
      return await mergeProfiles(data);
    } catch (error) {
      console.error('Error in getSessionPosts:', error);
      return [];
    }
  },

  async getSessionsPosts(limit = 10) {
    return this.getSessionPosts(limit);
  },
  
  async getPostsByUserId(userId) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`*, likes (count), comments (count)`)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return await mergeProfiles(data);
    } catch (error) {
      console.error('Error in getPostsByUserId:', error);
      throw error;
    }
  },

  async getPostById(id) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`*, likes (count)`)
        .eq('id', id)
        .single();

      if (error) throw error;
      const [mergedPost] = await mergeProfiles([data]);
      return mergedPost;
    } catch (error) {
      console.error('Error in getPostById:', error);
      throw error;
    }
  },

  async createPost(postData) {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('Usuario no autenticado');

      const payload = {
        ...postData,
        is_ai_generated: postData.is_ai_generated !== undefined ? postData.is_ai_generated : true
      };

      const { data, error } = await supabase
        .from('posts')
        .insert([payload])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      if (error.message && (error.message.includes('JWT') || error.message.includes('sub claim'))) {
        throw new Error('Sesión inválida. Por favor recarga la página.');
      }
      console.error('Error in createPost:', error);
      throw error;
    }
  },

  async deletePost(id) {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('Usuario no autenticado');

      const { data: post, error: fetchError } = await supabase
        .from('posts')
        .select('media_type, audio_path')
        .eq('id', id)
        .single();
        
      if (!fetchError && post?.media_type === 'upload' && post?.audio_path) {
        try {
          await audioService.deleteAudio(post.audio_path);
        } catch (audioErr) {
          console.error('Failed to cleanup audio file for post', id, audioErr);
        }
      }

      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      if (error.message && (error.message.includes('JWT') || error.message.includes('sub claim'))) {
        throw new Error('Sesión inválida. Por favor recarga la página.');
      }
      console.error('Error in deletePost:', error);
      throw error;
    }
  },
  
  calculateUserStats(posts) {
    if (!posts || posts.length === 0) return { topMoods: [], favoriteTool: null };
    
    const moodCounts = {};
    posts.forEach(p => {
      if (p.mood) moodCounts[p.mood] = (moodCounts[p.mood] || 0) + 1;
    });
    
    const topMoods = Object.entries(moodCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([mood, count]) => ({ mood, count }));
      
    const toolCounts = {};
    posts.forEach(p => {
      if (p.ai_tool) toolCounts[p.ai_tool] = (toolCounts[p.ai_tool] || 0) + 1;
    });
    
    const favoriteToolEntry = Object.entries(toolCounts)
      .sort(([,a], [,b]) => b - a)[0];
      
    const favoriteTool = favoriteToolEntry 
      ? { name: favoriteToolEntry[0], count: favoriteToolEntry[1] } 
      : null;
      
    return { topMoods, favoriteTool };
  }
};