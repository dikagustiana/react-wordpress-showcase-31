import React, { useState, useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { PublishButton } from '@/components/admin/PublishButton';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Code, 
  Link2, 
  Image as ImageIcon, 
  Quote, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Heading3,
  Table as TableIcon,
  Minus,
  Save,
  Eye,
  Edit3,
  Upload,
  Undo,
  Redo
} from 'lucide-react';
import { GreenEssay } from '@/hooks/useGreenEssays';

interface GreenTransitionInlineEditorProps {
  essay: GreenEssay;
  isEditing: boolean;
  onToggleEdit: () => void;
  onSave: (updates: Partial<GreenEssay>) => Promise<boolean>;
  onPublish?: (id: string) => Promise<boolean>;
  onUnpublish?: (id: string) => Promise<boolean>;
  autoSave?: boolean;
}

export const GreenTransitionInlineEditor: React.FC<GreenTransitionInlineEditorProps> = ({
  essay,
  isEditing,
  onToggleEdit,
  onSave,
  onPublish,
  onUnpublish,
  autoSave = true
}) => {
  const [title, setTitle] = useState(essay.title);
  const [subtitle, setSubtitle] = useState(essay.subtitle || '');
  const [authorName, setAuthorName] = useState(essay.author_name);
  const [coverImageUrl, setCoverImageUrl] = useState(essay.cover_image_url || '');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const { toast } = useToast();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary hover:text-primary/80 underline',
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: essay.content_json || essay.content_html || '<p>Start writing your essay...</p>',
    editable: isEditing,
    onUpdate: ({ editor }) => {
      setIsDirty(true);
      console.log('[Editor] Content updated, setting dirty=true');
    },
  });

  const handleSave = useCallback(async () => {
    if (!editor) return;

    try {
      setIsSaving(true);
      
      console.log('[Telemetry] edit_saved', { 
        essayId: essay.id, 
        timestamp: new Date().toISOString() 
      });
      
      const contentHtml = editor.getHTML();
      const contentJson = editor.getJSON();
      console.log('[Editor] Saving content:', { 
        htmlLength: contentHtml.length,
        hasJson: !!contentJson 
      });
      
      const updates: Partial<GreenEssay> = {
        title,
        subtitle,
        author_name: authorName,
        cover_image_url: coverImageUrl,
        content_html: contentHtml,
        content_json: contentJson,
      };

      const success = await onSave(updates);
      
      if (success) {
        setLastSaved(new Date());
        setIsDirty(false);
        toast({
          title: "Essay saved",
          description: `Saved at ${new Date().toLocaleTimeString()}`,
        });
      }
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Save failed",
        description: "Failed to save essay. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  }, [editor, title, subtitle, authorName, coverImageUrl, onSave, toast, essay.id]);

  // Update editor content when essay changes
  useEffect(() => {
    if (editor && essay) {
      const content = essay.content_json || essay.content_html || '<p>Start writing your essay...</p>';
      console.log('[Editor] Setting content:', { 
        hasContentJson: !!essay.content_json, 
        hasContentHtml: !!essay.content_html,
        content: typeof content === 'string' ? content.substring(0, 100) + '...' : content
      });
      editor.commands.setContent(content);
    }
  }, [editor, essay.content_json, essay.content_html, essay.id]);

  // Update editor editability when isEditing changes
  useEffect(() => {
    if (editor) {
      console.log('[Editor] Setting editable:', isEditing);
      editor.setEditable(isEditing);
    }
  }, [isEditing, editor]);

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && isDirty && isEditing && !isSaving && editor) {
      console.log('[Editor] Auto-save triggered');
      const timeoutId = setTimeout(() => {
        handleSave();
      }, 5000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [isDirty, isEditing, isSaving, autoSave, editor, handleSave]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditing && (e.ctrlKey || e.metaKey)) {
        switch (e.key.toLowerCase()) {
          case 's':
            e.preventDefault();
            handleSave();
            break;
          case 'b':
            e.preventDefault();
            editor?.chain().focus().toggleBold().run();
            break;
          case 'i':
            e.preventDefault();
            editor?.chain().focus().toggleItalic().run();
            break;
          case 'u':
            e.preventDefault();
            editor?.chain().focus().toggleUnderline().run();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isEditing, editor, handleSave]);

  const addImage = () => {
    const url = window.prompt('Enter image URL');
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    const previousUrl = editor?.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const addTable = () => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Edit/Preview Toggle & Status */}
      <div className="flex items-center justify-between mb-6 p-4 bg-card rounded-lg border">
        <div className="flex items-center space-x-4">
          <Button 
            variant={isEditing ? "default" : "outline"}
            size="sm"
            onClick={() => {
              // Log telemetry event when edit is opened
              if (!isEditing) {
                console.log('[Telemetry] edit_opened', { 
                  essayId: essay.id, 
                  timestamp: new Date().toISOString() 
                });
              }
              onToggleEdit();
            }}
          >
            {isEditing ? (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4 mr-2" />
                Edit
              </>
            )}
          </Button>
          
          <Badge variant={essay.status === 'published' ? 'default' : 'secondary'}>
            {essay.status}
          </Badge>
        </div>
        
        <div className="flex items-center space-x-4">
          {onPublish && onUnpublish && (
            <PublishButton
              essayId={essay.id}
              currentStatus={essay.status}
              onPublish={onPublish}
              onUnpublish={onUnpublish}
            />
          )}
          
          {isEditing && (
            <>
              {isSaving && (
                <span className="text-sm text-muted-foreground">Saving...</span>
              )}
              {lastSaved && !isDirty && (
                <span className="text-sm text-green-600">
                  Saved {lastSaved.toLocaleTimeString()}
                </span>
              )}
              {isDirty && (
                <span className="text-sm text-yellow-600">Unsaved changes</span>
              )}
              <Button 
                size="sm" 
                onClick={handleSave}
                disabled={isSaving || !isDirty}
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Cover Image */}
      {(coverImageUrl || isEditing) && (
        <div className="mb-6">
          {isEditing ? (
            <div className="space-y-2">
              <label className="text-sm font-medium">Cover Image URL</label>
              <Input
                value={coverImageUrl}
                onChange={(e) => {
                  setCoverImageUrl(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="Enter cover image URL"
              />
            </div>
          ) : coverImageUrl ? (
            <img 
              src={coverImageUrl} 
              alt={title}
              className="w-full h-80 object-cover rounded-lg"
            />
          ) : null}
        </div>
      )}

      {/* Title */}
      <div className="mb-4">
        {isEditing ? (
          <Input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setIsDirty(true);
            }}
            className="text-4xl font-bold border-0 px-0 shadow-none focus-visible:ring-0"
            placeholder="Essay title..."
          />
        ) : (
          <h1 className="text-4xl font-bold text-primary">{title}</h1>
        )}
      </div>

      {/* Subtitle */}
      <div className="mb-6">
        {isEditing ? (
          <Textarea
            value={subtitle}
            onChange={(e) => {
              setSubtitle(e.target.value);
              setIsDirty(true);
            }}
            className="text-xl text-muted-foreground border-0 px-0 shadow-none focus-visible:ring-0 resize-none"
            placeholder="Essay subtitle or excerpt..."
            rows={2}
          />
        ) : subtitle ? (
          <p className="text-xl text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>

      {/* Author */}
      <div className="mb-6">
        {isEditing ? (
          <div className="space-y-2">
            <label className="text-sm font-medium">Author</label>
            <Input
              value={authorName}
              onChange={(e) => {
                setAuthorName(e.target.value);
                setIsDirty(true);
              }}
              placeholder="Author name"
            />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">By {authorName}</p>
        )}
      </div>

      {/* Rich Text Toolbar (only in edit mode) */}
      {isEditing && (
        <div className="mb-4 p-3 bg-card rounded-lg border sticky top-0 z-10">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Text formatting */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive('bold') ? 'bg-accent' : ''}
              >
                <Bold className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive('italic') ? 'bg-accent' : ''}
              >
                <Italic className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={editor.isActive('strike') ? 'bg-accent' : ''}
              >
                <Strikethrough className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleCode().run()}
                className={editor.isActive('code') ? 'bg-accent' : ''}
              >
                <Code className="w-4 h-4" />
              </Button>
            </div>

            <div className="w-px h-6 bg-border" />

            {/* Headings */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={editor.isActive('heading', { level: 1 }) ? 'bg-accent' : ''}
              >
                <Heading1 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={editor.isActive('heading', { level: 2 }) ? 'bg-accent' : ''}
              >
                <Heading2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={editor.isActive('heading', { level: 3 }) ? 'bg-accent' : ''}
              >
                <Heading3 className="w-4 h-4" />
              </Button>
            </div>

            <div className="w-px h-6 bg-border" />

            {/* Lists & Blocks */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive('bulletList') ? 'bg-accent' : ''}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={editor.isActive('orderedList') ? 'bg-accent' : ''}
              >
                <ListOrdered className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={editor.isActive('blockquote') ? 'bg-accent' : ''}
              >
                <Quote className="w-4 h-4" />
              </Button>
            </div>

            <div className="w-px h-6 bg-border" />

            {/* Media & Links */}
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={addLink}>
                <Link2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={addImage}>
                <ImageIcon className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={addTable}>
                <TableIcon className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
              >
                <Minus className="w-4 h-4" />
              </Button>
            </div>

            <div className="w-px h-6 bg-border" />

            {/* Undo/Redo */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
              >
                <Undo className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
              >
                <Redo className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Editor Content */}
      <div 
        className={`prose prose-lg max-w-none ${
          isEditing 
            ? 'min-h-[500px] border rounded-lg p-6 focus-within:border-primary' 
            : ''
        }`}
      >
        <EditorContent editor={editor} />
      </div>

      {/* Shortcuts Help (only in edit mode) */}
      {isEditing && (
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="text-sm font-medium mb-2">Keyboard Shortcuts</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-muted-foreground">
            <div><kbd className="px-1.5 py-0.5 bg-background rounded">Ctrl+S</kbd> Save</div>
            <div><kbd className="px-1.5 py-0.5 bg-background rounded">Ctrl+B</kbd> Bold</div>
            <div><kbd className="px-1.5 py-0.5 bg-background rounded">Ctrl+I</kbd> Italic</div>
            <div><kbd className="px-1.5 py-0.5 bg-background rounded">/</kbd> Slash menu</div>
          </div>
        </div>
      )}
    </div>
  );
};