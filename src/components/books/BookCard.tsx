import { ExternalLink, Download, Tag } from 'lucide-react';
import { Book } from '../../types/books';

interface BookCardProps {
  book: Book;
}

const BookCard = ({ book }: BookCardProps) => {
  const handleDownload = () => {
    window.open(book.url, '_blank');
  };

  const handleExternal = () => {
    if (book.external) {
      window.open(book.external, '_blank');
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
          {book.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-1">
          by {book.author}
        </p>
        <p className="text-sm text-muted-foreground">
          {book.year} • {book.sizeMB.toFixed(1)} MB
        </p>
      </div>

      {book.description && (
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {book.description}
        </p>
      )}

      {book.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {book.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-md text-xs text-muted-foreground"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
          {book.tags.length > 3 && (
            <span className="px-2 py-1 bg-muted rounded-md text-xs text-muted-foreground">
              +{book.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleDownload}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
          aria-label={`Download ${book.title}`}
        >
          <Download className="w-4 h-4" />
          View
        </button>
        
        {book.external && (
          <button
            onClick={handleExternal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-sm font-medium"
            aria-label={`External link for ${book.title}`}
          >
            <ExternalLink className="w-4 h-4" />
            External
          </button>
        )}
      </div>
    </div>
  );
};

export default BookCard;