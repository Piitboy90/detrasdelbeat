import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

function DeleteConfirmModal({ isOpen, onClose, onConfirm, isDeleting, title = "Eliminar elemento", description = "¿Estás seguro de que quieres eliminar esto? Esta acción no se puede deshacer." }) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-[#1E293B] border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">{title}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end gap-2 mt-4">
          <Button variant="ghost" onClick={onClose} disabled={isDeleting} className="hover:bg-white/10 text-white">
            Cancelar
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirm} 
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteConfirmModal;