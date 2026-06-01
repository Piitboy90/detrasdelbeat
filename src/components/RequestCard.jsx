import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Download, MessageSquarePlus, Clock, CheckCircle2, Package, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ReviewModal from './ReviewModal';

const STATUS_CONFIG = {
  received: { label: 'Recibido', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: Package },
  in_production: { label: 'En Producción', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: Sparkles },
  delivered: { label: 'Entregado', color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: CheckCircle2 },
  published: { label: 'Publicado', color: 'bg-[#FF8C42]/20 text-[#FF8C42] border-[#FF8C42]/30', icon: CheckCircle2 },
};

function RequestCard({ request }) {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const status = STATUS_CONFIG[request.status] || STATUS_CONFIG.received;
  const StatusIcon = status.icon;
  const isFinished = ['delivered', 'published'].includes(request.status);

  return (
    <>
      <div className="bg-[#1E293B]/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden hover:border-gray-600 transition-all">
        <div className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">{request.title || 'Solicitud sin título'}</h3>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(new Date(request.created_at), { addSuffix: true, locale: es })}
              </p>
            </div>
            <Badge className={`flex items-center gap-1 border ${status.color}`}>
              <StatusIcon className="w-3 h-3" />
              {status.label}
            </Badge>
          </div>

          <div className="bg-[#0F172A] rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-300 italic">
              "{request.story_brief || request.motive || 'Sin descripción'}"
            </p>
          </div>

          {!isFinished ? (
            <div className="flex items-center gap-2 text-sm text-gray-400 bg-blue-500/5 p-3 rounded-lg border border-blue-500/10">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Estamos trabajando en tu historia. Te avisaremos pronto.</span>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-500/5 border border-green-500/10 rounded-lg p-4">
                <h4 className="text-sm font-medium text-green-400 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Tu entrega está lista
                </h4>
                {request.delivery_note && (
                  <p className="text-sm text-gray-300 mb-3">{request.delivery_note}</p>
                )}
                
                <div className="flex flex-wrap gap-3">
                  {request.delivery_url && (
                    <Button 
                      onClick={() => window.open(request.delivery_url, '_blank')}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      size="sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Descargar {request.delivery_filename ? `(${request.delivery_filename})` : ''}
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    onClick={() => setShowReviewModal(true)}
                    className="border-gray-600 text-gray-300 hover:text-white hover:bg-white/5"
                    size="sm"
                  >
                    <MessageSquarePlus className="w-4 h-4 mr-2" />
                    Dejar reseña
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ReviewModal 
        request={request} 
        open={showReviewModal} 
        onOpenChange={setShowReviewModal} 
      />
    </>
  );
}

export default RequestCard;