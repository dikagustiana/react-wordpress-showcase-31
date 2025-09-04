import React, { useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useRole } from '@/contexts/RoleContext';

interface BookUploadManagerProps {
  category: string;
  onUploadSuccess: () => void;
}

export const BookUploadManager: React.FC<BookUploadManagerProps> = ({
  category,
  onUploadSuccess
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { isAdmin } = useRole();

  const generateFilePath = (filename: string): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const uuid = crypto.randomUUID();
    const safeFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    
    return `books/${category}/${year}/${month}/${day}/${uuid}_${safeFilename}`;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file only.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 50MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const filepath = generateFilePath(file.name);

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('books')
        .upload(filepath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Save metadata to database
      const { error: dbError } = await supabase
        .from('books_uploads')
        .insert({
          category,
          filename: file.name,
          filepath,
          size_bytes: file.size,
          mime_type: file.type,
          uploaded_by: user.id
        });

      if (dbError) {
        // If database insert fails, clean up the uploaded file
        await supabase.storage.from('books').remove([filepath]);
        throw dbError;
      }

      toast({
        title: "Upload successful",
        description: `${file.name} has been uploaded successfully.`,
      });

      onUploadSuccess();
      
      // Clear the input
      event.target.value = '';
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An error occurred during upload.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="mb-6">
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileUpload}
        className="hidden"
        id="pdf-upload"
        disabled={isUploading}
      />
      <label htmlFor="pdf-upload">
        <Button
          variant="default"
          className="cursor-pointer"
          disabled={isUploading}
          asChild
        >
          <span>
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {isUploading ? 'Uploading...' : 'Upload PDF'}
          </span>
        </Button>
      </label>
    </div>
  );
};