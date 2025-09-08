import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { List, ChevronRight } from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';

interface TOCItem {
  id: string;
  title: string;
  group: string;
  order: number;
}

interface TOCGroup {
  name: string;
  items: TOCItem[];
  expanded: boolean;
}

interface TOCManagerProps {
  sections: any[];
  activeId: string;
  onSectionClick: (id: string) => void;
  onReorder?: (items: TOCItem[]) => void;
  className?: string;
}

export const TOCManager: React.FC<TOCManagerProps> = ({
  sections,
  activeId,
  onSectionClick,
  onReorder,
  className = ""
}) => {
  console.log('TOCManager: sections=', sections, 'activeId=', activeId);
  
  const { isAdmin } = useRole();
  
  console.log('TOCManager: About to call useState for groups');
  const [groups, setGroups] = useState<TOCGroup[]>([]);
  
  console.log('TOCManager: About to call useState for isVisible');
  const [isVisible, setIsVisible] = useState(false);

  // Generate TOC from sections
  useEffect(() => {
    const tocItems: TOCItem[] = sections.map((section, index) => ({
      id: section.id,
      title: section.title || `Section ${index + 1}`,
      group: section.group || 'Fundamentals',
      order: index
    }));

    // Group items
    const groupMap = new Map<string, TOCItem[]>();
    tocItems.forEach(item => {
      if (!groupMap.has(item.group)) {
        groupMap.set(item.group, []);
      }
      groupMap.get(item.group)!.push(item);
    });

    const groupedTOC: TOCGroup[] = Array.from(groupMap.entries()).map(([name, items]) => ({
      name,
      items: items.sort((a, b) => a.order - b.order),
      expanded: true
    }));

    setGroups(groupedTOC);
  }, [sections]);

  // Show/hide based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      setIsVisible(scrollPercent > 5);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleGroup = (groupName: string) => {
    setGroups(prev => prev.map(group => 
      group.name === groupName ? { ...group, expanded: !group.expanded } : group
    ));
  };

  const handleSectionClick = (id: string) => {
    onSectionClick(id);
    // Smooth scroll with offset
    const element = document.getElementById(id);
    if (element) {
      const offset = 96;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  };

  const DesktopTOC = () => (
    <div className={`sticky top-20 w-64 max-h-[80vh] overflow-y-auto ${className}`}>
      <div className="p-4 bg-card border border-border rounded-lg">
        <h3 className="font-semibold text-sm mb-4 text-muted-foreground">On this page</h3>
        <nav className="space-y-1">
          {groups.map(group => (
            <div key={group.name}>
              <button
                onClick={() => toggleGroup(group.name)}
                className="flex items-center justify-between w-full text-left text-xs font-medium text-muted-foreground hover:text-foreground mb-2"
              >
                {group.name}
                <ChevronRight className={`h-3 w-3 transition-transform ${group.expanded ? 'rotate-90' : ''}`} />
              </button>
              {group.expanded && (
                <div className="ml-2 space-y-1">
                  {group.items.map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleSectionClick(item.id)}
                      className={`block w-full text-left text-sm py-1 px-2 rounded transition-colors ${
                        activeId === item.id
                          ? 'text-accent-foreground bg-accent border-l-2 border-primary'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      {item.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );

  const MobileTOC = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="fixed bottom-4 right-4 z-50">
          <List className="h-4 w-4 mr-1" />
          On this page
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[50vh]">
        <SheetHeader>
          <SheetTitle>Table of Contents</SheetTitle>
        </SheetHeader>
        <nav className="mt-4 space-y-2 overflow-y-auto">
          {groups.map(group => (
            <div key={group.name}>
              <div className="font-medium text-sm mb-2 text-muted-foreground">{group.name}</div>
              <div className="space-y-1 ml-2">
                {group.items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleSectionClick(item.id)}
                    className={`block w-full text-left text-sm py-2 px-3 rounded transition-colors ${
                      activeId === item.id
                        ? 'text-accent-foreground bg-accent'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );

  if (!isVisible || groups.length === 0) return null;

  return (
    <>
      {/* Desktop TOC */}
      <div className="hidden lg:block">
        <DesktopTOC />
      </div>
      
      {/* Mobile TOC */}
      <div className="lg:hidden">
        <MobileTOC />
      </div>
    </>
  );
};