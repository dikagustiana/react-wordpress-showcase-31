import { useMemo } from 'react';
import { ReadingItem, READING_LISTS } from '../data/readingLists';
import { ReadingFilters } from '../components/books/ReadingListFilters';

export const useReadingList = (category: string) => {
  const readings = READING_LISTS[category] || [];
  
  return {
    readings,
    loading: false, // Since we're using dummy data
    error: null
  };
};

export const useFilteredReadingList = (readings: ReadingItem[], filters: ReadingFilters) => {
  return useMemo(() => {
    let filtered = [...readings];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchLower) ||
        item.author.toLowerCase().includes(searchLower) ||
        item.summary.toLowerCase().includes(searchLower) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Difficulty filter
    if (filters.difficulty.length > 0) {
      filtered = filtered.filter(item =>
        filters.difficulty.includes(item.difficulty)
      );
    }

    // Type filter
    if (filters.type.length > 0) {
      filtered = filtered.filter(item =>
        filters.type.includes(item.type)
      );
    }

    // Tags filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter(item =>
        filters.tags.some(tag => item.tags.includes(tag))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'author':
          return a.author.localeCompare(b.author);
        case 'year':
          return b.year - a.year; // Newest first
        case 'difficulty':
          const difficultyOrder = { 'beginner': 0, 'intermediate': 1, 'advanced': 2 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        default:
          return 0;
      }
    });

    return filtered;
  }, [readings, filters]);
};