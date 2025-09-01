import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit3 } from 'lucide-react';
import { useAuthRole } from '@/hooks/useAuthRole';

interface EditButtonProps {
  onClick: () => void;
  className?: string;
  variant?: 'default' | 'ghost' | 'outline' | 'secondary';
}

export const EditButton: React.FC<EditButtonProps> = ({ 
  onClick, 
  className = '', 
  variant = 'ghost' 
}) => {
  const { isAdmin } = useAuthRole();

  if (!isAdmin) return null;

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={onClick}
      className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${className}`}
    >
      <Edit3 className="w-4 h-4 mr-1" />
      Edit
    </Button>
  );
};