import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Breadcrumb from '../../components/Breadcrumb';

const EliminationBalanceSheet = () => {
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Accounting', path: '/accounting' },
    { label: 'Consolidated Reporting', path: '/accounting/consolidated-reporting' },
    { label: 'Elimination Balance Sheet Account' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1" style={{ backgroundColor: '#F6F3EE' }}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb items={breadcrumbItems} />
          
          <div className="bg-card rounded-lg p-8 shadow-sm border">
            <h1 className="text-3xl font-bold text-foreground mb-6">
              Elimination Balance Sheet Account
            </h1>
            
            <div className="prose max-w-none">
              <p className="text-lg text-muted-foreground mb-8">
                Understand balance sheet account elimination processes to remove 
                intercompany balances and transactions.
              </p>
              
              <div className="bg-muted/30 p-6 rounded-lg min-h-[400px]">
                <p className="text-muted-foreground italic">
                  Content area for balance sheet elimination procedures, including:
                  <br />• Intercompany receivables and payables
                  <br />• Intercompany loans and borrowings
                  <br />• Intercompany guarantees
                  <br />• Unrealized profits in inventory
                  <br />• Unrealized gains/losses on asset transfers
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

export default EliminationBalanceSheet;