import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Breadcrumb from '../../components/Breadcrumb';

const ForecastingInput = () => {
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Finance', path: '/finance-101' },
    { label: 'Financial Planning & Forecasting', path: '/finance-101/financial-planning-forecasting' },
    { label: 'Input Phase' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-content mx-auto px-6 py-8">
          <Breadcrumb items={breadcrumbItems} />
          
          <div className="bg-white rounded-2xl p-12 shadow-sm border">
            <h1 className="text-4xl font-bold text-[#2F4B6E] mb-6">
              Input Phase - Data Collection
            </h1>
            
            <div className="prose max-w-none">
              <p className="text-lg text-gray-600 mb-8">
                The foundation of financial forecasting starts with comprehensive data collection and initial assumptions.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-[#F6F3EE] p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-[#2F4B6E] mb-3">Sales Assumptions</h3>
                  <p className="text-gray-600">Build the foundation with market research, historical data analysis, and growth projections.</p>
                </div>
                
                <div className="bg-[#F6F3EE] p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-[#2F4B6E] mb-3">Revenue Projection</h3>
                  <p className="text-gray-600">Transform sales assumptions into detailed revenue forecasts across different segments.</p>
                </div>
                
                <div className="bg-[#F6F3EE] p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-[#2F4B6E] mb-3">COGS & Gross Profit</h3>
                  <p className="text-gray-600">Calculate cost structures and gross profit margins based on operational efficiency.</p>
                </div>
              </div>
              
              <div className="bg-[#3FB68B]/10 p-8 rounded-xl">
                <h2 className="text-2xl font-semibold text-[#2F4B6E] mb-4">Key Input Components</h2>
                <p className="text-gray-600 mb-4">
                  This phase involves collecting and organizing all the fundamental data points that will drive your financial forecast. 
                  Focus on accuracy and realistic assumptions as these form the backbone of your entire model.
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Historical financial performance data</li>
                  <li>Market research and industry benchmarks</li>
                  <li>Sales pipeline and customer acquisition trends</li>
                  <li>Product pricing strategies and cost structures</li>
                  <li>Seasonal patterns and cyclical variations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ForecastingInput;