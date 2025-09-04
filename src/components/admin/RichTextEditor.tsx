import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Bold, Italic, List, Link, Save, X } from 'lucide-react';

interface RichTextEditorProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  onSave: (content: string) => void;
  title?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  isOpen,
  onClose,
  content,
  onSave,
  title = "Edit Content"
}) => {
  const [editorContent, setEditorContent] = useState(content);
  const [isPreview, setIsPreview] = useState(false);

  const handleSave = () => {
    onSave(editorContent);
    onClose();
  };

  const insertFormat = (format: string) => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = editorContent.substring(start, end);
    
    let newText = '';
    
    switch (format) {
      case 'bold':
        newText = `<strong>${selectedText || 'bold text'}</strong>`;
        break;
      case 'italic':
        newText = `<em>${selectedText || 'italic text'}</em>`;
        break;
      case 'list':
        newText = `<ul><li>${selectedText || 'list item'}</li></ul>`;
        break;
      case 'link':
        const url = prompt('Enter URL:') || '#';
        newText = `<a href="${url}">${selectedText || 'link text'}</a>`;
        break;
      default:
        return;
    }
    
    const updatedContent = 
      editorContent.substring(0, start) + 
      newText + 
      editorContent.substring(end);
    
    setEditorContent(updatedContent);
  };

  const parseContent = (htmlContent: string) => {
    try {
      const parsed = JSON.parse(htmlContent);
      return parsed.content || htmlContent;
    } catch {
      return htmlContent;
    }
  };

  const formatContent = (content: string) => {
    return JSON.stringify({
      type: 'html',
      content: content
    });
  };

  React.useEffect(() => {
    if (isOpen) {
      setEditorContent(parseContent(content));
      setIsPreview(false);
    }
  }, [isOpen, content]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col min-h-0">
          {/* Toolbar */}
          <div className="flex items-center gap-2 p-2 border-b">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertFormat('bold')}
            >
              <Bold className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertFormat('italic')}
            >
              <Italic className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertFormat('list')}
            >
              <List className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertFormat('link')}
            >
              <Link className="w-4 h-4" />
            </Button>
            
            <div className="ml-auto">
              <Button
                variant={isPreview ? 'default' : 'outline'}
                size="sm"
                onClick={() => setIsPreview(!isPreview)}
              >
                {isPreview ? 'Edit' : 'Preview'}
              </Button>
            </div>
          </div>
          
          {/* Editor/Preview */}
          <div className="flex-1 min-h-0 p-4">
            {isPreview ? (
              <div 
                className="prose prose-sm max-w-none h-full overflow-y-auto"
                dangerouslySetInnerHTML={{ 
                  __html: DOMPurify.sanitize(editorContent, {
                    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'b', 'i', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'blockquote', 'code', 'pre', 'div', 'span'],
                    ALLOWED_ATTR: ['href', 'title', 'target', 'rel', 'class'],
                    ALLOW_DATA_ATTR: false,
                    FORCE_BODY: true,
                    ADD_ATTR: ['target'],
                    ADD_TAGS: ['iframe'],
                    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover']
                  })
                }}
              />
            ) : (
              <Textarea
                value={editorContent}
                onChange={(e) => setEditorContent(e.target.value)}
                className="w-full h-full resize-none font-mono text-sm"
                placeholder="Enter your content here. You can use HTML tags like <strong>, <em>, <ul>, <li>, <a>, etc."
              />
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};