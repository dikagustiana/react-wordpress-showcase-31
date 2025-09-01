import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, History, Users } from 'lucide-react';
import { useAuthRole } from '@/hooks/useAuthRole';

export const AdminToolbar: React.FC = () => {
  const { isAdmin, profile } = useAuthRole();

  if (!isAdmin) return null;

  return (
    <div className="fixed top-20 right-4 z-50 bg-background border rounded-lg shadow-lg p-3">
      <div className="flex items-center gap-3">
        <Badge variant="secondary" className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          Admin
        </Badge>
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Settings className="w-4 h-4" />
          </Button>
          
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <History className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {profile?.display_name && (
        <div className="text-xs text-muted-foreground mt-1">
          {profile.display_name}
        </div>
      )}
    </div>
  );
};