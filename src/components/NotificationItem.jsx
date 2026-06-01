import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Music, CheckCircle, Info, Heart, MessageCircle, AlertTriangle, Package, FileText, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { supabase } from '@/lib/supabase';

const TYPE_ICONS = {
  like: Heart,
  comment: MessageCircle,
  delivery_ready: Package,
  review_request: Star,
  new_request: FileText,
  report: AlertTriangle,
  default: Bell
};

const TYPE_COLORS = {
  like: "text-red-400 bg-red-400/10",
  comment: "text-blue-400 bg-blue-400/10",
  delivery_ready: "text-green-400 bg-green-400/10",
  review_request: "text-[#FF8C42] bg-[#FF8C42]/10",
  new_request: "text-purple-400 bg-purple-400/10",
  report: "text-red-500 bg-red-500/10",
  default: "text-gray-400 bg-gray-400/10"
};

function NotificationItem({ notification, onRead }) {
  const navigate = useNavigate();
  // Safe fallback for type
  const type = notification.type || 'default';
  const Icon = TYPE_ICONS[type] || TYPE_ICONS.default;
  const colorClass = TYPE_COLORS[type] || TYPE_COLORS.default;

  const handleClick = async () => {
    if (!notification.is_read) {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notification.id);
      
      if (onRead) onRead(notification.id);
    }
    
    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={cn(
        "group relative flex gap-4 p-4 rounded-xl border transition-all cursor-pointer",
        notification.is_read 
          ? "bg-[#0F172A] border-gray-800 opacity-70 hover:opacity-100" 
          : "bg-[#1E293B] border-[#FF8C42]/30 hover:border-[#FF8C42]/50 shadow-sm"
      )}
    >
      <div className={cn("flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center", colorClass)}>
        <Icon className="w-5 h-5" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <h4 className={cn("text-sm font-semibold truncate pr-2", notification.is_read ? "text-gray-300" : "text-white")}>
            {notification.title}
          </h4>
          <span className="text-[10px] text-gray-500 whitespace-nowrap">
            {notification.created_at && formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: es })}
          </span>
        </div>
        <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
          {notification.body}
        </p>
      </div>
      
      {!notification.is_read && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#FF8C42]" />
      )}
    </div>
  );
}

export default NotificationItem;