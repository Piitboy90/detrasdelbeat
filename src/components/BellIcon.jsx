import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { handleSupabaseError } from '@/lib/supabaseErrorHandler';

function BellIcon() {
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const userId = user?.id;
    if (!userId) return;

    let mounted = true;

    const fetchNotifications = async () => {
      try {
        const { count, error } = await supabase
          .from('notifications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('is_read', false);

        if (error) throw error;
        if (mounted) setUnreadCount(count || 0);
      } catch (err) {
        console.error("Error fetching notification count:", handleSupabaseError(err));
        if (mounted) setUnreadCount(0); // Fallback on error
      }
    };

    fetchNotifications();

    // Nombre de canal unico por montaje para evitar el error
    // "cannot add postgres_changes callbacks after subscribe()" que ocurre
    // cuando supabase-js reusa una instancia de canal todavia subscrita.
    const channel = supabase
      .channel(`notifications-${userId}-${Date.now()}`)
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
        (payload) => {
          if (mounted) setUnreadCount(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return (
    <Link to="/buzon" className="relative p-2 text-gray-400 hover:text-[#FF8C42] transition-colors rounded-full hover:bg-white/5">
      <Bell className="w-5 h-5" />
      {unreadCount > 0 && (
        <span className={cn(
          "absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-sm border border-[#0F172A]",
          "bg-red-500"
        )}>
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  );
}

export default BellIcon;