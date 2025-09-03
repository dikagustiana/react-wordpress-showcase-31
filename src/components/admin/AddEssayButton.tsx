import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAuthRole } from '@/hooks/useAuthRole';
import { useGreenEssays } from '@/hooks/useGreenEssays';
import { cn } from '@/lib/utils';

interface AddEssayButtonProps {
  section: string;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  onEssayCreated?: (essayId: string) => void;
}

export const AddEssayButton: React.FC<AddEssayButtonProps> = ({
  section,
  className,
  variant = 'outline',
  size = 'default',
  onEssayCreated
}) => {
  const { isAdmin } = useAuthRole();
  const { createEssay, saving } = useGreenEssays();

  const handleCreateEssay = async () => {
    console.log('[Add Essay] Creating new essay for section:', section);
    
    const newEssay = await createEssay(section);
    if (newEssay) {
      console.log('[Add Essay] Essay created successfully:', newEssay.id);
      onEssayCreated?.(newEssay.id);
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
      disabled={saving}
      className={cn("gap-2", className)}
    >
      <Plus className="w-4 h-4" />
      {saving ? 'Creating...' : 'Add Essay'}
    </Button>
  );
};