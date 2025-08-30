import { CheckCircle } from 'lucide-react';
import { CategoryMetadata, CategoryStats } from '../../types/categoryMetadata';
import { Button } from '../ui/button';

interface CategoryHeroProps {
  metadata: CategoryMetadata;
  stats: CategoryStats;
}

const CategoryHero = ({ metadata, stats }: CategoryHeroProps) => {
  const scrollToBooks = () => {
    const booksSection = document.getElementById('books-section');
    if (booksSection) {
      booksSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const formatFileSize = (sizeMB: number) => {
    if (sizeMB < 1024) {
      return `${sizeMB.toFixed(1)} MB`;
    }
    return `${(sizeMB / 1024).toFixed(1)} GB`;
  };

  return (
    <section className="w-full bg-muted/30 py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground font-plus-jakarta">
            {metadata.title}
          </h1>
          
          <p className="text-xl text-muted-foreground mb-6 font-medium">
            {metadata.subheading}
          </p>
          
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            {metadata.summary}
          </p>
          
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
              Key Topics
            </h3>
            <ul className="space-y-3">
              {metadata.highlights.map((highlight, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex flex-wrap gap-6 mb-8 text-sm text-muted-foreground">
            <div>
              <span className="font-semibold text-foreground">{stats.bookCount}</span> books
            </div>
            <div>
              <span className="font-semibold text-foreground">{formatFileSize(stats.totalSizeMB)}</span> total size
            </div>
            <div>
              Last updated <span className="font-semibold text-foreground">{stats.lastUpdated}</span>
            </div>
          </div>
          
          <Button 
            onClick={scrollToBooks}
            size="lg"
            className="font-semibold"
          >
            View All Books
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CategoryHero;