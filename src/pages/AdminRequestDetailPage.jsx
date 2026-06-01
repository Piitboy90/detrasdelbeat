import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/hooks/useAuth';
import { requestsService } from '@/services/requestsService';
import { postsService } from '@/services/postsService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import RequestStatusBadge from '@/components/RequestStatusBadge';
import { Loader2, ArrowLeft, Save, Share2, ExternalLink, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

function AdminRequestDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  
  const [formData, setFormData] = useState({
    status: '',
    admin_notes: '',
    result_url: '',
    result_lyrics: ''
  });

  useEffect(() => {
    loadRequest();
  }, [id]);

  const loadRequest = async () => {
    setLoading(true);
    try {
      const data = await requestsService.getRequest(id);
      setRequest(data);
      setFormData({
        status: data.status,
        admin_notes: data.admin_notes || '',
        result_url: data.result_url || '',
        result_lyrics: data.result_lyrics || ''
      });
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "No se pudo cargar la solicitud.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await requestsService.updateRequest(id, formData);
      toast({ title: "Cambios guardados", className: "bg-[#0F172A] border-[#FF8C42] text-white" });
      loadRequest(); // Refresh
    } catch (err) {
      toast({ title: "Error al guardar", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handlePublishPost = async () => {
    if (!request.allow_publish || !formData.result_url) {
      toast({ title: "No se puede publicar", description: "Verifica permisos y URL.", variant: "destructive" });
      return;
    }

    if (!confirm("¿Crear post público automáticamente basado en esta solicitud?")) return;

    setPublishing(true);
    try {
      const postPayload = {
        user_id: user.id, // Admin posts it on behalf of user? Or as admin? Usually admin posts it but maybe dedicates it. Let's make admin the poster for now as per requirement imply system action.
        title: request.title || `Historia de ${request.profiles?.username}`,
        story: `Pedido: ${request.dedication}\n\n${request.details || ''}`,
        tags: ['request', request.style, request.mood, 'community-request'],
        media_type: 'external',
        external_url: formData.result_url,
        media_url: formData.result_url,
        is_ai_generated: true,
        ai_tool: 'Suno', // Assumption
        mood: request.mood,
        created_at: new Date(),
        request_id: request.id
      };

      await postsService.createPost(postPayload);
      
      // Auto complete if not
      if (formData.status !== 'completed') {
         await requestsService.updateRequest(id, { ...formData, status: 'completed' });
      }

      toast({ title: "Post publicado con éxito", className: "bg-green-900 border-green-500 text-white" });
      navigate('/feed');
    } catch (err) {
      console.error(err);
      toast({ title: "Error al publicar post", variant: "destructive" });
    } finally {
      setPublishing(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#0F172A] flex justify-center items-center"><Loader2 className="animate-spin text-[#FF8C42]" /></div>;
  if (!request) return <div className="min-h-screen bg-[#0F172A] text-white p-8">Solicitud no encontrada.</div>;

  return (
    <>
      <Helmet><title>Detalle Solicitud | BeatStory Admin</title></Helmet>

      <div className="min-h-screen bg-[#0F172A] py-8 px-4 sm:px-6 pb-24">
        <div className="max-w-4xl mx-auto space-y-8">
           <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={() => navigate('/admin/requests')} className="text-gray-400 hover:text-white pl-0">
                 <ArrowLeft className="mr-2 w-4 h-4" /> Volver a solicitudes
              </Button>
              <div className="flex items-center gap-2">
                 <span className="text-gray-500 text-sm">ID: {request.id.slice(0, 8)}</span>
                 <RequestStatusBadge status={request.status} />
              </div>
           </div>

           {/* User & Request Info */}
           <div className="bg-[#1E293B] border border-gray-700 rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                 <h2 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-2">Información del Usuario</h2>
                 <div className="space-y-3 text-sm">
                    <p><span className="text-gray-400">Usuario:</span> <span className="text-white font-medium">@{request.profiles?.username}</span></p>
                    <p><span className="text-gray-400">Fecha:</span> <span className="text-white">{format(new Date(request.created_at), "dd/MM/yyyy HH:mm")}</span></p>
                    <p><span className="text-gray-400">Publicable:</span> <span className={request.allow_publish ? "text-green-400" : "text-red-400"}>{request.allow_publish ? "SÍ" : "NO"}</span></p>
                 </div>
              </div>
              <div>
                 <h2 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-2">Detalles del Pedido</h2>
                 <div className="space-y-3 text-sm">
                    <p><span className="text-gray-400">Título:</span> <span className="text-white">{request.title || '-'}</span></p>
                    <p><span className="text-gray-400">Estilo:</span> <span className="text-[#FF8C42]">{request.style}</span></p>
                    <p><span className="text-gray-400">Mood:</span> <span className="text-[#FF8C42]">{request.mood}</span></p>
                 </div>
              </div>
              <div className="md:col-span-2 space-y-4">
                 <div>
                    <span className="text-gray-400 text-sm block mb-1">Dedicatoria / Historia:</span>
                    <div className="bg-[#0F172A] p-4 rounded-lg text-gray-200 text-sm italic border border-gray-800">
                       {request.dedication}
                    </div>
                 </div>
                 {request.details && (
                    <div>
                       <span className="text-gray-400 text-sm block mb-1">Detalles Extra:</span>
                       <div className="bg-[#0F172A] p-3 rounded-lg text-gray-300 text-sm border border-gray-800">
                          {request.details}
                       </div>
                    </div>
                 )}
                 {request.reference_links && request.reference_links.length > 0 && (
                    <div>
                       <span className="text-gray-400 text-sm block mb-1">Referencias:</span>
                       <ul className="list-disc list-inside text-blue-400 text-sm">
                          {request.reference_links.map((link, i) => (
                             <li key={i}><a href={link} target="_blank" rel="noreferrer" className="hover:underline truncate inline-block max-w-md align-bottom">{link}</a></li>
                          ))}
                       </ul>
                    </div>
                 )}
              </div>
           </div>

           {/* Admin Action Area */}
           <div className="bg-[#1E293B] border border-gray-700 rounded-xl p-6 space-y-6 shadow-2xl">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                 <Sparkles className="text-[#FF8C42] w-5 h-5" /> Gestión de Admin
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                 <div className="space-y-4">
                    <div className="space-y-2">
                       <Label className="text-white">Estado</Label>
                       <select 
                          value={formData.status}
                          onChange={(e) => setFormData({...formData, status: e.target.value})}
                          className="w-full bg-[#0F172A] border border-gray-600 rounded-md h-10 px-3 text-white focus:border-[#FF8C42]"
                       >
                          <option value="new">Nuevo</option>
                          <option value="in_progress">En Proceso</option>
                          <option value="completed">Completado</option>
                          <option value="rejected">Rechazado</option>
                       </select>
                    </div>
                    
                    <div className="space-y-2">
                       <Label className="text-white">Notas Admin (Internas o razón rechazo)</Label>
                       <Textarea 
                          value={formData.admin_notes}
                          onChange={(e) => setFormData({...formData, admin_notes: e.target.value})}
                          className="bg-[#0F172A] border-gray-600 text-white min-h-[100px]"
                       />
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div className="space-y-2">
                       <Label className="text-white">URL del Resultado (Suno/Udio)</Label>
                       <Input 
                          value={formData.result_url}
                          onChange={(e) => setFormData({...formData, result_url: e.target.value})}
                          className="bg-[#0F172A] border-gray-600 text-white"
                          placeholder="https://suno.com/..."
                       />
                       {formData.result_url && (
                          <a href={formData.result_url} target="_blank" rel="noreferrer" className="text-xs text-[#FF8C42] hover:underline flex items-center gap-1">
                             Probar enlace <ExternalLink className="w-3 h-3" />
                          </a>
                       )}
                    </div>

                    <div className="space-y-2">
                       <Label className="text-white">Letra Generada</Label>
                       <Textarea 
                          value={formData.result_lyrics}
                          onChange={(e) => setFormData({...formData, result_lyrics: e.target.value})}
                          className="bg-[#0F172A] border-gray-600 text-white min-h-[100px]"
                          placeholder="Pegar letra aquí..."
                       />
                    </div>
                 </div>
              </div>

              <div className="pt-6 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                 <Button 
                    onClick={handleSave} 
                    disabled={saving}
                    className="bg-[#FF8C42] hover:bg-[#ff7a1f] text-white w-full sm:w-auto"
                 >
                    {saving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 w-4 h-4" />}
                    Guardar Cambios
                 </Button>

                 {request.allow_publish && formData.result_url && (
                    <Button 
                       onClick={handlePublishPost} 
                       disabled={publishing || saving}
                       variant="outline"
                       className="border-green-600 text-green-500 hover:bg-green-900/20 hover:text-green-400 w-full sm:w-auto"
                    >
                       {publishing ? <Loader2 className="animate-spin mr-2" /> : <Share2 className="mr-2 w-4 h-4" />}
                       Publicar en Feed
                    </Button>
                 )}
              </div>
           </div>
        </div>
      </div>
    </>
  );
}

export default AdminRequestDetailPage;