import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, User, Calendar, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useGreenEssays } from '@/hooks/useGreenEssays';
import { useAuthRole } from '@/hooks/useAuthRole';
import { GreenTransitionInlineEditor } from '@/components/admin/GreenTransitionInlineEditor';
import Header from './Header';
import Footer from './Footer';

const sectionTitles: Record<string, string> = {
  'where-we-are-now': 'Where We Are Now',
  'challenges-ahead': 'Challenges Ahead', 
  'pathways-forward': 'Pathways Forward'
};

const GreenTransitionEssayDetailTemplate = () => {
  const { section, slug } = useParams<{ section: string; slug: string }>();
  const { essays, loading, updateEssay } = useGreenEssays(section);
  const { isAdmin } = useAuthRole();
  const [isEditing, setIsEditing] = useState(false);
  
  const essay = essays.find(e => e.slug === slug);
  const sectionTitle = sectionTitles[section || ''] || section;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: essay?.title,
        text: essay?.subtitle,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/20">
        <Header />
        <main className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading essay...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!essay || !section) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/20">
        <Header />
        <main className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-primary mb-4">Essay Not Found</h1>
            <Link 
              to="/green-transition"
              className="text-primary hover:text-primary/80 font-medium"
            >
              ← Back to The Green Transition
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
          to={`/green-transition/${section}`}
          className="inline-flex items-center text-primary hover:text-primary/80 font-medium mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to {sectionTitle} Essays
        </Link>

        {/* Article with Inline Editor */}
        <article className="bg-card rounded-lg shadow-sm overflow-hidden">
          {isAdmin ? (
            <div className="p-8">
              <GreenTransitionInlineEditor
                essay={essay}
                isEditing={isEditing}
                onToggleEdit={() => setIsEditing(!isEditing)}
                onSave={async (updates) => await updateEssay(essay.id, updates)}
                autoSave={true}
              />
            </div>
          ) : (
            <>
              {/* Featured Image */}
              {essay.cover_image_url && (
                <div className="w-full h-80 bg-gray-200 overflow-hidden">
                  <img 
                    src={essay.cover_image_url} 
                    alt={essay.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="p-8">
                {/* Header */}
                <div className="mb-8">
                  {/* Category Badge */}
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
                    {sectionTitle}
                  </div>
                  
                  {/* Title */}
                  <h1 className="text-4xl font-bold text-primary mb-4 leading-tight">
                    {essay.title}
                  </h1>
                  
                  {/* Subtitle */}
                  {essay.subtitle && (
                    <p className="text-xl text-muted-foreground leading-relaxed mb-6">
                      {essay.subtitle}
                    </p>
                  )}
                  
                  {/* Meta Information & Share */}
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center text-sm text-muted-foreground space-x-6">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        <span className="font-medium">{essay.author_name}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{new Date(essay.updated_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{essay.reading_time} min read</span>
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
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: essay.content_html || '' }}
                />

                {/* Tags */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-muted-foreground">Tags:</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {sectionTitle}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      Green Transition
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      Sustainability
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </article>

        {/* Author Box */}
        <div className="mt-8 bg-card rounded-lg shadow-sm p-6">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground mb-2">{essay.author_name}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Expert in sustainable energy policy and green transition strategies. 
                Passionate about bridging the gap between environmental science and practical implementation.
              </p>
            </div>
          </div>
        </div>

        {/* Back to Index */}
        <div className="mt-12 text-center">
          <Link 
            to={`/green-transition/${section}`}
            className="inline-flex items-center bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            View More {sectionTitle} Essays
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default GreenTransitionEssayDetailTemplate;