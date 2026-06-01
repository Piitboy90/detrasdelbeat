import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { saveDraft, getDraft, clearDraft } from '@/utils/draftStorage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Sparkles, Music2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import NormasCheckbox from '@/components/NormasCheckbox';

const MOTIVES = [
  "Amor", "Perdón", "Motivación", "Cumpleaños", "Reflexión", "Crítica social", "Otro"
];

const MUSIC_STYLES = [
  "Rap", "Neo-soul", "R&B", "Pop", "Indie", "Rock", "Electrónica", "Lo-fi", "Otro"
];

function RequestSongPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    motive: '',
    story: '',
    musicStyle: '',
    customMusicStyle: '',
  });
  
  const [checks, setChecks] = useState([false, false, false]);
  const [showNormasError, setShowNormasError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const draft = getDraft();
    if (draft) {
      setFormData(prev => ({ ...prev, ...draft }));
    }
  }, []);

  useEffect(() => {
    if (formData.motive || formData.story || formData.musicStyle) {
      saveDraft(formData);
    }
  }, [formData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStyleChange = (value) => {
    setFormData(prev => ({ 
      ...prev, 
      musicStyle: value,
      customMusicStyle: value === 'Otro' ? prev.customMusicStyle : '' 
    }));
  };

  const handleCheckChange = (index, value) => {
    const newChecks = [...checks];
    newChecks[index] = value;
    setChecks(newChecks);
    if (showNormasError && newChecks.every(Boolean)) {
      setShowNormasError(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { data: { user: currentUser } } = await supabase.auth.getUser();

    if (!currentUser) {
      toast({
         title: "Debes iniciar sesión",
         description: "Para enviar una solicitud, necesitamos saber quién eres.",
         variant: "destructive"
      });
      saveDraft(formData);
      navigate('/login');
      return;
    }

    if (!formData.motive || !formData.story || !formData.musicStyle) {
      toast({
        title: "Faltan datos",
        description: "Por favor completa todos los campos requeridos.",
        variant: "destructive"
      });
      return;
    }

    if (formData.musicStyle === 'Otro' && !formData.customMusicStyle) {
      toast({
        title: "Especifica el estilo",
        description: "Por favor escribe el estilo musical deseado.",
        variant: "destructive"
      });
      return;
    }

    const allNormasChecked = checks.every(Boolean);
    if (!allNormasChecked) {
      setShowNormasError(true);
      toast({
        title: "Normas requeridas",
        description: "Falta aceptar las normas para continuar.",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      const finalMusicStyle = formData.musicStyle === 'Otro' ? formData.customMusicStyle : formData.musicStyle;
      
      // Changed to insert into 'requests' table as per new requirements
      const { error } = await supabase
        .from('requests')
        .insert({
          user_id: currentUser.id,
          title: `Canción de ${formData.motive}`,
          motive: formData.motive,
          music_style: finalMusicStyle,
          story_brief: formData.story, // Mapping story to story_brief
          description: formData.story, // Also mapping to description to be safe
          status: 'received',
          created_at: new Date()
        });

      if (error) throw error;
      
      // Create notification
      await supabase.from('notifications').insert({
        user_id: currentUser.id,
        type: 'request_received',
        title: 'Tu solicitud fue recibida',
        body: 'Estamos trabajando en tu canción. Te notificaremos cuando haya avances.',
        link: '/mis-pedidos',
        is_read: false
      });
      
      clearDraft();
      toast({
        title: "Solicitud enviada ✅",
        description: "Tu historia está en camino. Te avisaremos cuando empiece la magia.",
      });
      
      navigate('/mis-pedidos');
      
    } catch (error) {
      console.error('Submission Error:', error);
      toast({
        title: "Error al enviar",
        description: error.message || "Algo salió mal. Inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) return <div className="min-h-screen bg-[#0F172A]" />;

  return (
    <>
      <Helmet>
        <title>Solicitar Canción | BeatStory</title>
      </Helmet>
      
      <div className="min-h-screen bg-[#0F172A] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Encarga tu <span className="text-[#FF8C42]">canción personalizada</span>
            </h1>
            <p className="text-gray-400">
              Convierte tu historia, sentimiento o mensaje en música creada con IA.
            </p>
          </div>

          {!user && (
            <div className="bg-[#1E293B] border border-[#FF8C42]/20 rounded-xl p-6 mb-8 text-center shadow-lg">
              <Music2 className="w-10 h-10 text-[#FF8C42] mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Inicia sesión para enviar</h3>
              <p className="text-gray-400 text-sm mb-4">
                Guarda tu borrador y conéctate para que podamos notificarte cuando tu canción esté lista.
              </p>
              <Button 
                onClick={() => navigate('/login')}
                className="bg-[#FF8C42] hover:bg-[#ff7a1f] text-white"
              >
                Iniciar sesión
              </Button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8 bg-[#1E293B]/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-gray-800">
            
            {/* 1. Motive */}
            <div className="space-y-3">
              <Label className="text-white text-base">1. ¿Cuál es el motivo?</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {MOTIVES.map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => handleChange('motive', m)}
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm font-medium transition-all border",
                      formData.motive === m
                        ? "bg-[#FF8C42] text-white border-[#FF8C42] shadow-[0_0_10px_rgba(255,140,66,0.3)]"
                        : "bg-[#0F172A] text-gray-400 border-gray-700 hover:border-gray-500"
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Story */}
            <div className="space-y-3">
              <Label className="text-white text-base">2. Cuéntanos la historia</Label>
              <Textarea
                value={formData.story}
                onChange={(e) => handleChange('story', e.target.value)}
                placeholder="Es para... / Me pasó... / Quiero que suene a... / Quiero que diga..."
                className="bg-[#0F172A] border-gray-700 text-white min-h-[150px] focus:ring-[#FF8C42] focus:border-[#FF8C42]"
              />
              <p className="text-xs text-gray-500 text-right">
                {formData.story.length} caracteres (mínimo 40)
              </p>
            </div>

            {/* 3. Music Style */}
            <div className="space-y-3">
              <Label className="text-white text-base">3. ¿Qué estilo musical quieres?</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                 {MUSIC_STYLES.map(style => (
                   <button
                     key={style}
                     type="button"
                     onClick={() => handleStyleChange(style)}
                     className={cn(
                       "px-2 py-2 rounded-lg text-xs font-medium transition-all border truncate",
                       formData.musicStyle === style
                         ? "bg-[#FF8C42] text-white border-[#FF8C42] shadow-[0_0_10px_rgba(255,140,66,0.3)]"
                         : "bg-[#0F172A] text-gray-400 border-gray-700 hover:border-gray-500"
                     )}
                   >
                     {style}
                   </button>
                 ))}
              </div>
              
              {formData.musicStyle === 'Otro' && (
                <div className="mt-2">
                   <Input 
                      placeholder="Escribe el estilo (ej: Country, Jazz, Metal...)" 
                      value={formData.customMusicStyle}
                      onChange={(e) => handleChange('customMusicStyle', e.target.value)}
                      className="bg-[#0F172A] border-gray-700 text-white focus-visible-orange"
                   />
                </div>
              )}
            </div>

            {/* Normas Block */}
            <div className="pt-4 border-t border-gray-800">
               <NormasCheckbox 
                 title="Normas BeatStory"
                 description="Historias que suenan. Un espacio cuidado. La IA ayuda, pero el respeto manda: a tu historia, a la comunidad y a los derechos de los demás."
                 checks={[
                   "Tengo permiso del contenido que envío (historia, letra o referencias).",
                   "No pediré imitaciones de artistas reales, clonación de voz ni copias directas.",
                   "Entiendo el uso de la entrega: personal por defecto; comercial se gestiona aparte."
                 ]}
                 checkedState={checks}
                 onCheckChange={handleCheckChange}
                 showError={showNormasError}
               />
            </div>

            <Button 
              type="submit" 
              disabled={submitting || !checks.every(Boolean)}
              className="w-full bg-[#FF8C42] hover:bg-[#ff7a1f] text-white py-6 text-lg font-medium shadow-lg shadow-[#FF8C42]/20 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                "Enviando..." 
              ) : (
                <>
                  Enviar solicitud <Sparkles className="ml-2 w-5 h-5" />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}

export default RequestSongPage;