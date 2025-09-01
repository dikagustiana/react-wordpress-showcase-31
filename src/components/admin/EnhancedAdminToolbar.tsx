import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, History, Users, Edit3, Save, Eye } from 'lucide-react';
import { useAuthRole } from '@/hooks/useAuthRole';

interface EnhancedAdminToolbarProps {
  editMode: boolean;
  onToggleEditMode: () => void;
  onOpenHistory: () => void;
  onSaveAll?: () => void;
}

export const EnhancedAdminToolbar: React.FC<EnhancedAdminToolbarProps> = ({
  editMode,
  onToggleEditMode,
  onOpenHistory,
  onSaveAll
}) => {
  const { isAdmin, user } = useAuthRole();

  // Keyboard shortcut handler
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key?.toLowerCase() === 'e' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        onToggleEditMode();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onToggleEditMode]);

  if (!isAdmin) return null;

  return (
    <div className="fixed top-20 right-4 z-[100] bg-card border rounded-lg shadow-lg p-3">
      <div className="flex items-center gap-3">
        <Badge variant="secondary" className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          Admin
        </Badge>
        
        <div className="flex items-center gap-1">
          <Button 
            variant={editMode ? "default" : "ghost"} 
            size="sm" 
            className="h-8"
            onClick={onToggleEditMode}
            title="Toggle Edit Mode (Ctrl/Cmd + E)"
          >
            {editMode ? (
              <>
                <Eye className="w-4 h-4 mr-1" />
                View
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4 mr-1" />
                Edit
              </>
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8"
            onClick={onOpenHistory}
            title="View Revision History"
          >
            <History className="w-4 h-4" />
          </Button>

          {editMode && onSaveAll && (
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8"
              onClick={onSaveAll}
              title="Save All Changes"
            >
              <Save className="w-4 h-4 mr-1" />
              Save All
            </Button>
          )}
        </div>
      </div>
      
      {user?.email && (
        <div className="text-xs text-muted-foreground mt-1">
          {user.email}
        </div>
      )}
      
      {editMode && (
        <div className="text-xs text-primary mt-1 font-medium">
          Edit Mode Active
        </div>
      )}
    </div>
  );
};