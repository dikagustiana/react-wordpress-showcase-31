import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Breadcrumb from '../../components/Breadcrumb';

const ForecastingOutput = () => {
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Finance 101', path: '/finance-101' },
    { label: 'Financial Planning & Forecasting', path: '/finance-101/financial-planning-forecasting' },
    { label: 'Output & Analysis' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-content mx-auto px-6 py-8">
          <Breadcrumb items={breadcrumbItems} />
          
          <div className="bg-white rounded-2xl p-12 shadow-sm border">
            <h1 className="text-4xl font-bold text-[#2F4B6E] mb-6">
              Output & Analysis Phase
            </h1>
            
            <div className="prose max-w-none">
              <p className="text-lg text-gray-600 mb-8">
                Generate comprehensive financial statements and perform detailed analysis to guide strategic decision-making.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-[#F6F3EE] p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-[#2F4B6E] mb-3">Debt & Dividends</h3>
                  <p className="text-gray-600">Capital structure optimization and shareholder return planning.</p>
                </div>
                
                <div className="bg-[#3FB68B] p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-white mb-3">3 Statement Model</h3>
                  <p className="text-white">Integrated Income Statement, Balance Sheet, and Cash Flow Statement.</p>
                </div>
                
                <div className="bg-[#F6F3EE] p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-[#2F4B6E] mb-3">Analysis of Projections</h3>
                  <p className="text-gray-600">Scenario analysis, sensitivity testing, and performance metrics.</p>
                </div>
              </div>
              
              <div className="bg-[#2F4B6E] p-8 rounded-xl mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">Financial Statement Integration</h2>
                <p className="text-white/90 mb-4">
                  The culmination of your forecasting process results in fully integrated financial statements that provide 
                  a complete picture of your business's projected financial position and performance.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/10 p-4 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Income Statement</h4>
                    <p className="text-white/80 text-sm">Revenue, costs, and profitability projections</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Balance Sheet</h4>
                    <p className="text-white/80 text-sm">Assets, liabilities, and equity positions</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Cash Flow</h4>
                    <p className="text-white/80 text-sm">Operating, investing, and financing activities</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#3FB68B]/10 p-8 rounded-xl">
                <h2 className="text-2xl font-semibold text-[#2F4B6E] mb-4">Analysis & Insights</h2>
                <p className="text-gray-600 mb-4">
                  Transform your financial projections into actionable insights through comprehensive analysis and scenario planning.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-[#2F4B6E] mb-3">Key Metrics</h4>
                    <ul className="list-disc pl-6 text-gray-600 space-y-1 text-sm">
                      <li>Revenue growth rates and profitability trends</li>
                      <li>Return on investment and capital efficiency</li>
                      <li>Liquidity ratios and cash conversion cycles</li>
                      <li>Debt service coverage and leverage ratios</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#2F4B6E] mb-3">Scenario Analysis</h4>
                    <ul className="list-disc pl-6 text-gray-600 space-y-1 text-sm">
                      <li>Best case, base case, and worst case scenarios</li>
                      <li>Sensitivity analysis for key variables</li>
                      <li>Break-even analysis and stress testing</li>
                      <li>Strategic decision support and risk assessment</li>
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

export default ForecastingOutput;