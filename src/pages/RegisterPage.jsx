import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Mail, Lock, User, UserPlus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import SupabaseConfigWarning from '@/components/SupabaseConfigWarning';
import { isSupabaseConfigured } from '@/lib/supabase';
import { getPageTitle, getMetaDescription } from '@/lib/seo';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

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

    if (!email || !password || !username) {
      toast({
        title: "Campos requeridos",
        description: "Por favor, completa todos los campos",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Contraseña débil",
        description: "La contraseña debe tener al menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    if (!termsAccepted) {
      toast({
        title: "Términos y condiciones",
        description: "Debes aceptar los términos y condiciones",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const { data, error } = await signup(email, password, username);
    setIsLoading(false);

    if (error) {
      toast({
        title: "Error al registrarse",
        description: error,
        variant: "destructive",
      });
    } else {
      // Check if user is already authenticated (no email confirmation needed)
      if (data?.session) {
        toast({
          title: "¡Cuenta creada!",
          description: "Bienvenido a BeatStory.",
        });
        navigate('/', { replace: true });
      } else {
        setIsSuccess(true);
        toast({
          title: "¡Cuenta creada!",
          description: "Te hemos enviado un email para confirmar tu cuenta.",
          duration: 5000,
        });
      }
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-[#1E293B] rounded-lg shadow-xl p-8 border border-gray-700 text-center">
          <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
            <Mail className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">¡Revisa tu correo!</h2>
          <p className="text-gray-300 mb-6">
            Hemos enviado un enlace de confirmación a <span className="font-semibold text-white">{email}</span>.
            Por favor, confirma tu cuenta para poder iniciar sesión.
          </p>
          <Button 
            onClick={() => navigate('/', { replace: true })}
            className="w-full bg-[#FF6B35] hover:bg-[#FF5722] text-white"
          >
            Ir al Inicio
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{getPageTitle("Crea tu cuenta")}</title>
        <meta name="description" content={getMetaDescription("Crea tu cuenta en BeatStory")} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {!isSupabaseConfigured() && <SupabaseConfigWarning />}
          
          <div className="bg-[#1E293B] rounded-lg shadow-xl p-8 border border-gray-700">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Crear Cuenta</h1>
              <p className="text-gray-400">Únete a la comunidad de BeatStory</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre de usuario
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#0F172A] border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                    placeholder="tunombre"
                    required
                  />
                </div>
              </div>

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
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Contraseña
                </label>
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
                <p className="mt-1 text-xs text-gray-500">Mínimo 6 caracteres</p>
              </div>

              <div className="flex items-start gap-3">
                <input
                  id="terms"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-600 bg-[#0F172A] text-[#FF6B35] focus:ring-[#FF6B35] focus:ring-offset-[#1E293B]"
                />
                <label htmlFor="terms" className="text-sm text-gray-400">
                  Acepto los términos y condiciones de uso de BeatStory
                </label>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !isSupabaseConfigured()}
                className="w-full bg-[#FF6B35] hover:bg-[#FF5722] text-white py-3 text-lg font-semibold transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Creando cuenta...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    Crear Cuenta
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                ¿Ya tienes cuenta?{' '}
                <Link to="/login" className="text-[#FF6B35] hover:text-[#FF5722] font-medium transition-colors">
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RegisterPage;