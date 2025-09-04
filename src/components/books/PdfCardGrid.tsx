import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FileText, Download, ExternalLink, Copy, MoreVertical, Trash2, Replace, Search, Upload } from 'lucide-react';
import { format, isAfter, subDays } from 'date-fns';
import { useRole } from '@/contexts/RoleContext';
import { useToast } from '@/hooks/use-toast';
import type { BookUpload } from '@/hooks/useBookUploads';
import type { BookUploadExtended } from '@/types/books';
import { BookCover } from './BookCover';

interface PdfCardGridProps {
  uploads: BookUploadExtended[];
  loading: boolean;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  showDeleted: boolean;
  onShowDeletedChange: (show: boolean) => void;
  onDownload: (upload: BookUploadExtended) => void;
  onDelete: (upload: BookUploadExtended) => void;
  onReplaceCover?: (upload: BookUploadExtended) => void;
  currentPage: number;
  totalCount: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

interface SortOption {
  value: string;
  label: string;
}

const sortOptions: SortOption[] = [
  { value: 'uploaded_at_desc', label: 'Newest First' },
  { value: 'uploaded_at_asc', label: 'Oldest First' },
  { value: 'filename_asc', label: 'Title A-Z' },
  { value: 'size_bytes_desc', label: 'Largest First' },
];

export const PdfCardGrid: React.FC<PdfCardGridProps> = ({
  uploads,
  loading,
  searchTerm,
  onSearchChange,
  showDeleted,
  onShowDeletedChange,
  onDownload,
  onDelete,
  onReplaceCover,
  currentPage,
  totalCount,
  itemsPerPage,
  onPageChange,
}) => {
  const { isAdmin } = useRole();
  const { toast } = useToast();
  const [sortBy, setSortBy] = useState('uploaded_at_desc');
  const [deleteTarget, setDeleteTarget] = useState<BookUploadExtended | null>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const isNewFile = (uploadedAt: string) => {
    return isAfter(new Date(uploadedAt), subDays(new Date(), 7));
  };

  const sortedUploads = useMemo(() => {
    const sorted = [...uploads];
    const [field, direction] = sortBy.split('_');
    const isAsc = direction === 'asc';

    sorted.sort((a, b) => {
      let aVal: any, bVal: any;
      
      switch (field) {
        case 'filename':
          aVal = a.filename.toLowerCase();
          bVal = b.filename.toLowerCase();
          break;
        case 'uploaded':
          aVal = new Date(a.uploaded_at);
          bVal = new Date(b.uploaded_at);
          break;
        case 'size':
          aVal = a.size_bytes;
          bVal = b.size_bytes;
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return isAsc ? -1 : 1;
      if (aVal > bVal) return isAsc ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [uploads, sortBy]);

  const handleOpen = (upload: BookUploadExtended) => {
    // Navigate to reader page instead of downloading
    window.open(`/books/${upload.category}/${upload.id}/read`, '_blank');
  };

  const handleCopyLink = async (upload: BookUploadExtended) => {
    try {
      // Create a simple link - in real implementation, this would be a proper share URL
      const link = `${window.location.origin}/books/file/${upload.id}`;
      await navigator.clipboard.writeText(link);
      toast({
        title: 'Link Copied',
        description: 'File link copied to clipboard',
      });
    } catch {
      toast({
        title: 'Copy Failed',
        description: 'Failed to copy link to clipboard',
        variant: 'destructive',
      });
    }
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const LoadingGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <Skeleton className="h-10 w-10 rounded" />
              <div className="flex-1">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <FileText className="w-16 h-16 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold text-foreground mb-2">No files uploaded yet</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        {searchTerm ? 'No files found matching your search.' : 'Upload your first PDF file to get started.'}
      </p>
      {isAdmin && !searchTerm && (
        <Button>
          <Upload className="w-4 h-4 mr-2" />
          Upload PDF
        </Button>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Controls Skeleton */}
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-10 w-80" />
          <Skeleton className="h-10 w-40" />
        </div>
        <LoadingGrid />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {isAdmin && (
          <div className="flex items-center space-x-2">
            <Switch
              id="show-deleted"
              checked={showDeleted}
              onCheckedChange={onShowDeletedChange}
            />
            <label htmlFor="show-deleted" className="text-sm font-medium">
              Show deleted
            </label>
          </div>
        )}
      </div>

      {/* Grid */}
      {sortedUploads.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedUploads.map((upload) => (
              <Card key={upload.id} className="group overflow-hidden hover:shadow-lg transition-all duration-200 border-border hover:border-primary/20">
                <CardContent className="p-6">
                   {/* Cover Image */}
                   <div className="mb-4">
                     <BookCover 
                       book={upload}
                       className="w-full h-48 object-cover"
                     />
                   </div>

                   {/* Header with Title */}
                   <div className="flex items-start gap-3 mb-4">
                     <div className="relative">
                       {isNewFile(upload.uploaded_at) && (
                         <div className="absolute -top-1 -right-1 z-10">
                           <Badge variant="secondary" className="text-xs px-1 py-0 bg-green-100 text-green-800 border-green-200">
                             New
                           </Badge>
                         </div>
                       )}
                     </div>
                     
                     <div className="flex-1 min-w-0">
                       <h3 
                         className="font-medium text-foreground line-clamp-2 text-sm leading-tight mb-1" 
                         title={upload.title || upload.filename}
                       >
                         {upload.title || upload.filename.replace(/\.[^/.]+$/, "")}
                       </h3>
                       <p className="text-xs text-muted-foreground">
                         {upload.author && `By ${upload.author}`}
                         {upload.year && ` • ${upload.year}`}
                       </p>
                       <p className="text-xs text-muted-foreground">
                         PDF • {formatFileSize(upload.size_bytes)}
                       </p>
                     </div>

                     <DropdownMenu>
                       <DropdownMenuTrigger asChild>
                         <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                           <MoreVertical className="h-4 w-4" />
                         </Button>
                       </DropdownMenuTrigger>
                       <DropdownMenuContent align="end">
                         <DropdownMenuItem onClick={() => handleOpen(upload)}>
                           <ExternalLink className="w-4 h-4 mr-2" />
                           Read
                         </DropdownMenuItem>
                         <DropdownMenuItem onClick={() => onDownload(upload)}>
                           <Download className="w-4 h-4 mr-2" />
                           Download
                         </DropdownMenuItem>
                         <DropdownMenuItem onClick={() => handleCopyLink(upload)}>
                           <Copy className="w-4 h-4 mr-2" />
                           Copy Link
                         </DropdownMenuItem>
                         {isAdmin && (
                           <>
                             {onReplaceCover && (
                               <DropdownMenuItem onClick={() => onReplaceCover(upload)}>
                                 <Replace className="w-4 h-4 mr-2" />
                                 Replace Cover
                               </DropdownMenuItem>
                             )}
                             {!upload.deleted_at && (
                               <DropdownMenuItem 
                                 onClick={() => setDeleteTarget(upload as BookUploadExtended)}
                                 className="text-destructive focus:text-destructive"
                               >
                                 <Trash2 className="w-4 h-4 mr-2" />
                                 Delete
                               </DropdownMenuItem>
                             )}
                           </>
                         )}
                       </DropdownMenuContent>
                     </DropdownMenu>
                   </div>

                  {/* Metadata */}
                  <div className="space-y-2 mb-4">
                    <p className="text-xs text-muted-foreground">
                      Uploaded {format(new Date(upload.uploaded_at), 'MMM dd, yyyy')}
                    </p>
                    
                    <div className="flex items-center gap-2">
                      {upload.deleted_at ? (
                        <Badge variant="destructive" className="text-xs">Deleted</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">Active</Badge>
                      )}
                    </div>
                  </div>

                   {/* Quick Actions */}
                   <div className="flex gap-2">
                     <Button 
                       variant="outline" 
                       size="sm" 
                       onClick={() => handleOpen(upload)}
                       className="flex-1 h-8 text-xs"
                     >
                       <ExternalLink className="w-3 h-3 mr-1" />
                       Read
                     </Button>
                     <Button 
                       variant="outline" 
                       size="sm" 
                       onClick={() => onDownload(upload)}
                       className="h-8 px-2"
                     >
                       <Download className="w-3 h-3" />
                     </Button>
                   </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-muted-foreground">
                Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalCount)} to{' '}
                {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} files
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm px-3">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete File</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteTarget?.filename}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                 if (deleteTarget) {
                   onDelete(deleteTarget as BookUploadExtended);
                   setDeleteTarget(null);
                 }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};