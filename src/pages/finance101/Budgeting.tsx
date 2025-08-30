import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Breadcrumb from '../../components/Breadcrumb';

const Budgeting = () => {
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Finance 101', path: '/finance-101' },
    { label: 'Budgeting' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-content mx-auto px-6 py-8">
          <Breadcrumb items={breadcrumbItems} />
          
          <div className="bg-card rounded-lg p-8 shadow-sm border">
            <h1 className="text-h1 font-bold text-foreground mb-6">
              Budgeting
            </h1>
            
            <div className="prose max-w-none">
              <p className="text-lg text-muted-foreground mb-8">
                Learn about budgeting versus planning, bottom-up vs top-down approaches and the assumptions that drive your budget.
              </p>
              
              <div className="bg-muted/30 p-6 rounded-lg min-h-[300px]">
                <p className="text-muted-foreground italic">
                  Content area for Budgeting learning materials, including budget preparation 
                  methodologies, variance analysis, capital budgeting, and operational 
                  budget management techniques.
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

export default Budgeting;