import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Breadcrumb from '../../components/Breadcrumb';

const PSAKPrinciples = () => {
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Accounting', path: '/accounting' },
    { label: 'Consolidated Reporting', path: '/accounting/consolidated-reporting' },
    { label: 'PSAK Principles' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1" style={{ backgroundColor: '#F6F3EE' }}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb items={breadcrumbItems} />
          
          <div className="bg-card rounded-lg p-8 shadow-sm border">
            <h1 className="text-3xl font-bold text-foreground mb-6">
              PSAK Principles for Consolidation
            </h1>
            
            <div className="prose max-w-none">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-muted/30 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4">PSAK 22: Business Combinations</h2>
                  <p className="text-muted-foreground mb-4">
                    Comprehensive framework for accounting business combinations and understanding 
                    the fundamentals of consolidation procedures.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>Acquisition method application</li>
                    <li>Goodwill calculation and treatment</li>
                    <li>Fair value measurements</li>
                    <li>Non-controlling interests</li>
                  </ul>
                </div>
                
                <div className="bg-muted/30 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4">PSAK 338: Consolidated Financial Statements</h2>
                  <p className="text-muted-foreground mb-4">
                    Standards for preparation and presentation of consolidated financial statements 
                    including control assessment and consolidation procedures.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>Control definition and assessment</li>
                    <li>Consolidation procedures</li>
                    <li>Elimination of intragroup transactions</li>
                    <li>Uniform accounting policies</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-muted/30 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Key Implementation Guidelines</h3>
                <p className="text-muted-foreground">
                  Content area for detailed PSAK implementation guidelines, step-by-step procedures,
                  and practical examples for consolidation accounting following Indonesian standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PSAKPrinciples;