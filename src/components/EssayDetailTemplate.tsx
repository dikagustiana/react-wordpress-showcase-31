import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, User, Calendar } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { getEssayById, getPhaseTitle } from '../lib/essayData';

const EssayDetailTemplate = () => {
  const { phase, essayId } = useParams<{ phase: string; essayId: string }>();
  const essay = getEssayById(essayId || '');
  const phaseTitle = getPhaseTitle(phase || '');

  if (!essay || !phase) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/20">
        <Header />
        <main className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-primary mb-4">Essay Not Found</h1>
            <Link 
              to="/critical-thinking-research"
              className="text-card-cta hover:text-card-cta/80 font-medium"
            >
              ← Back to Critical Thinking & Research
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/20">
      <Header />
      
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Back Button */}
        <Link 
          to={`/critical-thinking-research/${phase}`}
          className="inline-flex items-center text-card-cta hover:text-card-cta/80 font-medium mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to {phaseTitle} Essays
        </Link>

        {/* Article Header */}
        <article className="bg-card-bg-light rounded-[var(--card-radius)] shadow-[var(--card-shadow)] p-8 font-plus-jakarta">
          {/* Title */}
          <h1 className="text-4xl font-bold text-primary mb-6 leading-tight">
            {essay.title}
          </h1>

          {/* Meta Information */}
          <div className="flex items-center text-sm text-muted-foreground space-x-6 mb-8 pb-6 border-b border-gray-200">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              <span className="font-medium">{essay.author}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{essay.date}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span>{essay.readTime}</span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="mb-8">
            <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
              <img 
                src={essay.thumbnail} 
                alt={essay.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div className="text-lg leading-relaxed text-gray-700 whitespace-pre-line">
              {essay.content}
            </div>
          </div>

          {/* Tags */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-muted-foreground">Tags:</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-card-icon-bg text-card-title">
                {phaseTitle}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-card-icon-bg text-card-title">
                Critical Thinking
              </span>
            </div>
          </div>
        </article>

        {/* Navigation to other essays */}
        <div className="mt-8 text-center">
          <Link 
            to={`/critical-thinking-research/${phase}`}
            className="inline-flex items-center bg-card-cta hover:bg-card-cta/90 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            View More {phaseTitle} Essays
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EssayDetailTemplate;