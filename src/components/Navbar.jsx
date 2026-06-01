import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Music, Home, PlusCircle, User, LogOut, PackageSearch, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

import MobileDrawer from '@/components/MobileDrawer';
import MobileDrawerOverlay from '@/components/MobileDrawerOverlay';
import LogoutConfirmDialog from '@/components/LogoutConfirmDialog';
import BellIcon from '@/components/BellIcon';

function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, logout } = useAuth();
  const { toast } = useToast();

  const isAdmin = profile?.role === 'admin';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente",
      });
      navigate('/');
      setIsDrawerOpen(false);
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, icon: Icon, label }) => (
    <Link
      to={to}
      className={`relative flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors group outline-none focus-visible:ring-2 focus-visible:ring-[#FF8C42] rounded-md ${
        isActive(to) ? 'text-[#FF8C42]' : 'text-gray-300 hover:text-white'
      }`}
    >
      <Icon className={`h-4 w-4 ${isActive(to) ? 'text-[#FF8C42]' : 'text-gray-400 group-hover:text-white'}`} />
      {label}
      {isActive(to) && (
        <motion.div 
          layoutId="navbar-indicator"
          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#FF8C42] rounded-full"
        />
      )}
    </Link>
  );

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-[#0F172A]/80 backdrop-blur-md border-b border-gray-800 shadow-lg' : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              to="/" 
              className="flex items-center gap-2 group outline-none focus-visible:ring-2 focus-visible:ring-[#FF8C42] rounded-lg p-1"
            >
              <div className="bg-gradient-to-tr from-[#FF8C42] to-orange-600 p-1.5 rounded-lg group-hover:rotate-3 transition-transform">
                <Music className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl tracking-tight text-white group-hover:text-[#FF8C42] transition-colors leading-none">
                  BeatStory
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <NavLink to="/" icon={Home} label="Inicio" />
              <NavLink to="/feed" icon={Music} label="Feed" />
              
              {user && (
                <>
                  <NavLink to="/create" icon={PlusCircle} label="Crear Post" />
                  <NavLink to="/mis-pedidos" icon={PackageSearch} label="Mis Pedidos" />
                  {isAdmin && (
                    <NavLink to="/admin/solicitudes" icon={ShieldAlert} label="Admin" />
                  )}
                  <NavLink to="/profile" icon={User} label="Perfil" />
                </>
              )}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4 pl-6 border-l border-gray-700 ml-4">
              {user ? (
                <>
                  <BellIcon />
                  <Button
                    onClick={() => setShowLogoutConfirm(true)}
                    variant="ghost"
                    className="text-gray-300 hover:text-red-400 hover:bg-red-500/10"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Salir
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/5">
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-[#FF8C42] hover:bg-[#ff7a1f] text-white shadow-lg shadow-[#FF8C42]/20 border-0">
                      Únete
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <div className="md:hidden flex items-center gap-4">
               {user && <BellIcon />}
               <button
                onClick={() => setIsDrawerOpen(true)}
                className="flex flex-col justify-center items-center w-9 h-9 rounded-full bg-[#FF8C42]/10 hover:bg-[#FF8C42]/20 text-[#FF8C42] transition-colors gap-1 outline-none focus-visible:ring-2 focus-visible:ring-[#FF8C42]"
                aria-label="Menú principal"
              >
                <span className="w-4 h-0.5 bg-current rounded-full" />
                <span className="w-4 h-0.5 bg-current rounded-full" />
                <span className="w-4 h-0.5 bg-current rounded-full" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer & Overlay */}
      <MobileDrawerOverlay 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
      />
      
      <MobileDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)}
        user={user}
        onLogoutClick={() => setShowLogoutConfirm(true)}
      />

      {/* Logout Confirmation Dialog */}
      <LogoutConfirmDialog 
        open={showLogoutConfirm} 
        onOpenChange={setShowLogoutConfirm} 
        onConfirm={handleLogout} 
      />
    </>
  );
}

export default Navbar;