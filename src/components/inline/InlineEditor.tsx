import React, { useState, useRef, useEffect, useCallback } from 'react';
import { InlineToolbar } from './InlineToolbar';
import { useInlineContent } from '@/hooks/useInlineContent';
import { useRole } from '@/contexts/RoleContext';

interface InlineEditorProps {
  pageKey: string;
  sectionKey: string;
  placeholder?: string;
  className?: string;
}

export const InlineEditor: React.FC<InlineEditorProps> = ({
  pageKey,
  sectionKey,
  placeholder = "Write here...",
  className = ""
}) => {
  const { isAdmin } = useRole();
  const { getSectionContent, saveSectionContent, uploadFile, saving } = useInlineContent(pageKey);
  const [isEditing, setIsEditing] = useState(false);
  const [toolbarVisible, setToolbarVisible] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  const editorRef = useRef<HTMLDivElement>(null);
  const autosaveTimeoutRef = useRef<NodeJS.Timeout>();

  const content = getSectionContent(sectionKey);

  // Handle autosave
  const handleAutosave = useCallback(() => {
    if (editorRef.current && isEditing) {
      const currentContent = editorRef.current.innerHTML;
      saveSectionContent(sectionKey, currentContent);
    }
  }, [isEditing, sectionKey, saveSectionContent]);

  // Trigger autosave after 2 seconds of inactivity
  const scheduleAutosave = useCallback(() => {
    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }
    autosaveTimeoutRef.current = setTimeout(handleAutosave, 2000);
  }, [handleAutosave]);

  // Handle content changes
  const handleInput = () => {
    if (isAdmin && isEditing) {
      scheduleAutosave();
    }
  };

  // Handle focus
  const handleFocus = () => {
    if (!isAdmin) return;
    
    setIsEditing(true);
    setToolbarVisible(true);
    
    // Position toolbar above the editor
    if (editorRef.current) {
      const rect = editorRef.current.getBoundingClientRect();
      setToolbarPosition({
        x: rect.left,
        y: rect.top - 60 // 60px above the editor
      });
    }
  };

  // Handle blur (but keep toolbar visible for a moment)
  const handleBlur = (e: React.FocusEvent) => {
    // Don't hide if clicking on toolbar
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (relatedTarget && relatedTarget.closest('.inline-toolbar')) {
      return;
    }
    
    setTimeout(() => {
      setIsEditing(false);
      setToolbarVisible(false);
    }, 150);
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 's':
          e.preventDefault();
          handleSave();
          break;
        case 'b':
          e.preventDefault();
          handleFormat('bold');
          break;
        case 'i':
          e.preventDefault();
          handleFormat('italic');
          break;
      }
    }

    if (e.key === 'Escape') {
      editorRef.current?.blur();
      setIsEditing(false);
      setToolbarVisible(false);
    }
  };

  // Handle formatting
  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  // Handle save
  const handleSave = async () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      const success = await saveSectionContent(sectionKey, content);
      if (success) {
        setIsEditing(false);
        setToolbarVisible(false);
      }
    }
  };

  // Handle image insertion
  const handleImageInsert = async (file: File) => {
    const imageUrl = await uploadFile(file, '', '');
    if (imageUrl && editorRef.current) {
      const img = `<img src="${imageUrl}" alt="" style="max-width: 100%; height: auto; margin: 1rem 0;" />`;
      handleFormat('insertHTML', img);
    }
  };

  // Handle Excel insertion
  const handleExcelInsert = (type: 'live' | 'static', data: any) => {
    if (type === 'live' && data.embed_url) {
      const iframe = `
        <div style="margin: 1.5rem 0;">
          <h4>${data.meta?.title || 'Excel Document'}</h4>
          <iframe 
            src="${data.embed_url}" 
            style="width: 100%; height: 400px; border: 1px solid #e2e8f0; border-radius: 8px;"
            frameborder="0">
          </iframe>
        </div>
      `;
      handleFormat('insertHTML', iframe);
    }
  };

  // Initialize content
  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  // Cleanup autosave on unmount
  useEffect(() => {
    return () => {
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      {/* Floating Toolbar */}
      {toolbarVisible && isAdmin && (
        <div 
          className="fixed z-50 inline-toolbar"
          style={{
            left: toolbarPosition.x,
            top: toolbarPosition.y,
          }}
        >
          <InlineToolbar
            onFormat={handleFormat}
            onSave={handleSave}
            onImageInsert={handleImageInsert}
            onExcelInsert={handleExcelInsert}
            saving={saving}
          />
        </div>
      )}

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable={isAdmin}
        suppressContentEditableWarning={true}
        className={`
          outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 rounded-md
          ${isAdmin ? 'cursor-text hover:bg-accent/10' : 'cursor-default'}
          ${!content && isAdmin ? 'min-h-[2rem]' : ''}
          ${className}
        `}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        data-placeholder={!content && isAdmin ? placeholder : ''}
        style={{
          ...(!content && isAdmin && {
            position: 'relative'
          })
        }}
      />

      {/* Placeholder styling */}
      <style>{`
        [contentEditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          cursor: text;
        }
      `}</style>
    </div>
  );
};
