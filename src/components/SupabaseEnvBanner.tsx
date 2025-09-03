import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { checkSupabaseEnv } from '@/utils/diagnostics';

export const SupabaseEnvBanner: React.FC = () => {
  const envCheck = checkSupabaseEnv();
  
  // Only show banner if environment variables are missing
  if (envCheck.isValid) return null;

  return (
    <Alert className="rounded-none border-0 border-b bg-red-500/10 border-red-500/20">
      <AlertTriangle className="h-4 w-4 text-red-600" />
      <AlertDescription className="text-red-800 font-medium">
        ⚠ Supabase environment variables missing: {envCheck.missing.join(', ')}
      </AlertDescription>
    </Alert>
  );
};