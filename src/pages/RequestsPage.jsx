import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { requestsService } from '@/services/requestsService';
import { Button } from '@/components/ui/button';
import RequestStatusBadge from '@/components/RequestStatusBadge';
import EmptyState from '@/components/EmptyState';
import { Loader2, ArrowRight, Music, FileText, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

function RequestsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedLyrics, setExpandedLyrics] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await requestsService.getRequests(user.id);
        setRequests(data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [user.id]);

  const toggleLyrics = (id) => {
    setExpandedLyrics(expandedLyrics === id ? null : id);
  };

  return (
    <>
      <Helmet><title>Mis Solicitudes | BeatStory</title></Helmet>

      <div className="min-h-screen bg-[#0F172A] py-8 px-4 sm:px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8 border-b border-gray-800 pb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Mis Solicitudes</h1>
              <p className="text-gray-400 text-sm">Estado de tus canciones pedidas.</p>
            </div>
            <Button onClick={() => navigate('/request-song')} className="bg-[#FF8C42] hover:bg-[#ff7a1f] text-white text-xs sm:text-sm">
               Nueva solicitud
            </Button>
          </div>

          {loading ? (
             <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 text-[#FF8C42] animate-spin" />
             </div>
          ) : requests.length === 0 ? (
             <EmptyState 
                type="generic"
                title="Sin solicitudes"
                subtitle="Aún no has pedido ninguna canción."
                actionLabel="Pedir mi primera canción"
                onAction={() => navigate('/request-song')}
             />
          ) : (
             <div className="grid gap-6">
                {requests.map((req, index) => (
                   <motion.div 
                     key={req.id}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: index * 0.1 }}
                     className="bg-[#1E293B] border border-gray-700 rounded-xl p-6 shadow-md"
                   >
                      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-4">
                         <div>
                            <div className="flex items-center gap-3 mb-2">
                               <h3 className="text-xl font-bold text-white">{req.title || 'Sin título'}</h3>
                               <RequestStatusBadge status={req.status} />
                            </div>
                            <div className="flex flex-wrap gap-2 text-xs text-gray-400 mb-2">
                               <span className="bg-gray-800 px-2 py-1 rounded border border-gray-700">{req.style}</span>
                               <span className="bg-gray-800 px-2 py-1 rounded border border-gray-700">{req.mood}</span>
                               <span className="flex items-center gap-1 text-gray-500 ml-2">
                                  {format(new Date(req.created_at), "d 'de' MMMM", { locale: es })}
                               </span>
                            </div>
                         </div>
                      </div>

                      <div className="bg-[#0F172A]/50 p-4 rounded-lg border border-gray-800 mb-4">
                         <p className="text-gray-300 text-sm italic">"{req.dedication}"</p>
                      </div>

                      {/* Status Specific Content */}
                      {req.status === 'completed' && req.result_url && (
                         <div className="mt-4 border-t border-gray-700 pt-4">
                            <h4 className="text-[#FF8C42] font-semibold text-sm mb-3 flex items-center gap-2">
                               <Music className="w-4 h-4" /> ¡Tu canción está lista!
                            </h4>
                            <div className="flex flex-wrap gap-3">
                               <a href={req.result_url} target="_blank" rel="noopener noreferrer">
                                  <Button className="bg-[#FF8C42] hover:bg-[#ff7a1f] text-white btn-sm h-9">
                                     Escuchar ahora <ExternalLink className="w-3 h-3 ml-2" />
                                  </Button>
                               </a>
                               {req.result_lyrics && (
                                  <Button variant="outline" size="sm" onClick={() => toggleLyrics(req.id)} className="border-gray-600 text-gray-300">
                                     {expandedLyrics === req.id ? "Ocultar letra" : "Ver letra"} 
                                     {expandedLyrics === req.id ? <ChevronUp className="ml-2 w-3 h-3"/> : <ChevronDown className="ml-2 w-3 h-3"/>}
                                  </Button>
                               )}
                            </div>
                            
                            {expandedLyrics === req.id && (
                               <div className="mt-4 p-4 bg-[#0F172A] rounded-lg text-gray-300 text-sm whitespace-pre-wrap border border-gray-800 animate-in fade-in slide-in-from-top-2">
                                  {req.result_lyrics}
                               </div>
                            )}
                         </div>
                      )}

                      {req.status === 'in_progress' && (
                         <div className="mt-4 flex items-center gap-2 text-orange-400 text-sm bg-orange-500/10 p-3 rounded-lg border border-orange-500/20">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>La estoy trabajando… Pronto tendrás noticias.</span>
                         </div>
                      )}

                      {req.status === 'rejected' && (
                         <div className="mt-4 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                            <p>No pudimos procesar tu solicitud. {req.admin_notes && `Motivo: ${req.admin_notes}`}</p>
                         </div>
                      )}

                   </motion.div>
                ))}
             </div>
          )}

          <div className="mt-12 text-center">
             <Button variant="ghost" onClick={() => navigate('/')} className="text-gray-400 hover:text-white">
                Volver al Home
             </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default RequestsPage;