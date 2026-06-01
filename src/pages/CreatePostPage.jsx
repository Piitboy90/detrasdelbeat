import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/hooks/useAuth';
import { postsService } from '@/services/postsService';
import { audioService } from '@/services/audioService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Link as LinkIcon, FileText, Bot, EyeOff, MessageCircle, Upload, Music, X, AlertTriangle, PenTool } from 'lucide-react';
import SmartEmbedPlayer from '@/components/SmartEmbedPlayer';
import { detectProvider, isEmbeddable } from '@/lib/embedUtils';
import { cn } from '@/lib/utils';
import FormFieldError from '@/components/FormFieldError';
import NormasCheckbox from '@/components/NormasCheckbox';

function CreatePostPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('upload');
  const [formData, setFormData] = useState({
    title: '',
    mediaUrl: '',
    story: '',
    tags: '',
    isAiGenerated: true,
    coverUrl: '',
    aiTool: '',
    communityQuestion: '',
    isSensitive: false
  });
  
  const [errors, setErrors] = useState({});
  const [audioFile, setAudioFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);

  const [loading, setLoading] = useState(false);
  const [detectedProvider, setDetectedProvider] = useState('unknown');
  
  const textareaRef = useRef(null);

  // Normas checks
  const [checks, setChecks] = useState([false, false, false]);
  const [showNormasError, setShowNormasError] = useState(false);

  // Load template from URL
  useEffect(() => {
    const template = searchParams.get('template');
    if (template) {
      setFormData(prev => ({ ...prev, story: template + " " }));
    }
  }, [searchParams]);

  const aiTools = [
    { value: "Suno", label: "Suno" },
    { value: "Udio", label: "Udio" },
    { value: "Otro", label: "Otro" }
  ];

  const storyHelpers = [
    "La hice para…",
    "Sonó como…",
    "Me recordó a…"
  ];

  useEffect(() => {
    if (activeTab === 'external') {
      const provider = detectProvider(formData.mediaUrl);
      setDetectedProvider(provider);
      if (provider === 'suno' && !formData.aiTool) {
        setFormData(prev => ({ ...prev, aiTool: 'Suno' }));
      } else if (provider === 'udio' && !formData.aiTool) {
        setFormData(prev => ({ ...prev, aiTool: 'Udio' }));
      }
    }
  }, [formData.mediaUrl, activeTab]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    const name = e.target.name;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleHelperClick = (text) => {
    const currentStory = formData.story;
    const newStory = currentStory ? text + " " + currentStory : text + " ";
    setFormData(prev => ({ ...prev, story: newStory }));
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/x-m4a', 'audio/ogg'];
    if (!validTypes.includes(file.type)) {
      toast({ title: "Formato no válido", description: "Por favor sube un archivo MP3, WAV, M4A o OGG.", variant: "destructive" });
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      toast({ title: "Archivo muy grande", description: "El tamaño máximo permitido es 25MB.", variant: "destructive" });
      return;
    }

    setAudioFile(file);
    if (errors.audio) setErrors(prev => ({ ...prev, audio: null }));

    try {
      const duration = await audioService.extractDuration(file);
      setAudioDuration(duration);
    } catch (err) {
      console.error("Could not extract duration", err);
    }
  };

  const clearFile = () => {
    setAudioFile(null);
    setAudioDuration(0);
    setUploadProgress(0);
  };

  const handleCheckChange = (index, value) => {
    const newChecks = [...checks];
    newChecks[index] = value;
    setChecks(newChecks);
    if (showNormasError && newChecks.every(Boolean)) {
      setShowNormasError(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title || formData.title.length < 5) newErrors.title = "El título debe tener al menos 5 caracteres.";
    if (activeTab === 'upload') {
      if (!audioFile) newErrors.audio = "Debes subir un archivo de audio para continuar.";
    } else {
      if (!formData.mediaUrl) newErrors.mediaUrl = "Debes incluir un enlace válido a tu tema.";
    }
    if (!formData.story || formData.story.length < 80) newErrors.story = `La historia es demasiado corta (${formData.story?.length || 0}/80 caracteres).`;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Acceso denegado", description: "Debes iniciar sesión para publicar.", variant: "destructive" });
      return;
    }

    if (!validateForm()) {
      toast({ title: "Revisa el formulario", description: "Hay campos incompletos o con errores.", variant: "destructive" });
      return;
    }

    const allNormasChecked = checks.every(Boolean);
    if (!allNormasChecked) {
      setShowNormasError(true);
      toast({ title: "Normas requeridas", description: "Debes aceptar las normas para publicar.", variant: "destructive" });
      return;
    }
    
    setLoading(true);
    
    try {
      let audioPath = null;
      let audioUrl = null;
      
      if (activeTab === 'upload' && audioFile) {
        setIsUploading(true);
        const interval = setInterval(() => setUploadProgress(prev => Math.min(prev + 10, 90)), 300);
        const tempPostId = crypto.randomUUID();
        try {
          const result = await audioService.uploadAudio(audioFile, user.id, tempPostId);
          audioPath = result.path;
          clearInterval(interval);
          setUploadProgress(100);
        } catch (uploadError) {
          clearInterval(interval);
          setErrors(prev => ({ ...prev, audio: "Error al subir el archivo." }));
          setIsUploading(false);
          setLoading(false);
          return;
        } finally {
          setIsUploading(false);
        }
      }

      const tagsArray = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
      
      const postPayload = {
        user_id: user.id,
        title: formData.title,
        story: formData.story,
        tags: tagsArray,
        media_type: activeTab,
        audio_path: audioPath,
        audio_url: audioUrl,
        external_url: activeTab === 'external' ? formData.mediaUrl : null,
        media_url: activeTab === 'external' ? formData.mediaUrl : null,
        suno_url: activeTab === 'external' && detectedProvider === 'suno' ? formData.mediaUrl : null,
        duration_sec: activeTab === 'upload' ? audioDuration : null,
        is_sensitive: formData.isSensitive,
        is_ai_generated: formData.isAiGenerated,
        ai_tool: formData.aiTool || null,
        cover_url: formData.coverUrl || null,
        community_question: formData.communityQuestion || null,
        created_at: new Date()
      };

      await postsService.createPost(postPayload);

      toast({ title: "¡Historia publicada!", description: "Tu post ya está disponible en el feed.", className: "bg-[#0F172A] border-[#FF8C42] text-white" });
      navigate('/');
    } catch (error) {
      console.error(error);
      toast({ title: "Error al publicar", description: "Hubo un problema guardando tu historia.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Publicar Historia | BeatStory</title></Helmet>
      
      <div className="min-h-screen bg-[#0F172A] py-12 px-4">
        <div className="max-w-[600px] mx-auto">
          
          <div className="text-center mb-10">
             <h1 className="text-3xl font-bold text-white mb-2">Publicar nueva historia</h1>
             <p className="text-[#FF8C42] font-semibold text-sm uppercase tracking-wide my-4 spacing-premium">
                La IA pone el sonido. Tú pones el motivo.
             </p>
          </div>
          
          <form onSubmit={handlePublish} className="space-y-8 bg-[#1E293B] p-8 rounded-2xl border border-gray-700 shadow-xl">
            
             {/* Media Selection Section */}
             <div className="space-y-6">
               <div className="flex items-center gap-3 mb-2 pb-4 border-b border-gray-700">
                  {activeTab === 'upload' ? <Music className="text-[#FF8C42]" /> : <LinkIcon className="text-[#FF8C42]" />}
                  <h2 className="text-xl font-semibold text-white">El Tema</h2>
               </div>
               
               <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-[#0F172A] mb-6 p-1">
                    <TabsTrigger value="upload" className="data-[state=active]:bg-[#FF8C42] data-[state=active]:text-white text-gray-400"><Upload className="w-4 h-4 mr-2" /> Subir archivo</TabsTrigger>
                    <TabsTrigger value="external" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400"><LinkIcon className="w-4 h-4 mr-2" /> Enlace externo</TabsTrigger>
                  </TabsList>
                  <TabsContent value="upload" className="space-y-6">
                      <div className={cn("border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center bg-[#0F172A]/50 transition-colors relative", errors.audio ? "border-red-500/50 bg-red-900/10" : "border-gray-700")}>
                        {audioFile ? (
                           <div className="w-full">
                              <div className="flex items-center justify-between bg-[#1E293B] p-4 rounded-lg mb-4 border border-gray-700">
                                 <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#FF8C42]/10 rounded-full flex items-center justify-center text-[#FF8C42]"><Music className="w-5 h-5" /></div>
                                    <div>
                                       <p className="text-sm font-medium text-white truncate max-w-[200px]">{audioFile.name}</p>
                                       <p className="text-xs text-gray-400">{(audioFile.size / (1024*1024)).toFixed(2)} MB</p>
                                    </div>
                                 </div>
                                 <Button type="button" variant="ghost" size="icon" onClick={clearFile} className="text-gray-400 hover:text-red-400"><X className="w-5 h-5" /></Button>
                              </div>
                              {isUploading && (
                                 <div className="space-y-2">
                                    <div className="flex justify-between text-xs text-gray-400"><span>Subiendo...</span><span>{uploadProgress}%</span></div>
                                    <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden"><div className="h-full bg-[#FF8C42] transition-all duration-300" style={{ width: `${uploadProgress}%` }} /></div>
                                 </div>
                              )}
                           </div>
                        ) : (
                           <>
                              <input type="file" id="audio-upload" className="hidden" accept="audio/mpeg,audio/wav,audio/mp4,audio/x-m4a,audio/ogg" onChange={handleFileChange} />
                              <label htmlFor="audio-upload" className="cursor-pointer flex flex-col items-center w-full hover-lift">
                                 <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4 text-gray-400 group-hover:text-[#FF8C42] transition-colors"><Upload className="w-8 h-8" /></div>
                                 <p className="text-white font-medium mb-1">Haz clic para subir tu audio</p>
                              </label>
                           </>
                        )}
                        <FormFieldError error={errors.audio} show={!!errors.audio} className="mt-4" />
                      </div>
                  </TabsContent>
                  <TabsContent value="external" className="space-y-6">
                      <div>
                        <Label className="text-gray-300 font-medium mb-2 block">Link del tema</Label>
                        <Input name="mediaUrl" value={formData.mediaUrl} onChange={handleChange} placeholder="Pega el link de tu tema..." className={cn("bg-[#0F172A] border-gray-600 text-white focus-visible:ring-[#FF8C42]", errors.mediaUrl && "border-red-500 focus-visible:ring-red-500")} />
                        <FormFieldError error={errors.mediaUrl} show={!!errors.mediaUrl} />
                        {formData.mediaUrl && (
                            <div className="mt-4 overflow-hidden rounded-xl border border-gray-700 bg-[#0F172A]">
                              <div className="px-4 py-2 text-xs text-gray-400 border-b border-gray-700 flex justify-between">
                                 <span>Vista previa</span>
                                 {!isEmbeddable(detectedProvider) && detectedProvider !== 'unknown' && <span className="text-yellow-500 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Enlace externo</span>}
                              </div>
                              <SmartEmbedPlayer url={formData.mediaUrl} className="bg-transparent" />
                            </div>
                        )}
                      </div>
                  </TabsContent>
               </Tabs>

               <div className="mt-6 pt-6 border-t border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300 font-medium mb-2 block">Herramienta IA</Label>
                      <select name="aiTool" value={formData.aiTool} onChange={handleChange} className="w-full bg-[#0F172A] border border-gray-600 text-white rounded-md h-10 px-3 focus:outline-none focus:ring-2 focus:ring-[#FF8C42]">
                        <option value="">Seleccionar herramienta</option>
                        {aiTools.map(tool => <option key={tool.value} value={tool.value}>{tool.label}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 pt-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="isAiGenerated" name="isAiGenerated" checked={formData.isAiGenerated} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isAiGenerated: checked }))} className="border-gray-500 data-[state=checked]:bg-[#FF8C42]" />
                      <label htmlFor="isAiGenerated" className="text-sm font-medium text-gray-300 flex items-center gap-2"><Bot className="w-4 h-4 text-[#FF8C42]" /> Confirmo que este tema es música generada por IA</label>
                    </div>

                    <div className="flex items-center space-x-2">
                       <Checkbox id="isSensitive" name="isSensitive" checked={formData.isSensitive} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isSensitive: checked }))} className="border-gray-500 data-[state=checked]:bg-[#FF8C42]" />
                       <label htmlFor="isSensitive" className="text-sm font-medium text-gray-300 flex items-center gap-2"><EyeOff className="w-4 h-4 text-[#FF8C42]" /> Contenido sensible (violencia, sexual, autolesión, etc.)</label>
                    </div>
                  </div>
               </div>
            </div>

            {/* Story Section */}
            <div className="space-y-6 pt-6 border-t border-gray-700">
               <div className="flex items-center gap-3 mb-2 pb-4 border-b border-gray-700">
                  <FileText className="text-[#FF8C42]" />
                  <h2 className="text-xl font-semibold text-white">La Historia Detrás</h2>
               </div>

               <div>
                 <Label className="text-gray-300 font-medium mb-2 block">Título</Label>
                 <Input name="title" value={formData.title} onChange={handleChange} placeholder="Ej: Ecos de madrugada" className={cn("bg-[#0F172A] border-gray-600 text-white focus-visible:ring-[#FF8C42]", errors.title && "border-red-500")} />
                 <FormFieldError error={errors.title} show={!!errors.title} />
               </div>

               {/* Writing Helpers */}
               <div>
                  <Label className="text-white/80 text-[13px] md:text-[14px] mb-3 block">
                     Empieza con una frase (opcional):
                  </Label>
                  <div className="flex flex-wrap gap-2 mb-4">
                     {storyHelpers.map((helperText) => (
                        <button
                           key={helperText}
                           type="button"
                           onClick={() => handleHelperClick(helperText)}
                           className="border border-[#FF8C42] text-gray-300 hover:text-white hover:bg-[#FF8C42]/10 rounded-full px-3 py-1.5 text-xs transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#FF8C42]"
                        >
                           {helperText}
                        </button>
                     ))}
                  </div>

                  <Label className="text-gray-300 font-medium mb-2 block">La historia detrás <span className="text-gray-500 text-xs font-normal ml-2">(Mínimo 80 caracteres)</span></Label>
                  <Textarea 
                      ref={textareaRef}
                      name="story" 
                      value={formData.story} 
                      onChange={handleChange} 
                      placeholder="Cuéntanos qué inspiró este tema..."
                      className={cn("min-h-[200px] bg-[#0F172A] border-gray-600 text-white focus-visible:ring-[#FF8C42] resize-y leading-relaxed", errors.story && "border-red-500")} 
                  />
                  <FormFieldError error={errors.story} show={!!errors.story} />
                  <div className="flex justify-end items-center mt-2">
                      <span className={cn("text-xs font-medium", formData.story.length < 80 ? 'text-red-400' : 'text-green-400')}>{formData.story.length}/5000</span>
                  </div>
               </div>
               
               <div>
                 <Label className="text-gray-300 font-medium mb-2 flex items-center gap-2"><MessageCircle className="w-4 h-4 text-[#FF8C42]" /> Pregunta a la comunidad</Label>
                 <Input name="communityQuestion" value={formData.communityQuestion} onChange={handleChange} maxLength={150} placeholder="Ej: ¿Alguna vez te has sentido así?" className="bg-[#0F172A] border-gray-600 text-white focus-visible:ring-[#FF8C42]" />
               </div>
               
               <div>
                 <Label className="text-gray-300 font-medium mb-2 block">Tags (opcional)</Label>
                 <Input name="tags" value={formData.tags} onChange={handleChange} placeholder="synthwave, melancolía" className="bg-[#0F172A] border-gray-600 text-white focus-visible:ring-[#FF8C42]" />
               </div>
            </div>
            
            {/* Normas Block */}
            <div className="pt-4 border-t border-gray-800">
               <NormasCheckbox 
                 title="Normas para publicar"
                 description="Lo que suena aquí, se cuida. Publica solo lo que es tuyo o lo que tienes permiso de compartir."
                 checks={[
                   "Tengo permiso del audio/letra que voy a publicar (o es creación propia).",
                   "No subiré contenido con copyright de terceros (canciones comerciales, remixes no autorizados, samples sin licencia).",
                   "No publicaré imitaciones/clones de voz ni suplantaciones de artistas reales."
                 ]}
                 checkedState={checks}
                 onCheckChange={handleCheckChange}
                 showError={showNormasError}
               />
            </div>

            <div className="flex flex-col sm:flex-row justify-end pt-4 gap-4">
               <Button type="button" variant="ghost" onClick={() => navigate(-1)} className="text-gray-400 hover:text-white w-full sm:w-auto">Cancelar</Button>
               <Button type="submit" disabled={loading || isUploading || !checks.every(Boolean)} className="bg-[#FF8C42] hover:bg-[#ff7a1f] text-white px-8 py-6 text-lg w-full shadow-lg shadow-[#FF8C42]/20 hover-lift disabled:opacity-50 disabled:cursor-not-allowed">
                  {(loading || isUploading) ? <Loader2 className="animate-spin mr-2" /> : "Publicar Historia"}
               </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreatePostPage;