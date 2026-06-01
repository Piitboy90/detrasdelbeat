import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { reportsService } from '@/services/reportsService';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

function ReportModal({ isOpen, onClose, postId, commentId }) {
  const [reason, setReason] = useState('spam');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      await reportsService.createReport({
        reported_by: user.id,
        post_id: postId || null,
        comment_id: commentId || null,
        reason: `${reason}: ${details}`
      });
      toast({
        title: "Reporte enviado",
        description: "Gracias por ayudarnos a mantener segura la comunidad.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar el reporte. Inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-[#1E293B] border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Reportar contenido</DialogTitle>
          <DialogDescription className="text-gray-400">
            Ayúdanos a entender el problema. Este reporte es anónimo.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-3 text-gray-300">¿Cuál es el problema?</p>
              <RadioGroup value={reason} onValueChange={setReason} className="gap-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="spam" id="spam" className="border-white text-[#FF6B35]" />
                  <Label htmlFor="spam" className="text-white font-normal cursor-pointer">Es spam o contenido engañoso</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="inappropriate" id="inappropriate" className="border-white text-[#FF6B35]" />
                  <Label htmlFor="inappropriate" className="text-white font-normal cursor-pointer">Contenido inapropiado u ofensivo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" className="border-white text-[#FF6B35]" />
                  <Label htmlFor="other" className="text-white font-normal cursor-pointer">Otro motivo</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="mt-4">
               <Label className="text-sm font-medium text-gray-300 mb-2 block">Detalles adicionales (opcional)</Label>
               <Textarea
                 className="bg-[#0F172A] border-gray-600 text-white focus-visible:ring-[#FF6B35]"
                 rows={3}
                 placeholder="Danos más contexto..."
                 value={details}
                 onChange={(e) => setDetails(e.target.value)}
               />
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting} className="hover:bg-white/10 text-white">
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enviar reporte
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ReportModal;