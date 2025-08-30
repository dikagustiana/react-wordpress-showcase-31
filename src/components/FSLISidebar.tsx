import { Link, useLocation } from 'react-router-dom';
import { fsliData, FSLIItem } from '../lib/fsliData';

interface FSLISidebarProps {
  currentSlug?: string;
}

const FSLISidebar = ({ currentSlug }: FSLISidebarProps) => {
  const location = useLocation();
  
  // Group FSLI items by taxonomy
  const currentAssets = fsliData.slice(0, 11); // First 11 items are current assets
  const nonCurrentAssets = fsliData.slice(11); // Rest are non-current assets
  
  const renderSidebarGroup = (title: string, items: FSLIItem[]) => (
    <div className="mb-8">
      <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4 px-4 font-plus-jakarta">
        {title}
      </h3>
      <nav className="space-y-0.5">
        {items.map((item) => {
          const isActive = currentSlug === item.slug;
          const itemPath = `/accounting/fsli/${item.slug}`;
          
          if (isActive) {
            // Show active item with special styling
            return (
              <div
                key={item.slug}
                className="block px-4 py-3 text-sm bg-navy-dark text-white rounded-lg mx-2 font-plus-jakarta"
              >
                <div className="font-medium">
                  {item.english}
                </div>
                <div className="text-xs text-gray-200 mt-1">
                  {item.indonesian}
                </div>
              </div>
            );
          }
          
          return (
            <Link
              key={item.slug}
              to={itemPath}
              className="group block px-4 py-3 text-sm text-gray-700 hover:bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ease-out rounded-lg mx-2 border-b border-gray-100 last:border-b-0"
            >
              <div className="font-medium group-hover:text-navy-dark transition-colors font-plus-jakarta">
                {item.english}
              </div>
              <div className="text-xs text-gray-500 mt-1 group-hover:text-gray-600 font-plus-jakarta">
                {item.indonesian}
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <aside 
      className="fixed top-16 left-0 h-[calc(100vh-4rem)] bg-beige-light border-r border-gray-200 overflow-y-auto z-30 shadow-sm"
      style={{ width: '250px' }}
    >
      <div className="p-6">
        <h2 className="text-lg font-bold text-navy-dark mb-8 font-plus-jakarta">
          Related line items
        </h2>
        
        <div className="space-y-2">
          {renderSidebarGroup("Current Assets", currentAssets)}
          {renderSidebarGroup("Non-Current Assets", nonCurrentAssets)}
        </div>
      </div>
    </aside>
  );
};

export default FSLISidebar;