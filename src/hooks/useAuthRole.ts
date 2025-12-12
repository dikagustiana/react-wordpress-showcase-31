import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type Role = 'admin' | 'editor' | 'viewer' | null;

const normalizeRole = (role: unknown): Role => {
  if (!role || typeof role !== 'string') return null;

  const normalized = role.toLowerCase();
  if (normalized === 'admin' || normalized === 'editor' || normalized === 'viewer') {
    return normalized;
  }

  return null;
};

export const useAuthRole = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  const readRoleFromUser = (u: User | null): Role => {
    try {
      const r = (u?.app_metadata as any)?.role;
      return normalizeRole(r);
    } catch (error) {
      console.error('Error reading role from user:', error);
      return null;
    }
  };

  const resolveRole = async (sess: Session | null) => {
    try {
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
          setRole(normalizeRole(data) ?? 'viewer');
        } catch {
          setRole('viewer');
        }
      } else {
        setRole(null);
      }
    } catch (error) {
      console.error('Error resolving role:', error);
      setRole(null);
    } finally {
      setLoading(false);
    }
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

  return { user, session, role, isAdmin: role === 'admin' || role === 'editor', loading };
};