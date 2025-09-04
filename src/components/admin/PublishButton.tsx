import React from 'react';
import { Button } from '@/components/ui/button';
import { Globe, FileText } from 'lucide-react';
import { useAuthRole } from '@/hooks/useAuthRole';

interface PublishButtonProps {
  essayId: string;
  currentStatus: 'draft' | 'published';
  onPublish: (id: string) => Promise<boolean>;
  onUnpublish: (id: string) => Promise<boolean>;
  className?: string;
}

export const PublishButton: React.FC<PublishButtonProps> = ({ 
  essayId,
  currentStatus,
  onPublish,
  onUnpublish,
  className = '' 
}) => {
  const { isAdmin } = useAuthRole();

  if (!isAdmin) return null;

  const handleClick = async () => {
    if (currentStatus === 'draft') {
      await onPublish(essayId);
    } else {
      await onUnpublish(essayId);
    }
  };

  return (
    <Button
      variant={currentStatus === 'published' ? 'outline' : 'default'}
      size="sm"
      onClick={handleClick}
      className={className}
    >
      {currentStatus === 'published' ? (
        <>
          <FileText className="w-4 h-4 mr-1" />
          Unpublish
        </>
      ) : (
        <>
          <Globe className="w-4 h-4 mr-1" />
          Publish
        </>
      )}
    </Button>
  );
};