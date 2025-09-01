import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, Eye, RotateCcw, Clock, User, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Revision {
  id: string;
  page_id: string;
  section_id?: string;
  content: any;
  created_at: string;
  editor_id: string;
  editor_email?: string;
}

interface RevisionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  pageId: string;
  sectionId?: string;
  onRevert: (content: any) => void;
}

export const RevisionHistory: React.FC<RevisionHistoryProps> = ({
  isOpen,
  onClose,
  pageId,
  sectionId,
  onRevert
}) => {
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRevision, setSelectedRevision] = useState<Revision | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchRevisions();
    }
  }, [isOpen, pageId, sectionId]);

  const fetchRevisions = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('fsli_revisions')
        .select(`
          id,
          page_id,
          section_id,
          content,
          created_at,
          editor_id
        `)
        .eq('page_id', pageId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (sectionId) {
        query = query.eq('section_id', sectionId);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Fetch editor emails from profiles table
      const editorIds = [...new Set(data?.map(r => r.editor_id) || [])];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, email')
        .in('id', editorIds);
      
      const revisionsWithEmails = data?.map(revision => ({
        ...revision,
        editor_email: profiles?.find(p => p.id === revision.editor_id)?.email || 'Unknown'
      })) || [];

      setRevisions(revisionsWithEmails);
    } catch (error) {
      console.error('Error fetching revisions:', error);
      toast({
        title: "Error",
        description: "Failed to load revision history.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRevert = async (revision: Revision) => {
    try {
      // Create new revision with reverted content
      const { error } = await supabase.from('fsli_revisions').insert({
        page_id: pageId,
        section_id: sectionId,
        content: revision.content,
        editor_id: (await supabase.auth.getUser()).data.user!.id
      });

      if (error) throw error;

      onRevert(revision.content);
      onClose();
      
      toast({
        title: "Reverted successfully",
        description: `Content reverted to version from ${format(new Date(revision.created_at), 'MMM dd, yyyy HH:mm')}`,
      });
    } catch (error) {
      console.error('Error reverting revision:', error);
      toast({
        title: "Error",
        description: "Failed to revert to this version.",
        variant: "destructive"
      });
    }
  };

  const getContentPreview = (content: any) => {
    try {
      if (typeof content === 'string') return content.slice(0, 200) + '...';
      if (content.content) return content.content.slice(0, 200) + '...';
      return JSON.stringify(content).slice(0, 200) + '...';
    } catch {
      return 'Invalid content format';
    }
  };

  const renderContent = (content: any) => {
    try {
      if (typeof content === 'string') {
        return <div dangerouslySetInnerHTML={{ __html: content }} />;
      }
      if (content.content) {
        return <div dangerouslySetInnerHTML={{ __html: content.content }} />;
      }
      return <pre className="whitespace-pre-wrap">{JSON.stringify(content, null, 2)}</pre>;
    } catch {
      return <p className="text-muted-foreground">Invalid content format</p>;
    }
  };

  return (
    <>
      <Dialog open={isOpen && !showPreview} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Revision History
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : revisions.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                <div className="text-center">
                  <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No revision history found</p>
                </div>
              </div>
            ) : (
              <ScrollArea className="h-[60vh]">
                <div className="space-y-4">
                  {revisions.map((revision, index) => (
                    <div
                      key={revision.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Badge variant={index === 0 ? "default" : "secondary"}>
                            {index === 0 ? "Current" : `Version ${revisions.length - index}`}
                          </Badge>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(revision.created_at), 'MMM dd, yyyy')}
                            <Clock className="w-4 h-4 ml-2" />
                            {format(new Date(revision.created_at), 'HH:mm')}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <User className="w-4 h-4" />
                            {revision.editor_email}
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-muted/30 rounded p-3 mb-3">
                        <p className="text-sm text-muted-foreground mb-1">Content preview:</p>
                        <p className="text-sm line-clamp-3">{getContentPreview(revision.content)}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedRevision(revision);
                            setShowPreview(true);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Preview
                        </Button>
                        
                        {index > 0 && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleRevert(revision)}
                          >
                            <RotateCcw className="w-4 h-4 mr-1" />
                            Revert to this version
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={() => setShowPreview(false)}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              Preview - {selectedRevision && format(new Date(selectedRevision.created_at), 'MMM dd, yyyy HH:mm')}
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="flex-1 max-h-[60vh]">
            <div className="prose prose-sm max-w-none p-4">
              {selectedRevision && renderContent(selectedRevision.content)}
            </div>
          </ScrollArea>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Back to History
            </Button>
            {selectedRevision && (
              <Button onClick={() => handleRevert(selectedRevision)}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Revert to this version
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};