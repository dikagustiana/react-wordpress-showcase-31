import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Breadcrumb from '../../components/Breadcrumb';

const ForecastingAssumptions = () => {
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Finance', path: '/finance-101' },
    { label: 'Financial Planning & Forecasting', path: '/finance-101/financial-planning-forecasting' },
    { label: 'Assumptions & Drivers' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-content mx-auto px-6 py-8">
          <Breadcrumb items={breadcrumbItems} />
          
          <div className="bg-white rounded-2xl p-12 shadow-sm border">
            <h1 className="text-4xl font-bold text-[#2F4B6E] mb-6">
              Assumptions & Drivers Planning
            </h1>
            
            <div className="prose max-w-none">
              <p className="text-lg text-gray-600 mb-8">
                Transform your input data into actionable planning assumptions that drive business operations and financial performance.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-[#F6F3EE] p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-[#2F4B6E] mb-3">Headcount Planning</h3>
                  <p className="text-gray-600">Strategic workforce planning based on growth projections and operational needs.</p>
                </div>
                
                <div className="bg-[#F6F3EE] p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-[#2F4B6E] mb-3">Salaries Planning</h3>
                  <p className="text-gray-600">Compensation structures, salary escalations, and benefits planning.</p>
                </div>
                
                <div className="bg-[#F6F3EE] p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-[#2F4B6E] mb-3">Overhead Costs Planning</h3>
                  <p className="text-gray-600">Fixed and variable overhead allocation based on business scale and efficiency.</p>
                </div>
                
                <div className="bg-[#F6F3EE] p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-[#2F4B6E] mb-3">Net Working Capital</h3>
                  <p className="text-gray-600">Cash flow optimization through receivables, payables, and inventory management.</p>
                </div>
              </div>

              <div className="bg-[#3FB68B] p-6 rounded-xl mb-8">
                <h3 className="text-xl font-semibold text-white mb-3">Capex Projection</h3>
                <p className="text-white">Capital expenditure planning for growth, maintenance, and strategic investments.</p>
              </div>
              
              <div className="bg-[#2F4B6E]/10 p-8 rounded-xl">
                <h2 className="text-2xl font-semibold text-[#2F4B6E] mb-4">Planning Framework</h2>
                <p className="text-gray-600 mb-4">
                  This phase involves converting your collected data into detailed operational and financial assumptions. 
                  These drivers form the engine of your forecast model and require careful consideration of business dynamics.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-[#2F4B6E] mb-2">Human Capital</h4>
                    <ul className="list-disc pl-6 text-gray-600 space-y-1 text-sm">
                      <li>Hiring timeline and recruitment costs</li>
                      <li>Performance-based compensation</li>
                      <li>Training and development investments</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#2F4B6E] mb-2">Financial Capital</h4>
                    <ul className="list-disc pl-6 text-gray-600 space-y-1 text-sm">
                      <li>Working capital optimization</li>
                      <li>Capital allocation priorities</li>
                      <li>Investment return expectations</li>
                    </ul>
                  </div>
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

export default ForecastingAssumptions;