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
    const supabaseUrl = "https://jvetboekyihvcialyeai.supabase.co";
    const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2ZXRib2VreWlodmNpYWx5ZWFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3Mzg3NTEsImV4cCI6MjA3MjMxNDc1MX0.SsxcBq7rfYRNXwHFzxPzXYPcokLdKEoarCsxWcdWSKc";
    
    console.log("Supabase URL:", supabaseUrl);
    console.log("Supabase Anon Key (first 12):", anonKey?.slice(0, 12));
    console.log("Supabase Project Ref: jvetboekyihvcialyeai");
    console.log('[Boot] Auth hook initialized');
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