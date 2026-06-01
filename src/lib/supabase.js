import { createClient } from '@supabase/supabase-js';
import { toHttps } from '@/utils/urlSecurity.js';

let supabaseInstance = null;

export const getSupabaseClient = () => {
  if (!supabaseInstance) {
    const supabaseUrl = toHttps(import.meta.env.VITE_SUPABASE_URL);
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error(
        "CRITICAL ERROR: Missing Supabase environment variables!\n" +
        "Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your environment."
      );
    }

    supabaseInstance = createClient(
      supabaseUrl || 'https://placeholder-missing-url.supabase.co', 
      supabaseAnonKey || 'placeholder-missing-key',
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storage: window.localStorage
        }
      }
    );
  }
  return supabaseInstance;
};

export const isSupabaseConfigured = () => {
  return !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
};

export const supabase = getSupabaseClient();
export default supabase;