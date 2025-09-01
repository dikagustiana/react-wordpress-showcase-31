import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type Role = 'admin' | 'viewer' | null;

export const useAuthRole = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  const readRoleFromUser = (u: User | null): Role => {
    const r = (u?.app_metadata as any)?.role;
    return r === 'admin' || r === 'viewer' ? r : null;
  };

  const resolveRole = async (sess: Session | null) => {
    const immediate = readRoleFromUser(sess?.user ?? null);
    if (immediate) {
      setRole(immediate);
      setLoading(false);
      return;
    }
    if (sess?.user) {
      try {
        const { data, error } = await supabase.rpc('get_user_role');
        if (error) throw error;
        setRole((data as 'admin' | 'viewer') ?? 'viewer');
      } catch {
        setRole('viewer');
      }
    } else {
      setRole(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    const sub = supabase.auth.onAuthStateChange((_evt, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      console.log('[Auth] app_metadata =', sess?.user?.app_metadata);
      resolveRole(sess);
    }).data.subscription;

    (async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user ?? null);
      console.log('[Auth:init] app_metadata =', data.session?.user?.app_metadata);
      await resolveRole(data.session);
    })();

    return () => sub.unsubscribe();
  }, []);

  return { user, session, role, isAdmin: role === 'admin', loading };
};