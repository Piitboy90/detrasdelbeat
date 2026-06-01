import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Save, Loader2, AlertCircle, Edit3 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import UnsavedChangesModal from '@/components/UnsavedChangesModal';
import FormFieldError from '@/components/FormFieldError';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [lastEdited, setLastEdited] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    story: '',
    community_question: '',
    tags: '',
    external_url: '',
    audio_url: '',
    media_type: ''
  });
  
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const { data: post, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      if (!post) {
        setError("No se pudo cargar la historia");
        return;
      }
      
      // Ownership check
      if (user && post.user_id !== user.id) {
        setError("No tienes permiso para editar esta historia.");
        return;
      }

      setFormData({
        title: post.title || '',
        story: post.story || '',
        community_question: post.community_question || '',
        tags: post.tags ? post.tags.join(', ') : '',
        external_url: post.external_url || '',
        audio_url: post.audio_url || '',
        media_type: post.media_type || ''
      });
      
      if (post.updated_at) {
        setLastEdited(post.updated_at);
      }
      
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar la historia");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setHasChanges(true);
    
    // Clear errors on change
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title || formData.title.length < 3) {
      errors.title = "El título debe tener al menos 3 caracteres.";
    }
    if (!formData.story || formData.story.length < 80) {
      errors.story = `La historia es demasiado corta (${formData.story.length}/80 caracteres).`;
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({ 
        title: "Revisa el formulario", 
        description: "Hay campos incompletos o con errores.", 
        variant: "destructive" 
      });
      return;
    }

    setIsSaving(true);
    try {
      const tagsArray = formData.tags 
        ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) 
        : [];

      const updateData = {
        title: formData.title,
        story: formData.story,
        community_question: formData.community_question,
        tags: tagsArray,
        external_url: formData.external_url,
        audio_url: formData.audio_url,
        media_type: formData.media_type,
        updated_at: new Date().toISOString()
      };

      const { error: updateError } = await supabase
        .from('posts')
        .update(updateData)
        .eq('id', id);

      if (updateError) throw updateError;

      toast({ 
        title: "Cambios guardados", 
        description: "La historia se queda.",
        className: "bg-[#0F172A] border-[#FF8C42] text-white" 
      });
      
      setHasChanges(false);
      setTimeout(() => navigate(`/post/${id}`), 1000);
      
    } catch (err) {
      console.error(err);
      if (err.code === '42501' || err.message?.includes('permission')) {
        toast({ title: "Error de permisos", description: "No tienes permiso para editar esta historia.", variant: "destructive" });
      } else {
        toast({ title: "Error", description: "No se pudieron guardar los cambios.", variant: "destructive" });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      setShowUnsavedModal(true);
    } else {
      navigate(`/post/${id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-[#FF8C42] animate-spin" />
        <p className="text-gray-400 animate-pulse">Cargando historia...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center p-6">
        <div className="bg-[#1E293B] p-8 rounded-xl border border-gray-700 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">{error}</h2>
          <Button onClick={() => navigate(user ? `/post/${id}` : '/feed')} className="mt-4 bg-[#FF8C42] text-white hover:bg-[#ff7a1f]">
             Volver
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Editar Historia | BeatStory</title>
      </Helmet>

      <div className="min-h-screen bg-[#0F172A] py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-[600px] mx-auto">
          
          <div className="mb-6 sm:mb-8">
            <h1 className="text-[28px] sm:text-[36px] font-bold text-white tracking-tight flex items-center gap-3">
              <Edit3 className="w-6 h-6 sm:w-8 sm:h-8 text-[#FF8C42]" />
              Editar historia
            </h1>
            {lastEdited && (
              <p className="text-gray-500 text-xs sm:text-sm mt-2 ml-1">
                Última edición: {format(new Date(lastEdited), "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}
              </p>
            )}
          </div>

          <div className="backdrop-blur-[10px] bg-[#1E293B]/60 border border-[#FF8C42]/20 rounded-xl p-5 sm:p-8 shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
            <form onSubmit={handleSave} className="space-y-6">
              
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-300">Título</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Título de la historia"
                  className={cn(
                    "bg-transparent border-gray-700/50 text-white focus:border-[#FF8C42] focus:ring-[#FF8C42]/20 placeholder:text-gray-600 transition-all",
                    formErrors.title && "border-red-500/50 focus:border-red-500"
                  )}
                />
                <FormFieldError error={formErrors.title} show={!!formErrors.title} />
              </div>

              {/* Story */}
              <div className="space-y-2">
                <Label htmlFor="story" className="text-gray-300">La historia detrás</Label>
                <Textarea
                  id="story"
                  name="story"
                  value={formData.story}
                  onChange={handleChange}
                  placeholder="Cuenta el contexto..."
                  className={cn(
                    "min-h-[200px] sm:min-h-[300px] bg-transparent border-gray-700/50 text-white focus:border-[#FF8C42] focus:ring-[#FF8C42]/20 placeholder:text-gray-600 resize-y leading-relaxed transition-all",
                    formErrors.story && "border-red-500/50 focus:border-red-500"
                  )}
                />
                <div className="flex justify-between items-center mt-1">
                  <FormFieldError error={formErrors.story} show={!!formErrors.story} />
                  <span className={cn(
                    "text-[12px] ml-auto",
                    formData.story.length < 80 ? "text-gray-500" : "text-[#FF8C42]"
                  )}>
                    {formData.story.length}/80 caracteres mínimo
                  </span>
                </div>
              </div>

              {/* Community Question */}
              <div className="space-y-2">
                <Label htmlFor="community_question" className="text-gray-300">Pregunta a la comunidad <span className="text-gray-500 text-xs font-normal">(opcional)</span></Label>
                <Input
                  id="community_question"
                  name="community_question"
                  value={formData.community_question}
                  onChange={handleChange}
                  placeholder="¿Qué te transmite?"
                  className="bg-transparent border-gray-700/50 text-white focus:border-[#FF8C42] focus:ring-[#FF8C42]/20 placeholder:text-gray-600 transition-all"
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tags" className="text-gray-300">Tags <span className="text-gray-500 text-xs font-normal">(separados por comas)</span></Label>
                <Input
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="nostalgia, synthwave, noche"
                  className="bg-transparent border-gray-700/50 text-white focus:border-[#FF8C42] focus:ring-[#FF8C42]/20 placeholder:text-gray-600 transition-all"
                />
              </div>

              {/* Advanced / Optional Fields */}
              <div className="grid grid-cols-1 gap-4 pt-4 border-t border-gray-800/50">
                 <div className="space-y-2">
                    <Label htmlFor="external_url" className="text-gray-300">URL externa <span className="text-gray-500 text-xs font-normal">(opcional)</span></Label>
                    <Input
                      id="external_url"
                      name="external_url"
                      value={formData.external_url}
                      onChange={handleChange}
                      placeholder="https://..."
                      className="bg-transparent border-gray-700/50 text-white focus:border-[#FF8C42] focus:ring-[#FF8C42]/20 placeholder:text-gray-600 transition-all"
                    />
                 </div>
                 
                 <div className="space-y-2">
                    <Label htmlFor="audio_url" className="text-gray-300">URL de audio <span className="text-gray-500 text-xs font-normal">(opcional)</span></Label>
                    <Input
                      id="audio_url"
                      name="audio_url"
                      value={formData.audio_url}
                      onChange={handleChange}
                      placeholder="URL del archivo de audio"
                      className="bg-transparent border-gray-700/50 text-white focus:border-[#FF8C42] focus:ring-[#FF8C42]/20 placeholder:text-gray-600 transition-all"
                    />
                 </div>

                 <div className="space-y-2">
                    <Label htmlFor="media_type" className="text-gray-300">Tipo <span className="text-gray-500 text-xs font-normal">(opcional)</span></Label>
                    <Input
                      id="media_type"
                      name="media_type"
                      value={formData.media_type}
                      onChange={handleChange}
                      placeholder="upload, external..."
                      className="bg-transparent border-gray-700/50 text-white focus:border-[#FF8C42] focus:ring-[#FF8C42]/20 placeholder:text-gray-600 transition-all"
                    />
                 </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 mt-6">
                <Button 
                  type="button" 
                  onClick={handleCancel}
                  variant="ghost"
                  className="w-full sm:w-auto text-[#FF8C42] hover:bg-[#FF8C42]/10 hover:text-[#FF8C42]"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSaving}
                  className="w-full sm:w-auto bg-[#FF8C42] hover:bg-[#ff7a1f] text-white shadow-[0_0_15px_rgba(255,140,66,0.3)] hover:shadow-[0_0_20px_rgba(255,140,66,0.5)] transition-all transform hover:scale-[1.02]"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Guardar cambios
                    </>
                  )}
                </Button>
              </div>

            </form>
          </div>
        </div>
      </div>

      <UnsavedChangesModal 
        isOpen={showUnsavedModal} 
        onContinueEditing={() => setShowUnsavedModal(false)}
        onDiscard={() => navigate(`/post/${id}`)}
      />
    </>
  );
}

export default EditPostPage;