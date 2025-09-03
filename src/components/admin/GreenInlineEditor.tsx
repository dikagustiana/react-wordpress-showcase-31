import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { 
  Bold, Italic, Underline, List, ListOrdered, Quote, Code, 
  Link, Image, Table, Minus, FileText, Heading1, Heading2, 
  Heading3, Save, Eye, EyeOff, Undo2, Redo2, Upload 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GreenInlineEditorProps {
  content: string;
  title?: string;
  subtitle?: string;
  onSave: (content: string, title?: string, subtitle?: string) => Promise<boolean>;
  onCancel: () => void;
  className?: string;
  isFullscreen?: boolean;
}

export const GreenInlineEditor: React.FC<GreenInlineEditorProps> = ({
  content,
  title: initialTitle = '',
  subtitle: initialSubtitle = '',
  onSave,
  onCancel,
  className,
  isFullscreen = false
}) => {
  const [editorContent, setEditorContent] = useState(content);
  const [title, setTitle] = useState(initialTitle);
  const [subtitle, setSubtitle] = useState(initialSubtitle);
  const [isPreview, setIsPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ top: 0, left: 0 });
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [undoStack, setUndoStack] = useState<string[]>([content]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const [undoIndex, setUndoIndex] = useState(0);
  
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const autoSaveRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  // Auto-save every 5 seconds
  useEffect(() => {
    if (editorContent !== content || title !== initialTitle || subtitle !== initialSubtitle) {
      if (autoSaveRef.current) {
        clearTimeout(autoSaveRef.current);
      }
      
      autoSaveRef.current = setTimeout(() => {
        handleAutoSave();
      }, 5000);
    }

    return () => {
      if (autoSaveRef.current) {
        clearTimeout(autoSaveRef.current);
      }
    };
  }, [editorContent, title, subtitle]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            handleSave();
            break;
          case 'b':
            e.preventDefault();
            insertFormat('**', '**');
            break;
          case 'i':
            e.preventDefault();
            insertFormat('*', '*');
            break;
          case 'u':
            e.preventDefault();
            insertFormat('<u>', '</u>');
            break;
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              handleRedo();
            } else {
              handleUndo();
            }
            break;
        }
      }
      
      if (e.key === '/' && editorRef.current === document.activeElement) {
        const textarea = editorRef.current;
        const cursorPos = textarea.selectionStart;
        const textBefore = editorContent.substring(0, cursorPos);
        
        if (textBefore.endsWith('\n') || textBefore === '') {
          e.preventDefault();
          showSlashMenuAt(cursorPos);
        }
      }
      
      if (e.key === 'Escape') {
        setShowSlashMenu(false);
        setShowToolbar(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [editorContent, undoIndex]);

  const showSlashMenuAt = (position: number) => {
    if (editorRef.current) {
      const textarea = editorRef.current;
      const rect = textarea.getBoundingClientRect();
      const lineHeight = 20;
      const lines = editorContent.substring(0, position).split('\n').length;
      
      setSlashMenuPosition({
        top: rect.top + (lines * lineHeight),
        left: rect.left
      });
      setShowSlashMenu(true);
    }
  };

  const handleAutoSave = async () => {
    if (saving) return;
    
    setSaving(true);
    const success = await onSave(editorContent, title, subtitle);
    if (success) {
      setLastSaved(new Date());
    }
    setSaving(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const success = await onSave(editorContent, title, subtitle);
    if (success) {
      setLastSaved(new Date());
      console.log('[Green Inline Editor] Content saved, length:', editorContent.length);
    }
    setSaving(false);
  };

  const addToUndoStack = (content: string) => {
    setUndoStack(prev => [...prev.slice(0, undoIndex + 1), content]);
    setRedoStack([]);
    setUndoIndex(prev => prev + 1);
  };

  const handleUndo = () => {
    if (undoIndex > 0) {
      const newIndex = undoIndex - 1;
      setEditorContent(undoStack[newIndex]);
      setUndoIndex(newIndex);
    }
  };

  const handleRedo = () => {
    if (undoIndex < undoStack.length - 1) {
      const newIndex = undoIndex + 1;
      setEditorContent(undoStack[newIndex]);
      setUndoIndex(newIndex);
    }
  };

  const insertFormat = (startTag: string, endTag: string) => {
    if (!editorRef.current) return;
    
    const textarea = editorRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = editorContent.substring(start, end);
    
    const newContent = 
      editorContent.substring(0, start) +
      startTag + selectedText + endTag +
      editorContent.substring(end);
    
    addToUndoStack(editorContent);
    setEditorContent(newContent);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + startTag.length, end + startTag.length);
    }, 0);
  };

  const insertBlock = (blockType: string) => {
    if (!editorRef.current) return;
    
    const textarea = editorRef.current;
    const cursorPos = textarea.selectionStart;
    let insertText = '';
    
    switch (blockType) {
      case 'h1':
        insertText = '# Heading 1\n';
        break;
      case 'h2':
        insertText = '## Heading 2\n';
        break;
      case 'h3':
        insertText = '### Heading 3\n';
        break;
      case 'list':
        insertText = '- List item\n';
        break;
      case 'ordered-list':
        insertText = '1. List item\n';
        break;
      case 'quote':
        insertText = '> Quote text\n';
        break;
      case 'code':
        insertText = '```\nCode block\n```\n';
        break;
      case 'divider':
        insertText = '\n---\n';
        break;
      case 'callout':
        insertText = '\n> 💡 **Note:** Your callout text here\n';
        break;
    }
    
    const newContent = 
      editorContent.substring(0, cursorPos) +
      insertText +
      editorContent.substring(cursorPos);
    
    addToUndoStack(editorContent);
    setEditorContent(newContent);
    setShowSlashMenu(false);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(cursorPos + insertText.length, cursorPos + insertText.length);
    }, 0);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 2MB",
        variant: "destructive"
      });
      return;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `content/green-transition/${fileName}`;

      const { data, error } = await supabase.storage
        .from('green-transition-content')
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('green-transition-content')
        .getPublicUrl(filePath);

      const imageMarkdown = `\n![Image](${publicUrl})\n`;
      const cursorPos = editorRef.current?.selectionStart || 0;
      
      const newContent = 
        editorContent.substring(0, cursorPos) +
        imageMarkdown +
        editorContent.substring(cursorPos);
      
      addToUndoStack(editorContent);
      setEditorContent(newContent);
      
      toast({
        title: "Image uploaded",
        description: "Image has been inserted into your content"
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive"
      });
    }
  };

  const renderPreview = () => {
    // Simple markdown-to-HTML conversion for preview
    let html = editorContent
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
      .replace(/\n/gim, '<br>');

    return <div dangerouslySetInnerHTML={{ __html: html }} className="prose max-w-none" />;
  };

  const toolbar = (
    <div ref={toolbarRef} className="flex flex-wrap items-center gap-1 p-2 bg-background border rounded-lg shadow-lg">
      <Button variant="ghost" size="sm" onClick={() => insertFormat('**', '**')} title="Bold (Ctrl+B)">
        <Bold className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => insertFormat('*', '*')} title="Italic (Ctrl+I)">
        <Italic className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => insertFormat('<u>', '</u>')} title="Underline (Ctrl+U)">
        <Underline className="w-4 h-4" />
      </Button>
      <Separator orientation="vertical" className="h-6" />
      <Button variant="ghost" size="sm" onClick={() => insertBlock('h1')} title="Heading 1">
        <Heading1 className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => insertBlock('h2')} title="Heading 2">
        <Heading2 className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => insertBlock('h3')} title="Heading 3">
        <Heading3 className="w-4 h-4" />
      </Button>
      <Separator orientation="vertical" className="h-6" />
      <Button variant="ghost" size="sm" onClick={() => insertBlock('list')} title="Bullet List">
        <List className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => insertBlock('ordered-list')} title="Numbered List">
        <ListOrdered className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => insertBlock('quote')} title="Quote">
        <Quote className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => insertBlock('code')} title="Code Block">
        <Code className="w-4 h-4" />
      </Button>
      <Separator orientation="vertical" className="h-6" />
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: 'none' }}
        id="image-upload"
      />
      <Button variant="ghost" size="sm" onClick={() => document.getElementById('image-upload')?.click()} title="Upload Image">
        <Image className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => insertBlock('divider')} title="Divider">
        <Minus className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => insertBlock('callout')} title="Callout">
        <FileText className="w-4 h-4" />
      </Button>
      <Separator orientation="vertical" className="h-6" />
      <Button variant="ghost" size="sm" onClick={handleUndo} disabled={undoIndex === 0} title="Undo (Ctrl+Z)">
        <Undo2 className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={handleRedo} disabled={undoIndex === undoStack.length - 1} title="Redo (Ctrl+Shift+Z)">
        <Redo2 className="w-4 h-4" />
      </Button>
    </div>
  );

  const slashMenu = showSlashMenu && (
    <div 
      className="fixed z-50 bg-background border rounded-lg shadow-lg p-2 min-w-48"
      style={{ top: slashMenuPosition.top, left: slashMenuPosition.left }}
    >
      <div className="space-y-1">
        <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => insertBlock('h1')}>
          <Heading1 className="w-4 h-4 mr-2" /> Heading 1
        </Button>
        <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => insertBlock('h2')}>
          <Heading2 className="w-4 h-4 mr-2" /> Heading 2
        </Button>
        <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => insertBlock('h3')}>
          <Heading3 className="w-4 h-4 mr-2" /> Heading 3
        </Button>
        <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => insertBlock('list')}>
          <List className="w-4 h-4 mr-2" /> Bullet List
        </Button>
        <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => insertBlock('ordered-list')}>
          <ListOrdered className="w-4 h-4 mr-2" /> Numbered List
        </Button>
        <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => insertBlock('quote')}>
          <Quote className="w-4 h-4 mr-2" /> Quote
        </Button>
        <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => insertBlock('code')}>
          <Code className="w-4 h-4 mr-2" /> Code Block
        </Button>
        <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => insertBlock('callout')}>
          <FileText className="w-4 h-4 mr-2" /> Callout
        </Button>
      </div>
    </div>
  );

  if (isFullscreen) {
    return (
      <Dialog open={true} onOpenChange={onCancel}>
        <DialogContent className="max-w-4xl w-full h-[90vh] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Edit Essay</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col h-full space-y-4">
            <div className="space-y-2">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Essay title..."
                className="text-lg font-semibold"
              />
              <Input
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Subtitle (optional)..."
                className="text-muted-foreground"
              />
            </div>
            
            <div className="flex items-center justify-between">
              {toolbar}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPreview(!isPreview)}
                >
                  {isPreview ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                  {isPreview ? 'Edit' : 'Preview'}
                </Button>
                <span className="text-sm text-muted-foreground">
                  {saving ? 'Saving...' : lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : ''}
                </span>
              </div>
            </div>
            
            <div className="flex-1 min-h-0">
              {isPreview ? (
                <div className="h-full overflow-auto p-4 border rounded">
                  {renderPreview()}
                </div>
              ) : (
                <Textarea
                  ref={editorRef}
                  value={editorContent}
                  onChange={(e) => {
                    addToUndoStack(editorContent);
                    setEditorContent(e.target.value);
                  }}
                  placeholder="Start writing your essay... Use / for commands"
                  className="h-full resize-none font-mono"
                  onFocus={() => setShowToolbar(true)}
                />
              )}
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="text-sm text-muted-foreground">
                {editorContent.length} characters • Press Ctrl+S to save
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  <Save className="w-4 h-4 mr-1" />
                  {saving ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          </div>
          {slashMenu}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Title and subtitle editing */}
      <div className="space-y-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Essay title..."
          className="text-lg font-semibold border-none shadow-none p-0 focus-visible:ring-0"
        />
        <Input
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          placeholder="Subtitle (optional)..."
          className="text-muted-foreground border-none shadow-none p-0 focus-visible:ring-0"
        />
      </div>

      {/* Toolbar */}
      {showToolbar && toolbar}

      {/* Content editing */}
      <div className="relative">
        {isPreview ? (
          <div className="min-h-64 p-4 border rounded">
            {renderPreview()}
          </div>
        ) : (
          <Textarea
            ref={editorRef}
            value={editorContent}
            onChange={(e) => {
              addToUndoStack(editorContent);
              setEditorContent(e.target.value);
            }}
            placeholder="Start writing your essay... Use / for commands"
            className="min-h-64 font-mono"
            onFocus={() => setShowToolbar(true)}
          />
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPreview(!isPreview)}
          >
            {isPreview ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
            {isPreview ? 'Edit' : 'Preview'}
          </Button>
          <span className="text-sm text-muted-foreground">
            {saving ? 'Saving...' : lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : ''}
          </span>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-1" />
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      {slashMenu}
    </div>
  );
};