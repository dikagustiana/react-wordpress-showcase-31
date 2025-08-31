import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Breadcrumb from '../../../components/Breadcrumb';

const ProfitabilityAnalysis = () => {
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Finance', path: '/finance-101' },
    { label: 'Financial Analytics', path: '/finance-101/financial-analytics' },
    { label: 'Profitability Analysis' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb items={breadcrumbItems} />
          
          <div className="bg-card rounded-lg p-8 shadow-sm border">
            <h1 className="text-3xl font-bold text-foreground mb-6">
              Profitability Analysis
            </h1>
            
            <div className="prose max-w-none">
              <p className="text-lg text-muted-foreground mb-8">
                Assess margins and returns to understand business health and evaluate the company's ability to generate profits.
              </p>
              
              <div className="bg-muted/30 p-6 rounded-lg min-h-[400px]">
                <p className="text-muted-foreground italic">
                  Content area for profitability analysis tools and metrics, including:
                  <br />• Gross profit margin analysis
                  <br />• Operating profit margin evaluation
                  <br />• Net profit margin assessment
                  <br />• Return on assets (ROA)
                  <br />• Return on equity (ROE)
                  <br />• Return on investment (ROI)
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

export default ProfitabilityAnalysis;