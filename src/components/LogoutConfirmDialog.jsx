import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const LogoutConfirmDialog = ({ open, onOpenChange, onConfirm }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0F172A] border-[#334155] text-gray-100 max-w-[90%] sm:max-w-sm rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">¿Seguro que quieres salir?</DialogTitle>
          <DialogDescription className="text-gray-400">
            Tendrás que iniciar sesión nuevamente para acceder a tu perfil y crear historias.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-row gap-3 justify-end mt-4">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="flex-1 sm:flex-none text-gray-300 hover:text-white hover:bg-white/10"
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className="flex-1 sm:flex-none bg-[#FF8C42] hover:bg-[#ff7a1f] text-white border-0"
          >
            Sí, salir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogoutConfirmDialog;