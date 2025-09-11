import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import FSLISidebar from '@/components/FSLISidebar';
import { InlineEditor } from '@/components/inline/InlineEditor';
import { ExcelEmbedRenderer } from '@/components/ExcelEmbedRenderer';
import { useInlineContent } from '@/hooks/useInlineContent';
import { useRole } from '@/contexts/RoleContext';
import { useToast } from '@/hooks/use-toast';
import { normalizeSlug } from '@/hooks/useContent';
import { supabase } from '@/integrations/supabase/client';
import { TOCManager } from '@/components/fsli/TOCManager';
import { ReadingProgressBar } from '@/components/fsli/ReadingProgressBar';
import { SectionH2 } from '@/components/fsli/SectionH2';
import { CalloutBox } from '@/components/fsli/CalloutBox';
import { IssueCard } from '@/components/fsli/IssueCard';
import { JournalTable } from '@/components/fsli/JournalTable';
import { StepperComponent } from '@/components/fsli/StepperComponent';
import { BackToTop } from '@/components/fsli/BackToTop';
import { useScrollSpy } from '@/hooks/useScrollSpy';

interface DynamicFSLITemplateProps {
  slug: string;
}

interface PageData {
  id: string;
  title: string;
  subtitle?: string;
  notes_ref?: string;
  slug: string;
}

interface MetricData {
  id: string;
  label: string;
  value?: number;
  unit?: string;
}

interface SectionData {
  id: string;
  title: string;
  group: string;
  intro?: string;
  body?: string;
  takeaways?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  blocks?: {
    type: 'callout' | 'issueCards' | 'journalTable' | 'stepper';
    data: any;
  }[];
}

export const DynamicFSLITemplate: React.FC<DynamicFSLITemplateProps> = ({ slug }) => {
  const { isAdmin } = useRole();
  const { toast } = useToast();
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [sections, setSections] = useState<SectionData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Add validation for slug to prevent React errors
  if (!slug || typeof slug !== 'string') {
    console.error('DynamicFSLITemplate: invalid slug provided:', slug);
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex">
          <div className="flex-1 p-8">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-muted-foreground">Invalid Page</h1>
              <p className="text-muted-foreground mt-2">No page slug provided.</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const pageKey = normalizeSlug(slug);
  
  // Generate section IDs for scrollspy
  const sectionIds = sections.map(section => section?.id).filter(Boolean);
  const activeId = useScrollSpy(sectionIds);

  // Load page data and metrics from existing FSLI tables
  useEffect(() => {
    const loadPageData = async () => {
      setLoading(true);
      try {
        const normalizedSlug = normalizeSlug(slug);
        
        // Load page data
        const { data: pageResult } = await supabase
          .from('fsli_pages')
          .select('*')
          .eq('slug', normalizedSlug)
          .maybeSingle();

        if (pageResult) {
          setPageData(pageResult);
          
          // Load metrics
          const { data: metricsResult } = await supabase
            .from('fsli_metrics')
            .select('*')
            .eq('page_id', pageResult.id)
            .order('sort_order');
            
          if (metricsResult) {
            setMetrics(metricsResult);
          }

          // Generate default sections structure
          const defaultSections: SectionData[] = [
            {
              id: 'definition',
              title: 'Definition',
              group: 'Fundamentals',
              collapsible: false
            },
            {
              id: 'recognition',
              title: 'Recognition Criteria',
              group: 'Fundamentals',
              collapsible: false
            },
            {
              id: 'measurement',
              title: 'Measurement Principles',
              group: 'Fundamentals',
              collapsible: false
            },
            {
              id: 'implementation-steps',
              title: 'Implementation Steps',
              group: 'Implementation',
              collapsible: true,
              defaultCollapsed: typeof window !== 'undefined' ? window.innerWidth < 768 : true,
              blocks: [{
                type: 'stepper',
                data: []
              }]
            },
            {
              id: 'common-issues',
              title: 'Common Implementation Issues',
              group: 'Issues',
              collapsible: true,
              defaultCollapsed: typeof window !== 'undefined' ? window.innerWidth < 768 : true,
              blocks: [{
                type: 'issueCards',
                data: []
              }]
            },
            {
              id: 'practical-examples',
              title: 'Practical Examples',
              group: 'Examples',
              collapsible: false
            },
            {
              id: 'journal-entries',
              title: 'Journal Entry Examples',
              group: 'Examples',
              collapsible: false,
              blocks: [{
                type: 'journalTable',
                data: []
              }]
            },
            {
              id: 'disclosure-requirements',
              title: 'Disclosure Requirements',
              group: 'Disclosures',
              collapsible: false
            },
            {
              id: 'financial-statement-examples',
              title: 'Financial Statement Examples',
              group: 'Disclosures',
              collapsible: false
            }
          ];
          
          setSections(defaultSections);
        }
      } catch (error) {
        console.error('Error loading page data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPageData();
  }, [slug]);

  // Format metric values for display
  const formatMetricValue = (value: number | undefined, unit: string | undefined) => {
    if (value === undefined) return '';
    
    if (unit === 'Percent') {
      return `${value}%`;
    }
    
    if (unit === 'Thousands USD' || unit === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: value >= 1000000 ? 'compact' : 'standard',
        maximumFractionDigits: 0,
      }).format(value);
    }
    
    return new Intl.NumberFormat('en-US').format(value);
  };

  const handleSectionClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 96;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  };

  const renderSectionBlocks = (section: SectionData) => {
    if (!section.blocks) return null;

    return (
      <div className="space-y-6">
        {section.blocks.map((block, index) => {
          const blockId = `${section.id}_block_${index}`;
          
          switch (block.type) {
            case 'callout':
              return (
                <CalloutBox
                  key={blockId}
                  id={blockId}
                  pageKey={pageKey}
                  variant={block.data?.variant || 'info'}
                  copiable={block.data?.copiable || false}
                />
              );
            case 'issueCards':
              return (
                <IssueCard
                  key={blockId}
                  id={blockId}
                  pageKey={pageKey}
                  items={block.data?.items || []}
                />
              );
            case 'journalTable':
              return (
                <JournalTable
                  key={blockId}
                  id={blockId}
                  pageKey={pageKey}
                  entries={Array.isArray(block.data?.entries) ? block.data.entries : []}
                />
              );
            case 'stepper':
              return (
                <StepperComponent
                  key={blockId}
                  id={blockId}
                  pageKey={pageKey}
                  steps={block.data?.steps || []}
                />
              );
            default:
              return null;
          }
        })}
      </div>
    );
  };

  // Combine loading and null safety checks
  if (loading || !pageData) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex">
          <FSLISidebar />
          <div className="flex-1 p-8">
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-muted rounded w-1/3"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="space-y-3 mt-8">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-16 bg-muted rounded"></div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-muted-foreground">Page not found</h1>
                <p className="text-muted-foreground mt-2">The requested FSLI page could not be found.</p>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-plus-jakarta">
      <Header />
      <ReadingProgressBar />
      
      {/* Wikipedia-style responsive layout */}
      <div className="mx-auto px-6 lg:px-8 xl:px-12 2xl:px-20 py-8">
        <div className="grid grid-cols-12 gap-6 lg:gap-8 max-w-[1920px] mx-auto">
          
          {/* Left Sidebar - Hidden on mobile, collapsible on tablet, fixed on desktop */}
          <aside className="hidden lg:block lg:col-span-3 xl:col-span-3 2xl:col-span-2">
            <div className="sticky top-24 h-[calc(100vh-96px)] overflow-y-auto pr-4">
              <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                {/* Breadcrumb */}
                <div className="mb-6">
                  <Breadcrumb items={[
                    { label: 'Accounting', path: '/accounting' },
                    { label: 'FSLI', path: '/accounting/fsli' },
                    { label: pageData?.title || 'Loading...' }
                  ]} />
                </div>
                
                {/* Table of Contents */}
                <TOCManager 
                  sections={sections} 
                  activeId={activeId} 
                  onSectionClick={handleSectionClick} 
                />
              </div>
            </div>
          </aside>

          {/* Main Content - Responsive width */}
          <main className="col-span-12 lg:col-span-6 xl:col-span-6 2xl:col-span-8">
            <div className="max-w-wiki-main mx-auto">
              
              {/* Mobile breadcrumbs - only shown on mobile */}
              <div className="lg:hidden mb-6">
                <Breadcrumb items={[
                  { label: 'Accounting', path: '/accounting' },
                  { label: 'FSLI', path: '/accounting/fsli' },
                  { label: pageData?.title || 'Loading...' }
                ]} />
              </div>

              {/* Excel Embed Renderer */}
              <ExcelEmbedRenderer />

              {/* Article Header */}
              <header className="mb-8">
                <InlineEditor
                  pageKey={pageKey}
                  sectionKey="title"
                  placeholder="Page Title"
                  className="text-h1 font-bold text-foreground mb-4 leading-tight"
                />
                
                <InlineEditor
                  pageKey={pageKey}
                  sectionKey="subtitle"
                  placeholder="Indonesian: Page subtitle (optional)"
                  className="text-lg text-muted-foreground mb-2"
                />
                
                {pageData?.notes_ref && (
                  <p className="text-small italic text-muted-foreground">
                    Notes Reference: {pageData.notes_ref}
                  </p>
                )}
              </header>

              {/* Key Points Section */}
              <section className="mb-8">
                <h2 className="text-h2 font-semibold text-foreground mb-3 pb-1 border-b border-border">
                  Key Points
                </h2>
                
                {/* Display existing metrics */}
                {metrics?.length > 0 && (
                  <div className="rounded-lg border border-border bg-muted p-6 mb-6">
                    <ul className="list-disc pl-6 space-y-2 text-foreground">
                      {metrics.map(metric => (
                        <li key={metric?.id} className="flex justify-between items-center">
                          <span className="font-medium">{metric?.label}</span>
                          <span className="text-muted-foreground">
                            {formatMetricValue(metric?.value, metric?.unit)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="rounded-lg border border-border bg-muted p-6">
                  <InlineEditor
                    pageKey={pageKey}
                    sectionKey="key_points"
                    placeholder="Add key points and essential information here..."
                    className="prose max-w-none text-foreground"
                  />
                </div>
              </section>

              {/* Quote Box (if needed) */}
              <figure className="mb-8">
                <blockquote className="border-l-4 border-primary bg-muted p-4 rounded-r-md">
                  <InlineEditor
                    pageKey={pageKey}
                    sectionKey="quote"
                    placeholder="Add an optional quote or important note here..."
                    className="text-foreground italic"
                  />
                </blockquote>
                <figcaption className="mt-2 text-small text-muted-foreground">
                  <InlineEditor
                    pageKey={pageKey}
                    sectionKey="quote_source"
                    placeholder="Quote source (optional)"
                    className="text-small text-muted-foreground"
                  />
                </figcaption>
              </figure>

              <hr className="my-8 border-border" />

              {/* Dynamic content sections with Wikipedia-style formatting */}
              <div className="space-y-8">
                {sections?.map((section, index) => {
                  if (!section?.id) return null;
                  
                  return (
                    <SectionH2
                      key={section.id}
                      id={section.id}
                      pageKey={pageKey}
                      title={section?.title || 'Untitled Section'}
                      collapsible={section?.collapsible}
                      defaultCollapsed={section?.defaultCollapsed}
                    >
                      {renderSectionBlocks(section)}
                    </SectionH2>
                  );
                })}
              </div>

              <hr className="my-8 border-border" />

              {/* Navigation - Single instance at bottom */}
              <nav className="flex items-center justify-between gap-4 pt-8">
                <div className="flex-1">
                  <InlineEditor
                    pageKey={pageKey}
                    sectionKey="prev_link"
                    placeholder="← Previous: Link to previous page"
                    className="text-accent hover:underline font-semibold"
                  />
                </div>
                <div className="flex-1 text-right">
                  <InlineEditor
                    pageKey={pageKey}
                    sectionKey="next_link"
                    placeholder="Next: Link to next page →"
                    className="text-accent hover:underline font-semibold"
                  />
                </div>
              </nav>

            </div>
          </main>

          {/* Right Sidebar - Optional infobox space (empty for now but can be populated) */}
          <aside className="hidden 2xl:block 2xl:col-span-2">
            <div className="sticky top-24 h-[calc(100vh-96px)] overflow-y-auto pl-4">
              {/* Optional infobox content can be added here */}
            </div>
          </aside>
          
        </div>
      </div>

      <Footer />
      <BackToTop />
    </div>
  );
};