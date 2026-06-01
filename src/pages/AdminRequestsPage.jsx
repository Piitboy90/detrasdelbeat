import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/hooks/useAuth';
import { requestsService } from '@/utils/requestsService';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Filter, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const STATUS_OPTIONS = [
  { value: 'received', label: 'Recibida' },
  { value: 'in_production', label: 'Produciendo' },
  { value: 'in_review', label: 'Revisión' },
  { value: 'delivered', label: 'Entregada' },
  { value: 'published', label: 'Publicada' }
];

function AdminRequestsPage() {
  const { user, profile } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [editNotes, setEditNotes] = useState({});

  useEffect(() => {
    if (user) {
      loadRequests();
    }
  }, [user]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await requestsService.getAllRequests();
      setRequests(data || []);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await requestsService.updateRequestStatus(id, newStatus);
      // Optimistic update
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    } catch (error) {
      console.error('Update failed', error);
      loadRequests(); // Revert on fail
    }
  };

  const handleNotesSave = async (id) => {
    const note = editNotes[id];
    if (note === undefined) return;
    
    try {
      await requestsService.updateRequestStatus(id, requests.find(r => r.id === id).status, note);
      setRequests(prev => prev.map(r => r.id === id ? { ...r, admin_notes: note } : r));
      alert('Nota guardada');
    } catch (error) {
      console.error('Save note failed', error);
    }
  };

  // Check Permissions
  if (!loading && (!profile || !['admin', 'moderator'].includes(profile.role))) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-white">
        <div>
          <h1 className="text-2xl font-bold mb-2">No autorizado</h1>
          <Link to="/" className="text-[#FF8C42] hover:underline">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  const filteredRequests = filter === 'all' ? requests : requests.filter(r => r.status === filter);

  return (
    <>
      <Helmet>
        <title>Admin Solicitudes | BeatStory</title>
      </Helmet>

      <div className="min-h-screen bg-[#0F172A] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-3">
               <Link to="/" className="text-gray-400 hover:text-white">
                 <ArrowLeft className="w-5 h-5" />
               </Link>
               <h1 className="text-2xl font-bold text-white">Gestión de Solicitudes</h1>
             </div>
             <Button variant="outline" onClick={loadRequests} className="text-sm">Refrescar</Button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium border transition-colors",
                filter === 'all' ? "bg-[#FF8C42] text-white border-[#FF8C42]" : "bg-transparent text-gray-400 border-gray-700"
              )}
            >
              Todos
            </button>
            {STATUS_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium border transition-colors",
                  filter === opt.value ? "bg-[#FF8C42] text-white border-[#FF8C42]" : "bg-transparent text-gray-400 border-gray-700"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="bg-[#1E293B] border border-gray-800 rounded-lg overflow-hidden">
             <div className="overflow-x-auto">
               <table className="w-full text-left text-sm text-gray-400">
                 <thead className="bg-[#0F172A] text-gray-200 uppercase font-medium text-xs">
                   <tr>
                     <th className="px-6 py-4">Fecha</th>
                     <th className="px-6 py-4">Usuario</th>
                     <th className="px-6 py-4">Motivo</th>
                     <th className="px-6 py-4">Status</th>
                     <th className="px-6 py-4">Acciones</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-800">
                   {filteredRequests.map(req => (
                     <React.Fragment key={req.id}>
                       <tr 
                         onClick={() => setExpandedId(expandedId === req.id ? null : req.id)}
                         className="hover:bg-gray-800/50 cursor-pointer transition-colors"
                       >
                         <td className="px-6 py-4">{format(new Date(req.created_at), 'dd/MM/yyyy')}</td>
                         <td className="px-6 py-4">
                           <div className="flex items-center gap-2">
                             {req.profiles?.avatar_url && (
                               <img src={req.profiles.avatar_url} className="w-6 h-6 rounded-full" alt="" />
                             )}
                             <span className="text-white font-medium">{req.profiles?.username || 'Anon'}</span>
                           </div>
                         </td>
                         <td className="px-6 py-4">
                           <span className="px-2 py-1 rounded bg-gray-700 text-white text-xs">{req.motive}</span>
                           {req.privacy === 'private' && <span className="ml-2 text-xs text-amber-500">🔒</span>}
                         </td>
                         <td className="px-6 py-4">
                            <select 
                              value={req.status} 
                              onClick={e => e.stopPropagation()}
                              onChange={e => handleStatusChange(req.id, e.target.value)}
                              className={cn(
                                "bg-transparent border-none text-xs font-medium focus:ring-0 cursor-pointer",
                                req.status === 'received' && "text-blue-400",
                                req.status === 'in_production' && "text-amber-400",
                                req.status === 'published' && "text-[#FF8C42]"
                              )}
                            >
                              {STATUS_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value} className="bg-[#1E293B] text-white">
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                         </td>
                         <td className="px-6 py-4 text-[#FF8C42]">
                           {expandedId === req.id ? "Cerrar" : "Ver"}
                         </td>
                       </tr>
                       {expandedId === req.id && (
                         <tr className="bg-[#0F172A]/50">
                           <td colSpan="5" className="px-6 py-6">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                               <div>
                                  <h4 className="text-white font-bold mb-2 text-xs uppercase">Historia Original</h4>
                                  <p className="text-gray-300 italic p-4 bg-[#1E293B] rounded-lg border border-gray-700 text-sm">
                                    "{req.description}"
                                  </p>
                                  {req.vibes && req.vibes.length > 0 && (
                                    <div className="mt-2 flex gap-1">
                                      {req.vibes.map(v => (
                                        <span key={v} className="text-xs bg-gray-700 px-2 py-0.5 rounded text-gray-300">{v}</span>
                                      ))}
                                    </div>
                                  )}
                               </div>
                               <div>
                                  <h4 className="text-white font-bold mb-2 text-xs uppercase">Notas Admin (Interno)</h4>
                                  <div className="flex gap-2">
                                    <Textarea 
                                      defaultValue={req.admin_notes || ''}
                                      onChange={(e) => setEditNotes(prev => ({ ...prev, [req.id]: e.target.value }))}
                                      className="bg-[#1E293B] border-gray-700 text-white min-h-[100px]"
                                    />
                                  </div>
                                  <Button 
                                    size="sm" 
                                    onClick={() => handleNotesSave(req.id)}
                                    className="mt-2 bg-[#FF8C42] hover:bg-[#ff7a1f] text-white"
                                  >
                                    <Save className="w-4 h-4 mr-1" /> Guardar Notas
                                  </Button>
                               </div>
                             </div>
                           </td>
                         </tr>
                       )}
                     </React.Fragment>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default AdminRequestsPage;