import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAuthRole } from '@/hooks/useAuthRole';
import { cn } from '@/lib/utils';
import { createEssayAPI, CreateEssayRequest } from '@/pages/api/essays';
import { showError, showSuccess, logDiagnostic } from '@/utils/diagnostics';
import { useToast } from '@/hooks/use-toast';
import { SECTION_KEYS, isValidSectionKey, type SectionKey } from '@/constants/sections';

interface AddEssayButtonProps {
  section: SectionKey;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  onEssayCreated?: (essayId: string, slug: string, path: string) => void;
}

export const AddEssayButton: React.FC<AddEssayButtonProps> = ({
  section,
  className,
  variant = 'outline',
  size = 'default',
  onEssayCreated
}) => {
  const { isAdmin, user } = useAuthRole();
  const { toast } = useToast();
  const [creating, setCreating] = React.useState(false);

  const handleCreateEssay = async () => {
    if (!user?.email) {
      showError('Authentication required', 'Please log in to create essays');
      return;
    }

    // Validate section
    if (!isValidSectionKey(section)) {
      toast({
        title: "Invalid Section",
        description: "Invalid section key provided",
        variant: "destructive"
      });
      return;
    }

    setCreating(true);
    logDiagnostic('add_essay_button:create_start', { section, userEmail: user.email });

    try {
      const request: CreateEssayRequest = {
        section,
        title: 'Untitled Essay',
        author: user.email.split('@')[0] || 'Editor',
        created_by: user.email
      };

      const response = await createEssayAPI(request);

      if (response.success && response.id && response.slug && response.path) {
        showSuccess(
          "Essay Created", 
          "New essay created successfully. You can now edit it inline."
        );
        
        logDiagnostic('add_essay_button:create_success', { 
          essayId: response.id,
          slug: response.slug,
          path: response.path 
        });
        
        onEssayCreated?.(response.id, response.slug, response.path);
      } else {
        toast({
          title: "Failed to create essay",
          description: response.error || "Unknown error occurred",
          variant: "destructive"
        });
        
        logDiagnostic('add_essay_button:create_failed', { response }, 'error');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      toast({
        title: "Error: Failed to create essay",
        description: errorMessage,
        variant: "destructive"
      });
      
      logDiagnostic('add_essay_button:create_error', { error, section }, 'error');
    } finally {
      setCreating(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCreateEssay}
      disabled={creating}
      className={cn("gap-2", className)}
    >
      <Plus className="w-4 h-4" />
      {creating ? 'Creating...' : 'Add Essay'}
    </Button>
  );
};