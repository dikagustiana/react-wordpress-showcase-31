import { Link, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { AuthButton } from '@/components/auth/AuthButton';
const Header = () => {
  const location = useLocation();
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
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
  return <header className="sticky top-0 z-50 bg-primary shadow-lg">
      <div className="max-w-content mx-auto px-6">
        <nav className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold text-primary-foreground mr-8">
              Finance & Accounting Hub
            </h1>
          </div>
          <div className="flex items-end justify-center flex-1">
          <div className="flex space-x-1">
            {/* Home */}
            <Link to="/" className={`px-4 py-2 text-sm font-medium transition-colors rounded-md ${isActive('/') && location.pathname === '/' ? 'bg-primary-hover text-primary-foreground' : 'text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-hover'}`}>
              Home
            </Link>

            {/* Finance Workspace */}
            <Link to="/finance-workspace" className={`px-4 py-2 text-sm font-medium transition-colors rounded-md ${isActive('/finance-workspace') ? 'bg-primary-hover text-primary-foreground' : 'text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-hover'}`}>
              Finance Workspace
            </Link>

            {/* Critical Thinking and Research */}
            <Link to="/critical-thinking-research" className={`px-4 py-2 text-sm font-medium transition-colors rounded-md ${isActive('/critical-thinking-research') ? 'bg-primary-hover text-primary-foreground' : 'text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-hover'}`}>
              Critical Thinking and Research
            </Link>

            {/* Accounting with Dropdown */}
            <div className="relative group" onMouseEnter={() => setHoveredMenu('accounting')} onMouseLeave={() => setHoveredMenu(null)}>
              <Link to="/accounting" className={`flex items-center px-4 py-2 text-sm font-medium transition-colors rounded-md ${isActive('/accounting') ? 'bg-primary-hover text-primary-foreground' : 'text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-hover'}`}>
                Accounting
                <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-200 ${hoveredMenu === 'accounting' ? 'rotate-180' : ''}`} />
              </Link>
              
              {/* Dropdown Menu */}
              <div className={`absolute top-full left-0 mt-1 w-64 bg-primary rounded-md shadow-lg border border-primary-hover py-2 z-[60] transition-all duration-200 ${hoveredMenu === 'accounting' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                {accountingSubmenu.map((item, index) => <Link key={item.path} to={item.path} className="block px-4 py-3 text-sm text-primary-foreground hover:bg-primary-hover transition-colors border-b border-primary-hover/30 last:border-b-0" onClick={() => setHoveredMenu(null)}>
                    {item.label}
                  </Link>)}
              </div>
            </div>

            {/* Finance with Dropdown */}
            <div className="relative group" onMouseEnter={() => setHoveredMenu('finance101')} onMouseLeave={() => setHoveredMenu(null)}>
              <Link to="/finance-101" className={`flex items-center px-4 py-2 text-sm font-medium transition-colors rounded-md ${isActive('/finance-101') ? 'bg-primary-hover text-primary-foreground' : 'text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-hover'}`}>
                Finance
                <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-200 ${hoveredMenu === 'finance101' ? 'rotate-180' : ''}`} />
              </Link>
              
              {/* Dropdown Menu */}
              <div className={`absolute top-full left-0 mt-1 w-72 bg-primary rounded-md shadow-lg border border-primary-hover py-2 z-[60] transition-all duration-200 ${hoveredMenu === 'finance101' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                {finance101Submenu.map((item, index) => <Link key={item.path} to={item.path} className="block px-4 py-3 text-sm text-primary-foreground hover:bg-primary-hover transition-colors border-b border-primary-hover/30 last:border-b-0" onClick={() => setHoveredMenu(null)}>
                    {item.label}
                  </Link>)}
              </div>
            </div>

            {/* Green Transition with Dropdown */}
            <div className="relative group" onMouseEnter={() => setHoveredMenu('green-transition')} onMouseLeave={() => setHoveredMenu(null)}>
              <Link to="/green-transition" className={`flex items-center px-4 py-2 text-sm font-medium transition-colors rounded-md ${isActive('/green-transition') ? 'bg-primary-hover text-primary-foreground' : 'text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-hover'}`}>
                The Green Transition
                <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-200 ${hoveredMenu === 'green-transition' ? 'rotate-180' : ''}`} />
              </Link>
              
              {/* Dropdown Menu */}
              <div className={`absolute top-full left-0 mt-1 w-56 bg-[#0F1B2D] rounded-md shadow-lg border border-primary-hover py-2 z-[60] transition-all duration-200 ${hoveredMenu === 'green-transition' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                <Link to="/green-transition/where-we-are-now" className="block px-4 py-3 text-sm text-white hover:text-[#4CAF50] hover:bg-white/10 transition-colors border-b border-white/10" onClick={() => setHoveredMenu(null)}>
                  Where We Are Now
                </Link>
                <Link to="/green-transition/challenges-ahead" className="block px-4 py-3 text-sm text-white hover:text-[#4CAF50] hover:bg-white/10 transition-colors border-b border-white/10" onClick={() => setHoveredMenu(null)}>
                  Challenges Ahead
                </Link>
                <Link to="/green-transition/pathways-forward" className="block px-4 py-3 text-sm text-white hover:text-[#4CAF50] hover:bg-white/10 transition-colors" onClick={() => setHoveredMenu(null)}>
                  Pathways Forward
                </Link>
              </div>
            </div>
            
            <Link to="/books-academia" className={`px-4 py-2 text-sm font-medium transition-colors rounded-md ${isActive('/books-academia') ? 'bg-primary-hover text-primary-foreground' : 'text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-hover'}`}>
              Books and Academia
            </Link>
            
            <Link to="/english-ielts" className={`px-4 py-2 text-sm font-medium transition-colors rounded-md ${isActive('/english-ielts') ? 'bg-primary-hover text-primary-foreground' : 'text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-hover'}`}>
              English IELTS
            </Link>
          </div>
          </div>
          <div className="flex items-center">
            <AuthButton />
          </div>
        </nav>
      </div>
    </header>;
};
export default Header;