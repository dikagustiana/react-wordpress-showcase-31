import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { AuthButton } from '@/components/auth/AuthButton';
import { useAuthRole } from '@/hooks/useAuthRole';
const Header = () => {
  const location = useLocation();
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const { role } = useAuthRole();
  
  // Handle logo hover for auth dropdown
  const handleLogoMouseEnter = () => setHoveredMenu('logo');
  const handleLogoMouseLeave = () => setHoveredMenu(null);
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };
  const accountingSubmenu = [{
    label: 'FSLI Detail',
    path: '/accounting/fsli'
  }, {
    label: 'Consolidated Reporting',
    path: '/accounting/consolidated-reporting'
  }, {
    label: 'Statutory Reporting',
    path: '/accounting/statutory-reporting'
  }];
  const finance101Submenu = [{
    label: 'Financial Analytics',
    path: '/finance-101/financial-analytics'
  }, {
    label: 'Financial Planning & Forecasting',
    path: '/finance-101/financial-planning-forecasting'
  }, {
    label: 'Budgeting',
    path: '/finance-101/budgeting'
  }, {
    label: 'CFA Prep',
    path: '/finance-101/cfa-prep'
  }];
  const mainNavItems = [
    { label: 'Home', path: '/' },
    { label: 'Finance Workspace', path: '/finance-workspace' },
    { label: 'Critical Thinking and Research', path: '/critical-thinking-research' },
    { label: 'Books and Academia', path: '/books-academia' },
    { label: 'English IELTS', path: '/english-ielts' }
  ];

  return <header className="sticky top-0 z-50 bg-primary shadow-lg">
      <div className="max-w-[1240px] mx-auto px-6">
        <nav className="flex items-center h-16">
          {/* Logo with Login dropdown */}
          <div 
            className="relative flex items-center cursor-pointer" 
            onMouseEnter={handleLogoMouseEnter} 
            onMouseLeave={handleLogoMouseLeave}
          >
            <img 
              src="/lovable-uploads/e4fef01c-e480-414e-8764-4044cb4cc1aa.png" 
              alt="Your Friendly Learning Buddy Logo" 
              className="w-8 h-8 mr-3 object-contain"
            />
            <h1 className="text-base font-medium text-primary-foreground whitespace-nowrap">
              Your Friendly Learning Buddy
            </h1>
            
            {/* Role badge next to logo */}
            {role === 'admin' && (
              <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium uppercase text-white" style={{ backgroundColor: '#16a34a' }}>
                Admin
              </span>
            )}
            {role === 'viewer' && (
              <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium uppercase text-white" style={{ backgroundColor: '#9ca3af' }}>
                Viewer
              </span>
            )}
            
            {/* Login dropdown - appears under logo */}
            <div className={`absolute top-full left-0 mt-1 bg-background rounded-lg shadow-lg border py-2 px-3 z-[70] transition-all duration-200 ${hoveredMenu === 'logo' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
              <AuthButton />
            </div>
          </div>

          {/* Navigation Menu - Compact spacing */}
          <div className="flex-1 flex justify-center ml-8">
            <div className="flex items-center gap-5">
              {/* Main navigation items */}
              {mainNavItems.map((item) => (
                <Link 
                  key={item.path}
                  to={item.path} 
                  className={`px-3 py-2 text-sm font-medium transition-all duration-150 whitespace-nowrap rounded-md ${
                    isActive(item.path) && (item.path === '/' ? location.pathname === '/' : true)
                      ? 'text-primary-foreground bg-primary-hover' 
                      : 'text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-hover/50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              {/* Accounting with Dropdown */}
              <div className="relative" onMouseEnter={() => setHoveredMenu('accounting')} onMouseLeave={() => setHoveredMenu(null)}>
                <Link to="/accounting" className={`flex items-center px-3 py-2 text-sm font-medium transition-all duration-150 whitespace-nowrap rounded-md ${isActive('/accounting') ? 'text-primary-foreground bg-primary-hover' : 'text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-hover/50'}`}>
                  Accounting
                  <ChevronDown className={`ml-1 w-3 h-3 transition-transform duration-150 ${hoveredMenu === 'accounting' ? 'rotate-180' : ''}`} />
                </Link>
                
                <div className={`absolute top-full left-0 mt-1 w-64 bg-primary rounded-md shadow-lg border border-primary-hover py-2 z-[60] transition-all duration-150 ${hoveredMenu === 'accounting' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                  {accountingSubmenu.map((item) => <Link key={item.path} to={item.path} className="block px-4 py-3 text-sm text-primary-foreground hover:bg-primary-hover transition-colors border-b border-primary-hover/30 last:border-b-0" onClick={() => setHoveredMenu(null)}>
                      {item.label}
                    </Link>)}
                </div>
              </div>

              {/* Finance 101 with Dropdown */}
              <div className="relative" onMouseEnter={() => setHoveredMenu('finance101')} onMouseLeave={() => setHoveredMenu(null)}>
                <Link to="/finance-101" className={`flex items-center px-3 py-2 text-sm font-medium transition-all duration-150 whitespace-nowrap rounded-md ${isActive('/finance-101') ? 'text-primary-foreground bg-primary-hover' : 'text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-hover/50'}`}>
                  Finance 101
                  <ChevronDown className={`ml-1 w-3 h-3 transition-transform duration-150 ${hoveredMenu === 'finance101' ? 'rotate-180' : ''}`} />
                </Link>
                
                <div className={`absolute top-full left-0 mt-1 w-72 bg-primary rounded-md shadow-lg border border-primary-hover py-2 z-[60] transition-all duration-150 ${hoveredMenu === 'finance101' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                  {finance101Submenu.map((item) => <Link key={item.path} to={item.path} className="block px-4 py-3 text-sm text-primary-foreground hover:bg-primary-hover transition-colors border-b border-primary-hover/30 last:border-b-0" onClick={() => setHoveredMenu(null)}>
                      {item.label}
                    </Link>)}
                </div>
              </div>

              {/* Green Transition with Dropdown */}
              <div className="relative" onMouseEnter={() => setHoveredMenu('green-transition')} onMouseLeave={() => setHoveredMenu(null)}>
                <Link to="/green-transition" className={`flex items-center px-3 py-2 text-sm font-medium transition-all duration-150 whitespace-nowrap rounded-md ${isActive('/green-transition') ? 'text-primary-foreground bg-primary-hover' : 'text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-hover/50'}`}>
                  The Green Transition
                  <ChevronDown className={`ml-1 w-3 h-3 transition-transform duration-150 ${hoveredMenu === 'green-transition' ? 'rotate-180' : ''}`} />
                </Link>
                
                <div className={`absolute top-full left-0 mt-1 w-56 bg-primary rounded-md shadow-lg border border-primary-hover py-2 z-[60] transition-all duration-150 ${hoveredMenu === 'green-transition' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                  <Link to="/green-transition/where-we-are-now" className="block px-4 py-3 text-sm text-primary-foreground hover:text-accent hover:bg-primary-hover/50 transition-colors border-b border-primary-hover/30" onClick={() => setHoveredMenu(null)}>
                    Where We Are Now
                  </Link>
                  <Link to="/green-transition/challenges-ahead" className="block px-4 py-3 text-sm text-primary-foreground hover:text-accent hover:bg-primary-hover/50 transition-colors border-b border-primary-hover/30" onClick={() => setHoveredMenu(null)}>
                    Challenges Ahead
                  </Link>
                  <Link to="/green-transition/pathways-forward" className="block px-4 py-3 text-sm text-primary-foreground hover:text-accent hover:bg-primary-hover/50 transition-colors" onClick={() => setHoveredMenu(null)}>
                    Pathways Forward
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>;
};
export default Header;