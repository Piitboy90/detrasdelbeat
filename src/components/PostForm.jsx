import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, FileText, Tag, Link as LinkIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

function PostForm() {
  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [sunoUrl, setSunoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !story) {
      toast({
        title: "Campos requeridos",
        description: "El título y la historia son obligatorios",
        variant: "destructive",
      });
      return;
    }

    // Convert comma-separated tags to array
    const tagsArray = tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            user_id: user.id,
            title: title.trim(),
            story: story.trim(),
            tags: tagsArray,
            suno_url: sunoUrl.trim() || null,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "¡Post creado!",
        description: "Tu historia ha sido publicada exitosamente",
      });

      navigate('/feed');
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error al crear post",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#1E293B] rounded-lg shadow-xl p-8 border border-gray-700">
      {/* User Header */}
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-700">
        <div className="w-12 h-12 rounded-full bg-[#FF6B35] flex items-center justify-center text-white font-semibold text-lg">
          {profile?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-white font-semibold">{profile?.username || user?.email}</p>
          <p className="text-gray-400 text-sm">Crear nuevo post</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
            <Music className="inline h-4 w-4 mr-2" />
            Título de tu canción
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-[#0F172A] border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
            placeholder="Ej: Mi nueva canción"
            required
          />
        </div>

        {/* Story */}
        <div>
          <label htmlFor="story" className="block text-sm font-medium text-gray-300 mb-2">
            <FileText className="inline h-4 w-4 mr-2" />
            Tu historia / reflexión
          </label>
          <textarea
            id="story"
            value={story}
            onChange={(e) => setStory(e.target.value)}
            rows={6}
            className="w-full px-4 py-3 bg-[#0F172A] border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent resize-none"
            placeholder="Cuéntanos la historia detrás de tu música, qué te inspiró, cómo te sentías..."
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            {story.length} caracteres
          </p>
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-2">
            <Tag className="inline h-4 w-4 mr-2" />
            Etiquetas (opcional)
          </label>
          <input
            id="tags"
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            className="w-full px-4 py-3 bg-[#0F172A] border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
            placeholder="indie, rock, melancólico (separadas por comas)"
          />
          <p className="mt-1 text-xs text-gray-500">
            Separa las etiquetas con comas
          </p>
        </div>

        {/* Suno URL */}
        <div>
          <label htmlFor="sunoUrl" className="block text-sm font-medium text-gray-300 mb-2">
            <LinkIcon className="inline h-4 w-4 mr-2" />
            URL de Suno (opcional)
          </label>
          <input
            id="sunoUrl"
            type="url"
            value={sunoUrl}
            onChange={(e) => setSunoUrl(e.target.value)}
            className="w-full px-4 py-3 bg-[#0F172A] border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
            placeholder="https://suno.com/song/..."
          />
          <p className="mt-1 text-xs text-gray-500">
            Pega el enlace de tu canción en Suno
          </p>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#FF6B35] hover:bg-[#FF5722] text-white py-3 text-lg font-semibold transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span>
              Publicando...
            </span>
          ) : (
            'Publicar Historia'
          )}
        </Button>
      </form>
    </div>
  );
}

export default PostForm;