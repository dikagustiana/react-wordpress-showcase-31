import { ArrowLeft, Calendar, Clock, Plus, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Essay,
  addEssayToPhase,
  getAllEssaysForPhaseWithCustom,
  getPhaseTitle,
  isCustomEssay,
  removeCustomEssay,
} from '../lib/essayData';
import '../utils/essayDebug'; // Load debug utilities
import Footer from './Footer';
import Header from './Header';

const EssayListTemplate = () => {
  const { phase } = useParams<{ phase: string }>();
  const [essays, setEssays] = useState<Essay[]>([]);
  const phaseTitle = getPhaseTitle(phase || '');
  const [showModal, setShowModal] = useState(false);
  const [newEssay, setNewEssay] = useState({
    title: '',
    snippet: '',
    author: '',
    readTime: '',
  });

  // Load essays when component mounts or phase changes
  useEffect(() => {
    setEssays(getAllEssaysForPhaseWithCustom(phase || ''));
  }, [phase]);

  const handleAddEssay = () => {
    if (
      newEssay.title &&
      newEssay.snippet &&
      newEssay.author &&
      newEssay.readTime
    ) {
      const essay: Essay = {
        id: `${phase}-${Date.now()}`,
        title: newEssay.title,
        snippet: newEssay.snippet,
        author: newEssay.author,
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        }),
        readTime: newEssay.readTime,
        thumbnail: '/placeholder.svg',
        content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum at risus mi. Sed congue facilisis libero, ut cursus ipsum tempor vel. Donec euismod, nunc vel tincidunt lacinia, nunc nisl aliquam nunc, vel aliquam nunc nisl vel nunc. Vestibulum at risus mi. Sed congue facilisis libero, ut cursus ipsum tempor vel.

Mauris vel lorem sed nunc tincidunt lacinia. Sed vel nunc vel lorem tincidunt lacinia. Donec euismod, nunc vel tincidunt lacinia, nunc nisl aliquam nunc, vel aliquam nunc nisl vel nunc. Vestibulum at risus mi. Sed congue facililis libero, ut cursus ipsum tempor vel.

Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed vel nunc vel lorem tincidunt lacinia. Donec euismod, nunc vel tincidunt lacinia, nunc nisl aliquam nunc, vel aliquam nunc nisl vel nunc.

Vestibulum at risus mi. Sed congue facilisis libero, ut cursus ipsum tempor vel. Donec euismod, nunc vel tincidunt lacinia, nunc nisl aliquam nunc, vel aliquam nunc nisl vel nunc. Mauris vel lorem sed nunc tincidunt lacinia.

Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla.

Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor.`,
        phase: phase || '',
      };

      // Add to localStorage
      addEssayToPhase(phase || '', essay);

      // Update local state
      setEssays(getAllEssaysForPhaseWithCustom(phase || ''));

      // Reset form and close modal
      setNewEssay({ title: '', snippet: '', author: '', readTime: '' });
      setShowModal(false);
    }
  };

  const handleDeleteEssay = (essayId: string) => {
    if (
      isCustomEssay(essayId) &&
      confirm('Are you sure you want to delete this essay?')
    ) {
      // Remove from localStorage
      removeCustomEssay(phase || '', essayId);

      // Update local state
      setEssays(getAllEssaysForPhaseWithCustom(phase || ''));
    }
  };

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
          {essays.map((essay) => {
            const isCustom = isCustomEssay(essay.id);
            return (
              <div key={essay.id} className="relative">
                <Link
                  to={`/critical-thinking-research/${phase}/${essay.id}`}
                  className="block group"
                >
                  <article
                    className={`${
                      isCustom
                        ? 'bg-blue-50 border-2 border-blue-200'
                        : 'bg-card-bg-light'
                    } hover:bg-card-bg-light-hover rounded-[var(--card-radius)] shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] p-6 transition-all duration-300 hover:-translate-y-1 font-plus-jakarta`}
                  >
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
                        <div className="flex items-start justify-between mb-3">
                          <h2 className="text-xl font-bold text-card-title group-hover:text-card-cta transition-colors">
                            {essay.title}
                            {isCustom && (
                              <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                Custom
                              </span>
                            )}
                          </h2>
                        </div>

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

                {/* Delete Button for Custom Essays */}
                {isCustom && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleDeleteEssay(essay.id);
                    }}
                    className="absolute top-4 right-4 px-3 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors z-10 text-sm font-semibold"
                    title="Hapus custom essay ini"
                  >
                    hapus
                  </button>
                )}
              </div>
            );
          })}
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

      {/* Add Essay Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Add New Essay</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddEssay();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newEssay.title}
                  onChange={(e) =>
                    setNewEssay({ ...newEssay, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter essay title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description/Snippet
                </label>
                <textarea
                  value={newEssay.snippet}
                  onChange={(e) =>
                    setNewEssay({ ...newEssay, snippet: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter essay description"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Author
                </label>
                <input
                  type="text"
                  value={newEssay.author}
                  onChange={(e) =>
                    setNewEssay({ ...newEssay, author: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter author name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Read Time
                </label>
                <input
                  type="text"
                  value={newEssay.readTime}
                  onChange={(e) =>
                    setNewEssay({ ...newEssay, readTime: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g. 5 min"
                  required
                />
              </div>

              <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-600">
                <p>
                  <strong>Auto-generated fields:</strong>
                </p>
                <p>
                  • ID: {phase}-{Date.now()}
                </p>
                <p>• Thumbnail: /placeholder.svg</p>
                <p>• Content: Lorem ipsum content</p>
                <p>• Phase: {phase}</p>
                <p>
                  • Date:{' '}
                  {new Date().toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
                >
                  Add Essay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EssayListTemplate;
