import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Breadcrumb from '../../components/Breadcrumb';

const CorporateDividendTaxesReceivableCurrent = () => {
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Accounting', path: '/accounting' },
    { label: 'FSLI', path: '/accounting/fsli' },
    { label: 'Corporate and Dividend Taxes Receivable (Current)' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb items={breadcrumbItems} />
          
          <div className="bg-card rounded-lg p-8 shadow-sm border">
            <h1 className="text-3xl font-bold text-foreground mb-6">
              Corporate and Dividend Taxes Receivable (Current)
            </h1>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">December 31, 2024</h3>
                  <p className="text-2xl font-bold text-primary">$300,738</p>
                  <p className="text-sm text-muted-foreground">Thousands USD</p>
                </div>
                
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">December 31, 2023</h3>
                  <p className="text-2xl font-bold text-muted-foreground">$275,812</p>
                  <p className="text-sm text-muted-foreground">Thousands USD</p>
                </div>
              </div>

              <div className="bg-corporate-blue-light p-4 rounded-lg">
                <h3 className="font-semibold text-primary mb-2">Notes Reference</h3>
                <p className="text-foreground">3c,43a</p>
              </div>
              
              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Description and Analysis
                </h2>
                <div className="bg-muted/30 p-6 rounded-lg min-h-[200px]">
                  <p className="text-muted-foreground italic">
                    Content area for detailed analysis and description of Corporate and Dividend Taxes Receivable (Current).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CorporateDividendTaxesReceivableCurrent;