import React, { useState, useEffect } from 'react';
import { commentsService } from '@/services/commentsService';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { MessageCircle, Send, Trash2, Flag } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { CommentSkeleton } from '@/components/LoadingSkeletons';
import { formatTimeAgo } from '@/lib/utils';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import ReportModal from '@/components/ReportModal';
import { Link } from 'react-router-dom';
import EmptyState from '@/components/EmptyState';
import { handleSupabaseError } from '@/lib/supabaseErrorHandler';

function CommentSection({ postId }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [deleteId, setDeleteId] = useState(null);
  const [reportId, setReportId] = useState(null);

  useEffect(() => {
    let mounted = true;
    const loadComments = async () => {
      try {
        setLoading(true);
        const data = await commentsService.getCommentsByPostId(postId);
        if (mounted) setComments(data || []);
      } catch (error) {
        if (mounted) {
          toast({ 
            title: "Error al cargar", 
            description: handleSupabaseError(error), 
            variant: "destructive" 
          });
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    
    if (postId) {
      loadComments();
    }
    
    return () => { mounted = false; };
  }, [postId, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setSubmitting(true);
    try {
      const commentData = {
        post_id: postId,
        user_id: user.id,
        content: newComment.trim()
      };
      const createdComment = await commentsService.createComment(commentData);
      setComments([createdComment, ...comments]);
      setNewComment('');
      toast({ title: "Comentario enviado", description: "Tu comentario ha sido publicado." });
    } catch (error) {
      toast({ title: "Error", description: handleSupabaseError(error), variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await commentsService.deleteComment(deleteId);
      setComments(comments.filter(c => c.id !== deleteId));
      toast({ title: "Comentario eliminado" });
    } catch (error) {
       toast({ title: "Error", description: handleSupabaseError(error), variant: "destructive" });
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="bg-[#1E293B]/50 rounded-2xl border border-gray-800 p-6 md:p-8 mt-12 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-8">
         <div className="bg-[#FF6B35]/10 p-2 rounded-lg">
           <MessageCircle className="h-6 w-6 text-[#FF6B35]" />
         </div>
         <h3 className="text-xl font-bold text-white">
            Comentarios <span className="text-gray-500 font-normal ml-2 text-base">{comments.length}</span>
         </h3>
      </div>

      {user ? (
        <div className="flex gap-4 mb-10">
           <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF6B35] to-orange-600 flex-shrink-0 flex items-center justify-center text-white font-bold text-sm shadow-md">
              {user.email?.charAt(0).toUpperCase()}
           </div>
           <form onSubmit={handleSubmit} className="flex-grow relative">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Comparte tu pensamiento..."
                className="w-full bg-[#0F172A] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/50 focus:border-[#FF6B35] resize-none h-24 transition-all text-sm md:text-base"
              />
              <Button 
                 type="submit" 
                 disabled={submitting || !newComment.trim()}
                 size="sm"
                 className="absolute bottom-3 right-3 bg-[#FF6B35] hover:bg-[#e05a2b] text-white rounded-lg h-8 px-3 disabled:opacity-50"
               >
                  {submitting ? '...' : <Send className="h-4 w-4" />}
               </Button>
           </form>
        </div>
      ) : (
        <div className="bg-[#0F172A] p-6 rounded-xl text-center mb-10 border border-dashed border-gray-700">
           <p className="text-gray-400 mb-3">Únete a la conversación</p>
           <Link to="/login">
             <Button variant="outline" className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800">
               Iniciar Sesión para comentar
             </Button>
           </Link>
        </div>
      )}

      <div className="space-y-6">
        {loading ? (
           <>
             <CommentSkeleton />
             <CommentSkeleton />
           </>
        ) : comments.length === 0 ? (
           <EmptyState 
             icon={MessageCircle} 
             title="No hay comentarios aún"
             description="Sé el primero en compartir tu opinión sobre esta historia."
           />
        ) : (
           comments.map((comment, index) => {
             const commenterUsername = comment.profiles?.username || 'Usuario desconocido';
             
             return (
             <div key={comment.id} className="animate-fade-in">
                <div className="flex gap-4 group">
                   <Link 
                     to={`/u/${commenterUsername}`}
                     className="w-10 h-10 rounded-full bg-gray-700 flex-shrink-0 flex items-center justify-center text-white font-bold text-sm overflow-hidden ring-1 ring-gray-600 hover:ring-[#FF6B35] transition-all"
                   >
                      {comment.profiles?.avatar_url ? (
                         <img src={comment.profiles.avatar_url} alt={commenterUsername} className="w-full h-full object-cover" />
                      ) : (
                         commenterUsername.charAt(0).toUpperCase()
                      )}
                   </Link>
                   <div className="flex-grow">
                      <div className="flex justify-between items-start mb-1">
                         <div className="flex items-center gap-2">
                            <Link 
                               to={`/u/${commenterUsername}`}
                               className="font-semibold text-white text-sm md:text-base hover:text-[#FF6B35] transition-colors"
                            >
                              {commenterUsername}
                            </Link>
                            <span className="text-xs text-gray-500">• {formatTimeAgo(comment.created_at)}</span>
                         </div>
                         <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => setReportId(comment.id)}
                              className="text-gray-600 hover:text-yellow-500 p-1.5 rounded-md hover:bg-yellow-500/10 transition-colors"
                              title="Reportar"
                            >
                               <Flag className="h-3.5 w-3.5" />
                            </button>
                            {user && comment.user_id === user.id && (
                              <button 
                                onClick={() => setDeleteId(comment.id)}
                                className="text-gray-600 hover:text-red-500 p-1.5 rounded-md hover:bg-red-500/10 transition-colors"
                                title="Eliminar"
                              >
                                 <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                         </div>
                      </div>
                      <p className="text-gray-300 text-sm md:text-base leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                   </div>
                </div>
                {index < comments.length - 1 && (
                  <div className="h-px bg-gray-800/50 my-6 ml-14" />
                )}
             </div>
             );
           })
        )}
      </div>

      <DeleteConfirmModal 
        isOpen={!!deleteId} 
        onClose={() => setDeleteId(null)} 
        onConfirm={confirmDelete} 
        isDeleting={false} 
        title="Eliminar comentario"
        description="¿Estás seguro? Esta acción no se puede deshacer."
      />

      <ReportModal 
        isOpen={!!reportId} 
        onClose={() => setReportId(null)} 
        commentId={reportId}
      />
    </div>
  );
}

export default CommentSection;