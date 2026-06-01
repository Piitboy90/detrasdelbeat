import { supabase } from '@/lib/supabase';
import { toHttps } from '@/utils/urlSecurity.js';

// Cache for signed URLs to prevent excessive API calls
const signedUrlCache = new Map();

export const audioService = {
  async uploadAudio(file, userId, postId) {
    try {
      const ext = file.name.split('.').pop();
      const timestamp = Date.now();
      const fileName = `${postId}-${timestamp}.${ext}`;
      const filePath = `${userId}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('audio')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      return {
        path: data.path,
        fullPath: data.fullPath
      };
    } catch (error) {
      console.error('Error uploading audio:', error);
      throw error;
    }
  },

  async getAudioUrl(path, expiresIn = 3600) {
    if (!path) return null;

    if (signedUrlCache.has(path)) {
      return signedUrlCache.get(path);
    }

    try {
      const { data, error } = await supabase.storage
        .from('audio')
        .createSignedUrl(path, expiresIn);

      if (error) throw error;
      
      const url = toHttps(data.signedUrl);
      signedUrlCache.set(path, url);
      return url;
    } catch (error) {
      console.error('Error getting audio URL:', error);
      return null;
    }
  },

  async getSignedUrl(path, expiresIn = 3600) {
    return this.getAudioUrl(path, expiresIn);
  },

  clearSignedUrlCache(path) {
    if (path) {
      signedUrlCache.delete(path);
    }
  },

  async extractDuration(file) {
    return new Promise((resolve, reject) => {
      const audio = new Audio(URL.createObjectURL(file));
      audio.onloadedmetadata = () => {
        resolve(Math.round(audio.duration));
      };
      audio.onerror = (e) => {
        console.error('Error extracting duration:', e);
        resolve(0);
      };
    });
  },

  async deleteAudio(path) {
    if (!path) return;
    try {
      const { error } = await supabase.storage
        .from('audio')
        .remove([path]);
      
      if (error) throw error;
      this.clearSignedUrlCache(path);
    } catch (error) {
      console.error('Error deleting audio:', error);
      throw error;
    }
  }
};