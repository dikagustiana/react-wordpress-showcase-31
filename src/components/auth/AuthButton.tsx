import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuthRole } from '@/hooks/useAuthRole';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { LogIn, LogOut, User } from 'lucide-react';

export const AuthButton: React.FC = () => {
  const { user, isAdmin, loading, role } = useAuthRole();
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
        {role === 'admin' && (
          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Admin
          </span>
        )}
        {role === 'viewer' && (
          <span className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Viewer
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