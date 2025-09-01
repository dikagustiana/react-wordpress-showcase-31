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

  // Debug logging on startup
  useEffect(() => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    
    console.log("Supabase URL:", supabaseUrl);
    console.log("Supabase Anon Key (first 12):", anonKey?.slice(0, 12));
    
    // Extract project ref from URL
    const urlMatch = supabaseUrl?.match(/https:\/\/([^.]+)\.supabase\.co/);
    const projectRef = urlMatch ? urlMatch[1] : 'unknown';
    console.log("Supabase Project Ref:", projectRef);
  }, []);

  const fetchUserRole = async (userId: string, userEmail?: string) => {
    try {
      console.log("Active User ID:", userId);
      console.log("Active User Email:", userEmail);
      
      const { data: role, error } = await supabase.rpc('get_user_role');

      if (error) {
        console.error('Error fetching user role:', error);
        console.log("Role from DB: viewer (fallback due to error)");
        setRole('viewer');
        return;
      }

      console.log("Role from DB:", role);
      setRole((role as 'admin' | 'viewer') || 'viewer');
    } catch (error) {
      console.error('Error in fetchUserRole:', error);
      console.log("Role from DB: viewer (fallback due to exception)");
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
            fetchUserRole(session.user.id, session.user.email);
          }, 0);
        } else {
          // Clear role state on logout
          console.log("User logged out, clearing role state");
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
          await fetchUserRole(session.user.id, session.user.email);
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