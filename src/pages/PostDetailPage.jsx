import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Share2, Trash2, Calendar, User, MoreVertical, Flag, Edit, EyeOff, Eye, Upload, Bot, Music } from 'lucide-react';
import { postsService } from '@/services/postsService';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from 'framer-motion';
import { getOpenGraphTags } from '@/lib/seo';
import SmartEmbedPlayer from '@/components/SmartEmbedPlayer';
import AudioPlayer from '@/components/AudioPlayer';
import CommentSection from '@/components/CommentSection';
import LikeButton from '@/components/LikeButton';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import { formatTimeAgo, cn } from '@/lib/utils';
import { getProviderInfo } from '@/lib/providerUtils';
import AudioVisualizer from '@/components/AudioVisualizer';
import BookmarkButton from '@/components/BookmarkButton';
import ReportButton from '@/components/ReportButton';
import MicroRitual from '@/components/MicroRitual';
import PostRecommendations from '@/components/PostRecommendations';
import { toHttps } from '@/utils/urlSecurity.js';

function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState(null);
  const [isSensitiveHidden, setIsSensitiveHidden] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    loadPost();
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (post?.is_sensitive) {
      const allowed = localStorage.getItem(`sensitive_${post.id}`) === 'true';
      if (!allowed) {
        setIsSensitiveHidden(true);
      }
    }
  }, [post]);

  const loadPost = async () => {
    setLoading(true);
    try {
      const data = await postsService.getPostById(id);
      if (!data) throw new Error("Post not found");
      setPost(data);
      
      if (data.user_id) {
         try {
           const userPosts = await postsService.getUserPosts(data.user_id);
           const otherPosts = userPosts.filter(p => p.id !== data.id).slice(0, 3);
           setRelatedPosts(otherPosts);
         } catch (e) {
           console.warn("Could not fetch related posts");
         }
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await postsService.deletePost(id);
      toast({ title: "Historia eliminada" });
      navigate('/feed');
    } catch (err) {
      toast({ title: "Error al eliminar", variant: "destructive" });
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(toHttps(window.location.href));
    toast({ title: "Enlace copiado", className: "bg-[#0F172A] border-[#FF8C42] text-white" });
  };

  const handleShowSensitive = () => {
    setIsSensitiveHidden(false);
    localStorage.setItem(`sensitive_${post.id}`, 'true');
  };

  if (loading) return <div className="min-h-screen bg-[#0F172A] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF8C42]"></div></div>;
  if (!post) return <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-white">Post no encontrado</div>;

  const isAuthor = user && post.user_id === user.id;
  const isUpload = post.media_type === 'upload';
  const mediaUrl = post.external_url || post.media_url || post.suno_url;
  const providerInfo = getProviderInfo(mediaUrl);

  const ogTags = getOpenGraphTags(post).map(tag => {
    if (tag.property === 'og:image' || tag.name === 'twitter:image') {
      return { ...tag, content: toHttps(tag.content) };
    }
    return tag;
  });

  return (
    <>
      <Helmet>
        <title>{post.title} | BeatStory</title>
        {ogTags.map((tag, i) => <meta key={i} {...tag} />)}
      </Helmet>

      <div className="min-h-screen bg-[#0F172A] pb-20 pt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
            
            <div className="mb-6 border-b border-gray-800 pb-6">
                <div className="flex items-center justify-between mb-3">
                   <Link to={`/u/${post.profiles?.username}`} className="flex items-center gap-3 hover:bg-white/5 p-2 rounded-lg transition-colors -ml-2">
                      <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden ring-1 ring-gray-600">
                         {post.profiles?.avatar_url ? <img src={toHttps(post.profiles.avatar_url)} className="w-full h-full object-cover" /> : <User className="p-2 w-full h-full text-gray-400" />}
                      </div>
                      <div className="flex flex-col">
                         <span className="font-bold text-white leading-none">@{post.profiles?.username}</span>
                         <span className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {formatTimeAgo(post.created_at)}
                         </span>
                      </div>
                   </Link>

                   <div className="flex items-center gap-2">
                       <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="hidden sm:flex text-gray-400 hover:text-white">
                          <ArrowLeft className="w-5 h-5" />
                       </Button>
                       
                       <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                           <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                             <MoreVertical className="w-5 h-5" />
                           </Button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent align="end" className="bg-[#1E293B] border-gray-700 text-gray-200">
                           {isAuthor && (
                             <>
                               <DropdownMenuItem onClick={() => navigate(`/post/${post.id}/edit`)} className="hover:bg-white/10 cursor-pointer">
                                 <Edit className="w-4 h-4 mr-2" /> Editar
                               </DropdownMenuItem>
                               <DropdownMenuItem onClick={() => setIsDeleteModalOpen(true)} className="text-red-400 hover:bg-red-500/10 cursor-pointer hover:text-red-400 focus:text-red-400">
                                 <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                               </DropdownMenuItem>
                             </>
                           )}
                           <DropdownMenuItem onClick={copyLink} className="hover:bg-white/10 cursor-pointer">
                             <Share2 className="w-4 h-4 mr-2" /> Copiar enlace
                           </DropdownMenuItem>
                           {!isAuthor && (
                             <DropdownMenuItem onClick={() => {}} className="hover:bg-white/10 cursor-pointer">
                               <Flag className="w-4 h-4 mr-2" /> Reportar
                             </DropdownMenuItem>
                           )}
                         </DropdownMenuContent>
                       </DropdownMenu>
                   </div>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-4">{post.title}</h1>
                
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {post.tags?.map(tag => (
                        <span key={tag} className="flex-shrink-0 px-2.5 py-1 bg-[#FF8C42]/10 text-[#FF8C42] border border-[#FF8C42]/20 text-[10px] sm:text-xs font-bold rounded-full uppercase tracking-wide">
                        #{tag}
                        </span>
                    ))}
                </div>
            </div>

            <div className="bg-[#1E293B] rounded-xl overflow-hidden shadow-2xl border border-gray-800 relative mb-8">
               {isSensitiveHidden && (
                 <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-6 text-center backdrop-blur-sm rounded-xl">
                    <EyeOff className="w-12 h-12 text-[#FF8C42] mb-3" />
                    <h3 className="text-xl font-bold text-white mb-2">Contenido sensible</h3>
                    <Button onClick={handleShowSensitive} size="sm" className="bg-white/10 hover:bg-white/20 text-white border border-white/20">
                       <Eye className="w-4 h-4 mr-2" /> Ver contenido
                    </Button>
                 </div>
               )}

               {isUpload ? (
                 <AudioPlayer 
                   post={post} 
                   onPlayStateChange={setIsPlaying}
                   onAudioRef={setAudioElement}
                 />
               ) : (
                 <SmartEmbedPlayer 
                    url={mediaUrl} 
                    cover_url={toHttps(post.cover_url)}
                    title={post.title}
                    provider={providerInfo.id}
                 />
               )}
               
               <div className="bg-[#0F172A]/80 backdrop-blur-md p-3 border-t border-gray-800 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                       <span className="flex items-center gap-1 text-[10px] font-bold text-[#FF8C42] bg-[#FF8C42]/10 px-2 py-1 rounded border border-[#FF8C42]/20 uppercase tracking-wider">
                          <Music className="w-3 h-3" /> BeatStory Original
                       </span>
                       
                       <div className="hidden sm:flex items-center gap-2">
                          {post.ai_tool && (
                             <span className="text-[10px] text-gray-400 bg-gray-800 px-2 py-0.5 rounded border border-gray-700">Hecho con {post.ai_tool}</span>
                          )}
                          {isUpload && (
                             <span className="text-[10px] text-gray-400 bg-gray-800 px-2 py-0.5 rounded border border-gray-700">Subido</span>
                          )}
                       </div>
                   </div>

                   <div className="flex items-center gap-3">
                      <LikeButton postId={post.id} />
                      <BookmarkButton postId={post.id} />
                      <Button variant="ghost" size="icon" onClick={copyLink} className="h-8 w-8 text-gray-400 hover:text-white">
                         <Share2 className="w-4 h-4" />
                      </Button>
                   </div>
               </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
               <div className="prose prose-invert max-w-none">
                  <div className="text-lg text-gray-300 leading-8 whitespace-pre-wrap font-serif pl-4 border-l-2 border-[#FF8C42]/50 italic">
                    {post.story}
                  </div>
               </div>
               
               <div className="border-t border-gray-800 pt-8">
                  <h3 className="text-lg font-bold text-white mb-4">Comentarios</h3>
                  <CommentSection 
                     postId={post.id} 
                     placeholder="Comparte tu opinión..."
                  />
               </div>
            </div>

            <PostRecommendations 
               posts={relatedPosts} 
               authorName={post.profiles?.username} 
            />

        </div>
      </div>

      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={handleDelete}
        title="Eliminar Historia"
        description="Esta acción eliminará el post permanentemente."
      />
    </>
  );
}

export default PostDetailPage;