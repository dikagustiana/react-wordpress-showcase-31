import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AuthButton } from '@/components/auth/AuthButton';
import { useAuthRole } from '@/hooks/useAuthRole';
const Header = () => {
  const location = useLocation();
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const desktopNavRef = useRef<HTMLDivElement | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { role } = useAuthRole();
  
  // Close delay in ms to prevent flicker when moving between trigger and panel
  const CLOSE_DELAY = 200;

  // Clear any pending close timer
  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  // Open a dropdown immediately, clearing any pending close
  const openMenu = useCallback((menuId: string | null) => {
    clearCloseTimer();
    setActiveMenuId(menuId);
  }, [clearCloseTimer]);

  // Schedule a delayed close
  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setActiveMenuId(null);
      closeTimerRef.current = null;
    }, CLOSE_DELAY);
  }, [clearCloseTimer]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);
  
  // Handle logo hover for auth dropdown
  const handleLogoMouseEnter = () => openMenu('logo');
  const handleLogoMouseLeave = () => scheduleClose();
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Close menus on route change
  useEffect(() => {
    clearCloseTimer();
    setIsMobileMenuOpen(false);
    setOpenMobileDropdown(null);
    setActiveMenuId(null);
  }, [location.pathname, clearCloseTimer]);

  // Close mobile menu or desktop dropdowns on outside click or Esc
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (isMobileMenuOpen) {
        if (mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
          setIsMobileMenuOpen(false);
          setOpenMobileDropdown(null);
        }
      }

      if (activeMenuId && desktopNavRef.current && !desktopNavRef.current.contains(target)) {
        clearCloseTimer();
        setActiveMenuId(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        clearCloseTimer();
        setIsMobileMenuOpen(false);
        setOpenMobileDropdown(null);
        setActiveMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen, activeMenuId, clearCloseTimer]);
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
    { 
      label: 'Masyarakat Baru',
      path: '#masyarakat-baru',
      hasDropdown: true,
      dropdownKey: 'masyarakat-baru',
      submenu: [
        { label: 'English – IELTS', path: '/english-ielts' },
        { label: 'Critical Thinking and Research', path: '/critical-thinking-research' },
        { label: 'Books and Academia', path: '/books-academia' }
      ]
    }
  ];

  return <header className="sticky top-0 z-50 bg-primary shadow-lg">
      <div
        className="w-full mx-auto"
        style={{ maxWidth: '1200px', paddingLeft: '16px', paddingRight: '16px' }}
      >
        <nav className="grid grid-cols-[auto,1fr,auto] items-center gap-4 min-w-0 h-14 md:h-14 xl:h-16">
          {/* Logo with Login dropdown */}
          <div 
            className="relative flex items-center cursor-pointer min-w-0" 
            onMouseEnter={handleLogoMouseEnter} 
            onMouseLeave={handleLogoMouseLeave}
          >
            <img 
              src="/lovable-uploads/e4fef01c-e480-414e-8764-4044cb4cc1aa.png" 
              alt="Your Friendly Learning Buddy Logo" 
              className="w-8 h-8 mr-3 object-contain"
            />
            <h1 className="text-base font-medium text-primary-foreground whitespace-nowrap truncate max-w-[140px] sm:max-w-[220px]">
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
            <div className={`absolute top-full left-0 mt-1 bg-background rounded-lg shadow-lg border py-2 px-3 z-[70] transition-all duration-200 ${activeMenuId === 'logo' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2 pointer-events-none'}`}>
              <AuthButton />
            </div>
          </div>

          {/* Desktop Navigation Menu */}
          <div
            ref={desktopNavRef}
            className="hidden xl:flex flex-1 justify-start min-w-0 ml-4"
          >
            <div className="flex items-center gap-6 min-w-0 flex-nowrap">
              {/* Unified navigation items */}
              {mainNavItems.map((item) => {
                if (item.hasDropdown) {
                  // Render dropdown item with separate link and caret button
                  const isOpen = activeMenuId === item.dropdownKey;
                  const isHashLink = item.path.startsWith('#');
                  return (
                    <div 
                      key={item.path}
                      className="relative" 
                      onMouseEnter={() => openMenu(item.dropdownKey || null)} 
                      onMouseLeave={scheduleClose}
                    >
                      <div className="flex items-center">
                        {/* Nav label - clickable link for navigation */}
                        {isHashLink ? (
                          <span 
                            className={`flex-none px-3 py-2 text-sm font-medium transition-all duration-150 rounded-l-md whitespace-nowrap cursor-default ${
                              isActive(item.path) 
                                ? 'text-primary-foreground bg-primary-hover'
                                : 'text-primary-foreground/90'
                            }`}
                          >
                            {item.label}
                          </span>
                        ) : (
                          <Link 
                            to={item.path} 
                            className={`flex-none px-3 py-2 text-sm font-medium transition-all duration-150 rounded-l-md whitespace-nowrap cursor-pointer ${
                              isActive(item.path) 
                                ? 'text-primary-foreground bg-primary-hover'
                                : 'text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-hover/50'
                            }`}
                            onClick={() => {
                              // Close dropdown and clear timer on navigation
                              clearCloseTimer();
                              setActiveMenuId(null);
                            }}
                          >
                            {item.label}
                          </Link>
                        )}
                        {/* Caret button - toggles dropdown */}
                        <button
                          type="button"
                          className={`flex-none p-2 text-sm transition-all duration-150 rounded-r-md cursor-pointer ${
                            isOpen 
                              ? 'text-primary-foreground bg-primary-hover'
                              : 'text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-hover/50'
                          }`}
                          aria-haspopup="true"
                          aria-expanded={isOpen}
                          aria-controls={item.dropdownKey ? `${item.dropdownKey}-menu` : undefined}
                          aria-label={`Toggle ${item.label} submenu`}
                          onClick={(e) => {
                            e.stopPropagation();
                            clearCloseTimer();
                            const next = activeMenuId === item.dropdownKey ? null : item.dropdownKey || null;
                            setActiveMenuId(next);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              clearCloseTimer();
                              const next = activeMenuId === item.dropdownKey ? null : item.dropdownKey || null;
                              setActiveMenuId(next);
                            }
                            if (e.key === 'Escape') {
                              clearCloseTimer();
                              setActiveMenuId(null);
                            }
                          }}
                        >
                          <ChevronDown className={`w-4 h-4 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                      
                      <div
                        id={item.dropdownKey ? `${item.dropdownKey}-menu` : undefined}
                        role="menu"
                        className={`absolute left-0 mt-2 bg-primary rounded-md shadow-lg border border-primary-hover py-2 z-[60] transition-all duration-150 ${
                          isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2 pointer-events-none'
                        }`}
                        style={{
                          top: 'calc(100% + 8px)',
                          minWidth: item.dropdownKey === 'masyarakat-baru' ? 240 : undefined,
                          maxHeight: item.dropdownKey === 'masyarakat-baru' && isOpen ? '60vh' : undefined,
                          overflowY: item.dropdownKey === 'masyarakat-baru' && isOpen ? 'auto' : undefined,
                          overflowX: 'hidden',
                          width:
                            item.dropdownKey === 'finance101'
                              ? '18rem'
                              : item.dropdownKey === 'accounting' || item.dropdownKey === 'finance-workspace'
                              ? '16rem'
                              : item.dropdownKey === 'green-transition'
                              ? '14rem'
                              : undefined
                        }}
                      >
                        {item.submenu?.map((subItem) => (
                          <Link 
                            key={subItem.path} 
                            to={subItem.path} 
                            className={`block px-3 py-2 text-sm text-primary-foreground transition-colors border-b border-primary-hover/30 last:border-b-0 ${
                              item.dropdownKey === 'green-transition' 
                                ? 'hover:text-accent hover:bg-primary-hover/50' 
                                : 'hover:bg-primary-hover'
                            }`}
                            role="menuitem"
                            onClick={() => {
                              clearCloseTimer();
                              setActiveMenuId(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Escape') {
                                e.preventDefault();
                                clearCloseTimer();
                                setActiveMenuId(null);
                              }
                            }}
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
                      className={`flex-none px-3 py-2 text-sm font-medium transition-all duration-150 rounded-md whitespace-nowrap ${
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

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-primary-foreground hover:bg-primary-hover/60 xl:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>
      </div>

      {/* Mobile navigation panel */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="xl:hidden bg-primary border-t border-primary-hover"
        >
          <div className="w-full mx-auto px-4 sm:px-6 py-3" style={{ maxWidth: '1200px' }}>
            <nav className="space-y-2">
              {mainNavItems.map((item) => {
                if (item.hasDropdown) {
                  const isOpen = openMobileDropdown === item.dropdownKey;
                  const isHashLink = item.path.startsWith('#');
                  return (
                    <div key={item.path}>
                      <div className="flex items-center min-h-[44px]">
                        {/* Mobile nav label - clickable link for navigation */}
                        {isHashLink ? (
                          <span
                            className={`flex-1 px-3 py-2 text-sm font-medium rounded-l-md text-left break-words ${
                              isActive(item.path)
                                ? 'text-primary-foreground bg-primary-hover'
                                : 'text-primary-foreground/90'
                            }`}
                          >
                            {item.label}
                          </span>
                        ) : (
                          <Link
                            to={item.path}
                            className={`flex-1 px-3 py-2 text-sm font-medium rounded-l-md text-left break-words cursor-pointer ${
                              isActive(item.path)
                                ? 'text-primary-foreground bg-primary-hover'
                                : 'text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-hover/60'
                            }`}
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              setOpenMobileDropdown(null);
                            }}
                          >
                            {item.label}
                          </Link>
                        )}
                        {/* Mobile caret button - toggles dropdown */}
                        <button
                          type="button"
                          className={`flex-none p-3 rounded-r-md ${
                            isOpen
                              ? 'text-primary-foreground bg-primary-hover'
                              : 'text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-hover/60'
                          }`}
                          aria-label={`Toggle ${item.label} submenu`}
                          onClick={() =>
                            setOpenMobileDropdown((prev) =>
                              prev === item.dropdownKey ? null : item.dropdownKey || null
                            )
                          }
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                      </div>
                      {isOpen && item.submenu && (
                        <div className="mt-1 ml-3 space-y-1">
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.path}
                              to={subItem.path}
                              className="block px-3 py-2 text-base text-primary-foreground/90 rounded-md hover:bg-primary-hover/60 break-words min-h-[44px]"
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                setOpenMobileDropdown(null);
                              }}
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`block px-3 py-2 text-base font-medium rounded-md break-words min-h-[44px] ${
                      isActive(item.path)
                        ? 'text-primary-foreground bg-primary-hover'
                        : 'text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-hover/60'
                    }`}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setOpenMobileDropdown(null);
                    }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </header>;
};
export default Header;