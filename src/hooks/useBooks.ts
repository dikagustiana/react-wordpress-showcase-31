import { useState, useEffect, useMemo } from 'react';
import { Book, BookFilters } from '../types/books';
import { BASE_JSON_URL } from '../config/books';

// Cache for fetched data
const booksCache = new Map<string, Book[]>();

export const useBooks = (category: string) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);

      // Check cache first
      if (booksCache.has(category)) {
        setBooks(booksCache.get(category)!);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${BASE_JSON_URL}/${category}.json`);
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        const data: Book[] = await response.json();
        
        // Cache the result
        booksCache.set(category, data);
        setBooks(data);
      } catch (err) {
        setError('Cannot load books. Check your connection or try again');
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [category]);

  return { books, loading, error };
};

export const useFilteredBooks = (books: Book[], filters: BookFilters) => {
  return useMemo(() => {
    let filtered = [...books];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(searchLower) ||
        book.author.toLowerCase().includes(searchLower)
      );
    }

    // Tags filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter(book =>
        filters.tags.some(tag => book.tags.includes(tag))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'year':
          return b.year - a.year; // Newest first
        case 'size':
          return a.sizeMB - b.sizeMB; // Smallest first
        default:
          return 0;
      }
    });

    return filtered;
  }, [books, filters]);
};