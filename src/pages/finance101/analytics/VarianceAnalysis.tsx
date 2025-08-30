import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Breadcrumb from '../../../components/Breadcrumb';

const VarianceAnalysis = () => {
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Finance 101', path: '/finance-101' },
    { label: 'Financial Analytics', path: '/finance-101/financial-analytics' },
    { label: 'Variance Analysis' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb items={breadcrumbItems} />
          
          <div className="bg-card rounded-lg p-8 shadow-sm border">
            <h1 className="text-3xl font-bold text-foreground mb-6">
              Variance Analysis - TEST PAGE LOADED
            </h1>
            
            <div className="prose max-w-none">
              <p className="text-lg text-muted-foreground mb-8">
                Analyze differences between planned and actual figures to identify performance gaps and opportunities for improvement.
              </p>
              
              <div className="bg-muted/30 p-6 rounded-lg min-h-[400px]">
                <p className="text-muted-foreground italic">
                  Content area for variance analysis tools and methodologies, including:
                  <br />• Budget vs Actual analysis
                  <br />• Material price and quantity variances
                  <br />• Labor rate and efficiency variances
                  <br />• Overhead spending and volume variances
                  <br />• Sales price and volume variances
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

export default VarianceAnalysis;