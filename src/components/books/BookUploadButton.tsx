import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Loader2 } from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';

interface BookUploadButtonProps {
  onUpload: (file: File) => Promise<boolean>;
  uploading: boolean;
}

export const BookUploadButton: React.FC<BookUploadButtonProps> = ({
  onUpload,
  uploading,
}) => {
  const { isAdmin } = useRole();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isAdmin) return null;

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await onUpload(file);
      // Reset the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <Button
        onClick={handleClick}
        disabled={uploading}
        className="bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {uploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" />
            Upload PDF
          </>
        )}
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
};