import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Card, CardContent } from '../components/ui/card';

const ConsolidatedReporting = () => {
  const [activeTab, setActiveTab] = useState('sofp');
  
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Accounting', path: '/accounting' },
    { label: 'Consolidated Reporting' }
  ];

  const tabs = [
    { id: 'sofp', label: 'SOFP' },
    { id: 'sopl', label: 'SOPL' },
    { id: 'soce', label: 'SOCE' },
    { id: 'cf', label: 'CF' }
  ];

  const basicCards = [
    {
      title: 'Consolidated PSAK 22',
      description: 'Master the fundamentals of business combinations and consolidation principles',
      path: '/accounting/consolidation/psak-principles'
    },
    {
      title: 'Consolidated PSAK 338',
      description: 'Understanding consolidated financial statements presentation standards',
      path: '/accounting/consolidation/psak-principles'
    }
  ];

  const conceptCards = [
    {
      title: 'Equity adjustment at parent level',
      description: 'Learn how to adjust equity accounts at the parent company level',
      path: '/accounting/consolidation/equity-adjustment-parent'
    },
    {
      title: 'Elimination Equity',
      description: 'Master equity elimination procedures in consolidation',
      path: '/accounting/consolidation/elimination-equity'
    },
    {
      title: 'Elimination Balance Sheet Account',
      description: 'Understand balance sheet account elimination processes',
      path: '/accounting/consolidation/elimination-balance-sheet'
    },
    {
      title: 'Elimination PnL Account',
      description: 'Learn profit and loss account elimination techniques',
      path: '/accounting/consolidation/elimination-pnl'
    }
  ];

  const controlCards = [
    {
      title: 'Control your equity through SOCE',
      description: 'Monitor and control equity changes through statement of changes in equity',
      path: '/accounting/consolidation/control-soce'
    },
    {
      title: 'Control your NCI through NCI Movement',
      description: 'Track and manage non-controlling interest movements',
      path: '/accounting/consolidation/control-nci-movement'
    },
    {
      title: 'Control your BS through BS Schedule',
      description: 'Maintain balance sheet control through detailed schedules',
      path: '/accounting/consolidation/control-bs-schedule'
    },
    {
      title: 'Control your PnL through Segment Information',
      description: 'Manage profit and loss through comprehensive segment reporting',
      path: '/accounting/consolidation/control-segment-info'
    }
  ];

  // Handle URL hash changes
  useEffect(() => {
    const hash = window.location.hash.replace('#tab=', '');
    if (tabs.find(tab => tab.id === hash)) {
      setActiveTab(hash);
    }
  }, []);

  // Update URL hash when tab changes
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    window.history.replaceState(null, '', `#tab=${tabId}`);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    if (e.key === 'ArrowLeft' && currentIndex > 0) {
      const newTab = tabs[currentIndex - 1].id;
      handleTabChange(newTab);
    } else if (e.key === 'ArrowRight' && currentIndex < tabs.length - 1) {
      const newTab = tabs[currentIndex + 1].id;
      handleTabChange(newTab);
    }
  };

  const EducationalCard = ({ title, description, path }: { title: string; description: string; path: string }) => (
    <Link to={path} className="block group">
      <Card className="h-full transition-all duration-200 hover:shadow-md hover:border-primary/30 cursor-pointer">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-3 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {description}
          </p>
          <span className="text-sm font-medium text-primary group-hover:underline">
            Learn more →
          </span>
        </CardContent>
      </Card>
    </Link>
  );

  return (
    <div id="consolidated-reporting" className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1" style={{ backgroundColor: '#F6F3EE' }}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb items={breadcrumbItems} />
          
          {/* Section 1: Selector + Embed */}
          <div className="bg-card rounded-lg p-8 shadow-sm border mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-8">
              Consolidated Reporting
            </h1>
            
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList id="report-tabs" className="grid w-full grid-cols-4 mb-6">
                {tabs.map((tab, index) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="report-tab"
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <div id="report-embeds" className="mb-8">
                {tabs.map((tab) => (
                  <TabsContent key={tab.id} value={tab.id} className="mt-0">
                    <div className="w-full h-96 bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                      <iframe
                        id={`iframe-${tab.id}`}
                        className="report-iframe w-full h-full rounded-lg"
                        style={{ display: activeTab === tab.id ? 'block' : 'none' }}
                        title={`${tab.label} Report`}
                      />
                      <p className="text-muted-foreground">
                        {tab.label} embed will be loaded here
                      </p>
                    </div>
                  </TabsContent>
                ))}
              </div>
            </Tabs>
            
            <div className="text-center mb-6">
              <p className="text-lg font-bold text-foreground mb-6">
                before we go far, you need to master these first
              </p>
              <div className="card-grid grid grid-cols-1 md:grid-cols-2 gap-6">
                {basicCards.map((card, index) => (
                  <EducationalCard key={index} {...card} />
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Penguatan konsep */}
          <div className="edu-section bg-card rounded-lg p-8 shadow-sm border mb-8">
            <p className="edu-title text-lg font-bold text-foreground mb-6 text-center">
              after that, you need to understand this
            </p>
            <div className="card-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {conceptCards.map((card, index) => (
                <EducationalCard key={index} {...card} />
              ))}
            </div>
          </div>

          {/* Section 3: Kontrol pelaporan */}
          <div className="edu-section bg-card rounded-lg p-8 shadow-sm border">
            <p className="edu-title text-lg font-bold text-foreground mb-6 text-center">
              after you did all those things, you need to
            </p>
            <div className="card-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {controlCards.map((card, index) => (
                <EducationalCard key={index} {...card} />
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ConsolidatedReporting;