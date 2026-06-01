import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import supabase from '@/lib/supabase';

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
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return { data, error };
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setSession(null);
  };
  
  const signUp = async (email, password, options) => {
    const { data, error } = await supabase.auth.signUp({ email, password, options });
    if (error) throw error;
    return { data, error };
  };

  const value = useMemo(() => ({
    user,
    session,
    loading,
    login,
    logout,
    signUp,
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