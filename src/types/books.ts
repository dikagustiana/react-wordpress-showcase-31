export interface Book {
  title: string;
  author: string;
  year: number;
  tags: string[];
  sizeMB: number;
  url: string;
  external?: string;
  description?: string;
}

export interface BookFilters {
  search: string;
  tags: string[];
  sortBy: 'title' | 'year' | 'size';
}