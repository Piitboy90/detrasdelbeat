import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { PackageSearch } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import RequestCard from '@/components/RequestCard';
import { getPageTitle } from '@/lib/seo';
import { handleSupabaseError } from '@/lib/supabaseErrorHandler';
import { useToast } from '@/components/ui/use-toast';

function MisPedidosPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    async function fetchRequests() {
      if (!user?.id) {
         if (mounted) setLoading(false);
         return;
      }
      try {
        setLoading(true);
        setError(null);
        const { data, error: fetchError } = await supabase
          .from('requests')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        if (mounted) setRequests(data || []);
      } catch (err) {
        const msg = handleSupabaseError(err);
        if (mounted) setError(msg);
        toast({ title: "Error", description: msg, variant: "destructive" });
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchRequests();
    return () => { mounted = false; };
  }, [user, toast]);

  return (
    <>
      <Helmet>
        <title>{getPageTitle("Mis Pedidos")}</title>
      </Helmet>

      <div className="min-h-screen bg-[#0F172A] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-white">Mis Solicitudes</h1>
            <Link to="/solicitar">
              <Button className="bg-[#FF8C42] hover:bg-[#ff7a1f] text-white text-xs md:text-sm">
                Nueva solicitud
              </Button>
            </Link>
          </div>

          <div className="space-y-6">
            {loading ? (
              [1, 2].map(i => (
                <div key={i} className="h-64 bg-[#1E293B] rounded-xl animate-pulse border border-gray-700/50" />
              ))
            ) : error ? (
               <div className="p-6 bg-red-900/20 border border-red-500/30 rounded-xl text-center">
                  <p className="text-red-400 font-medium">Error al cargar solicitudes</p>
                  <p className="text-sm text-gray-400 mt-2">{error}</p>
               </div>
            ) : requests.length > 0 ? (
              requests.map(req => (
                <RequestCard key={req.id} request={req} />
              ))
            ) : (
              <div className="text-center py-16 bg-[#1E293B]/30 rounded-2xl border border-gray-800">
                <PackageSearch className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-white font-medium mb-1">Aún no tienes pedidos</h3>
                <p className="text-gray-400 mb-6">Empieza a crear tu primera canción personalizada.</p>
                <Link to="/solicitar">
                  <Button variant="outline" className="border-[#FF8C42] text-[#FF8C42] hover:bg-[#FF8C42] hover:text-white">
                    Crear ahora
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default MisPedidosPage;