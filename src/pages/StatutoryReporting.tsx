import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';

const StatutoryReporting = () => {
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Accounting', path: '/accounting' },
    { label: 'Statutory Reporting' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb items={breadcrumbItems} />
          
          <div className="bg-card rounded-lg p-8 shadow-sm border">
            <h1 className="text-3xl font-bold text-foreground mb-6">
              Statutory Reporting
            </h1>
            
            <div className="prose max-w-none">
              <p className="text-lg text-muted-foreground mb-8">
                Regulatory compliance and statutory financial reporting requirements for legal and regulatory bodies.
              </p>
              
              <div className="bg-muted/30 p-6 rounded-lg min-h-[300px]">
                <p className="text-muted-foreground italic">
                  Content area for statutory reporting requirements, compliance guidelines,
                  and regulatory submission procedures. This section will cover local and
                  international statutory reporting obligations.
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

export default StatutoryReporting;