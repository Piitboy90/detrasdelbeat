import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mail, AlertCircle, CheckCircle2 } from 'lucide-react';
import { authService } from '@/services/authService';
import { useToast } from '@/components/ui/use-toast';

function PasswordResetDialog({ open, onOpenChange }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!email || !email.includes('@')) {
      setError("Por favor ingresa un correo electrónico válido");
      setIsLoading(false);
      return;
    }

    try {
      const { error: apiError } = await authService.resetPasswordForEmail(email);
      
      if (apiError) {
        setError(authService.getFriendlyErrorMessage(apiError));
      } else {
        setIsSuccess(true);
        toast({
          title: "Email enviado",
          description: "Revisa tu bandeja de entrada para restablecer tu contraseña.",
        });
      }
    } catch (err) {
      setError("Ocurrió un error inesperado. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset state after a short delay so animation looks smooth
    setTimeout(() => {
      setEmail('');
      setIsSuccess(false);
      setError(null);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-sound-slate border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            {isSuccess ? (
              <>
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                Email Enviado
              </>
            ) : (
              "Recuperar Contraseña"
            )}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {isSuccess 
              ? `Hemos enviado un enlace de recuperación a ${email}. Sigue las instrucciones para crear una nueva contraseña.`
              : "Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña."
            }
          </DialogDescription>
        </DialogHeader>

        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="reset-email" className="text-sm font-medium text-gray-300">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className="w-full pl-10 pr-4 py-3 bg-sound-dark border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sound-orange focus:border-transparent transition-all"
                  autoFocus
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-md border border-red-400/20">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <DialogFooter className="mt-6 flex flex-col-reverse sm:flex-row gap-2">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={handleClose}
                className="text-gray-400 hover:text-white hover:bg-white/10"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-sound-orange hover:bg-sound-orangeHover text-white min-w-[120px]"
              >
                {isLoading ? "Enviando..." : "Enviar enlace"}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <DialogFooter className="sm:justify-center pt-4">
            <Button 
              onClick={handleClose}
              className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto min-w-[140px]"
            >
              Entendido
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default PasswordResetDialog;