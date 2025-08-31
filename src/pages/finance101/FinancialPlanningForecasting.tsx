import { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Breadcrumb from '../../components/Breadcrumb';
import ForecastingInfinityLoop from '../../components/ForecastingInfinityLoop';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Target, BarChart3, TrendingUp, Settings } from 'lucide-react';
import Card from '../../components/Card';

const FinancialPlanningForecasting = () => {
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Finance', path: '/finance-101' },
    { label: 'Financial Planning & Forecasting' }
  ];

  const [activeTab, setActiveTab] = useState('transportation');

  const essentialCards = [
    {
      icon: Target,
      title: 'Purposes',
      description: 'Plan, budget, and prepare for the future. Use forecasting to guide decisions, attract investors, and manage risks.',
      path: '#purposes'
    },
    {
      icon: BarChart3,
      title: 'Types',
      description: 'From short-term cash needs to long-term strategy, forecasting adapts to support planning and manage risks.',
      path: '#types'
    },
    {
      icon: TrendingUp,
      title: 'Approach',
      description: 'Combine expert judgment with data-driven methods. Choose qualitative insights or quantitative precision.',
      path: '#approach'
    },
    {
      icon: Settings,
      title: 'Methods',
      description: 'Select the right tool: straight-line growth, regression models, or bottom-up projections.',
      path: '#methods'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-content mx-auto px-6 py-8">
          <Breadcrumb items={breadcrumbItems} />
          
          {/* Section 1: 3-Statement Model by Industry */}
          <section className="py-16">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-[#2F4B6E] mb-4">
                Your Financial Forecast at a Glance
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Explore 3-statement financial models across industries. Scroll, compare, and dive into details with embedded Excel models.
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8 bg-[#F6F3EE] rounded-full p-1">
                <TabsTrigger 
                  value="transportation" 
                  className="rounded-full data-[state=active]:bg-[#2F4B6E] data-[state=active]:text-white"
                >
                  Transportation & Warehousing
                </TabsTrigger>
                <TabsTrigger 
                  value="renewable" 
                  className="rounded-full data-[state=active]:bg-[#2F4B6E] data-[state=active]:text-white"
                >
                  Renewable Energy
                </TabsTrigger>
                <TabsTrigger 
                  value="fossil" 
                  className="rounded-full data-[state=active]:bg-[#2F4B6E] data-[state=active]:text-white"
                >
                  Fossil Energy
                </TabsTrigger>
              </TabsList>

              <TabsContent value="transportation">
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm h-[650px] overflow-auto">
                  <div className="p-6 text-center text-muted-foreground">
                    <p className="text-lg mb-4">Transportation & Warehousing Excel Model</p>
                    <div className="bg-[#F6F3EE] rounded-lg p-8 min-h-[500px] flex items-center justify-center">
                      <p className="text-gray-600">Excel embed container - 1200px × 600px scrollable area</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="renewable">
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm h-[650px] overflow-auto">
                  <div className="p-6 text-center text-muted-foreground">
                    <p className="text-lg mb-4">Renewable Energy Excel Model</p>
                    <div className="bg-[#F6F3EE] rounded-lg p-8 min-h-[500px] flex items-center justify-center">
                      <p className="text-gray-600">Excel embed container - 1200px × 600px scrollable area</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="fossil">
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm h-[650px] overflow-auto">
                  <div className="p-6 text-center text-muted-foreground">
                    <p className="text-lg mb-4">Fossil Energy Excel Model</p>
                    <div className="bg-[#F6F3EE] rounded-lg p-8 min-h-[500px] flex items-center justify-center">
                      <p className="text-gray-600">Excel embed container - 1200px × 600px scrollable area</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </section>

          {/* Section 2: Financial Forecasting Essentials */}
          <section className="py-16 bg-[#F6F3EE] rounded-2xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#2F4B6E] mb-4">
                Financial Forecasting Essentials
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-8">
              {essentialCards.map((card, index) => (
                <Card
                  key={index}
                  title={card.title}
                  description={card.description}
                  icon={card.icon}
                  path={card.path}
                  buttonText="Learn More"
                />
              ))}
            </div>
          </section>

          {/* Section 3: Infinity Loop */}
          <section className="py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#2F4B6E] mb-4">
                How Financial Forecasting Works
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                From sales assumptions to final analysis, forecasting is a continuous loop of data, planning, and refinement.
              </p>
            </div>

            <ForecastingInfinityLoop />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FinancialPlanningForecasting;