import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface WikipediaLayoutProps {
  sidebar?: React.ReactNode;
  children: React.ReactNode;
  rightSidebar?: React.ReactNode;
}

export const WikipediaLayout: React.FC<WikipediaLayoutProps> = ({ 
  sidebar, 
  children, 
  rightSidebar 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="mx-auto px-6 lg:px-8 xl:px-12 2xl:px-20 py-8">
      <div className="grid grid-cols-12 gap-6 lg:gap-8 max-w-[1920px] mx-auto">
        
        {/* Mobile Menu Toggle */}
        <div className="lg:hidden col-span-12 mb-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="inline-flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-md text-foreground hover:bg-muted transition-colors"
            aria-label="Toggle navigation menu"
          >
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
            {sidebarOpen ? 'Close Menu' : 'Navigation'}
          </button>
        </div>

        {/* Left Sidebar - Hidden on mobile unless toggled, collapsible on tablet, fixed on desktop */}
        <aside className={`
          lg:col-span-3 xl:col-span-3 2xl:col-span-2
          ${sidebarOpen ? 'col-span-12 block' : 'hidden lg:block'}
        `}>
          <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-96px)] lg:overflow-y-auto lg:pr-4">
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              {sidebar}
            </div>
          </div>
        </aside>

        {/* Main Content - Responsive width */}
        <main className={`
          col-span-12 lg:col-span-6 xl:col-span-6 2xl:col-span-8
          ${sidebarOpen ? 'hidden lg:block' : 'block'}
        `}>
          <div className="max-w-wiki-main mx-auto">
            {children}
          </div>
        </main>

        {/* Right Sidebar - Optional infobox space */}
        {rightSidebar && (
          <aside className="hidden 2xl:block 2xl:col-span-2">
            <div className="sticky top-24 h-[calc(100vh-96px)] overflow-y-auto pl-4">
              {rightSidebar}
            </div>
          </aside>
        )}
        
      </div>
    </div>
  );
};