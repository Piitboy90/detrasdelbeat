import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare as MessageSquareQuote, ArrowRight, Sparkles, Mic, Music } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import ReviewCard from './ReviewCard';
import { useAuth } from '@/hooks/useAuth';
import { getVerificationStatus } from '@/utils/verification';
import ReviewModal from './ReviewModal';
import { handleSupabaseError } from '@/lib/supabaseErrorHandler';

function VoicesSection() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [latestRequest, setLatestRequest] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    let mounted = true;

    async function fetchReviews() {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error: fetchError } = await supabase
          .from('reviews_public_view')
          .select('*')
          .eq('is_featured', true)
          .order('created_at', { ascending: false })
          .limit(6);

        if (fetchError) throw fetchError;

        if (!data || data.length === 0) {
            const { data: allReviews, error: allError } = await supabase
              .from('reviews_public_view')
              .select('*')
              .eq('is_public', true)
              .order('created_at', { ascending: false })
              .limit(6);
              
            if (allError) throw allError;
            if (mounted) setReviews(allReviews || []);
        } else {
            if (mounted) setReviews(data);
        }
      } catch (err) {
        if (mounted) setError(handleSupabaseError(err));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchReviews();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let mounted = true;
    if (user) {
      getVerificationStatus(user.id)
        .then(verified => { if (mounted) setIsVerified(verified); })
        .catch(err => console.error("Verification error:", handleSupabaseError(err)));
      
      async function fetchLatestRequest() {
        try {
          const { data, error } = await supabase
            .from('requests')
            .select('*')
            .eq('user_id', user.id)
            .in('status', ['delivered', 'published'])
            .order('created_at', { ascending: false })
            .limit(1);
            
          if (error) throw error;
          if (mounted && data && data.length > 0) {
            setLatestRequest(data[0]);
          }
        } catch (err) {
           console.error("Latest request fetch error:", handleSupabaseError(err));
        }
      }
      fetchLatestRequest();
    }
    return () => { mounted = false; };
  }, [user]);

  const handleOpenReview = () => {
    setShowReviewModal(true);
  };

  return (
    <div className="py-12 md:py-16 relative z-10 border-t border-gray-800 bg-[#0F172A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="pl-4 border-l-4 border-[#FF8C42]">
            <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">
              Voces que suenan
            </h3>
            <p className="text-gray-400 text-sm md:text-base mt-2 max-w-lg">
              Historias reales convertidas en música. Así suena la experiencia BeatStory.
            </p>
          </div>
          <Link to="/feed">
            <Button variant="ghost" className="text-[#FF8C42] hover:text-white hover:bg-white/5 p-0 h-auto font-normal">
              Explorar biblioteca <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-48 bg-gray-800/20 rounded-xl animate-pulse border border-gray-700/50" />
            ))}
          </div>
        ) : error ? (
           <div className="text-center py-12 bg-red-900/10 rounded-2xl border border-red-500/20">
              <p className="text-red-400 font-medium">No pudimos cargar las reseñas en este momento.</p>
              <p className="text-gray-400 text-sm mt-2">{error}</p>
           </div>
        ) : reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-[#1E293B]/30 rounded-2xl border border-gray-800/50">
            <MessageSquareQuote className="w-12 h-12 text-[#FF8C42]/40 mx-auto mb-4" />
            <h4 className="text-white font-medium text-lg mb-2">Aún no hay reseñas destacadas</h4>
            <p className="text-gray-400 max-w-md mx-auto">
              Las primeras historias están en camino. Sé de los primeros en convertir tu relato en canción.
            </p>
          </div>
        )}

        <div className="mt-12 text-center space-y-4">
          <Link to="/solicitar">
            <Button className="bg-[#FF8C42] hover:bg-[#ff7a1f] text-white px-8 py-6 rounded-full text-lg shadow-lg shadow-[#FF8C42]/20 group">
              Encargar mi canción <Sparkles className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
            </Button>
          </Link>
          
          <div className="pt-4 flex justify-center">
            {user ? (
               isVerified ? (
                 <Button 
                   variant="outline" 
                   onClick={handleOpenReview}
                   className="text-gray-300 border-gray-700 hover:text-white hover:border-[#FF8C42] bg-transparent"
                 >
                   <Mic className="w-4 h-4 mr-2" /> Dejar mi reseña
                 </Button>
               ) : (
                 <div className="flex items-center gap-3 bg-[#1E293B]/50 px-4 py-2 rounded-lg border border-gray-800 max-w-sm text-left">
                    <Music className="w-5 h-5 text-[#FF8C42] flex-shrink-0" />
                    <p className="text-sm text-gray-400">
                       Aún no tienes una entrega. Cuando recibas tu primera canción, tu voz podrá sonar aquí.
                    </p>
                 </div>
               )
            ) : (
               <Link to="/login" className="text-sm text-gray-500 hover:text-[#FF8C42] transition-colors">
                  Inicia sesión para compartir tu experiencia
               </Link>
            )}
          </div>
        </div>
      </div>
      
      <ReviewModal 
        open={showReviewModal}
        onOpenChange={setShowReviewModal}
        request={latestRequest}
        isVerified={isVerified}
      />
    </div>
  );
}

export default VoicesSection;