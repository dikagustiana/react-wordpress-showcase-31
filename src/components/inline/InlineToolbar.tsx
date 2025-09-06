import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Bold, 
  Italic, 
  Link, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Image,
  FileSpreadsheet,
  Type,
  Save
} from 'lucide-react';

interface InlineToolbarProps {
  onFormat: (command: string, value?: string) => void;
  onSave: () => void;
  onImageInsert: (file: File) => void;
  onExcelInsert: (type: 'live' | 'static', data: any) => void;
  saving?: boolean;
}

export const InlineToolbar: React.FC<InlineToolbarProps> = ({
  onFormat,
  onSave,
  onImageInsert,
  onExcelInsert,
  saving = false
}) => {
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showExcelDialog, setShowExcelDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [excelUrl, setExcelUrl] = useState('');
  const [excelTitle, setExcelTitle] = useState('');

  const handleFormat = (command: string, value?: string) => {
    onFormat(command, value);
  };

  const handleLinkInsert = () => {
    if (linkUrl) {
      const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText || linkUrl}</a>`;
      onFormat('insertHTML', linkHtml);
      setLinkUrl('');
      setLinkText('');
      setShowLinkDialog(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      if (!['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'].includes(file.type)) {
        alert('Only PNG, JPG, WebP, and SVG files are allowed');
        return;
      }
      onImageInsert(file);
    }
  };

  const handleExcelInsert = (type: 'live' | 'static') => {
    if (type === 'live' && excelUrl) {
      onExcelInsert('live', {
        embed_url: excelUrl,
        provider: 'excel_online',
        meta: { title: excelTitle }
      });
    }
    setExcelUrl('');
    setExcelTitle('');
    setShowExcelDialog(false);
  };

  return (
    <>
      <div className="inline-flex items-center gap-1 p-2 bg-background border border-border rounded-lg shadow-lg">
        {/* Text Formatting */}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => handleFormat('bold')}
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </Button>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={() => handleFormat('italic')}
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Headers */}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => handleFormat('formatBlock', 'h1')}
          title="Heading 1"
        >
          <Type className="h-4 w-4" />
          <span className="text-xs ml-1">H1</span>
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={() => handleFormat('formatBlock', 'h2')}
          title="Heading 2"
        >
          <Type className="h-4 w-4" />
          <span className="text-xs ml-1">H2</span>
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={() => handleFormat('formatBlock', 'h3')}
          title="Heading 3"
        >
          <Type className="h-4 w-4" />
          <span className="text-xs ml-1">H3</span>
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Lists */}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => handleFormat('insertUnorderedList')}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={() => handleFormat('insertOrderedList')}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Other Formatting */}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => handleFormat('formatBlock', 'blockquote')}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={() => handleFormat('formatBlock', 'code')}
          title="Inline Code"
        >
          <Code className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Media */}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowLinkDialog(true)}
          title="Insert Link"
        >
          <Link className="h-4 w-4" />
        </Button>

        <Button
          size="sm"
          variant="ghost"
          title="Insert Image"
          onClick={() => document.getElementById('image-upload')?.click()}
        >
          <Image className="h-4 w-4" />
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowExcelDialog(true)}
          title="Insert Excel"
        >
          <FileSpreadsheet className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Save */}
        <Button
          size="sm"
          variant="default"
          onClick={onSave}
          disabled={saving}
          title="Save (Ctrl+S)"
        >
          <Save className="h-4 w-4" />
          {saving && <span className="ml-1 text-xs">Saving...</span>}
        </Button>

        {/* Hidden file input */}
        <input
          id="image-upload"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          style={{ display: 'none' }}
          onChange={handleImageUpload}
        />
      </div>

      {/* Link Dialog */}
      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">URL</label>
              <Input
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Text (optional)</label>
              <Input
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="Link text"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowLinkDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleLinkInsert}>Insert</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Excel Dialog */}
      <Dialog open={showExcelDialog} onOpenChange={setShowExcelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Excel</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={excelTitle}
                onChange={(e) => setExcelTitle(e.target.value)}
                placeholder="Excel title"
              />
            </div>
            <div>
              <label className="text-sm font-medium">OneDrive/Excel Online URL</label>
              <Input
                value={excelUrl}
                onChange={(e) => setExcelUrl(e.target.value)}
                placeholder="https://onedrive.live.com/..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowExcelDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => handleExcelInsert('live')}>
                Insert Live Excel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
