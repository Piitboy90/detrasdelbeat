import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Home, Music, PlusCircle, User, LogOut, LogIn, Sparkles, ShieldCheck, PackageSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const MobileDrawer = ({ isOpen, onClose, user, onLogoutClick }) => {
  const location = useLocation();

  // Navigation Items Configuration
  const navItems = [
    { label: 'Inicio', path: '/', icon: Home },
    { label: 'Feed', path: '/feed', icon: Music },
    { label: 'Crear Post', path: '/create', icon: PlusCircle },
    // Only show Mis Pedidos if authenticated
    ...(user ? [
      { label: 'Mis Pedidos', path: '/mis-pedidos', icon: PackageSearch },
    ] : []),
    { label: 'Mi perfil', path: user ? '/profile' : '/login', icon: User },
    { label: 'Normas y licencias', path: '/normas', icon: ShieldCheck }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ 
            duration: 0.3, 
            ease: [0.4, 0, 0.2, 1] 
          }}
          className="fixed top-0 left-0 bottom-0 w-[280px] z-50 md:hidden flex flex-col shadow-[-4px_0_16px_rgba(0,0,0,0.4)] border-r border-[#FF8C42]/15 drawer-premium-bg bg-[#0F172A]"
        >
          {/* Header */}
          <div className="p-6 pb-2 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                 <div className="bg-gradient-to-tr from-[#FF8C42] to-orange-600 p-1.5 rounded-lg shadow-lg shadow-[#FF8C42]/20">
                   <Music className="h-4 w-4 text-white" />
                 </div>
                 <span className="font-bold text-lg text-white tracking-tight">BeatStory</span>
              </div>
              <p className="text-[11px] text-[#FF8C42]/80 font-medium tracking-wide uppercase pl-1">
                Historias que suenan.
              </p>
            </div>
            
            <button
              onClick={onClose}
              className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8C42]"
              aria-label="Cerrar menú"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Micro-manifesto */}
          <div className="drawer-manifesto mt-[10px] mb-[18px] px-4">
            <span className="manifesto-dot">•</span>
            <p className="manifesto-text text-gray-400 text-sm">
              Una canción puede ser IA. Tu motivo, no.
            </p>
          </div>

          {/* User Profile Block (if logged in) */}
          {user && (
            <div className="px-5 mb-6">
              <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center gap-3 relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-br from-[#FF8C42]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                 
                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF8C42] to-[#FF6B6B] flex items-center justify-center text-white font-bold shadow-md shrink-0">
                    {user.email?.[0].toUpperCase() || 'U'}
                 </div>
                 <div className="flex-1 min-w-0 z-10">
                    <p className="text-white font-medium text-sm truncate">
                       {user.user_metadata?.username || user.email?.split('@')[0]}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                 </div>
                 <div className="absolute top-2 right-2">
                    <span className="flex items-center gap-1 text-[9px] font-bold text-[#FF8C42] bg-[#FF8C42]/10 px-1.5 py-0.5 rounded border border-[#FF8C42]/20">
                       <Sparkles className="w-2 h-2" /> AI
                    </span>
                 </div>
              </div>
            </div>
          )}

          {/* Navigation Items */}
          <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#FF8C42]",
                  isActive(item.path) 
                    ? "bg-[#FF8C42]/10 border border-[#FF8C42]/30 text-[#FF8C42]" 
                    : "text-gray-300 hover:bg-white/5 hover:text-white active:scale-[0.98]"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive(item.path) ? "text-[#FF8C42]" : "text-gray-400")} />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Footer Actions */}
          <div className="p-6 border-t border-white/5">
            {user ? (
              <button
                onClick={onLogoutClick}
                className="w-full flex items-center justify-center gap-2 text-[#FF8C42] hover:text-[#ff7a1f] hover:bg-[#FF8C42]/10 py-3 rounded-lg text-sm font-medium transition-colors active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-[#FF8C42]"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link to="/login" onClick={onClose}>
                  <Button variant="ghost" className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/5">
                    <LogIn className="w-4 h-4 mr-2" /> Entrar
                  </Button>
                </Link>
                <Link to="/register" onClick={onClose}>
                  <Button className="w-full bg-[#FF8C42] hover:bg-[#ff7a1f] text-white border-0 shadow-lg shadow-[#FF8C42]/20">
                    Únete
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileDrawer;