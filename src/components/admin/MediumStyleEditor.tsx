import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Link, 
  Code, 
  Quote, 
  List, 
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Image,
  Video,
  Save,
  X,
  Undo,
  Redo,
  Type,
  Minus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MediumStyleEditorProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  onSave: (content: string) => void;
  title?: string;
  onAutoSave?: (content: string) => void;
}

export const MediumStyleEditor: React.FC<MediumStyleEditorProps> = ({
  isOpen,
  onClose,
  content,
  onSave,
  title = "Edit Content",
  onAutoSave
}) => {
  const [editorContent, setEditorContent] = useState('');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [showBubbleToolbar, setShowBubbleToolbar] = useState(false);
  const [bubblePosition, setBubblePosition] = useState({ top: 0, left: 0 });
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashPosition, setSlashPosition] = useState({ top: 0, left: 0 });
  
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Initialize content when modal opens
  useEffect(() => {
    if (isOpen) {
      let initialContent = content;
      try {
        const parsed = JSON.parse(content);
        initialContent = parsed.content || content;
      } catch {
        // Use content as-is if not JSON
      }
      setEditorContent(initialContent);
      setIsDirty(false);
      setLastSaved(new Date());
    }
  }, [isOpen, content]);

  // Auto-save functionality
  useEffect(() => {
    if (isDirty && onAutoSave) {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      
      autoSaveTimeoutRef.current = setTimeout(() => {
        onAutoSave(editorContent);
        setLastSaved(new Date());
        setIsDirty(false);
        toast({
          title: "Auto-saved",
          description: `Saved at ${new Date().toLocaleTimeString()}`,
        });
      }, 5000);
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [editorContent, isDirty, onAutoSave, toast]);

  // Handle content changes
  const handleContentChange = (newContent: string) => {
    setEditorContent(newContent);
    setIsDirty(true);
    
    // Check for slash command
    const textarea = editorRef.current;
    if (textarea) {
      const cursorPos = textarea.selectionStart;
      const textBefore = newContent.substring(0, cursorPos);
      const lastChar = textBefore.charAt(textBefore.length - 1);
      
      if (lastChar === '/' && (textBefore.length === 1 || textBefore.charAt(textBefore.length - 2) === '\n')) {
        // Show slash menu
        const rect = textarea.getBoundingClientRect();
        setSlashPosition({
          top: rect.top + (cursorPos / newContent.length) * rect.height,
          left: rect.left + 20
        });
        setShowSlashMenu(true);
      } else {
        setShowSlashMenu(false);
      }
    }
  };

  // Handle text selection for bubble toolbar
  const handleTextSelect = () => {
    const textarea = editorRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      if (start !== end) {
        // Text is selected, show bubble toolbar
        const rect = textarea.getBoundingClientRect();
        setBubblePosition({
          top: rect.top - 50,
          left: rect.left + (rect.width / 2)
        });
        setShowBubbleToolbar(true);
      } else {
        setShowBubbleToolbar(false);
      }
    }
  };

  // Insert formatting
  const insertFormat = (before: string, after: string = before) => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = editorContent.substring(start, end);
    
    const newContent = 
      editorContent.substring(0, start) + 
      before + selectedText + after + 
      editorContent.substring(end);
    
    setEditorContent(newContent);
    setIsDirty(true);
    
    // Focus back to textarea
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  // Insert block element
  const insertBlock = (blockType: string) => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const cursorPos = textarea.selectionStart;
    const lines = editorContent.split('\n');
    let currentLineIndex = 0;
    let charCount = 0;
    
    // Find current line
    for (let i = 0; i < lines.length; i++) {
      if (charCount + lines[i].length >= cursorPos) {
        currentLineIndex = i;
        break;
      }
      charCount += lines[i].length + 1; // +1 for newline
    }

    let newContent = editorContent;
    
    switch (blockType) {
      case 'h1':
        lines[currentLineIndex] = '# ' + lines[currentLineIndex].replace(/^#+\s*/, '');
        break;
      case 'h2':
        lines[currentLineIndex] = '## ' + lines[currentLineIndex].replace(/^#+\s*/, '');
        break;
      case 'h3':
        lines[currentLineIndex] = '### ' + lines[currentLineIndex].replace(/^#+\s*/, '');
        break;
      case 'quote':
        lines[currentLineIndex] = '> ' + lines[currentLineIndex].replace(/^>\s*/, '');
        break;
      case 'ul':
        lines[currentLineIndex] = '- ' + lines[currentLineIndex].replace(/^[-*]\s*/, '');
        break;
      case 'ol':
        lines[currentLineIndex] = '1. ' + lines[currentLineIndex].replace(/^\d+\.\s*/, '');
        break;
      case 'code':
        lines[currentLineIndex] = '```\n' + lines[currentLineIndex] + '\n```';
        break;
      case 'hr':
        lines.splice(currentLineIndex + 1, 0, '---');
        break;
    }
    
    newContent = lines.join('\n');
    setEditorContent(newContent);
    setIsDirty(true);
    setShowSlashMenu(false);
  };

  // Keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          insertFormat('**');
          break;
        case 'i':
          e.preventDefault();
          insertFormat('*');
          break;
        case 'u':
          e.preventDefault();
          insertFormat('<u>', '</u>');
          break;
        case 'k':
          e.preventDefault();
          insertFormat('[', '](url)');
          break;
        case 's':
          e.preventDefault();
          handleSave();
          break;
      }
    }
    
    if (e.key === 'Escape') {
      setShowSlashMenu(false);
      setShowBubbleToolbar(false);
    }
  };

  const handleSave = () => {
    onSave(editorContent);
    setLastSaved(new Date());
    setIsDirty(false);
    onClose();
    toast({
      title: "Content saved",
      description: "Your changes have been saved successfully.",
    });
  };

  const slashMenuItems = [
    { label: 'Heading 1', icon: Heading1, action: () => insertBlock('h1') },
    { label: 'Heading 2', icon: Heading2, action: () => insertBlock('h2') },
    { label: 'Heading 3', icon: Heading3, action: () => insertBlock('h3') },
    { label: 'Quote', icon: Quote, action: () => insertBlock('quote') },
    { label: 'Bullet List', icon: List, action: () => insertBlock('ul') },
    { label: 'Numbered List', icon: ListOrdered, action: () => insertBlock('ol') },
    { label: 'Code Block', icon: Code, action: () => insertBlock('code') },
    { label: 'Divider', icon: Minus, action: () => insertBlock('hr') },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {title}
            {lastSaved && (
              <span className="text-sm text-muted-foreground font-normal">
                {isDirty ? 'Unsaved changes' : `Saved ${lastSaved.toLocaleTimeString()}`}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>
        
        {/* Toolbar */}
        <div className="flex items-center gap-2 p-2 border-b flex-wrap">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={() => insertFormat('**')}>
              <Bold className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => insertFormat('*')}>
              <Italic className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => insertFormat('<u>', '</u>')}>
              <Underline className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => insertFormat('~~')}>
              <Strikethrough className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => insertFormat('`')}>
              <Code className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => insertFormat('[', '](url)')}>
              <Link className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="w-px h-6 bg-border" />
          
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={() => insertBlock('h1')}>
              <Heading1 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => insertBlock('h2')}>
              <Heading2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => insertBlock('h3')}>
              <Heading3 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => insertBlock('quote')}>
              <Quote className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => insertBlock('ul')}>
              <List className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => insertBlock('ol')}>
              <ListOrdered className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Editor */}
        <div className="flex-1 relative">
          <Textarea
            ref={editorRef}
            value={editorContent}
            onChange={(e) => handleContentChange(e.target.value)}
            onSelect={handleTextSelect}
            onKeyDown={handleKeyDown}
            placeholder="Start writing... Use / for commands"
            className="min-h-[400px] resize-none font-mono text-sm"
          />
          
          {/* Bubble Toolbar */}
          {showBubbleToolbar && (
            <div 
              className="fixed bg-popover border rounded-lg shadow-lg p-2 flex items-center gap-1 z-50"
              style={{ 
                top: bubblePosition.top, 
                left: bubblePosition.left - 100,
                transform: 'translateX(-50%)'
              }}
            >
              <Button variant="ghost" size="sm" onClick={() => insertFormat('**')}>
                <Bold className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => insertFormat('*')}>
                <Italic className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => insertFormat('[', '](url)')}>
                <Link className="w-3 h-3" />
              </Button>
            </div>
          )}
          
          {/* Slash Menu */}
          {showSlashMenu && (
            <div 
              className="fixed bg-popover border rounded-lg shadow-lg p-2 min-w-[200px] z-50"
              style={{ 
                top: slashPosition.top, 
                left: slashPosition.left 
              }}
            >
              {slashMenuItems.map((item, index) => (
                <button
                  key={index}
                  className="w-full text-left px-3 py-2 rounded hover:bg-accent flex items-center gap-2"
                  onClick={item.action}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isDirty}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};