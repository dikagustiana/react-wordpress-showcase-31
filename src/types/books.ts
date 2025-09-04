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

export interface BookUploadExtended {
  id: string;
  filename: string;
  filepath: string;
  category: string;
  size_bytes: number;
  mime_type: string;
  uploaded_at: string;
  uploaded_by: string;
  deleted_at?: string;
  version: number;
  title?: string;
  author?: string;
  year?: number;
  tags?: string[];
  cover_path?: string;
  cover_width?: number;
  cover_height?: number;
  cover_color?: string;
}

export interface BookFilters {
  search: string;
  tags: string[];
  sortBy: 'title' | 'year' | 'size';
}