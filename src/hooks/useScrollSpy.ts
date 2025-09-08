import { useState, useEffect } from 'react';

export const useScrollSpy = (sectionIds: string[], options?: {
  threshold?: number;
  rootMargin?: string;
}) => {
  console.log('useScrollSpy: Starting with sectionIds:', sectionIds);
  
  const [activeId, setActiveId] = useState<string>('');
  const threshold = options?.threshold || 0.35;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find entries that are intersecting
        const intersectingEntries = entries.filter(entry => entry.isIntersecting);
        
        if (intersectingEntries.length === 0) return;

        // Sort by intersection ratio and position
        intersectingEntries.sort((a, b) => {
          // If one has higher intersection ratio, prefer it
          if (Math.abs(a.intersectionRatio - b.intersectionRatio) > 0.1) {
            return b.intersectionRatio - a.intersectionRatio;
          }
          
          // Otherwise, prefer the one that's higher on the page
          const aRect = a.boundingClientRect;
          const bRect = b.boundingClientRect;
          return aRect.top - bRect.top;
        });

        // Set the first (best) match as active
        const bestMatch = intersectingEntries[0];
        if (bestMatch) {
          setActiveId(bestMatch.target.id);
        }
      },
      {
        rootMargin: options?.rootMargin || '-35% 0px -65% 0px',
        threshold: [0, 0.1, 0.25, 0.35, 0.5, 0.75, 1.0]
      }
    );

    // Observe all sections
    sectionIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [sectionIds, threshold, options?.rootMargin]);

  return activeId;
};
