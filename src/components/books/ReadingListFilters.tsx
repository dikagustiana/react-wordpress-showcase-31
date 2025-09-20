import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Checkbox } from '../ui/checkbox';
import { ALL_TAGS, DIFFICULTY_LEVELS, READING_TYPES } from '../../data/readingLists';

export interface ReadingFilters {
  search: string;
  difficulty: string[];
  type: string[];
  tags: string[];
  sortBy: 'title' | 'year' | 'author' | 'difficulty';
}

interface ReadingListFiltersProps {
  filters: ReadingFilters;
  onFiltersChange: (filters: ReadingFilters) => void;
  totalItems: number;
  filteredCount: number;
}

const ReadingListFilters = ({ 
  filters, 
  onFiltersChange, 
  totalItems, 
  filteredCount 
}: ReadingListFiltersProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const updateFilters = (updates: Partial<ReadingFilters>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      search: '',
      difficulty: [],
      type: [],
      tags: [],
      sortBy: 'title'
    });
  };

  const hasActiveFilters = filters.search || 
    filters.difficulty.length > 0 || 
    filters.type.length > 0 || 
    filters.tags.length > 0;

  const toggleArrayFilter = (category: 'difficulty' | 'type' | 'tags', value: string) => {
    const current = filters[category];
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    updateFilters({ [category]: updated });
  };

  return (
    <div className="space-y-4 mb-8">
      {/* Search and Sort Row */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search books, authors, or content..."
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select
            value={filters.sortBy}
            onValueChange={(value: any) => updateFilters({ sortBy: value })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Title A-Z</SelectItem>
              <SelectItem value="year">Year (Newest)</SelectItem>
              <SelectItem value="author">Author A-Z</SelectItem>
              <SelectItem value="difficulty">Difficulty</SelectItem>
            </SelectContent>
          </Select>

          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="default" className="relative">
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <Badge className="ml-2 px-1 py-0 text-xs h-5 w-5 rounded-full bg-primary text-primary-foreground">
                    {filters.difficulty.length + filters.type.length + filters.tags.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Filters</h4>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="text-xs"
                    >
                      Clear all
                    </Button>
                  )}
                </div>

                {/* Difficulty Filter */}
                <div>
                  <h5 className="text-sm font-medium mb-2">Difficulty</h5>
                  <div className="flex flex-wrap gap-2">
                    {DIFFICULTY_LEVELS.map((level) => (
                      <div key={level} className="flex items-center space-x-2">
                        <Checkbox
                          id={`difficulty-${level}`}
                          checked={filters.difficulty.includes(level)}
                          onCheckedChange={() => toggleArrayFilter('difficulty', level)}
                        />
                        <label
                          htmlFor={`difficulty-${level}`}
                          className="text-sm capitalize cursor-pointer"
                        >
                          {level}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Type Filter */}
                <div>
                  <h5 className="text-sm font-medium mb-2">Type</h5>
                  <div className="flex flex-wrap gap-2">
                    {READING_TYPES.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`type-${type}`}
                          checked={filters.type.includes(type)}
                          onCheckedChange={() => toggleArrayFilter('type', type)}
                        />
                        <label
                          htmlFor={`type-${type}`}
                          className="text-sm capitalize cursor-pointer"
                        >
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Popular Tags */}
                <div>
                  <h5 className="text-sm font-medium mb-2">Popular Tags</h5>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {ALL_TAGS.slice(0, 20).map((tag) => (
                      <div key={tag} className="flex items-center space-x-2">
                        <Checkbox
                          id={`tag-${tag}`}
                          checked={filters.tags.includes(tag)}
                          onCheckedChange={() => toggleArrayFilter('tags', tag)}
                        />
                        <label
                          htmlFor={`tag-${tag}`}
                          className="text-xs cursor-pointer"
                        >
                          {tag}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Active Filters Row */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          
          {filters.difficulty.map((difficulty) => (
            <Badge key={difficulty} variant="secondary" className="text-xs">
              {difficulty}
              <button
                onClick={() => toggleArrayFilter('difficulty', difficulty)}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          
          {filters.type.map((type) => (
            <Badge key={type} variant="secondary" className="text-xs">
              {type}
              <button
                onClick={() => toggleArrayFilter('type', type)}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          
          {filters.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
              <button
                onClick={() => toggleArrayFilter('tags', tag)}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing {filteredCount} of {totalItems} reading recommendations
        </span>
        {filteredCount !== totalItems && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-xs"
          >
            Show all {totalItems}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ReadingListFilters;