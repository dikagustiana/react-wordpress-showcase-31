import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TreePine, Plus, Clock, User, Calendar } from 'lucide-react';
import { useState } from 'react';
import { useAuthRole } from '@/hooks/useAuthRole';
import { useGreenEssays } from '@/hooks/useGreenEssays';
import { AddEssayModal } from '@/components/admin/AddEssayModal';
import { SECTION_TITLES, SECTION_DESCRIPTIONS, buildEssayUrl, type SectionKey } from '@/constants/sections';
import Header from './Header';
import Footer from './Footer';

const GreenTransitionEssayListTemplate = () => {
  const { phase } = useParams<{ phase: string }>();
  const { isAdmin } = useAuthRole();
  const { essays, loading, refreshEssays } = useGreenEssays(phase as SectionKey);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleEssayCreated = async (essayId: string, slug: string, path: string) => {
    // Close modal
    setShowModal(false);
    
    // Refresh the essay list to show the new essay
    await refreshEssays();
    
    // Navigate to the new essay in edit mode
    navigate(`${path}?edit=1`);
  };
  
  const sectionKey = phase as SectionKey;
  const sectionTitle = SECTION_TITLES[sectionKey] || 'Essays';
  const sectionDescription = SECTION_DESCRIPTIONS[sectionKey] || 'Explore essays in this section.';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/20">
        <Header />
        <main className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading essays...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!phase) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/20">
        <Header />
        <main className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-primary mb-4">Section Not Found</h1>
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
      
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Back Button */}
        <Link 
          to="/green-transition"
          className="inline-flex items-center text-card-cta hover:text-card-cta/80 font-medium mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to The Green Transition
        </Link>

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-primary mb-4 font-plus-jakarta">
                {sectionTitle} Essays
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl">
                {sectionDescription}
              </p>
            </div>
            
            {/* Add Essay Button (Admin Only) */}
            {isAdmin && (
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Essay
              </button>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
            <select 
              value="latest"
              className="px-3 py-1 border border-input rounded-lg text-sm bg-background"
            >
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
          <div className="text-sm text-muted-foreground">
            {essays.length} essays found
          </div>
        </div>

        {/* Essays Grid */}
        {essays.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {essays.map((essay) => (
              <Link
                key={essay.id}
                to={buildEssayUrl(sectionKey, essay.slug)}
                className="group block bg-card rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                {/* Cover Image */}
                {essay.cover_image_url && (
                  <div className="w-full h-48 bg-gray-200 overflow-hidden">
                    <img 
                      src={essay.cover_image_url} 
                      alt={essay.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                
                {/* Content */}
                <div className="p-6">
                  {/* Status Badge */}
                  {essay.status === 'draft' && (
                    <div className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800 mb-3">
                      Draft
                    </div>
                  )}
                  
                  {/* Title */}
                  <h3 className="text-xl font-bold text-card-title mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {essay.title}
                  </h3>
                  
                  {/* Subtitle/Snippet */}
                  {essay.subtitle && (
                    <p className="text-card-description text-sm leading-relaxed mb-4 line-clamp-3">
                      {essay.subtitle}
                    </p>
                  )}
                  
                  {/* Meta Information */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        <span>{essay.author_name}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{essay.reading_time} min read</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>{new Date(essay.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  {/* Read Button */}
                  <div className="flex items-center text-primary font-semibold text-sm">
                    Read Essay
                    <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <TreePine className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              No essays found for this section yet.
            </p>
            {isAdmin && (
              <p className="text-sm text-muted-foreground">
                Click the "Add Essay" button above to create the first essay.
              </p>
            )}
          </div>
        )}

        {/* Add Essay Modal */}
        {isAdmin && sectionKey && (
          <AddEssayModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            section={sectionKey}
            onEssayCreated={handleEssayCreated}
          />
        )}

      </main>
      
      <Footer />
    </div>
  );
};

export default GreenTransitionEssayListTemplate;