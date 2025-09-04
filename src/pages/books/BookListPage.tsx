import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, AlertCircle } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Breadcrumb from '../../components/Breadcrumb';
import BookCard from '../../components/books/BookCard';
import BookListToolbar from '../../components/books/BookListToolbar';
import BookPagination from '../../components/books/BookPagination';
import CategoryHero from '../../components/books/CategoryHero';
import { BookUploadButton } from '../../components/books/BookUploadButton';
import { PdfCardGrid } from '../../components/books/PdfCardGrid';
import { useBooks, useFilteredBooks } from '../../hooks/useBooks';
import { useCategoryMetadata } from '../../hooks/useCategoryMetadata';
import { useBookUploads } from '../../hooks/useBookUploads';
import { BookFilters } from '../../types/books';
import { CATEGORY_NAMES } from '../../config/books';

const BOOKS_PER_PAGE = 24;

const BookListPage = () => {
  const { category } = useParams<{ category: string }>();
  const [filters, setFilters] = useState<BookFilters>({
    search: '',
    tags: [],
    sortBy: 'title'
  });
  const [currentPage, setCurrentPage] = useState(1);

  const { books, loading, error } = useBooks(category || '');
  const filteredBooks = useFilteredBooks(books, filters);
  const { metadata, stats } = useCategoryMetadata(category || '', books);
  const bookUploads = useBookUploads(category || '');
  
  const totalPages = Math.ceil(filteredBooks.length / BOOKS_PER_PAGE);
  const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
  const paginatedBooks = filteredBooks.slice(startIndex, startIndex + BOOKS_PER_PAGE);

  const categoryName = CATEGORY_NAMES[category || ''] || category || 'Unknown Category';

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Books and Academia', path: '/books-academia' },
    { label: 'Categories', path: '/books/categories' },
    { label: categoryName }
  ];

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Send height updates for WordPress iframe
  useEffect(() => {
    const updateHeight = () => {
      window.parent?.postMessage({
        type: "EMBED_SIZE",
        id: "dgi-embed",
        height: document.documentElement.scrollHeight
      }, "*");
    };

    updateHeight();
    
    // Update on window resize
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [filteredBooks, currentPage, books]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <Breadcrumb items={breadcrumbItems} />
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
                <p className="text-lg text-muted-foreground">Loading books...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Don't show error screen if only the old JSON books fail to load
  // We'll handle this gracefully in the main render

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb items={breadcrumbItems} />
          
          {/* Back Navigation */}
          <div className="mb-6">
            <Link
              to="/books/categories"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Categories
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <CategoryHero metadata={metadata} stats={stats} />

        {/* Books Section */}
        <div id="books-section" className="max-w-7xl mx-auto px-6 py-8">
          
          {/* PDF Upload Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">PDF Resources</h2>
              <BookUploadButton
                onUpload={bookUploads.uploadFile}
                uploading={bookUploads.uploading}
              />
            </div>
            
            {/* PDF Files Grid */}
            <PdfCardGrid
              uploads={bookUploads.uploads}
              loading={bookUploads.loading}
              searchTerm={bookUploads.searchTerm}
              onSearchChange={bookUploads.setSearchTerm}
              showDeleted={bookUploads.showDeleted}
              onShowDeletedChange={bookUploads.setShowDeleted}
              onDownload={bookUploads.downloadFile}
              onDelete={bookUploads.deleteFile}
              currentPage={bookUploads.currentPage}
              totalCount={bookUploads.totalCount}
              itemsPerPage={bookUploads.itemsPerPage}
              onPageChange={bookUploads.setCurrentPage}
            />
          </div>

          {books.length === 0 && !error ? (
            /* Empty State - only show if no error */
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">No Books Yet</h2>
                <p className="text-muted-foreground">
                  No books yet for {categoryName}. Come back soon!
                </p>
              </div>
            </div>
          ) : books.length > 0 ? (
            <>
              {/* Toolbar */}
              <BookListToolbar
                filters={filters}
                onFiltersChange={setFilters}
                totalBooks={books.length}
                filteredCount={filteredBooks.length}
              />

              {filteredBooks.length === 0 ? (
                /* No Results */
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-foreground mb-2">No Books Found</h2>
                    <p className="text-muted-foreground">
                      Try adjusting your search or filter criteria.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Books Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {paginatedBooks.map((book, index) => (
                      <BookCard key={`${book.title}-${index}`} book={book} />
                    ))}
                  </div>

                  {/* Pagination */}
                  <BookPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </>
              )}
            </>
          ) : error ? (
            /* Error State - show this if JSON books failed but still allow PDF uploads */
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Traditional Books Unavailable</h3>
                <p className="text-muted-foreground">
                  Book catalog is temporarily unavailable. You can still upload and access PDF resources above.
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookListPage;