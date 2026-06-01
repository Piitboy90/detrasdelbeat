import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, ShieldAlert, Sparkles, AlertCircle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

function ReviewModal({ request, open, onOpenChange, onSuccess, isVerified = false }) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin';

  const handleSubmit = async () => {
    if (!isVerified && !isAdmin) { // Admins can always leave reviews for testing if needed, or restrict strictly
       return;
    }
    
    if (rating === 0) {
      toast({ title: "Calificación requerida", description: "Por favor selecciona las estrellas.", variant: "destructive" });
      return;
    }
    if (text.trim().length === 0) {
      toast({ title: "Opinión requerida", description: "Escribe brevemente qué te pareció.", variant: "destructive" });
      return;
    }
    
    if (!request?.id) {
       toast({ title: "Error", description: "No se encontró la solicitud asociada.", variant: "destructive" });
       return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('reviews').insert({
        request_id: request.id,
        user_id: request.user_id,
        rating,
        text,
        is_public: isPublic,
        is_featured: isAdmin ? isFeatured : false // Only admins can feature
      });

      if (error) throw error;

      toast({
        title: "¡Gracias!",
        description: "Tu voz ayuda a que más historias suenen.",
      });
      if (onSuccess) onSuccess();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "No se pudo guardar la reseña.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1E293B] border-gray-700 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Valora tu experiencia</DialogTitle>
          <DialogDescription className="text-gray-400">
             {request ? `¿Qué te pareció el resultado de "${request.title}"?` : 'Comparte tu experiencia con BeatStory.'}
          </DialogDescription>
        </DialogHeader>

        {!isVerified ? (
          <div className="py-6 text-center space-y-4">
             <div className="bg-[#FF8C42]/10 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <ShieldAlert className="w-8 h-8 text-[#FF8C42]" />
             </div>
             <div>
               <h4 className="text-lg font-medium text-white mb-2">Verificación necesaria</h4>
               <p className="text-sm text-gray-400 max-w-xs mx-auto mb-4">
                 Para asegurar la autenticidad, solo los usuarios con al menos una canción entregada pueden dejar reseñas.
               </p>
               <Link to="/solicitar" onClick={() => onOpenChange(false)}>
                 <Button className="bg-[#FF8C42] hover:bg-[#ff7a1f] text-white">
                    Solicitar mi canción
                 </Button>
               </Link>
             </div>
          </div>
        ) : (
          <>
            <div className="space-y-6 py-4">
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star 
                      className={cn(
                        "w-8 h-8", 
                        rating >= star ? "text-[#FF8C42] fill-[#FF8C42]" : "text-gray-600"
                      )} 
                    />
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <Label>Tu opinión</Label>
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value.slice(0, 240))}
                  placeholder="La canción capturó exactamente lo que sentía..."
                  className="bg-[#0F172A] border-gray-600 focus:border-[#FF8C42] min-h-[100px]"
                />
                <div className="text-right text-xs text-gray-500">
                  {text.length}/240
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="public" 
                    checked={isPublic} 
                    onCheckedChange={setIsPublic}
                    className="border-gray-500 data-[state=checked]:bg-[#FF8C42] data-[state=checked]:border-[#FF8C42]"
                  />
                  <Label htmlFor="public" className="text-sm font-normal text-gray-300 cursor-pointer">
                    Aceptar que se muestre en Home (Verificado)
                  </Label>
                </div>
                
                {isAdmin && (
                  <div className="flex items-center space-x-2 pt-2 border-t border-gray-700">
                    <Checkbox 
                      id="featured" 
                      checked={isFeatured} 
                      onCheckedChange={setIsFeatured}
                      className="border-gray-500 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                    />
                    <Label htmlFor="featured" className="text-sm font-normal text-purple-300 cursor-pointer flex items-center gap-2">
                      <Sparkles className="w-3 h-3" /> Destacar reseña (Admin)
                    </Label>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button 
                onClick={handleSubmit} 
                disabled={submitting}
                className="bg-[#FF8C42] hover:bg-[#ff7a1f] text-white"
              >
                {submitting ? 'Enviando...' : 'Enviar reseña'}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ReviewModal;