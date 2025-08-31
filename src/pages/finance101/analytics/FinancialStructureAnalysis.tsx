import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Breadcrumb from '../../../components/Breadcrumb';

const FinancialStructureAnalysis = () => {
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Finance', path: '/finance-101' },
    { label: 'Financial Analytics', path: '/finance-101/financial-analytics' },
    { label: 'Financial Structure Analysis' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb items={breadcrumbItems} />
          
          <div className="bg-card rounded-lg p-8 shadow-sm border">
            <h1 className="text-3xl font-bold text-foreground mb-6">
              Financial Structure Analysis
            </h1>
            
            <div className="prose max-w-none">
              <p className="text-lg text-muted-foreground mb-8">
                Examine leverage and capital structure of the entity to assess financial stability and risk management.
              </p>
              
              <div className="bg-muted/30 p-6 rounded-lg min-h-[400px]">
                <p className="text-muted-foreground italic">
                  Content area for financial structure analysis tools and ratios, including:
                  <br />• Debt-to-equity ratio analysis
                  <br />• Debt-to-assets ratio
                  <br />• Interest coverage ratio
                  <br />• Times interest earned
                  <br />• Capital adequacy assessment
                  <br />• Financial leverage evaluation
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

export default FinancialStructureAnalysis;