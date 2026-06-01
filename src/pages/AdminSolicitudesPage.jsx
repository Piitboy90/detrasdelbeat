import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import AdminRequestCard from '@/components/AdminRequestCard';
import { getPageTitle } from '@/lib/seo';
import { handleSupabaseError } from '@/lib/supabaseErrorHandler';
import { useToast } from '@/components/ui/use-toast';
import { ShieldAlert } from 'lucide-react';

function AdminSolicitudesPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const isAdmin = profile?.role === 'admin' || profile?.role === 'moderator';

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setRequests(data || []);
    } catch (err) {
      const msg = handleSupabaseError(err);
      setError(msg);
      toast({ title: "Error al cargar", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchRequests();
    } else {
      setLoading(false);
      setError("Acceso denegado. Se requieren permisos de administrador.");
    }
  }, [isAdmin]);

  return (
    <>
      <Helmet>
        <title>{getPageTitle("Admin Solicitudes")}</title>
      </Helmet>

      <div className="min-h-screen bg-[#0F172A] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-white">Administrar Solicitudes</h1>
            <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-mono">
              Total: {requests.length}
            </span>
          </div>

          {!isAdmin ? (
             <div className="text-center py-20 bg-[#1E293B]/30 rounded-2xl border border-red-500/30">
               <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
               <p className="text-red-400 font-medium text-lg">Acceso denegado</p>
               <p className="text-gray-400">Esta sección es solo para administradores.</p>
             </div>
          ) : (
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-20">
                   <div className="animate-spin h-8 w-8 border-2 border-[#FF8C42] border-t-transparent rounded-full mx-auto mb-4"></div>
                   <p className="text-gray-400">Cargando solicitudes...</p>
                </div>
              ) : error ? (
                 <div className="p-6 bg-red-900/20 border border-red-500/30 rounded-xl text-center">
                    <p className="text-red-400 font-medium">Error al conectar con la base de datos</p>
                    <p className="text-sm text-gray-400 mt-2">{error}</p>
                 </div>
              ) : requests.length === 0 ? (
                 <div className="text-center py-16 bg-[#1E293B]/30 rounded-2xl border border-gray-800">
                    <p className="text-gray-400">No hay solicitudes pendientes.</p>
                 </div>
              ) : (
                requests.map(req => (
                  <AdminRequestCard 
                    key={req.id} 
                    request={req} 
                    onUpdate={fetchRequests} 
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AdminSolicitudesPage;