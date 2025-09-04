import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { BookUploadExtended } from '@/types/books';

interface BookCoverProps {
  book: BookUploadExtended;
  className?: string;
}

export const BookCover: React.FC<BookCoverProps> = ({ book, className = '' }) => {
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadCover = async () => {
      if (!book.cover_path) {
        setIsLoading(false);
        return;
      }

      try {
        // Get signed URL for cover
        const response = await fetch(`/supabase/functions/v1/signed-cover?path=${encodeURIComponent(book.cover_path)}`);
        
        if (response.ok) {
          const data = await response.json();
          setCoverUrl(data.url);
        } else {
          setHasError(true);
        }
      } catch (error) {
        console.error('Error loading cover:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadCover();
  }, [book.cover_path]);

  const displayTitle = book.title || book.filename.replace(/\.[^/.]+$/, '');
  const placeholderColor = book.cover_color || '#e5e7eb';

  if (isLoading) {
    return (
      <div 
        className={`flex items-center justify-center bg-muted rounded-lg ${className}`}
        style={{ backgroundColor: placeholderColor }}
      >
        <div className="animate-pulse">
          <FileText className="w-8 h-8 text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!coverUrl || hasError) {
    return (
      <div 
        className={`flex flex-col items-center justify-center bg-muted rounded-lg p-4 ${className}`}
        style={{ backgroundColor: placeholderColor }}
      >
        <FileText className="w-8 h-8 text-muted-foreground mb-2" />
        <span className="text-xs text-muted-foreground text-center leading-tight">
          {displayTitle.length > 30 ? displayTitle.substring(0, 30) + '...' : displayTitle}
        </span>
      </div>
    );
  }

  return (
    <img
      src={coverUrl}
      alt={`Cover of ${displayTitle}`}
      className={`object-cover rounded-lg ${className}`}
      style={{ backgroundColor: placeholderColor }}
      onError={() => setHasError(true)}
    />
  );
};