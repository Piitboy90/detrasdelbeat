import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/hooks/useAuth';
import { usersService } from '@/services/usersService';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Check, X, Instagram, Youtube, Music } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getPageTitle, getMetaDescription } from '@/lib/seo';

function SettingsProfilePage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    avatar_url: '',
    instagram_url: '',
    tiktok_url: '',
    youtube_url: '',
    manifesto: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [usernameError, setUsernameError] = useState('');

  // Initial load
  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        bio: profile.bio || '',
        avatar_url: profile.avatar_url || '',
        instagram_url: profile.instagram_url || '',
        tiktok_url: profile.tiktok_url || '',
        youtube_url: profile.youtube_url || '',
        manifesto: profile.manifesto || ''
      });
    }
  }, [profile]);

  // Username validation effect
  useEffect(() => {
    const checkUsername = async () => {
      const u = formData.username.trim();
      
      if (!u || u === profile?.username) {
        setUsernameAvailable(true);
        setUsernameError('');
        return;
      }
      
      if (u.length < 3) {
        setUsernameError('Mínimo 3 caracteres');
        setUsernameAvailable(false);
        return;
      }
      
      if (!/^[a-zA-Z0-9_]+$/.test(u)) {
        setUsernameError('Solo letras, números y guiones bajos');
        setUsernameAvailable(false);
        return;
      }

      setCheckingUsername(true);
      try {
        const isAvailable = await usersService.checkUsernameAvailable(u, user?.id);
        setUsernameAvailable(isAvailable);
        setUsernameError(isAvailable ? '' : 'Este nombre de usuario ya está en uso');
      } catch (err) {
        console.error(err);
      } finally {
        setCheckingUsername(false);
      }
    };
    
    // Debounce
    const timer = setTimeout(checkUsername, 500);
    return () => clearTimeout(timer);
  }, [formData.username, profile, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (!usernameAvailable || usernameError) return;

    setLoading(true);
    try {
      const updates = {
        username: formData.username,
        bio: formData.bio,
        avatar_url: formData.avatar_url,
        instagram_url: formData.instagram_url,
        tiktok_url: formData.tiktok_url,
        youtube_url: formData.youtube_url,
        manifesto: formData.manifesto,
        updated_at: new Date().toISOString(),
      };

      await usersService.updateProfile(user.id, updates);
      
      toast({ title: "Perfil actualizado correctamente" });
      navigate(`/u/${formData.username}`);
      
    } catch (error) {
      console.error("Update failed", error);
      toast({ 
        title: "Error", 
        description: "No se pudo actualizar el perfil.",
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{getPageTitle("Editar perfil")}</title>
        <meta name="description" content={getMetaDescription("Edita tu perfil en BeatStory")} />
      </Helmet>
      
      <div className="min-h-screen bg-[#0F172A] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-[#1E293B] rounded-2xl border border-gray-700 p-8 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-white">Editar Perfil</h1>
            <Button variant="ghost" onClick={() => navigate(-1)} className="text-gray-400">
               <X className="w-5 h-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Avatar */}
            <div>
              <Label htmlFor="avatar_url" className="text-white mb-2 block">URL del Avatar</Label>
              <div className="flex gap-4 items-start">
                 <div className="w-16 h-16 rounded-full bg-[#0F172A] flex-shrink-0 overflow-hidden border border-gray-600">
                    {formData.avatar_url ? (
                      <img src={formData.avatar_url} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">Sin imagen</div>
                    )}
                 </div>
                 <Input 
                   id="avatar_url"
                   name="avatar_url"
                   value={formData.avatar_url} 
                   onChange={handleChange}
                   placeholder="https://ejemplo.com/imagen.jpg"
                   className="bg-[#0F172A] border-gray-600 text-white flex-grow"
                 />
              </div>
            </div>

            {/* Username */}
            <div>
              <Label htmlFor="username" className="text-white mb-2 block">Nombre de usuario</Label>
              <div className="relative">
                <Input 
                  id="username"
                  name="username"
                  value={formData.username} 
                  onChange={handleChange}
                  className={cn(
                    "bg-[#0F172A] border-gray-600 text-white pr-10",
                    !usernameAvailable && "border-red-500 focus-visible:ring-red-500"
                  )}
                  placeholder="usuario_unico"
                  required
                  minLength={3}
                  maxLength={20}
                />
                <div className="absolute right-3 top-2.5">
                   {checkingUsername ? (
                     <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                   ) : formData.username && formData.username !== profile?.username ? (
                     usernameAvailable ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />
                   ) : null}
                </div>
              </div>
              {usernameError && <p className="text-red-400 text-xs mt-1">{usernameError}</p>}
              <p className="text-gray-500 text-xs mt-1">3-20 caracteres, sin espacios.</p>
            </div>

            {/* Bio */}
            <div>
              <Label htmlFor="bio" className="text-white mb-2 block">Biografía</Label>
              <Textarea 
                id="bio"
                name="bio"
                value={formData.bio} 
                onChange={handleChange}
                className="bg-[#0F172A] border-gray-600 text-white resize-none h-24"
                placeholder="Cuéntanos un poco sobre ti..."
                maxLength={160}
              />
              <p className="text-right text-xs text-gray-500 mt-1">{formData.bio.length}/160</p>
            </div>
            
            {/* Manifesto */}
            <div>
              <Label htmlFor="manifesto" className="text-white mb-2 block text-[#FF8C42]">Tu Manifiesto</Label>
              <Textarea 
                id="manifesto"
                name="manifesto"
                value={formData.manifesto} 
                onChange={handleChange}
                className="bg-[#0F172A] border-gray-600 text-white resize-none h-32"
                placeholder="¿Qué te mueve a crear? ¿Qué quieres transmitir con tu música y tus historias?"
                maxLength={300}
              />
              <p className="text-right text-xs text-gray-500 mt-1">{formData.manifesto.length}/300</p>
            </div>

            {/* Social Links */}
            <div className="space-y-4 pt-4 border-t border-gray-700">
              <h3 className="text-white font-medium">Redes Sociales</h3>
              
              <div className="relative">
                 <Instagram className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                 <Input 
                   name="instagram_url"
                   value={formData.instagram_url}
                   onChange={handleChange}
                   placeholder="URL de Instagram"
                   className="pl-10 bg-[#0F172A] border-gray-600 text-white"
                 />
              </div>

              <div className="relative">
                 <Music className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                 <Input 
                   name="tiktok_url"
                   value={formData.tiktok_url}
                   onChange={handleChange}
                   placeholder="URL de TikTok"
                   className="pl-10 bg-[#0F172A] border-gray-600 text-white"
                 />
              </div>

              <div className="relative">
                 <Youtube className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                 <Input 
                   name="youtube_url"
                   value={formData.youtube_url}
                   onChange={handleChange}
                   placeholder="URL de YouTube"
                   className="pl-10 bg-[#0F172A] border-gray-600 text-white"
                 />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-700 mt-6">
              <Button type="button" variant="ghost" onClick={() => navigate(-1)} className="text-white hover:bg-white/10">
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-[#FF6B35] hover:bg-[#e05a2b] text-white"
                disabled={loading || !usernameAvailable || usernameError}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar Cambios
              </Button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
}

export default SettingsProfilePage;