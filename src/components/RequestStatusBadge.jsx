import React from 'react';
import { cn } from '@/lib/utils';
import { Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

const RequestStatusBadge = ({ status, className }) => {
  const config = {
    new: {
      color: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
      label: 'Pendiente',
      icon: Clock
    },
    in_progress: {
      color: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      label: 'En Proceso',
      icon: Loader2,
      animate: true
    },
    completed: {
      color: 'bg-green-500/20 text-green-300 border-green-500/30',
      label: 'Completada',
      icon: CheckCircle2
    },
    rejected: {
      color: 'bg-red-500/20 text-red-300 border-red-500/30',
      label: 'Rechazada',
      icon: XCircle
    }
  };

  const current = config[status] || config.new;
  const Icon = current.icon;

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-sm transition-all",
      current.color,
      className
    )}>
      <Icon className={cn("w-3 h-3", current.animate && "animate-spin")} />
      {current.label}
    </div>
  );
};

export default RequestStatusBadge;