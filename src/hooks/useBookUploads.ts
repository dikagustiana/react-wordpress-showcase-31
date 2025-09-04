import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useRole } from '@/contexts/RoleContext';

export interface BookUpload {
  id: string;
  category: string;
  filename: string;
  filepath: string;
  size_bytes: number;
  mime_type: string;
  uploaded_by: string;
  uploaded_at: string;
  deleted_at: string | null;
  version: number;
}

export const useBookUploads = (category: string) => {
  const [uploads, setUploads] = useState<BookUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showDeleted, setShowDeleted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { isAdmin } = useRole();

  const itemsPerPage = 20;

  const fetchUploads = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('books_uploads')
        .select('*', { count: 'exact' })
        .eq('category', category)
        .order('uploaded_at', { ascending: false })
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);

      if (!showDeleted) {
        query = query.is('deleted_at', null);
      }

      if (searchTerm) {
        query = query.ilike('filename', `%${searchTerm}%`);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      setUploads(data || []);
      setTotalCount(count || 0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch uploads';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchUploads();
    }, searchTerm ? 300 : 0);

    return () => clearTimeout(timeoutId);
  }, [category, currentPage, searchTerm, showDeleted]);

  const uploadFile = async (file: File) => {
    if (!isAdmin) {
      toast({
        title: 'Access Denied',
        description: 'Only admins can upload files',
        variant: 'destructive',
      });
      return false;
    }

    if (file.type !== 'application/pdf') {
      toast({
        title: 'Invalid File Type',
        description: 'Please select a PDF file',
        variant: 'destructive',
      });
      return false;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB
      toast({
        title: 'File Too Large',
        description: 'File size must be less than 50MB',
        variant: 'destructive',
      });
      return false;
    }

    try {
      setUploading(true);

      // Check authentication first
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        toast({
          title: 'Authentication Error',
          description: 'Please refresh page and try again. You must be logged in as admin.',
          variant: 'destructive',
        });
        return false;
      }

      // Generate safe filename and path
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const uuid = crypto.randomUUID();
      const safeFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filepath = `books/${category}/${year}/${month}/${day}/${uuid}_${safeFilename}`;

      // Upload to storage first
      const { error: uploadError } = await supabase.storage
        .from('books')
        .upload(filepath, file);

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw new Error(`Storage upload failed: ${uploadError.message}`);
      }

      // Save metadata
      const { error: insertError } = await supabase
        .from('books_uploads')
        .insert({
          category,
          filename: file.name,
          filepath,
          size_bytes: file.size,
          mime_type: file.type,
          uploaded_by: user.id,
        });

      if (insertError) {
        console.error('Database insert error:', insertError);
        // If metadata save fails, clean up the uploaded file
        await supabase.storage.from('books').remove([filepath]);
        throw new Error(`Database save failed: ${insertError.message}. Please check your admin permissions.`);
      }

      toast({
        title: 'Success',
        description: 'File uploaded successfully',
      });

      fetchUploads();
      return true;
    } catch (err) {
      console.error('Upload error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload file';
      toast({
        title: 'Upload Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (upload: BookUpload) => {
    if (!isAdmin) {
      toast({
        title: 'Access Denied',
        description: 'Only admins can delete files',
        variant: 'destructive',
      });
      return false;
    }

    try {
      // Soft delete - update deleted_at
      const { error: updateError } = await supabase
        .from('books_uploads')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', upload.id);

      if (updateError) throw updateError;

      // Try to delete from storage
      const { error: storageError } = await supabase.storage
        .from('books')
        .remove([upload.filepath]);

      if (storageError) {
        toast({
          title: 'Warning',
          description: 'File marked as deleted but storage cleanup failed. This can be retried later.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: 'File deleted successfully',
        });
      }

      fetchUploads();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete file';
      toast({
        title: 'Delete Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    }
  };

  const getDownloadUrl = async (filepath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('books')
        .createSignedUrl(filepath, 600); // 10 minutes

      if (error) throw error;
      return data.signedUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get download URL';
      toast({
        title: 'Download Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return null;
    }
  };

  const downloadFile = async (upload: BookUpload) => {
    const url = await getDownloadUrl(upload.filepath);
    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.download = upload.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return {
    uploads,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalCount,
    itemsPerPage,
    showDeleted,
    setShowDeleted,
    uploading,
    uploadFile,
    deleteFile,
    downloadFile,
    refreshUploads: fetchUploads,
  };
};