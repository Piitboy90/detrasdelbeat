import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Save, Loader2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { handleSupabaseError } from '@/lib/supabaseErrorHandler';

function AdminRequestCard({ request, onUpdate }) {
  const [status, setStatus] = useState(request.status || 'received');
  const [deliveryUrl, setDeliveryUrl] = useState(request.delivery_url || request.result_url || '');
  const [deliveryFilename, setDeliveryFilename] = useState(request.delivery_filename || '');
  const [deliveryNote, setDeliveryNote] = useState(request.delivery_note || '');
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = {
        status,
        result_url: deliveryUrl,
        delivery_url: deliveryUrl,
        delivery_filename: deliveryFilename,
        delivery_note: deliveryNote,
      };

      if (status === 'delivered' && request.status !== 'delivered') {
        updates.delivered_at = new Date();
      }

      const { error } = await supabase
        .from('requests')
        .update(updates)
        .eq('id', request.id);

      if (error) throw error;

      if (status === 'delivered' && request.status !== 'delivered') {
         const { error: notifError } = await supabase.from('notifications').insert([
           {
             user_id: request.user_id,
             type: 'delivery_ready',
             title: '¡Tu canción está lista!',
             body: `Tu solicitud "${request.title}" ha sido completada. Escúchala ahora.`,
             link: '/mis-pedidos',
           },
           {
             user_id: request.user_id,
             type: 'info',
             title: 'Valora tu experiencia',
             body: 'Nos encantaría saber qué piensas de tu nueva canción.',
             link: '/mis-pedidos',
           }
         ]);
         if (notifError) console.error("Error creating notifications:", handleSupabaseError(notifError));
      }

      toast({ title: "Actualizado", description: "Solicitud guardada correctamente." });
      if (onUpdate) onUpdate();

    } catch (err) {
      toast({ title: "Error", description: handleSupabaseError(err), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-[#1E293B] border border-gray-700 rounded-xl p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-white text-lg">{request.title}</h3>
          <p className="text-sm text-gray-400">ID: {request.id.slice(0, 8)}...</p>
          <div className="flex items-center gap-2 mt-1">
             <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-300">
               {request.music_style || 'Sin estilo'}
             </span>
             <span className="text-xs text-gray-500">
               {formatDistanceToNow(new Date(request.created_at), { addSuffix: true, locale: es })}
             </span>
          </div>
        </div>
        <div className="w-40">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="bg-[#0F172A] border-gray-600">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="received">Recibido</SelectItem>
              <SelectItem value="in_production">En producción</SelectItem>
              <SelectItem value="delivered">Entregado</SelectItem>
              <SelectItem value="published">Publicado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-[#0F172A] p-3 rounded-lg mb-6 text-sm text-gray-300 border border-gray-800">
        <p className="font-semibold text-gray-400 mb-1">Descripción / Historia:</p>
        {request.description || request.story_brief || request.motive}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <Label className="text-xs">Delivery URL</Label>
          <div className="flex gap-2">
             <Input 
                value={deliveryUrl} 
                onChange={e => setDeliveryUrl(e.target.value)}
                className="bg-[#0F172A] border-gray-700 h-8 text-xs text-white placeholder:text-gray-500"
                placeholder="https://..." 
             />
             {deliveryUrl && (
               <Button size="icon" variant="ghost" className="h-8 w-8 text-white hover:bg-white/10" onClick={() => window.open(deliveryUrl, '_blank')}>
                 <ExternalLink className="w-3 h-3" />
               </Button>
             )}
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Filename (Optional)</Label>
          <Input 
            value={deliveryFilename} 
            onChange={e => setDeliveryFilename(e.target.value)}
            className="bg-[#0F172A] border-gray-700 h-8 text-xs text-white placeholder:text-gray-500"
            placeholder="song_v1.mp3" 
          />
        </div>
      </div>

      <div className="space-y-2 mb-6">
         <Label className="text-xs">Nota de entrega (Visible para usuario)</Label>
         <Textarea 
            value={deliveryNote}
            onChange={e => setDeliveryNote(e.target.value)}
            className="bg-[#0F172A] border-gray-700 text-sm min-h-[60px] text-white placeholder:text-gray-500"
            placeholder="¡Esperamos que te guste! Fue un reto capturar..."
         />
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-[#FF8C42] hover:bg-[#ff7a1f] text-white"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Guardar cambios
        </Button>
      </div>
    </div>
  );
}

export default AdminRequestCard;