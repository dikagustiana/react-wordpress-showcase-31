import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export const WarningBanner: React.FC = () => {
  // Only show in development
  if (import.meta.env.PROD) return null;
  
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const expectedProjectRef = 'jvetboekyihvcialyeai';
  
  // Extract project ref from URL
  const urlMatch = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/);
  const currentProjectRef = urlMatch ? urlMatch[1] : 'unknown';
  
  // Only show if project ref doesn't match expected
  if (currentProjectRef === expectedProjectRef) return null;
  
  return (
    <Alert className="rounded-none border-0 border-b bg-yellow-500/10 border-yellow-500/20">
      <AlertTriangle className="h-4 w-4 text-yellow-600" />
      <AlertDescription className="text-yellow-800 font-medium">
        ⚠ Warning: App connected to a different Supabase project (ref: {currentProjectRef})
      </AlertDescription>
    </Alert>
  );
};