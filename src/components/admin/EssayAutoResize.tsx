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
  const html = content?.trim() || '';
  
  return (
    <div className="prose">
      {html
        ? <div dangerouslySetInnerHTML={{ __html: html }} />
        : <p className="italic text-muted-foreground">No content yet</p>}
      {children}
    </div>
  );
};