import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, User, Calendar, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { 
  getGreenTransitionEssayById, 
  getGreenTransitionPhaseTitle, 
  getAdjacentGreenTransitionEssays,
  getRelatedGreenTransitionEssays 
} from '../lib/greenTransitionData';

const GreenTransitionEssayDetailTemplate = () => {
  const { phase, essayId } = useParams<{ phase: string; essayId: string }>();
  const essay = getGreenTransitionEssayById(essayId || '');
  const phaseTitle = getGreenTransitionPhaseTitle(phase || '');
  const { previous, next } = getAdjacentGreenTransitionEssays(essayId || '', phase || '');
  const relatedEssays = getRelatedGreenTransitionEssays(essayId || '');

  if (!essay || !phase) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/20">
        <Header />
        <main className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-primary mb-4">Essay Not Found</h1>
            <Link 
              to="/green-transition"
              className="text-card-cta hover:text-card-cta/80 font-medium"
            >
              ← Back to The Green Transition
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: essay.title,
        text: essay.snippet,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // Could add a toast notification here
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/20">
      <Header />
      
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Back Button */}
        <Link 
          to={`/green-transition/${phase}`}
          className="inline-flex items-center text-card-cta hover:text-card-cta/80 font-medium mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to {phaseTitle} Essays
        </Link>

        {/* Article */}
        <article className="bg-card-bg-light rounded-[var(--card-radius)] shadow-[var(--card-shadow)] overflow-hidden font-plus-jakarta">
          {/* Featured Image */}
          <div className="w-full h-80 bg-gray-200 overflow-hidden">
            <img 
              src={essay.thumbnail} 
              alt={essay.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              {/* Category Badge */}
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-card-icon-bg text-card-title mb-4">
                {phaseTitle}
              </div>
              
              {/* Title */}
              <h1 className="text-4xl font-bold text-primary mb-4 leading-tight">
                {essay.title}
              </h1>
              
              {/* Snippet */}
              <p className="text-xl text-muted-foreground leading-relaxed mb-6">
                {essay.snippet}
              </p>
              
              {/* Meta Information & Share */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center text-sm text-muted-foreground space-x-6">
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
                
                <button
                  onClick={handleShare}
                  className="flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </button>
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
                  Green Transition
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-card-icon-bg text-card-title">
                  Sustainability
                </span>
              </div>
            </div>
          </div>
        </article>

        {/* Author Box */}
        <div className="mt-8 bg-card-bg-light rounded-[var(--card-radius)] shadow-[var(--card-shadow)] p-6">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-card-icon-bg rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-card-title" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-card-title mb-2">{essay.author}</h3>
              <p className="text-card-description text-sm leading-relaxed">
                Expert in sustainable energy policy and green transition strategies. 
                Passionate about bridging the gap between environmental science and practical implementation.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-between items-center">
          <div className="flex-1">
            {previous && (
              <Link
                to={`/green-transition/${phase}/${previous.id}`}
                className="group inline-flex items-center text-card-cta hover:text-card-cta/80 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                <div className="text-left">
                  <div className="text-xs text-muted-foreground">Previous</div>
                  <div className="font-medium line-clamp-1">{previous.title}</div>
                </div>
              </Link>
            )}
          </div>
          
          <div className="flex-1 text-right">
            {next && (
              <Link
                to={`/green-transition/${phase}/${next.id}`}
                className="group inline-flex items-center text-card-cta hover:text-card-cta/80 transition-colors"
              >
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Next</div>
                  <div className="font-medium line-clamp-1">{next.title}</div>
                </div>
                <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            )}
          </div>
        </div>

        {/* Related Essays */}
        {relatedEssays.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-primary mb-6">Related Essays</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedEssays.map((relatedEssay) => (
                <Link
                  key={relatedEssay.id}
                  to={`/green-transition/${relatedEssay.phase}/${relatedEssay.id}`}
                  className="group block bg-card-bg-light rounded-[var(--card-radius)] shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] transition-all duration-300 overflow-hidden"
                >
                  <div className="w-full h-32 bg-gray-200 overflow-hidden">
                    <img 
                      src={relatedEssay.thumbnail} 
                      alt={relatedEssay.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-card-title mb-2 line-clamp-2 group-hover:text-card-cta transition-colors">
                      {relatedEssay.title}
                    </h3>
                    <p className="text-card-description text-sm line-clamp-2">
                      {relatedEssay.snippet}
                    </p>
                    <div className="mt-2 text-xs text-muted-foreground">
                      {relatedEssay.readTime}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back to Index */}
        <div className="mt-12 text-center">
          <Link 
            to={`/green-transition/${phase}`}
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

export default GreenTransitionEssayDetailTemplate;