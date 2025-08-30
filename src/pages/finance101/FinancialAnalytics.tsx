import { BarChart } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Breadcrumb from '../../components/Breadcrumb';
import Card from '../../components/Card';

const FinancialAnalytics = () => {
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Finance 101', path: '/finance-101' },
    { label: 'Financial Analytics' }
  ];

  const analyticsCards = [
    {
      title: 'Variance Analysis',
      description: 'Analyse differences between planned and actual figures.',
      path: '/finance-101/financial-analytics/variance-analysis'
    },
    {
      title: 'Profitability Analysis', 
      description: 'Assess margins and returns to understand business health.',
      path: '/finance-101/financial-analytics/profitability-analysis'
    },
    {
      title: 'Liquidity Analysis',
      description: 'Measure the ability to meet short-term obligations.',
      path: '/finance-101/financial-analytics/liquidity-analysis'
    },
    {
      title: 'Efficiency Analysis',
      description: 'Evaluate how effectively resources are used.',
      path: '/finance-101/financial-analytics/efficiency-analysis'
    },
    {
      title: 'Financial Structure Analysis',
      description: 'Examine leverage and capital structure of the entity.',
      path: '/finance-101/financial-analytics/financial-structure-analysis'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb items={breadcrumbItems} />
          
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-12 mb-12 text-center">
            <h1 className="text-4xl font-bold text-primary mb-6">
              Financial Analytics
            </h1>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Financial analytics helps you understand performance and make informed decisions. Select a topic 
              below to open a pop-up where you can document your analysis and attach supporting charts or 
              visuals.
            </p>
          </div>

          {/* Analytics Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {analyticsCards.map((card, index) => (
              <Card
                key={index}
                title={card.title}
                description={card.description}
                icon={BarChart}
                path={card.path}
                buttonText="Edit Explanation"
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FinancialAnalytics;