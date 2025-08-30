import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Breadcrumb from '../../components/Breadcrumb';

const ControlNCIMovement = () => {
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Accounting', path: '/accounting' },
    { label: 'Consolidated Reporting', path: '/accounting/consolidated-reporting' },
    { label: 'Control NCI Movement' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1" style={{ backgroundColor: '#F6F3EE' }}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb items={breadcrumbItems} />
          
          <div className="bg-card rounded-lg p-8 shadow-sm border">
            <h1 className="text-3xl font-bold text-foreground mb-6">
              Control your NCI through NCI Movement
            </h1>
            
            <div className="prose max-w-none">
              <p className="text-lg text-muted-foreground mb-8">
                Track and manage non-controlling interest movements for 
                comprehensive consolidation control.
              </p>
              
              <div className="bg-muted/30 p-6 rounded-lg min-h-[400px]">
                <p className="text-muted-foreground italic">
                  Content area for NCI movement control, including:
                  <br />• NCI opening balance validation
                  <br />• NCI share of profit/loss tracking
                  <br />• NCI dividend distribution control
                  <br />• NCI additional investment monitoring
                  <br />• NCI disposal and acquisition effects
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

export default ControlNCIMovement;