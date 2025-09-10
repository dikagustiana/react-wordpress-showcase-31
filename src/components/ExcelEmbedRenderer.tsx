import React, { useEffect } from 'react';
import { ExcelEmbed } from '@/components/inline/ExcelEmbed';

// Component to render Excel embeds in content
export const ExcelEmbedRenderer: React.FC = () => {
  useEffect(() => {
    // Find all Excel embed placeholders and replace with actual components
    const replaceExcelEmbeds = () => {
      const wrappers = document.querySelectorAll('.excel-embed-wrapper');
      
      wrappers.forEach((wrapper) => {
        const url = wrapper.getAttribute('data-excel-url');
        const title = wrapper.getAttribute('data-excel-title');
        
        if (url) {
          // Create a container div
          const container = document.createElement('div');
          wrapper.parentNode?.replaceChild(container, wrapper);
          
          // Render ExcelEmbed component here (this would need React rendering)
          // For now, we'll create a simpler iframe solution
          const iframe = document.createElement('iframe');
          iframe.src = url;
          iframe.style.width = '100%';
          iframe.style.height = '600px';
          iframe.style.border = '1px solid #e5e7eb';
          iframe.style.borderRadius = '8px';
          iframe.setAttribute('frameborder', '0');
          iframe.setAttribute('loading', 'lazy');
          iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
          iframe.setAttribute('allowfullscreen', 'true');
          iframe.title = title || 'Excel Document';
          
          if (title) {
            const titleEl = document.createElement('h4');
            titleEl.textContent = title;
            titleEl.className = 'text-lg font-semibold mb-3 text-fsli-text';
            container.appendChild(titleEl);
          }
          
          const wrapperDiv = document.createElement('div');
          wrapperDiv.className = 'border border-fsli-border rounded-lg overflow-hidden shadow-sm';
          wrapperDiv.appendChild(iframe);
          container.appendChild(wrapperDiv);
        }
      });
    };

    // Run on mount and whenever content changes
    replaceExcelEmbeds();
    
    // Create a mutation observer to watch for content changes
    const observer = new MutationObserver(replaceExcelEmbeds);
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, []);

  return null; // This component doesn't render anything itself
};