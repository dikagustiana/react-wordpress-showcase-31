import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { History, RotateCcw, Eye, Calendar } from 'lucide-react';
import { useGreenEssays, type EssayVersion } from '@/hooks/useGreenEssays';
import { useAuthRole } from '@/hooks/useAuthRole';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface EssayVersionHistoryProps {
  essayId: string;
  currentVersion: number;
  onRestore?: (version: EssayVersion) => void;
  className?: string;
}

export const EssayVersionHistory: React.FC<EssayVersionHistoryProps> = ({
  essayId,
  currentVersion,
  onRestore,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [versions, setVersions] = useState<EssayVersion[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<EssayVersion | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  const { isAdmin } = useAuthRole();
  const { getEssayVersions, updateEssay } = useGreenEssays();
  const { toast } = useToast();

  const fetchVersions = async () => {
    setLoading(true);
    try {
      const versionData = await getEssayVersions(essayId);
      setVersions(versionData);
      console.log('[Version History] Loaded versions for essay:', essayId, 'Count:', versionData.length);
    } catch (error) {
      console.error('Error fetching versions:', error);
      toast({
        title: "Failed to load versions",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (version: EssayVersion) => {
    if (!isAdmin) return;

    try {
      const success = await updateEssay(essayId, {
        title: version.title,
        subtitle: version.subtitle,
        content_html: version.content_html,
        content_json: version.content_json
      });

      if (success) {
        toast({
          title: "Version restored",
          description: `Successfully restored to version ${version.version}`
        });
        onRestore?.(version);
        setIsOpen(false);
        console.log('[Version History] Restored version:', version.version, 'for essay:', essayId);
      }
    } catch (error) {
      console.error('Error restoring version:', error);
      toast({
        title: "Failed to restore version",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    }
  };

  const handleOpenHistory = () => {
    setIsOpen(true);
    fetchVersions();
  };

  const renderPreview = (content: string) => {
    // Simple markdown-to-HTML conversion for preview
    let html = content
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
      .replace(/\n/gim, '<br>');

    return <div dangerouslySetInnerHTML={{ __html: html }} className="prose prose-sm max-w-none" />;
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleOpenHistory}
        className={cn("gap-2", className)}
      >
        <History className="w-4 h-4" />
        History
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl w-full h-[80vh] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Version History</DialogTitle>
          </DialogHeader>
          
          <div className="flex h-full gap-4">
            {/* Version List */}
            <div className="w-1/3 border-r">
              <ScrollArea className="h-full pr-4">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-sm text-muted-foreground">Loading versions...</div>
                  </div>
                ) : versions.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-sm text-muted-foreground">No versions found</div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {versions.map((version) => (
                      <div
                        key={version.id}
                        className={cn(
                          "p-3 rounded-lg border cursor-pointer transition-colors",
                          selectedVersion?.id === version.id
                            ? "bg-primary/10 border-primary"
                            : "hover:bg-muted/50"
                        )}
                        onClick={() => setSelectedVersion(version)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant={version.version === currentVersion ? "default" : "outline"}>
                            v{version.version}
                          </Badge>
                          {version.version === currentVersion && (
                            <Badge variant="secondary">Current</Badge>
                          )}
                        </div>
                        
                        <div className="space-y-1">
                          <div className="font-medium text-sm truncate">{version.title}</div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {new Date(version.created_at).toLocaleDateString()}
                          </div>
                          {version.created_by && (
                            <div className="text-xs text-muted-foreground">
                              by {version.created_by.split('@')[0]}
                            </div>
                          )}
                          {version.version_note && (
                            <div className="text-xs italic text-muted-foreground">
                              "{version.version_note}"
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Version Preview */}
            <div className="flex-1 flex flex-col">
              {selectedVersion ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">{selectedVersion.title}</h3>
                      {selectedVersion.subtitle && (
                        <p className="text-sm text-muted-foreground">{selectedVersion.subtitle}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPreview(!showPreview)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        {showPreview ? 'Raw' : 'Preview'}
                      </Button>
                      {selectedVersion.version !== currentVersion && (
                        <Button
                          size="sm"
                          onClick={() => handleRestore(selectedVersion)}
                        >
                          <RotateCcw className="w-4 h-4 mr-1" />
                          Restore
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <Separator className="mb-4" />
                  
                  <ScrollArea className="flex-1">
                    {showPreview ? (
                      <div className="p-4">
                        {renderPreview(selectedVersion.content_html || '')}
                      </div>
                    ) : (
                      <pre className="p-4 text-sm font-mono whitespace-pre-wrap">
                        {selectedVersion.content_html || 'No content'}
                      </pre>
                    )}
                  </ScrollArea>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-muted-foreground">
                    <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Select a version to view its content</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};