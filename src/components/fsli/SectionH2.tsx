import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { InlineEditor } from '@/components/inline/InlineEditor';
import { useRole } from '@/contexts/RoleContext';
import { useToast } from '@/hooks/use-toast';
import { ChevronDown, ChevronRight, Link, ArrowLeft, ArrowRight } from 'lucide-react';

interface SectionH2Props {
  id: string;
  pageKey: string;
  title?: string;
  intro?: string;
  body?: string;
  takeaways?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  prevSection?: { id: string; title: string };
  nextSection?: { id: string; title: string };
  children?: React.ReactNode;
  className?: string;
}

export const SectionH2: React.FC<SectionH2Props> = ({
  id,
  pageKey,
  title,
  intro,
  body,
  takeaways,
  collapsible = false,
  defaultCollapsed = false,
  prevSection,
  nextSection,
  children,
  className = ""
}) => {
  const { isAdmin } = useRole();
  const { toast } = useToast();
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const copyLink = async () => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied",
        description: "Section link copied to clipboard",
        duration: 2000,
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy link to clipboard",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const scrollToSection = (sectionId: string) => {
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

  return (
    <section 
      id={id} 
      className={`scroll-mt-24 mb-12 ${className}`}
      style={{ scrollMarginTop: '96px' }}
    >
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6 group">
        <div className="flex items-center gap-3 flex-1">
          {collapsible && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 hover:bg-muted rounded transition-colors"
              aria-label={isCollapsed ? 'Expand section' : 'Collapse section'}
            >
              {isCollapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
          )}
          
          <h2 className="text-2xl font-semibold flex-1">
            <InlineEditor
              pageKey={pageKey}
              sectionKey={`${id}_title`}
              placeholder="Section Title"
              className="outline-none"
            />
          </h2>
        </div>

        {/* Copy Link Button */}
        <button
          onClick={copyLink}
          className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 p-2 hover:bg-muted rounded transition-all focus:opacity-100"
          aria-label="Copy link to this section"
          tabIndex={0}
        >
          <Link className="h-4 w-4" />
        </button>
      </div>

      {/* Section Content */}
      {!isCollapsed && (
        <>
          {/* Intro */}
          {(intro || isAdmin) && (
            <div className="mb-6">
              <InlineEditor
                pageKey={pageKey}
                sectionKey={`${id}_intro`}
                placeholder="Section introduction..."
                className="text-lg text-muted-foreground leading-relaxed"
              />
            </div>
          )}

          {/* Body */}
          <div className="mb-8">
            <InlineEditor
              pageKey={pageKey}
              sectionKey={`${id}_body`}
              placeholder="Section content..."
              className="prose max-w-none leading-relaxed"
            />
          </div>

          {/* Children (custom content blocks) */}
          {children && (
            <div className="mb-8">
              {children}
            </div>
          )}

          {/* Takeaways */}
          {(takeaways || isAdmin) && (
            <div className="mb-8 p-4 bg-accent/10 border border-accent/20 rounded-lg">
              <h4 className="font-medium mb-2 text-accent-foreground">Takeaways</h4>
              <InlineEditor
                pageKey={pageKey}
                sectionKey={`${id}_takeaways`}
                placeholder="Key takeaways (keep to 2 sentences)..."
                className="text-sm leading-relaxed text-accent-foreground"
              />
            </div>
          )}

          {/* Prev/Next Navigation */}
          {(prevSection || nextSection) && (
            <div className="flex justify-between items-center pt-6 border-t border-border">
              {prevSection ? (
                <button
                  onClick={() => scrollToSection(prevSection.id)}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                  <div>
                    <div className="text-xs">Previous</div>
                    <div className="font-medium">{prevSection.title}</div>
                  </div>
                </button>
              ) : <div />}

              {nextSection && (
                <button
                  onClick={() => scrollToSection(nextSection.id)}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors text-right group"
                >
                  <div>
                    <div className="text-xs">Next</div>
                    <div className="font-medium">{nextSection.title}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
};