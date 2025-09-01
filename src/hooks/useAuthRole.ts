import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthRole {
  user: User | null;
  role: 'admin' | 'viewer' | null;
  isAdmin: boolean;
  loading: boolean;
  session: Session | null;
}

export const useAuthRole = (): AuthRole => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<'admin' | 'viewer' | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user role:', error);
        setRole('viewer');
        return;
      }

      if (data) {
        setRole(data.role as 'admin' | 'viewer');
      } else {
        // If no role found, default to viewer
        setRole('viewer');
      }
    } catch (error) {
      console.error('Error in fetchUserRole:', error);
      setRole('viewer');
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer role fetching to avoid auth state deadlock
          setTimeout(() => {
            fetchUserRole(session.user.id);
          }, 0);
        } else {
          // Clear role state on logout
          setRole(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session on mount/refresh
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Always fetch role from database after getting session
          await fetchUserRole(session.user.id);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setLoading(false);
      }
    };

    initializeAuth();

    return () => subscription.unsubscribe();
  }, []);

  return {
    user,
    role,
    isAdmin: role === 'admin',
    loading,
    session,
  };
};