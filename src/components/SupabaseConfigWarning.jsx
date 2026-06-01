import React from 'react';
import { AlertCircle } from 'lucide-react';

function SupabaseConfigWarning() {
  return (
    <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-semibold text-destructive mb-2">
            Supabase Configuration Missing
          </h3>
          <p className="text-sm text-destructive/90 mb-3">
            The Supabase environment variables are not configured. Please complete the integration steps:
          </p>
          <ol className="text-sm text-destructive/90 space-y-1 list-decimal list-inside">
            <li>Create a Supabase project at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-destructive">supabase.com</a></li>
            <li>Copy your project URL and anon key from Settings → API</li>
            <li>Add them to your environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY)</li>
            <li>Restart the development server</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default SupabaseConfigWarning;