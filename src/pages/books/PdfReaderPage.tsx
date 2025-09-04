import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, ZoomIn, ZoomOut, RotateCw, Search, Moon, Sun, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useRole } from '@/contexts/RoleContext';
import { supabase } from '@/integrations/supabase/client';
import type { BookUploadExtended } from '@/types/books';

const PdfReaderPage: React.FC = () => {
  const { category, bookId } = useParams<{ category: string; bookId: string }>();
  const { toast } = useToast();
  const { isAdmin } = useRole();
  
  const [book, setBook] = useState<BookUploadExtended | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const loadBook = async () => {
      if (!bookId) return;

      try {
        // Fetch book metadata
        const { data, error } = await supabase
          .from('books_uploads')
          .select('*')
          .eq('id', bookId)
          .maybeSingle();

        if (error) throw error;
        if (!data) {
          toast({
            title: 'Book not found',
            description: 'The requested book could not be found.',
            variant: 'destructive',
          });
          return;
        }

        setBook(data);

        // Get signed URL for PDF
        const { data: urlData } = await supabase.storage
          .from('books')
          .createSignedUrl(data.filepath, 3600);

        if (urlData?.signedUrl) {
          setPdfUrl(urlData.signedUrl);
        }
      } catch (error) {
        console.error('Error loading book:', error);
        toast({
          title: 'Error loading book',
          description: 'Failed to load the book. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadBook();
  }, [bookId, toast]);

  const handleDownload = async () => {
    if (!book || !pdfUrl) return;

    try {
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = book.filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: 'Download failed',
        description: 'Failed to download the file.',
        variant: 'destructive',
      });
    }
  };

  const handlePrint = () => {
    if (pdfUrl) {
      const printWindow = window.open(pdfUrl, '_blank');
      printWindow?.focus();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading PDF...</p>
        </div>
      </div>
    );
  }

  if (!book || !pdfUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Book not found</h1>
          <p className="text-muted-foreground mb-4">The requested book could not be loaded.</p>
          <Link to={`/books/${category}`}>
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Category
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const displayTitle = book.title || book.filename.replace(/\.[^/.]+$/, '');

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark' : ''} bg-background`}>
      {/* Header Toolbar */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Link to={`/books/${category}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="font-semibold text-foreground line-clamp-1">{displayTitle}</h1>
              <p className="text-sm text-muted-foreground">
                {book.author && `By ${book.author}`}
                {book.year && ` • ${book.year}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search in document..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>

            {/* Zoom Controls */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.max(25, zoom - 25))}
              disabled={zoom <= 25}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm text-muted-foreground px-2">{zoom}%</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.min(400, zoom + 25))}
              disabled={zoom >= 400}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>

            {/* Rotate */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRotation((rotation + 90) % 360)}
            >
              <RotateCw className="w-4 h-4" />
            </Button>

            {/* Dark Mode */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {/* Actions */}
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* PDF Viewer */}
      <main className="flex-1 flex">
        <div className="flex-1 flex items-center justify-center p-4">
          <div 
            className="w-full h-full rounded-lg border border-border overflow-hidden shadow-lg"
            style={{ 
              transform: `rotate(${rotation}deg) scale(${zoom / 100})`,
              transformOrigin: 'center center'
            }}
          >
            <iframe
              src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1&page=1&view=FitH`}
              className="w-full h-full"
              title={`PDF Viewer - ${displayTitle}`}
              style={{ minHeight: '600px' }}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default PdfReaderPage;