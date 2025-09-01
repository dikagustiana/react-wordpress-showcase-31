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
  isEditing, 
  children 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsClamp, setNeedsClamp] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const { isAdmin } = useAuthRole();
  
  const html = content?.trim() || '';

  // Check if content needs clamping (not in admin edit mode)
  useEffect(() => {
    if (!contentRef.current || isEditing) {
      setNeedsClamp(false);
      return;
    }

    const contentHeight = contentRef.current.scrollHeight;
    // Set clamp heights based on screen size
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth < 1024;
    
    let maxHeight;
    if (isMobile) {
      maxHeight = window.innerHeight * 0.5; // 50vh mobile
    } else if (isTablet) {
      maxHeight = window.innerHeight * 0.6; // 60vh tablet  
    } else {
      maxHeight = window.innerHeight * 0.7; // 70vh desktop
    }

    setNeedsClamp(contentHeight > maxHeight);
  }, [content, isEditing]);

  // In edit mode, don't clamp - let content grow naturally
  if (isEditing || (isAdmin && isEditing)) {
    return (
      <div className="prose max-w-none">
        {html ? (
          <div 
            ref={contentRef}
            dangerouslySetInnerHTML={{ __html: html }} 
          />
        ) : (
          <p className="italic text-muted-foreground">No content yet</p>
        )}
        {children}
      </div>
    );
  }

  // Viewer mode with clamp functionality
  const getClampStyle = () => {
    if (!needsClamp || isExpanded) return {};
    
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth < 1024;
    
    if (isMobile) {
      return { maxHeight: '50vh', overflow: 'hidden' };
    } else if (isTablet) {
      return { maxHeight: '60vh', overflow: 'hidden' };
    } else {
      return { maxHeight: '70vh', overflow: 'hidden' };
    }
  };

  return (
    <div className="prose max-w-none relative">
      <div 
        ref={contentRef}
        style={getClampStyle()}
        className={needsClamp && !isExpanded ? 'relative' : ''}
      >
        {html ? (
          <div dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <p className="italic text-muted-foreground">No content yet</p>
        )}
        
        {/* Gradient overlay when clamped */}
        {needsClamp && !isExpanded && (
          <div 
            className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none"
          />
        )}
      </div>
      
      {/* Expand/Collapse button */}
      {needsClamp && html && (
        <div className="flex justify-center mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Collapse
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Expand
              </>
            )}
          </Button>
        </div>
      )}
      
      {children}
    </div>
  );
};