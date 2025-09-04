import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuthRole } from '@/hooks/useAuthRole';
import { useToast } from '@/hooks/use-toast';
import { createEssayAPI } from '@/pages/api/essays';
import { SECTION_TITLES, type SectionKey } from '@/constants/sections';
import { X } from 'lucide-react';

interface AddEssayModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: SectionKey;
  onEssayCreated: (essayId: string, slug: string, path: string) => Promise<void>;
}

const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

export const AddEssayModal: React.FC<AddEssayModalProps> = ({
  isOpen,
  onClose,
  section,
  onEssayCreated
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [author, setAuthor] = useState('');
  const [notes, setNotes] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useAuthRole();
  const { toast } = useToast();

  // Auto-fill author when modal opens
  useEffect(() => {
    if (isOpen && user?.email) {
      setAuthor(user.email.split('@')[0] || 'Editor');
    }
  }, [isOpen, user?.email]);

  // Generate live slug preview
  const slugPreview = title ? slugify(title) : 'untitled-essay';
  const pathPreview = `/green-transition/${section}/${slugPreview}`;

  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your essay.",
        variant: "destructive"
      });
      return;
    }

    if (!user?.email) {
      toast({
        title: "Authentication required", 
        description: "Please log in to create essays.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsCreating(true);

      // Log telemetry
      console.log('[Telemetry] add_essay_opened', {
        section,
        timestamp: new Date().toISOString()
      });

      const response = await createEssayAPI({
        section,
        title: title.trim(),
        subtitle: subtitle.trim(),
        author: author.trim(),
        notes: notes.trim(),
        created_by: user.email
      });

      if (response.success && response.id && response.slug && response.path) {
        // Log telemetry
        console.log('[Telemetry] add_essay_saved', {
          essay_id: response.id,
          section,
          timestamp: new Date().toISOString()
        });

        toast({
          title: "Essay created",
          description: "Your essay has been created successfully.",
        });

        // Close modal and reset form
        handleClose();
        
        // Callback to parent with essay details
        await onEssayCreated(response.id, response.slug, response.path);
        
      } else {
        toast({
          title: "Failed to create essay",
          description: response.error || "An unexpected error occurred.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Create essay error:', error);
      toast({
        title: "Failed to create essay", 
        description: "Network error. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setSubtitle('');
    setAuthor('');
    setNotes('');
    setIsCreating(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Add New Essay</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* Section Info */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Section: <span className="font-medium text-foreground">{SECTION_TITLES[section]}</span>
            </p>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter essay title..."
              className="text-lg"
            />
          </div>

          {/* Live Slug Preview */}
          {title && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>URL Preview:</strong> {pathPreview}
              </p>
            </div>
          )}

          {/* Subtitle */}
          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Brief description or excerpt..."
            />
          </div>

          {/* Author */}
          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Author name..."
            />
          </div>

          {/* Notes/Tags */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes or Tags</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes, references, or tags..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!title.trim() || isCreating}
            >
              {isCreating ? 'Creating...' : 'Create Essay'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};