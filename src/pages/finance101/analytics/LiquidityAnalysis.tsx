import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Breadcrumb from '../../../components/Breadcrumb';

const LiquidityAnalysis = () => {
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Finance', path: '/finance-101' },
    { label: 'Financial Analytics', path: '/finance-101/financial-analytics' },
    { label: 'Liquidity Analysis' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb items={breadcrumbItems} />
          
          <div className="bg-card rounded-lg p-8 shadow-sm border">
            <h1 className="text-3xl font-bold text-foreground mb-6">
              Liquidity Analysis
            </h1>
            
            <div className="prose max-w-none">
              <p className="text-lg text-muted-foreground mb-8">
                Measure the ability to meet short-term obligations and assess the company's cash flow management efficiency.
              </p>
              
              <div className="bg-muted/30 p-6 rounded-lg min-h-[400px]">
                <p className="text-muted-foreground italic">
                  Content area for liquidity analysis tools and ratios, including:
                  <br />• Current ratio calculations
                  <br />• Quick ratio (acid-test) analysis
                  <br />• Cash ratio evaluation
                  <br />• Working capital analysis
                  <br />• Cash conversion cycle
                  <br />• Days sales outstanding (DSO)
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

export default LiquidityAnalysis;