export interface CategoryMetadata {
  title: string;
  subheading: string;
  summary: string;
  highlights: string[];
  lastUpdated?: string;
}

export interface CategoryStats {
  bookCount: number;
  totalSizeMB: number;
  lastUpdated: string;
}