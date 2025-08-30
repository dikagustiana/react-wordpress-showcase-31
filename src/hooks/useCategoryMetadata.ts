import { useMemo } from 'react';
import { Book } from '../types/books';
import { CategoryMetadata, CategoryStats } from '../types/categoryMetadata';
import { CATEGORY_METADATA } from '../data/categoryMetadata';
import { CATEGORY_NAMES } from '../config/books';

const toTitleCase = (str: string) => {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const useCategoryMetadata = (category: string, books: Book[]) => {
  const metadata = useMemo((): CategoryMetadata => {
    if (CATEGORY_METADATA[category]) {
      return CATEGORY_METADATA[category];
    }
    
    // Fallback metadata
    const title = CATEGORY_NAMES[category] || toTitleCase(category);
    return {
      title,
      subheading: "Curated academic resources",
      summary: "No metadata available for this category yet. Browse the available books below.",
      highlights: ["Academic resources", "Curated content", "Professional development"]
    };
  }, [category]);

  const stats = useMemo((): CategoryStats => {
    const totalSizeMB = books.reduce((sum, book) => sum + book.sizeMB, 0);
    
    // Get current date for last updated (in real app, this would come from API)
    const lastUpdated = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    return {
      bookCount: books.length,
      totalSizeMB,
      lastUpdated
    };
  }, [books]);

  return { metadata, stats };
};