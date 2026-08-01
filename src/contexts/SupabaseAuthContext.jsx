import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import supabase from '@/lib/supabase';
import { track } from '@/lib/analytics';

const SupabaseAuthContext = createContext(undefined);

export const SupabaseAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (err) {
        console.error('Error getting session:', err);
        if (mounted) {
          setSession(null);
          setUser(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      // Solo cuando Supabase confirma la sesion, no al pulsar el boton.
      if (!error && data?.session) track('login_ok');
      return { data, error: error?.message ?? null };
    } catch (err) {
      // Network failures (DNS down, offline, paused project) are thrown, not returned
      console.error('Login failed:', err);
      return { data: null, error: err?.message ?? 'Unknown error' };
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setSession(null);
  };

  const signup = async (email, password, username) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } },
      });
      // data.user llega tanto si hay sesion inmediata como si queda
      // pendiente de confirmar el email; en ambos casos el alta se creo.
      if (!error && data?.user) track('registro_ok');
      return { data, error: error?.message ?? null };
    } catch (err) {
      console.error('Signup failed:', err);
      return { data: null, error: err?.message ?? 'Unknown error' };
    }
  };

  const value = useMemo(() => ({
    user,
    session,
    loading,
    login,
    logout,
    signup,
  }), [user, session, loading]);

  return <SupabaseAuthContext.Provider value={value}>{children}</SupabaseAuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(SupabaseAuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a SupabaseAuthProvider');
  }
  return context;
};