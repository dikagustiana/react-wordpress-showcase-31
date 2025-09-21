import { ArrowLeft, Calendar, Clock, Plus, User } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getAllEssaysForPhase, getPhaseTitle } from '../lib/essayData';
import Footer from './Footer';
import Header from './Header';

const EssayListTemplate = () => {
  const { phase } = useParams<{ phase: string }>();
  const essays = getAllEssaysForPhase(phase || '');
  const phaseTitle = getPhaseTitle(phase || '');
  const [showModal, setShowModal] = useState(false);

  if (!phase) {
    return <div>Phase not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/20">
      <Header />

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Back Button */}
        <Link
          to="/critical-thinking-research"
          className="inline-flex items-center text-card-cta hover:text-card-cta/80 font-medium mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Critical Thinking & Research
        </Link>

        {/* Page Header */}
        <div className="mb-12">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-4xl font-bold text-primary font-plus-jakarta">
              {phaseTitle} Essays
            </h1>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Essay
            </button>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Deep dive into the {phaseTitle.toLowerCase()} phase with these
            carefully curated essays and insights.
          </p>
        </div>

        {/* Essays List */}
        <div className="space-y-6">
          {essays.map((essay) => (
            <Link
              key={essay.id}
              to={`/critical-thinking-research/${phase}/${essay.id}`}
              className="block group"
            >
              <article className="bg-card-bg-light hover:bg-card-bg-light-hover rounded-[var(--card-radius)] shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] p-6 transition-all duration-300 hover:-translate-y-1 font-plus-jakarta">
                <div className="flex gap-6">
                  {/* Thumbnail */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={essay.thumbnail}
                        alt={essay.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-card-title mb-3 group-hover:text-card-cta transition-colors">
                      {essay.title}
                    </h2>

                    <p className="text-card-description text-sm leading-relaxed mb-4">
                      {essay.snippet}
                    </p>

                    {/* Meta Information */}
                    <div className="flex items-center text-xs text-muted-foreground space-x-4">
                      <div className="flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        <span>{essay.author}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>{essay.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{essay.readTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex-shrink-0 flex items-center">
                    <div className="w-8 h-8 rounded-full bg-card-icon-bg flex items-center justify-center group-hover:bg-card-cta group-hover:text-white transition-all duration-300">
                      <span className="text-sm transition-transform group-hover:translate-x-0.5">
                        →
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {essays.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No essays found for this phase.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default EssayListTemplate;
