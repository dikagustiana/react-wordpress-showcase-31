import { FileText, Database, BarChart } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Card from '../components/Card';
import Breadcrumb from '../components/Breadcrumb';

const Accounting = () => {
  const accountingModules = [
    {
      title: "FSLI Detail",
      description: "Comprehensive Financial Statement Line Items analysis with bilingual explanations, definitions, and practical examples for professional accounting.",
      icon: Database,
      path: "/accounting/fsli"
    },
    {
      title: "Consolidated Reporting",
      description: "Master group-wide financial consolidation, elimination entries, and comprehensive reporting frameworks for multi-entity organizations.",
      icon: BarChart,
      path: "/accounting/consolidated-reporting"
    },
    {
      title: "Statutory Reporting",
      description: "Navigate regulatory compliance requirements, statutory financial reporting standards, and legal reporting obligations across jurisdictions.",
      icon: FileText,
      path: "/accounting/statutory-reporting"
    }
  ];

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Accounting' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-content mx-auto px-6 py-8">
          <Breadcrumb items={breadcrumbItems} />
          
          <div className="mb-12">
            <h1 className="text-h1 font-bold text-foreground mb-6">
              Accounting
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Master professional accounting with comprehensive modules covering financial statement analysis, 
              consolidation procedures, and regulatory compliance requirements for modern business practice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {accountingModules.map((module) => (
              <Card
                key={module.path}
                title={module.title}
                description={module.description}
                icon={module.icon}
                path={module.path}
                className="h-full"
              />
            ))}
          </div>

          {/* Additional Content Section */}
          <section className="mt-16 bg-card rounded-lg p-8 shadow-sm border">
            <h2 className="text-h2 font-semibold text-foreground mb-6">
              Professional Accounting Standards
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-h4 font-medium text-foreground mb-4">Key Standards & Frameworks</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li>• International Financial Reporting Standards (IFRS)</li>
                  <li>• Generally Accepted Accounting Principles (GAAP)</li>
                  <li>• Local regulatory requirements and compliance</li>
                  <li>• Consolidated reporting methodologies</li>
                  <li>• Financial statement presentation standards</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-h4 font-medium text-foreground mb-4">Learning Outcomes</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li>• Comprehensive understanding of FSLI components</li>
                  <li>• Advanced consolidation and elimination techniques</li>
                  <li>• Regulatory compliance and statutory reporting</li>
                  <li>• Professional accounting judgment and decision-making</li>
                  <li>• Real-world application of accounting standards</li>
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

export default Accounting;