import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useAuthRole } from '@/hooks/useAuthRole';

interface EssayAutoResizeProps {
  content: string;
  isEditing?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const EssayAutoResize: React.FC<EssayAutoResizeProps> = ({
  content,
  isEditing = false,
  className = '',
  children
}) => {
  const { isAdmin } = useAuthRole();
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldClamp, setShouldClamp] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Check if content needs clamping
  useEffect(() => {
    const checkContentHeight = () => {
      if (contentRef.current && !isEditing) {
        const contentHeight = contentRef.current.scrollHeight;
        const viewportHeight = window.innerHeight;
        
        // Clamp thresholds based on device
        let maxHeight;
        if (window.innerWidth >= 1024) { // Desktop
          maxHeight = viewportHeight * 0.7; // 70vh
        } else if (window.innerWidth >= 768) { // Tablet
          maxHeight = viewportHeight * 0.6; // 60vh
        } else { // Mobile
          maxHeight = viewportHeight * 0.5; // 50vh
        }
        
        setShouldClamp(contentHeight > maxHeight);
      }
    };

    // Check on mount and when content changes
    checkContentHeight();
    
    // Check on window resize
    const handleResize = () => checkContentHeight();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [content, isEditing]);

  // Reset expansion when entering/exiting edit mode
  useEffect(() => {
    if (isEditing) {
      setIsExpanded(true);
    }
  }, [isEditing]);

  const getMaxHeight = () => {
    if (isEditing || isExpanded) return 'none';
    
    const viewportHeight = window.innerHeight;
    if (window.innerWidth >= 1024) return `${viewportHeight * 0.7}px`;
    if (window.innerWidth >= 768) return `${viewportHeight * 0.6}px`;
    return `${viewportHeight * 0.5}px`;
  };

  const isEmpty = !content || content.trim() === '';

  if (isEmpty) {
    return (
      <div className={`relative ${className}`}>
        <div className="text-muted-foreground italic p-6 text-center bg-muted/30 rounded-lg">
          {isAdmin ? 'Edit to add content' : 'No content yet'}
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div
        ref={contentRef}
        className={`
          prose prose-sm max-w-none transition-all duration-300 ease-in-out
          ${!isEditing && !isExpanded && shouldClamp ? 'overflow-hidden relative' : ''}
        `}
        style={{
          maxHeight: getMaxHeight(),
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: content }} />
        
        {/* Gradient fade effect when clamped */}
        {!isEditing && !isExpanded && shouldClamp && (
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        )}
      </div>
      
      {/* Expand/Collapse button */}
      {shouldClamp && !isEditing && (
        <div className="flex justify-center mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2"
            aria-label={isExpanded ? 'Collapse essay' : 'Expand essay'}
          >
            {isExpanded ? (
              <>
                Collapse essay
                <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Expand essay
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      )}
      
      {children}
    </div>
  );
};