import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Breadcrumb from '../../components/Breadcrumb';

const CFAPrep = () => {
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Finance', path: '/finance-101' },
    { label: 'CFA Prep' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-content mx-auto px-6 py-8">
          <Breadcrumb items={breadcrumbItems} />
          
          <div className="bg-card rounded-lg p-8 shadow-sm border">
            <h1 className="text-h1 font-bold text-foreground mb-6">
              CFA Prep
            </h1>
            
            <div className="prose max-w-none">
              <p className="text-lg text-muted-foreground mb-8">
                Outline your strategies for preparing for the CFA exams. Include study schedules, resources and tips you have found effective.
              </p>
              
              <div className="bg-muted/30 p-6 rounded-lg min-h-[300px]">
                <p className="text-muted-foreground italic">
                  Content area for CFA Preparation materials, including study strategies, 
                  exam techniques, curriculum coverage, practice materials, and 
                  professional certification guidance.
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

export default CFAPrep;