import { useState, useEffect } from 'react';
import { Search, Filter, SortAsc } from 'lucide-react';
import { BookFilters } from '../../types/books';
import { AVAILABLE_TAGS } from '../../config/books';

interface BookListToolbarProps {
  filters: BookFilters;
  onFiltersChange: (filters: BookFilters) => void;
  totalBooks: number;
  filteredCount: number;
}

const BookListToolbar = ({ filters, onFiltersChange, totalBooks, filteredCount }: BookListToolbarProps) => {
  const [searchInput, setSearchInput] = useState(filters.search);
  const [showTagFilter, setShowTagFilter] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onFiltersChange({ ...filters, search: searchInput });
    }, 250);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleTagToggle = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    
    onFiltersChange({ ...filters, tags: newTags });
  };

  const clearAllFilters = () => {
    setSearchInput('');
    onFiltersChange({ search: '', tags: [], sortBy: 'title' });
  };

  const hasActiveFilters = filters.search || filters.tags.length > 0;

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex flex-col gap-4">
        {/* Search and Sort Row */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <SortAsc className="w-4 h-4 text-muted-foreground" />
            <select
              value={filters.sortBy}
              onChange={(e) => onFiltersChange({ ...filters, sortBy: e.target.value as BookFilters['sortBy'] })}
              className="px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="title">Title A to Z</option>
              <option value="year">Year Newest</option>
              <option value="size">Size Smallest</option>
            </select>
          </div>

          {/* Tag Filter Toggle */}
          <button
            onClick={() => setShowTagFilter(!showTagFilter)}
            className={`inline-flex items-center gap-2 px-4 py-2 border border-border rounded-md transition-colors ${
              showTagFilter ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            <Filter className="w-4 h-4" />
            Tags
            {filters.tags.length > 0 && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                {filters.tags.length}
              </span>
            )}
          </button>
        </div>

        {/* Tag Filter Panel */}
        {showTagFilter && (
          <div className="border-t border-border pt-4">
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    filters.tags.includes(tag)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results and Clear */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {filteredCount} of {totalBooks} books
          </span>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-primary hover:text-primary/80 transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookListToolbar;