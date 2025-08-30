import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Breadcrumb from '../../components/Breadcrumb';

const ControlSegmentInfo = () => {
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Accounting', path: '/accounting' },
    { label: 'Consolidated Reporting', path: '/accounting/consolidated-reporting' },
    { label: 'Control Segment Info' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1" style={{ backgroundColor: '#F6F3EE' }}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb items={breadcrumbItems} />
          
          <div className="bg-card rounded-lg p-8 shadow-sm border">
            <h1 className="text-3xl font-bold text-foreground mb-6">
              Control your PnL through Segment Information
            </h1>
            
            <div className="prose max-w-none">
              <p className="text-lg text-muted-foreground mb-8">
                Manage profit and loss through comprehensive segment reporting 
                and detailed performance analysis.
              </p>
              
              <div className="bg-muted/30 p-6 rounded-lg min-h-[400px]">
                <p className="text-muted-foreground italic">
                  Content area for segment information control, including:
                  <br />• Segment revenue tracking
                  <br />• Segment cost allocation
                  <br />• Inter-segment elimination
                  <br />• Geographic segment analysis
                  <br />• Business segment performance monitoring
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

export default ControlSegmentInfo;