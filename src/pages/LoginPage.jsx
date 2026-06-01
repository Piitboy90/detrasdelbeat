import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import SupabaseConfigWarning from '@/components/SupabaseConfigWarning';
import { isSupabaseConfigured } from '@/lib/supabase';
import { authService } from '@/services/authService';
import PasswordResetDialog from '@/components/PasswordResetDialog';
import { getPageTitle, getMetaDescription } from '@/lib/seo';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isSupabaseConfigured()) {
      toast({
        title: "Error de configuración",
        description: "Supabase no está configurado.",
        variant: "destructive",
      });
      return;
    }

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      toast({
        title: "Campos requeridos",
        description: "Por favor, completa todos los campos",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      toast({
        title: "Email inválido",
        description: "Por favor, ingresa un correo electrónico válido",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    const { error } = await login(trimmedEmail, trimmedPassword);
    
    setIsLoading(false);

    if (error) {
      const friendlyError = authService.getFriendlyErrorMessage(error);
      
      toast({
        title: "No se pudo iniciar sesión",
        description: friendlyError,
        variant: "destructive",
      });
    } else {
      toast({
        title: "¡Bienvenido!",
        description: "Has iniciado sesión exitosamente",
      });
      
      // Explicitly redirect to HOME as requested
      navigate('/', { replace: true });
    }
  };

  return (
    <>
      <Helmet>
        <title>{getPageTitle("Inicia sesión")}</title>
        <meta name="description" content={getMetaDescription("Inicia sesión en BeatStory")} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {!isSupabaseConfigured() && <SupabaseConfigWarning />}
          
          <div className="bg-[#1E293B] rounded-lg shadow-xl p-8 border border-gray-700">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Iniciar Sesión</h1>
              <p className="text-gray-400">Bienvenido de vuelta a BeatStory</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#0F172A] border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                    placeholder="tu@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                    Contraseña
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsResetDialogOpen(true)}
                    className="text-sm text-[#FF6B35] hover:text-[#FF8C42] hover:underline transition-colors"
                  >
                    ¿Olvidaste mi contraseña?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#0F172A] border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !isSupabaseConfigured()}
                className="w-full bg-[#FF6B35] hover:bg-[#FF5722] text-white py-3 text-lg font-semibold transition-colors disabled:opacity-50 h-12"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                    Iniciando sesión...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <LogIn className="h-5 w-5" />
                    Iniciar Sesión
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                ¿No tienes cuenta?{' '}
                <Link to="/register" className="text-[#FF6B35] hover:text-[#FF5722] font-medium transition-colors">
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <PasswordResetDialog 
        open={isResetDialogOpen} 
        onOpenChange={setIsResetDialogOpen} 
      />
    </>
  );
}

export default LoginPage;