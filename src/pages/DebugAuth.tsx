import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthRole } from '@/hooks/useAuthRole';

export default function DebugAuth() {
  const [sess, setSess] = useState<any>(null);
  const { user, role, isAdmin, loading } = useAuthRole();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSess(data.session));
  }, []);

  const refresh = async () => {
    await supabase.auth.refreshSession();
    const { data } = await supabase.auth.getSession();
    setSess(data.session);
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Auth Debug</h1>
      <pre className="p-4 bg-muted rounded">{JSON.stringify({
        email: sess?.user?.email,
        app_metadata: sess?.user?.app_metadata,
        roleHook: role,
        isAdmin,
        loading
      }, null, 2)}</pre>
      <button className="px-3 py-2 rounded border" onClick={refresh}>Refresh session</button>
    </div>
  );
}