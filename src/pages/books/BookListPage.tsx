import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Heart, Sparkles } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Breadcrumb from '../../components/Breadcrumb';
import ReadingRecommendationCard from '../../components/books/ReadingRecommendationCard';
import ReadingListFilters from '../../components/books/ReadingListFilters';
import type { ReadingFilters } from '../../components/books/ReadingListFilters';
import { useReadingList, useFilteredReadingList } from '../../hooks/useReadingList';
import { CATEGORY_NAMES } from '../../config/books';

const BookListPage = () => {
  const { category } = useParams<{ category: string }>();
  const [filters, setFilters] = useState<ReadingFilters>({
    search: '',
    difficulty: [],
    type: [],
    tags: [],
    sortBy: 'title'
  });

  const { readings, loading, error } = useReadingList(category || '');
  const filteredReadings = useFilteredReadingList(readings, filters);
  
  const categoryName = CATEGORY_NAMES[category || ''] || category || 'Unknown Category';

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Books and Academia', path: '/books-academia' },
    { label: 'Categories', path: '/books/categories' },
    { label: categoryName }
  ];

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
  }, [filteredReadings]);

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
                <p className="text-lg text-muted-foreground">Loading reading recommendations...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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

          {/* Hero Section */}
          <section className="text-center py-12 mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                {categoryName}
              </h1>
              <Heart className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Hand-picked reading recommendations from your Learning Buddy. These aren't just any books – 
              they're the ones that'll actually expand your mind and maybe even change how you see the world.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full text-sm text-muted-foreground">
              <BookOpen className="w-4 h-4" />
              {readings.length} curated recommendations
            </div>
          </section>

          {readings.length === 0 ? (
            /* Empty State */
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">Coming Soon</h2>
                <p className="text-muted-foreground">
                  We're curating an amazing collection of {categoryName.toLowerCase()} reading recommendations. 
                  Check back soon!
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Filters */}
              <ReadingListFilters
                filters={filters}
                onFiltersChange={setFilters}
                totalItems={readings.length}
                filteredCount={filteredReadings.length}
              />

              {filteredReadings.length === 0 ? (
                /* No Results */
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-foreground mb-2">No Matches Found</h2>
                    <p className="text-muted-foreground">
                      Try adjusting your search or filter criteria to find what you're looking for.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Reading Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {filteredReadings.map((item) => (
                      <ReadingRecommendationCard key={item.id} item={item} />
                    ))}
                  </div>

                  {/* Footer Message */}
                  <div className="text-center py-8 border-t border-border">
                    <p className="text-muted-foreground">
                      Found a great book that should be on this list? 
                      <Link 
                        to="/settings" 
                        className="text-primary hover:underline ml-1"
                      >
                        Let us know!
                      </Link>
                    </p>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookListPage;