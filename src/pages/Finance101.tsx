import { TrendingUp, Target, DollarSign, GraduationCap, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import Card from '../components/Card';

const Finance101 = () => {
  const financeModules = [
    {
      title: "Financial Analytics",
      description: "Drill down into variance, profitability, liquidity, efficiency and financial structure analyses.",
      icon: TrendingUp,
      path: "/finance-101/financial-analytics",
      buttonText: "Explore Analytics"
    },
    {
      title: "Financial Planning & Forecasting",
      description: "Build a comprehensive plan and forecast using a step-by-step flowchart covering sales assumptions through to analysing projected statements.",
      icon: Target,
      path: "/finance-101/financial-planning-forecasting",
      buttonText: "Start Planning"
    },
    {
      title: "Budgeting",
      description: "Learn about budgeting versus planning, bottom-up vs top-down approaches and the assumptions that drive your budget.",
      icon: DollarSign,
      path: "/finance-101/budgeting",
      buttonText: "See Budgeting"
    },
    {
      title: "CFA Prep",
      description: "Outline your strategies for preparing for the CFA exams. Include study schedules, resources and tips you have found effective.",
      icon: GraduationCap,
      path: "/finance-101/cfa-prep",
      buttonText: "Add Notes"
    }
  ];

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Finance' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-content mx-auto px-6 py-8">
          <Breadcrumb items={breadcrumbItems} />
          
          <div className="mb-12">
            <h1 className="text-h1 font-bold text-foreground mb-6">
              Finance
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Master essential financial concepts and analytical skills through comprehensive modules covering 
              financial analysis, planning, budgeting, and professional certification preparation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {financeModules.map((module, index) => (
              <Card
                key={module.path}
                title={module.title}
                description={module.description}
                icon={module.icon}
                path={module.path}
                buttonText={module.buttonText}
              />
            ))}
          </div>


          {/* Additional Content Section */}
          <section className="bg-card rounded-lg p-8 shadow-sm border">
            <h2 className="text-h2 font-semibold text-foreground mb-6">
              Finance Learning Path
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-h4 font-medium text-foreground mb-4">Foundation Level</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li>• Financial statement basics</li>
                  <li>• Key financial ratios</li>
                  <li>• Cash flow fundamentals</li>
                  <li>• Time value of money</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-h4 font-medium text-foreground mb-4">Intermediate Level</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li>• Advanced financial analysis</li>
                  <li>• Valuation techniques</li>
                  <li>• Financial modeling</li>
                  <li>• Risk assessment methods</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-h4 font-medium text-foreground mb-4">Advanced Level</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li>• Portfolio management</li>
                  <li>• Derivatives and hedging</li>
                  <li>• Capital structure optimization</li>
                  <li>• Professional certification prep</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Finance101;