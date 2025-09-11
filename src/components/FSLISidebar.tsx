import { Link, useLocation } from 'react-router-dom';
import { fsliData, FSLIItem } from '../lib/fsliData';

interface FSLISidebarProps {
  currentSlug?: string;
}

const FSLISidebar = ({ currentSlug }: FSLISidebarProps) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Group FSLI items by taxonomy
  const currentAssets = fsliData.slice(0, 11); // First 11 items are current assets
  const nonCurrentAssets = fsliData.slice(11); // Rest are non-current assets
  
  const renderSidebarGroup = (title: string, items: FSLIItem[]) => (
    <div className="mb-6">
      <h4 className="text-xs font-semibold text-secondary uppercase tracking-wider mb-3">
        {title}
      </h4>
      <div className="space-y-1">
        {items.map((item) => {
          const isActive = currentPath === `/accounting/fsli/${item.slug}` || 
                          currentSlug === item.slug;
          
          return (
            <Link
              key={item.slug}
              to={`/accounting/fsli/${item.slug}`}
              className={
                isActive
                  ? 'flex items-start gap-2 rounded-md border-l-4 border-primary bg-primary-light px-3 py-2 text-small font-medium text-foreground'
                  : 'block rounded-md px-3 py-2 text-small text-muted-foreground hover:bg-muted transition-colors'
              }
              aria-current={isActive ? 'page' : undefined}
            >
              {item.english}
            </Link>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {renderSidebarGroup("CURRENT ASSETS", currentAssets)}
      {renderSidebarGroup("NON-CURRENT ASSETS", nonCurrentAssets)}
    </div>
  );
};

export default FSLISidebar;