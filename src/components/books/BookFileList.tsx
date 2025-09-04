import React, { useState, useEffect, useCallback } from 'react';
import { Download, Trash2, Search, Eye, EyeOff, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useRole } from '@/contexts/RoleContext';

interface BookFile {
  id: string;
  filename: string;
  filepath: string;
  size_bytes: number;
  uploaded_at: string;
  uploaded_by: string;
  deleted_at: string | null;
}

interface BookFileListProps {
  category: string;
  refreshTrigger?: number;
}

export const BookFileList: React.FC<BookFileListProps> = ({ 
  category, 
  refreshTrigger = 0 
}) => {
  const [files, setFiles] = useState<BookFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [retryDeleteFile, setRetryDeleteFile] = useState<string | null>(null);
  const { toast } = useToast();
  const { isAdmin } = useRole();

  const itemsPerPage = 20;

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('books_uploads')
        .select('*')
        .eq('category', category)
        .order('uploaded_at', { ascending: false });

      if (!showDeleted || !isAdmin) {
        query = query.is('deleted_at', null);
      }

      if (searchTerm.trim()) {
        query = query.ilike('filename', `%${searchTerm.trim()}%`);
      }

      const { data, error, count } = await query
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);

      if (error) throw error;

      setFiles(data || []);
      setTotalPages(Math.ceil((count || 0) / itemsPerPage));
    } catch (error) {
      console.error('Error fetching files:', error);
      toast({
        title: "Error loading files",
        description: error instanceof Error ? error.message : "Failed to load files",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [category, searchTerm, showDeleted, currentPage, isAdmin, toast]);

  useEffect(() => {
    const timeoutId = setTimeout(fetchFiles, 300);
    return () => clearTimeout(timeoutId);
  }, [fetchFiles]);

  useEffect(() => {
    fetchFiles();
  }, [refreshTrigger]);

  const handleDownload = async (filepath: string, filename: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('books')
        .createSignedUrl(filepath, 600); // 10 minutes

      if (error) throw error;

      if (data?.signedUrl) {
        const link = document.createElement('a');
        link.href = data.signedUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: error instanceof Error ? error.message : "Failed to download file",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (file: BookFile) => {
    try {
      // Step 1: Soft delete in database
      const { error: dbError } = await supabase
        .from('books_uploads')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', file.id);

      if (dbError) throw dbError;

      // Step 2: Delete from storage
      const { error: storageError } = await supabase.storage
        .from('books')
        .remove([file.filepath]);

      if (storageError) {
        console.error('Storage deletion failed:', storageError);
        setRetryDeleteFile(file.id);
        toast({
          title: "Partial deletion",
          description: "File removed from list but still exists in storage. Use retry button to complete deletion.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "File deleted",
          description: `${file.filename} has been deleted successfully.`,
        });
      }

      fetchFiles();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Failed to delete file",
        variant: "destructive",
      });
    }
  };

  const handleRetryDelete = async (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    try {
      const { error } = await supabase.storage
        .from('books')
        .remove([file.filepath]);

      if (error) throw error;

      setRetryDeleteFile(null);
      toast({
        title: "Deletion completed",
        description: "File has been completely removed from storage.",
      });
    } catch (error) {
      console.error('Retry delete error:', error);
      toast({
        title: "Retry failed",
        description: error instanceof Error ? error.message : "Failed to complete deletion",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-4 items-center">
          <Skeleton className="h-10 flex-1" />
          {isAdmin && <Skeleton className="h-10 w-32" />}
        </div>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Controls */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>
        {isAdmin && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDeleted(!showDeleted)}
          >
            {showDeleted ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showDeleted ? 'Hide Deleted' : 'Show Deleted'}
          </Button>
        )}
      </div>

      {/* Retry Banner */}
      {retryDeleteFile && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-center justify-between">
          <p className="text-sm text-destructive">
            File deletion incomplete. Click retry to remove from storage.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleRetryDelete(retryDeleteFile)}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      )}

      {/* Files Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Uploaded At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  {searchTerm ? 'No files found matching your search.' : 'No files uploaded yet.'}
                </TableCell>
              </TableRow>
            ) : (
              files.map((file) => (
                <TableRow key={file.id}>
                  <TableCell>
                    <button
                      onClick={() => handleDownload(file.filepath, file.filename)}
                      className="text-left hover:text-primary transition-colors"
                    >
                      {file.filename}
                    </button>
                  </TableCell>
                  <TableCell>{formatFileSize(file.size_bytes)}</TableCell>
                  <TableCell>{formatDate(file.uploaded_at)}</TableCell>
                  <TableCell>
                    {file.deleted_at ? (
                      <Badge variant="destructive">Deleted</Badge>
                    ) : (
                      <Badge variant="default">Active</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(file.filepath, file.filename)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      {isAdmin && !file.deleted_at && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete File</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{file.filename}" from the {category} category? 
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(file)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};