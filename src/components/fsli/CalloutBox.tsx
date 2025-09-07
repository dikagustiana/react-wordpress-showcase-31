import React from 'react';
import { InlineEditor } from '@/components/inline/InlineEditor';
import { useRole } from '@/contexts/RoleContext';
import { Info, AlertTriangle, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface CalloutBoxProps {
  id: string;
  pageKey: string;
  variant?: 'info' | 'caution';
  content?: string;
  copiable?: boolean;
  className?: string;
}

export const CalloutBox: React.FC<CalloutBoxProps> = ({
  id,
  pageKey,
  variant = 'info',
  content,
  copiable = false,
  className = ""
}) => {
  const { isAdmin } = useRole();
  const { toast } = useToast();

  const copyContent = async () => {
    if (!content) return;
    
    try {
      // Strip HTML tags for plain text copy
      const plainText = content.replace(/<[^>]*>/g, '');
      await navigator.clipboard.writeText(plainText);
      toast({
        title: "Copied",
        description: "Content copied to clipboard",
        duration: 2000,
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy content",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const variantStyles = {
    info: {
      container: "bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800",
      icon: "text-blue-600 dark:text-blue-400",
      text: "text-blue-900 dark:text-blue-100"
    },
    caution: {
      container: "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-800",
      icon: "text-yellow-600 dark:text-yellow-400",
      text: "text-yellow-900 dark:text-yellow-100"
    }
  };

  const styles = variantStyles[variant];
  const Icon = variant === 'info' ? Info : AlertTriangle;

  return (
    <div className={`border rounded-lg p-4 ${styles.container} ${className}`}>
      <div className="flex items-start gap-3">
        <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${styles.icon}`} />
        
        <div className="flex-1 min-w-0">
          <div className={`text-sm leading-relaxed ${styles.text}`}>
            <InlineEditor
              pageKey={pageKey}
              sectionKey={`${id}_content`}
              placeholder={`Add ${variant} content (keep to 3 lines max)...`}
              className="outline-none"
            />
          </div>
        </div>

        {copiable && content && (
          <Button
            variant="ghost"
            size="sm"
            onClick={copyContent}
            className={`flex-shrink-0 hover:bg-transparent ${styles.text}`}
            aria-label="Copy content"
          >
            <Copy className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};