import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, User, Calendar } from 'lucide-react';
import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { getAllGreenTransitionEssaysForPhase, getGreenTransitionPhaseTitle } from '../lib/greenTransitionData';

const GreenTransitionEssayListTemplate = () => {
  const { phase } = useParams<{ phase: string }>();
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const essaysPerPage = 6;
  
  const essays = getAllGreenTransitionEssaysForPhase(phase || '');
  const phaseTitle = getGreenTransitionPhaseTitle(phase || '');

  // Sort essays based on selection
  const sortedEssays = [...essays].sort((a, b) => {
    if (sortBy === 'latest') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    // For popular, we'll just return as-is for now (could implement view counts later)
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedEssays.length / essaysPerPage);
  const startIndex = (currentPage - 1) * essaysPerPage;
  const currentEssays = sortedEssays.slice(startIndex, startIndex + essaysPerPage);

  if (!phase) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/20">
        <Header />
        <main className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-primary mb-4">Phase Not Found</h1>
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
          <h1 className="text-4xl font-bold text-primary mb-4 font-plus-jakarta">
            {phaseTitle} Essays
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Explore in-depth analysis and insights about {phaseTitle.toLowerCase()} in the context of global green transition.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as 'latest' | 'popular')}
              className="px-3 py-1 border border-input rounded-lg text-sm bg-background"
            >
              <option value="latest">Latest</option>
              <option value="popular">Popular</option>
            </select>
          </div>
          <div className="text-sm text-muted-foreground">
            {essays.length} essays found
          </div>
        </div>

        {/* Essays Grid */}
        {currentEssays.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentEssays.map((essay) => (
              <Link
                key={essay.id}
                to={`/green-transition/${phase}/${essay.id}`}
                className="group block bg-card-bg-light rounded-[var(--card-radius)] shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] transition-all duration-300 overflow-hidden"
              >
                {/* Thumbnail */}
                <div className="w-full h-48 bg-gray-200 overflow-hidden">
                  <img 
                    src={essay.thumbnail} 
                    alt={essay.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                
                {/* Content */}
                <div className="p-6">
                  {/* Category Badge */}
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-card-icon-bg text-card-title mb-3">
                    {phaseTitle}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-bold text-card-title mb-3 line-clamp-2 group-hover:text-card-cta transition-colors">
                    {essay.title}
                  </h3>
                  
                  {/* Snippet */}
                  <p className="text-card-description text-sm leading-relaxed mb-4 line-clamp-3">
                    {essay.snippet}
                  </p>
                  
                  {/* Meta Information */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        <span>{essay.author}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>{essay.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{essay.readTime}</span>
                    </div>
                  </div>
                  
                  {/* Read Button */}
                  <div className="mt-4 flex items-center text-card-cta font-semibold text-sm">
                    Read Essay
                    <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No essays found for this phase yet.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm border border-input rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent"
            >
              Previous
            </button>
            
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 text-sm rounded-lg ${
                    currentPage === page
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-input hover:bg-accent'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm border border-input rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent"
            >
              Next
            </button>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default GreenTransitionEssayListTemplate;