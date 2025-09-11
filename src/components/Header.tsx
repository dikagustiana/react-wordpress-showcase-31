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
  // Define menu item types
  interface NestedMenuItem {
    label: string;
    path: string;
  }

  interface MenuItem {
    label: string;
    path?: string;
    submenu?: NestedMenuItem[];
  }

  interface NavItem {
    label: string;
    path: string;
    hasDropdown?: boolean;
    dropdownKey?: string;
    submenu?: MenuItem[];
  }

  const accountingSubmenu: MenuItem[] = [{
    label: 'FSLI Detail',
    path: '/accounting/fsli'
  }, {
    label: 'Consolidated Reporting',
    path: '/accounting/consolidated-reporting'
  }, {
    label: 'Statutory Reporting',
    path: '/accounting/statutory-reporting'
  }];

  const finance101Submenu: MenuItem[] = [{
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

  const dikasToolsSubmenu: NestedMenuItem[] = [{
    label: 'Executive Dashboard',
    path: '/executive-dashboard'
  }, {
    label: 'Forecasting Input',
    path: '/forecasting/input'
  }, {
    label: 'Forecasting Assumptions',
    path: '/forecasting/assumptions'
  }, {
    label: 'Forecasting Output',
    path: '/forecasting/output'
  }, {
    label: 'System Health Check',
    path: '/admin/health'
  }];

  const financeWorkspaceItem: NavItem = role === 'admin' 
    ? { 
        label: 'Finance Workspace', 
        path: '/finance-workspace',
        hasDropdown: true,
        dropdownKey: 'finance-workspace',
        submenu: [{ label: "Dika's Tools", path: '/dikas-tools' }]
      }
    : { label: 'Finance Workspace', path: '/finance-workspace' };

  const mainNavItems: NavItem[] = [
    { label: 'Home', path: '/' },
    financeWorkspaceItem,
    { label: 'Critical Thinking and Research', path: '/critical-thinking-research' },
    { 
      label: 'Accounting', 
      path: '/accounting',
      hasDropdown: true,
      dropdownKey: 'accounting',
      submenu: accountingSubmenu
    },
    { 
      label: 'Finance', 
      path: '/finance-101',
      hasDropdown: true,
      dropdownKey: 'finance101',
      submenu: finance101Submenu
    },
    { 
      label: 'The Green Transition', 
      path: '/green-transition',
      hasDropdown: true,
      dropdownKey: 'green-transition',
      submenu: [
        { label: 'Where We Are Now', path: '/green-transition/where-we-are-now' },
        { label: 'Challenges Ahead', path: '/green-transition/challenges-ahead' },
        { label: 'Pathways Forward', path: '/green-transition/pathways-forward' }
      ]
    },
    { label: 'Books and Academia', path: '/books-academia' },
    { label: 'English – IELTS', path: '/english-ielts' }
  ];

  return <header className="sticky top-0 z-50 bg-primary shadow-lg">
      <div className="max-w-[1920px] mx-auto px-6">
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
              {/* Unified navigation items */}
              {mainNavItems.map((item) => {
                if (item.hasDropdown) {
                  // Render dropdown item
                  return (
                    <div 
                      key={item.path}
                      className="relative" 
                      onMouseEnter={() => setHoveredMenu(item.dropdownKey)} 
                      onMouseLeave={() => setHoveredMenu(null)}
                    >
                      <Link 
                        to={item.path} 
                        className={`flex items-center px-3 py-2 text-sm font-medium transition-all duration-150 whitespace-nowrap rounded-md ${
                          isActive(item.path) 
                            ? 'text-primary-foreground bg-primary-hover' 
                            : 'text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-hover/50'
                        }`}
                      >
                        {item.label}
                        <ChevronDown className={`ml-1 w-3 h-3 transition-transform duration-150 ${hoveredMenu === item.dropdownKey ? 'rotate-180' : ''}`} />
                      </Link>
                      
                      <div className={`absolute top-full left-0 mt-1 ${item.dropdownKey === 'finance101' ? 'w-72' : item.dropdownKey === 'accounting' ? 'w-64' : item.dropdownKey === 'finance-workspace' ? 'w-64' : 'w-56'} bg-primary rounded-md shadow-lg border border-primary-hover py-2 z-[60] transition-all duration-150 ${hoveredMenu === item.dropdownKey ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                        {item.submenu?.map((subItem) => (
                          <Link 
                            key={subItem.path} 
                            to={subItem.path} 
                            className={`block px-4 py-3 text-sm text-primary-foreground transition-colors border-b border-primary-hover/30 last:border-b-0 ${
                              item.dropdownKey === 'green-transition' 
                                ? 'hover:text-accent hover:bg-primary-hover/50' 
                                : 'hover:bg-primary-hover'
                            }`}
                            onClick={() => setHoveredMenu(null)}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                } else {
                  // Render simple link item
                  return (
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
                  );
                }
              })}
            </div>
          </div>
        </nav>
      </div>
    </header>;
};
export default Header;