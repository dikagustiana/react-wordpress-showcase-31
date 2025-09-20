import { Clock, ExternalLink, Tag as TagIcon, BookOpen, FileText, GraduationCap, Newspaper } from 'lucide-react';
import { ReadingItem } from '../../data/readingLists';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';

interface ReadingRecommendationCardProps {
  item: ReadingItem;
}

const ReadingRecommendationCard = ({ item }: ReadingRecommendationCardProps) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'book': return BookOpen;
      case 'article': return FileText;
      case 'journal': return GraduationCap;
      case 'paper': return Newspaper;
      default: return BookOpen;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'book': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'article': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'journal': return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'paper': return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-emerald-100 text-emerald-700';
      case 'intermediate': return 'bg-amber-100 text-amber-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const TypeIcon = getTypeIcon(item.type);

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {item.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              by {item.author} ({item.year})
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <TypeIcon className="w-5 h-5 text-muted-foreground" />
            <Badge className={`text-xs capitalize ${getDifficultyColor(item.difficulty)}`}>
              {item.difficulty}
            </Badge>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1">
          <Badge variant="secondary" className={`text-xs ${getTypeBadgeColor(item.type)}`}>
            {item.type}
          </Badge>
          {item.estimatedReadTime && (
            <Badge variant="outline" className="text-xs flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {item.estimatedReadTime}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <p className="text-sm text-foreground leading-relaxed mb-4">
          {item.summary}
        </p>
        
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.tags.slice(0, 4).map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs bg-muted/50 hover:bg-muted transition-colors"
              >
                <TagIcon className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
            {item.tags.length > 4 && (
              <Badge variant="outline" className="text-xs bg-muted/50">
                +{item.tags.length - 4} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex gap-2 w-full">
          <button
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
            onClick={() => {
              // In a real app, this would open the book or navigate to reading page
              console.log('Reading:', item.title);
            }}
          >
            <BookOpen className="w-4 h-4" />
            Read
          </button>
          
          {item.externalUrl && (
            <button
              className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-sm font-medium"
              onClick={() => window.open(item.externalUrl, '_blank')}
            >
              <ExternalLink className="w-4 h-4" />
              External
            </button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ReadingRecommendationCard;