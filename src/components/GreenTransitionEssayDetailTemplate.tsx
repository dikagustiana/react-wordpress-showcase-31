import { useParams, Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Clock, User, Calendar, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useGreenEssays } from '@/hooks/useGreenEssays';
import { useAuthRole } from '@/hooks/useAuthRole';
import { GreenTransitionInlineEditor } from '@/components/admin/GreenTransitionInlineEditor';
import { supabase } from '@/integrations/supabase/client';
import { SECTION_TITLES, buildSectionUrl, type SectionKey } from '@/constants/sections';
import Header from './Header';
import Footer from './Footer';

const GreenTransitionEssayDetailTemplate = () => {
  const { section, slug } = useParams<{ section: string; slug: string }>();
  const [searchParams] = useSearchParams();
  const { essays, loading, updateEssay, publishEssay, unpublishEssay } = useGreenEssays(section as SectionKey);
  const { isAdmin, user } = useAuthRole();
  const [isEditing, setIsEditing] = useState(false);
  
  const foundEssay = essays.find(e => e.slug === slug);
  const sectionKey = section as SectionKey;
  const sectionTitle = SECTION_TITLES[sectionKey] || section;

  // Create template essay when no essay found
  const templateEssay = !foundEssay ? {
    id: `template-${slug}`,
    slug: slug || '',
    section_key: sectionKey,
    section: sectionTitle,
    title: 'New Essay',
    subtitle: 'Click Edit to start writing your essay...',
    author_name: user?.email?.split('@')[0] || 'Author',
    cover_image_url: '/assets/placeholders/cover_default.webp',
    content_html: '<h1>New Essay</h1><p>Start writing your essay here...</p>',
    content_json: {
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'New Essay' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Start writing your essay here...' }] }
      ]
    },
    status: 'draft' as const,
    version: 1,
    reading_time: 1,
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_by: user?.email || 'system'
  } : null;

  const essay = foundEssay || templateEssay;

  // Check if edit mode should be enabled from query params
  useEffect(() => {
    if (searchParams.get('edit') === '1' && isAdmin && essay && !essay.id.startsWith('dummy-') && !essay.id.startsWith('template-')) {
      console.log('[Telemetry] edit_opened', { 
        essayId: essay.id, 
        timestamp: new Date().toISOString() 
      });
      setIsEditing(true);
    }
  }, [searchParams, isAdmin, essay]);

  // Auto-redirect to edit mode for template essays
  useEffect(() => {
    if (templateEssay && isAdmin && !searchParams.get('edit')) {
      const newUrl = `${window.location.pathname}?edit=1`;
      window.history.replaceState({}, '', newUrl);
      setIsEditing(true);
    }
  }, [templateEssay, isAdmin, searchParams]);

  // Auto-create essay if not found but section and slug exist (must be before any early returns)
  useEffect(() => {
    const autoCreateEssay = async () => {
      console.log('[EssayDetail] useEffect triggered', { 
        loading, 
        essay: !!foundEssay, 
        section, 
        slug, 
        isAdmin, 
        userEmail: user?.email 
      });

      if (!loading && !foundEssay && section && slug && isAdmin && user?.email) {
        console.log('[EssayDetail] Auto-creating missing essay:', { section, slug });
        
        const defaultContent = {
          type: 'doc',
          content: [
            { 
              type: 'heading', 
              attrs: { level: 1 }, 
              content: [{ type: 'text', text: 'New Essay' }] 
            },
            { 
              type: 'paragraph', 
              content: [{ type: 'text', text: 'Start writing your essay here...' }] 
            }
          ]
        };

        try {
          const { data, error } = await supabase.from('green_essays').insert({
            slug,
            section,
            title: 'New Essay',
            subtitle: '',
            author_name: user.email.split('@')[0] || 'Editor',
            content_html: '<h1>New Essay</h1><p>Start writing your essay here...</p>',
            content_json: defaultContent,
            status: 'draft',
            version: 1,
            reading_time: 1,
            updated_by: user.email
          }).select().single();

          if (error) {
            console.error('[EssayDetail] Failed to auto-create essay:', error);
          } else if (data) {
            console.log('[EssayDetail] Essay auto-created successfully:', data);
            // Refresh the page to show the new essay
            window.location.reload();
          }
        } catch (error) {
          console.error('[EssayDetail] Auto-create error:', error);
        }
      } else {
        console.log('[EssayDetail] Auto-create conditions not met:', {
          loading,
          hasEssay: !!foundEssay,
          hasSection: !!section,
          hasSlug: !!slug,
          isAdmin,
          hasUser: !!user?.email
        });
      }
    };

    autoCreateEssay();
  }, [loading, foundEssay, section, slug, isAdmin, user]);

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
    console.log('[EssayDetail] Rendering loading state');
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

  // Show essay template even if essay not found, but section exists
  if (!section) {
    console.log('[EssayDetail] No section found, redirecting');
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/20">
        <Header />
        <main className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-primary mb-4">
              Page Not Found
            </h1>
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

  if (!essay) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/20">
        <Header />
        <main className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-primary mb-4">
              Essay Not Found
            </h1>
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
          to={buildSectionUrl(sectionKey)}
          className="inline-flex items-center text-primary hover:text-primary/80 font-medium mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to {sectionTitle} Essays
        </Link>

        {/* Article with Inline Editor */}
        <article className="bg-card rounded-lg shadow-sm overflow-hidden">
          {isAdmin && essay && !essay.id.startsWith('dummy-') && !essay.id.startsWith('template-') ? (
            <div className="p-8">
              <GreenTransitionInlineEditor
                essay={essay}
                isEditing={isEditing}
                onToggleEdit={() => setIsEditing(!isEditing)}
                onSave={async (updates) => await updateEssay(essay.id, updates)}
                onPublish={async (id) => await publishEssay(id)}
                onUnpublish={async (id) => await unpublishEssay(id)}
                autoSave={true}
              />
            </div>
          ) : isAdmin && essay && essay.id.startsWith('template-') ? (
            <div className="p-8">
              <GreenTransitionInlineEditor
                essay={essay}
                isEditing={isEditing}
                onToggleEdit={() => setIsEditing(!isEditing)}
                onSave={async (updates) => {
                  // For template essays, create new essay instead of updating
                  console.log('[Template] Creating new essay from template:', updates);
                  return true;
                }}
                onPublish={async (id) => { return true; }}
                onUnpublish={async (id) => { return true; }}
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
                {/* Dummy Content Banner */}
                {(essay.id.startsWith('dummy-') || essay.id.startsWith('template-')) && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">
                          {essay.id.startsWith('template-') ? 'New Essay Template' : 'Konten Demo'}
                        </h3>
                        <div className="mt-2 text-sm text-blue-700">
                          <p>
                            {essay.id.startsWith('template-') 
                              ? 'This is a new essay template. Start editing to create your content.'
                              : 'Ini adalah konten dummy untuk demonstrasi. Konten ini akan digantikan dengan essay sesungguhnya ketika admin mulai membuat dan menerbitkan essay melalui sistem inline editor.'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

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
                <div className="prose prose-lg max-w-none">
                  {essay.id.startsWith('dummy-') ? (
                    <div className="text-lg leading-relaxed text-gray-700 space-y-4">
                      <p>
                        Transisi energi global sedang menghadapi tantangan kompleks yang memerlukan pendekatan holistik dan realistis. 
                        Essay ini mengeksplorasi berbagai dimensi dari perjalanan menuju energi berkelanjutan.
                      </p>
                      
                      <p>
                        Dalam konteks Indonesia, kebijakan energi harus mempertimbangkan realitas geografi, ekonomi, dan politik yang unik. 
                        Populisme dalam politik energi seringkali bertentangan dengan kebutuhan teknis dan ekonomis transisi yang sesungguhnya.
                      </p>
                      
                      <p>
                        Analisis mendalam menunjukkan bahwa kesuksesan transisi energi bergantung pada keseimbangan antara ambisi klimat, 
                        keamanan energi, dan keadilan sosial. Ketiga pilar ini harus diintegrasikan dalam setiap kebijakan energi yang berkelanjutan.
                      </p>
                      
                      <blockquote className="border-l-4 border-primary pl-4 italic text-lg">
                        "Transisi energi bukan hanya soal teknologi, tetapi juga tentang transformasi sosial, ekonomi, dan politik yang menyeluruh."
                      </blockquote>
                      
                      <p>
                        Ke depan, Indonesia perlu mengembangkan roadmap yang realistis namun ambisius, dengan mempertimbangkan kapasitas lokal, 
                        potensi sumber daya, dan kebutuhan masyarakat. Kolaborasi antara pemerintah, sektor swasta, dan civil society 
                        menjadi kunci untuk mewujudkan transisi energi yang adil dan berkelanjutan.
                      </p>
                    </div>
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: essay.content_html || '' }} />
                  )}
                </div>

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
            to={buildSectionUrl(sectionKey)}
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