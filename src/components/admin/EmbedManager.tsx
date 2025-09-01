import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useContent } from '@/hooks/useContent';
import { Upload, Link, FileText, Save, X, Plus, Trash2 } from 'lucide-react';
import { useAuthRole } from '@/hooks/useAuthRole';

interface EmbedManagerProps {
  pageSlug: string;
}

export const EmbedManager: React.FC<EmbedManagerProps> = ({ pageSlug }) => {
  const { isAdmin } = useAuthRole();
  const { embeds, uploadFile, createEmbed, deleteEmbed } = useContent(pageSlug);
  const [isOpen, setIsOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [embedData, setEmbedData] = useState({
    title: '',
    type: 'file' as 'file' | 'iframe' | 'link',
    src: '',
    width: 1200,
    height: 600,
    scrollable: true,
  });

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadFile(file);
      if (url) {
        setEmbedData(prev => ({
          ...prev,
          src: url,
          title: prev.title || file.name
        }));
      }
    } finally {
      setUploading(false);
    }
  };

  const handleCreateEmbed = async () => {
    if (!embedData.src) return;
    
    const { page_id, ...embedDataWithoutPageId } = embedData as any;
    await createEmbed(embedDataWithoutPageId);
    setIsOpen(false);
    setEmbedData({
      title: '',
      type: 'file',
      src: '',
      width: 1200,
      height: 600,
      scrollable: true,
    });
  };

  const renderEmbed = (embed: any) => {
    const containerStyle = {
      width: `${embed.width}px`,
      height: `${embed.height}px`,
      maxWidth: '100%',
    };

    if (embed.type === 'iframe') {
      return (
        <iframe
          src={embed.src}
          style={containerStyle}
          className={`border rounded-lg ${embed.scrollable ? 'overflow-auto' : 'overflow-hidden'}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={embed.title || 'Embedded content'}
        />
      );
    }

    if (embed.type === 'file') {
      const extension = embed.src.split('.').pop()?.toLowerCase();
      
      if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
        return (
          <div style={containerStyle} className="border rounded-lg overflow-hidden">
            <img
              src={embed.src}
              alt={embed.title}
              className="w-full h-full object-contain"
            />
          </div>
        );
      }

      if (extension === 'pdf') {
        return (
          <iframe
            src={embed.src}
            style={containerStyle}
            className="border rounded-lg"
            title={embed.title || 'PDF Document'}
          />
        );
      }

      // For Excel/CSV files or other files, show a viewer container
      return (
        <div style={containerStyle} className="border rounded-lg p-4 bg-muted/30">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">{embed.title}</h3>
              <a
                href={embed.src}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Open in new tab
              </a>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  if (!isAdmin) {
    return (
      <div className="space-y-4">
        {embeds.map(embed => (
          <div key={embed.id} className="bg-card rounded-lg p-6 border">
            {embed.title && (
              <h3 className="text-lg font-medium mb-4">{embed.title}</h3>
            )}
            {renderEmbed(embed)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="group space-y-4">
      {/* Add Embed Button */}
      <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Embed
        </Button>
      </div>

      {/* Existing Embeds */}
      {embeds.map(embed => (
        <div key={embed.id} className="bg-card rounded-lg p-6 border relative group/embed">
          <div className="absolute top-4 right-4 opacity-0 group-hover/embed:opacity-100 transition-opacity">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteEmbed(embed.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          
          {embed.title && (
            <h3 className="text-lg font-medium mb-4">{embed.title}</h3>
          )}
          
          {renderEmbed(embed)}
        </div>
      ))}

      {/* Add Embed Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Embed</DialogTitle>
          </DialogHeader>

          <Tabs value={embedData.type} onValueChange={(value) => setEmbedData(prev => ({ ...prev, type: value as any }))}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="file">
                <Upload className="w-4 h-4 mr-2" />
                Upload File
              </TabsTrigger>
              <TabsTrigger value="iframe">
                <Link className="w-4 h-4 mr-2" />
                Iframe/URL
              </TabsTrigger>
              <TabsTrigger value="link">
                <FileText className="w-4 h-4 mr-2" />
                Link
              </TabsTrigger>
            </TabsList>

            <TabsContent value="file" className="space-y-4">
              <div>
                <Label>Upload File</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv,.pdf,.png,.jpg,.jpeg,.gif,.webp,.mp4,.mov"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                  className="hidden"
                />
                <div className="mt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : 'Choose File'}
                  </Button>
                </div>
                {embedData.src && (
                  <p className="text-sm text-muted-foreground mt-2">
                    File uploaded successfully
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="iframe" className="space-y-4">
              <div>
                <Label htmlFor="iframe-url">Iframe URL</Label>
                <Input
                  id="iframe-url"
                  value={embedData.src}
                  onChange={(e) => setEmbedData(prev => ({ ...prev, src: e.target.value }))}
                  placeholder="https://example.com/embed"
                />
              </div>
            </TabsContent>

            <TabsContent value="link" className="space-y-4">
              <div>
                <Label htmlFor="link-url">Link URL</Label>
                <Input
                  id="link-url"
                  value={embedData.src}
                  onChange={(e) => setEmbedData(prev => ({ ...prev, src: e.target.value }))}
                  placeholder="https://example.com/document"
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* Common Options */}
          <div className="space-y-4 pt-4 border-t">
            <div>
              <Label htmlFor="embed-title">Title (optional)</Label>
              <Input
                id="embed-title"
                value={embedData.title}
                onChange={(e) => setEmbedData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter a title for this embed"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="embed-width">Width (px)</Label>
                <Input
                  id="embed-width"
                  type="number"
                  value={embedData.width}
                  onChange={(e) => setEmbedData(prev => ({ ...prev, width: parseInt(e.target.value) || 1200 }))}
                />
              </div>
              <div>
                <Label htmlFor="embed-height">Height (px)</Label>
                <Input
                  id="embed-height"
                  type="number"
                  value={embedData.height}
                  onChange={(e) => setEmbedData(prev => ({ ...prev, height: parseInt(e.target.value) || 600 }))}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="scrollable"
                checked={embedData.scrollable}
                onCheckedChange={(checked) => setEmbedData(prev => ({ ...prev, scrollable: checked }))}
              />
              <Label htmlFor="scrollable">Enable scrolling</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleCreateEmbed} disabled={!embedData.src}>
              <Save className="w-4 h-4 mr-2" />
              Create Embed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
