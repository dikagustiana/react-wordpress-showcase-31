import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuthRole } from '@/hooks/useAuthRole';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { LogIn, LogOut, User } from 'lucide-react';

export const AuthButton: React.FC = () => {
  const { user, isAdmin, loading, profile } = useAuthRole();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSignIn = () => {
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-primary border-t-transparent animate-spin rounded-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <Button 
        onClick={handleSignIn}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <LogIn className="w-4 h-4" />
        Login
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-sm">
        <User className="w-4 h-4" />
        <span className="text-foreground">{user.email}</span>
        {isAdmin && (
          <span className="bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-medium">
            Admin
          </span>
        )}
        {!isAdmin && profile?.role && (
          <span className="bg-muted text-muted-foreground px-2 py-1 rounded-md text-xs font-medium">
            {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
          </span>
        )}
      </div>
      <Button 
        onClick={handleSignOut}
        variant="ghost"
        size="sm"
        className="flex items-center gap-2"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </Button>
    </div>
  );
};