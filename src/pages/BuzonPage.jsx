import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { CheckCheck, BellOff, ShieldAlert } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import NotificationItem from '@/components/NotificationItem';
import { getPageTitle } from '@/lib/seo';
import { handleSupabaseError } from '@/lib/supabaseErrorHandler';
import { useToast } from '@/components/ui/use-toast';

function BuzonPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("for_you");
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const isAdmin = profile?.role === 'admin';

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (activeTab === "for_you") {
         query = query.in('type', ['like', 'comment', 'delivery_ready', 'review_request']);
      } else if (activeTab === "admin" && isAdmin) {
         query = query.in('type', ['new_request', 'report']);
      }

      const { data, error: fetchError } = await query;
        
      if (fetchError) throw fetchError;
      setNotifications(data || []);
    } catch (err) {
      const msg = handleSupabaseError(err);
      setError(msg);
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user, activeTab]);

  const handleMarkAllRead = async () => {
    try {
      const types = activeTab === 'for_you' 
        ? ['like', 'comment', 'delivery_ready', 'review_request']
        : ['new_request', 'report'];
        
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .in('type', types)
        .eq('is_read', false);
        
      if (updateError) throw updateError;
      
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      toast({ title: "Marcado como leído" });
    } catch (err) {
      toast({ title: "Error al actualizar", description: handleSupabaseError(err), variant: "destructive" });
    }
  };

  const handleItemRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  return (
    <>
      <Helmet>
        <title>{getPageTitle("Buzón")}</title>
      </Helmet>

      <div className="min-h-screen bg-[#0F172A] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-white">Buzón de notificaciones</h1>
            {notifications.some(n => !n.is_read) && !error && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleMarkAllRead}
                className="text-[#FF8C42] hover:text-white hover:bg-[#FF8C42]/10"
              >
                <CheckCheck className="w-4 h-4 mr-2" />
                Marcar todo leído
              </Button>
            )}
          </div>

          <Tabs defaultValue="for_you" value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
            <TabsList className="bg-[#1E293B] border border-gray-700 w-full justify-start p-1">
               <TabsTrigger 
                 value="for_you" 
                 className="flex-1 data-[state=active]:bg-[#FF8C42] data-[state=active]:text-white transition-all"
               >
                 Para ti
               </TabsTrigger>
               {isAdmin && (
                 <TabsTrigger 
                   value="admin" 
                   className="flex-1 data-[state=active]:bg-[#FF8C42] data-[state=active]:text-white transition-all"
                 >
                   Admin
                 </TabsTrigger>
               )}
            </TabsList>
            
            <TabsContent value="for_you" className="mt-4 space-y-4">
              {loading ? (
                [1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-[#1E293B] rounded-xl animate-pulse border border-gray-700/50" />
                ))
              ) : error ? (
                 <div className="p-6 bg-red-900/20 border border-red-500/30 rounded-xl text-center">
                    <p className="text-red-400 font-medium">Error al cargar notificaciones</p>
                    <p className="text-sm text-gray-400 mt-2">{error}</p>
                    <Button variant="outline" className="mt-4" onClick={fetchNotifications}>Reintentar</Button>
                 </div>
              ) : notifications.length > 0 ? (
                notifications.map(notification => (
                  <NotificationItem 
                    key={notification.id} 
                    notification={notification} 
                    onRead={handleItemRead}
                  />
                ))
              ) : (
                <div className="text-center py-16 bg-[#1E293B]/30 rounded-2xl border border-gray-800">
                  <BellOff className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-white font-medium mb-1">Todo está tranquilo</h3>
                  <p className="text-gray-400">No tienes nuevas notificaciones personales.</p>
                </div>
              )}
            </TabsContent>
            
            {isAdmin && (
              <TabsContent value="admin" className="mt-4 space-y-4">
                {loading ? (
                  [1, 2].map(i => (
                    <div key={i} className="h-24 bg-[#1E293B] rounded-xl animate-pulse" />
                  ))
                ) : error ? (
                   <div className="p-6 bg-red-900/20 border border-red-500/30 rounded-xl text-center">
                      <p className="text-red-400 font-medium">Error al cargar notificaciones admin</p>
                      <p className="text-sm text-gray-400 mt-2">{error}</p>
                   </div>
                ) : notifications.length > 0 ? (
                  notifications.map(notification => (
                    <NotificationItem 
                      key={notification.id} 
                      notification={notification} 
                      onRead={handleItemRead}
                    />
                  ))
                ) : (
                  <div className="text-center py-16 bg-[#1E293B]/30 rounded-2xl border border-gray-800">
                    <ShieldAlert className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-white font-medium mb-1">Sin alertas de sistema</h3>
                    <p className="text-gray-400">No hay reportes ni solicitudes nuevas pendientes.</p>
                  </div>
                )}
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </>
  );
}

export default BuzonPage;