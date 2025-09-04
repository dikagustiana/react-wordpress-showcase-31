import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Calculator, BarChart3, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const DikasTools = () => {
  const tools = [
    {
      id: 1,
      title: 'Financial Model Platform',
      description: 'Comprehensive financial modeling and forecasting platform with advanced analytics and scenario planning capabilities.',
      icon: <TrendingUp className="w-8 h-8 text-primary" />,
      path: '/executive-dashboard',
      isActive: true,
      features: ['DCF Models', 'Scenario Analysis', 'Risk Assessment', 'Forecasting']
    },
    {
      id: 2,
      title: 'Investment Analysis Suite',
      description: 'Advanced investment analysis tools for portfolio management and strategic decision making.',
      icon: <Calculator className="w-8 h-8 text-muted-foreground" />,
      path: '#',
      isActive: false,
      features: ['Portfolio Optimization', 'Risk Metrics', 'Performance Analytics', 'Benchmarking']
    },
    {
      id: 3,
      title: 'Business Intelligence Dashboard',
      description: 'Real-time business intelligence and reporting platform for data-driven insights.',
      icon: <BarChart3 className="w-8 h-8 text-muted-foreground" />,
      path: '#',
      isActive: false,
      features: ['Real-time Data', 'Custom Reports', 'KPI Tracking', 'Predictive Analytics']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/20">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-primary mb-6">
            Dika's Tools
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Specialized financial and business intelligence tools designed for advanced analysis, 
            modeling, and strategic decision making.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className={`group relative bg-card rounded-xl shadow-lg border transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${
                tool.isActive ? 'border-primary/20' : 'border-border/50'
              }`}
            >
              {/* Status Badge */}
              {tool.isActive ? (
                <div className="absolute -top-3 -right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                  Active
                </div>
              ) : (
                <div className="absolute -top-3 -right-3 bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm font-medium">
                  Coming Soon
                </div>
              )}

              <div className="p-8">
                {/* Icon */}
                <div className="mb-6">
                  {tool.icon}
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  {tool.title}
                </h3>
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {tool.description}
                </p>

                {/* Features */}
                <div className="mb-8">
                  <h4 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
                    Key Features
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {tool.features.map((feature, index) => (
                      <div key={index} className="text-sm text-muted-foreground">
                        • {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                {tool.isActive ? (
                  <Link
                    to={tool.path}
                    className="inline-flex items-center justify-center w-full bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-semibold transition-colors group-hover:shadow-lg"
                  >
                    Launch Platform
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Link>
                ) : (
                  <div className="inline-flex items-center justify-center w-full bg-muted text-muted-foreground px-6 py-3 rounded-lg font-semibold cursor-not-allowed">
                    Coming Soon
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="bg-card rounded-xl p-8 border border-border/50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Advanced Financial Intelligence
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              These specialized tools are designed to provide deep financial insights, 
              advanced modeling capabilities, and comprehensive business intelligence 
              for strategic decision making and analysis.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DikasTools;