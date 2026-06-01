import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/hooks/useAuth';
import { requestsService } from '@/utils/requestsService';
import { Button } from '@/components/ui/button';
import RequestCard from '@/components/RequestCard';
import { ArrowLeft, PlusCircle, Inbox } from 'lucide-react';

function MyRequestsPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      if (user) {
        try {
          const data = await requestsService.getMyRequests(user.id);
          setRequests(data || []);
        } catch (error) {
          console.error('Failed to load requests:', error);
        } finally {
          setLoading(false);
        }
      } else if (!authLoading) {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] py-12 px-4 flex justify-center items-start">
        <div className="animate-pulse w-full max-w-4xl space-y-4">
          <div className="h-8 w-48 bg-gray-800 rounded mb-8" />
          <div className="h-32 bg-gray-800 rounded-xl" />
          <div className="h-32 bg-gray-800 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
           <h2 className="text-2xl font-bold text-white mb-4">Inicia sesión</h2>
           <p className="text-gray-400 mb-6">Necesitas estar identificado para ver tus solicitudes.</p>
           <Button onClick={() => navigate('/login?redirect=/requests')} className="bg-[#FF8C42]">
             Iniciar Sesión
           </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Mis Solicitudes | BeatStory</title>
      </Helmet>

      <div className="min-h-screen bg-[#0F172A] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-3xl font-bold text-white">Mis Solicitudes</h1>
            </div>
            
            <Link to="/request-song">
              <Button className="bg-[#FF8C42] hover:bg-[#ff7a1f] text-white gap-2">
                <PlusCircle className="w-4 h-4" /> Nueva solicitud
              </Button>
            </Link>
          </div>

          {requests.length === 0 ? (
            <div className="bg-[#1E293B] border border-gray-800 rounded-xl p-12 text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Inbox className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Aún no tienes solicitudes</h3>
              <p className="text-gray-400 mb-6 max-w-sm mx-auto">
                Envía tu primera historia y la convertiremos en una canción única con IA.
              </p>
              <Link to="/request-song">
                <Button variant="outline" className="border-[#FF8C42] text-[#FF8C42] hover:bg-[#FF8C42] hover:text-white">
                  Crear mi primera solicitud
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {requests.map(request => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
}

export default MyRequestsPage;