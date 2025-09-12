import Header from './Header';
import Footer from './Footer';
import Breadcrumb from './Breadcrumb';
import FSLISidebar from './FSLISidebar';
import { fsliData, getFSLIItemBySlug } from '../lib/fsliData';
import { useParams } from 'react-router-dom';

// Template for FSLI detail pages
const FSLITemplate = ({ itemSlug }: { itemSlug: string }) => {
  const item = getFSLIItemBySlug(itemSlug);
  
  if (!item) {
    return <div>Item not found</div>;
  }

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Accounting', path: '/accounting' },
    { label: 'FSLI Detail', path: '/accounting/fsli' },
    { label: item.english }
  ];

  const sections = [
    {
      title: 'Quick Facts',
      content: 'Overview of key characteristics, classification, and basic information about this financial statement line item.'
    },
    {
      title: 'Definition',
      content: 'Comprehensive definition and scope of this line item according to accounting standards and best practices.'
    },
    {
      title: 'Recognition',
      content: 'Criteria and conditions for recognizing this item in the financial statements, including timing and threshold considerations.'
    },
    {
      title: 'Measurement',
      content: 'Measurement basis, valuation methods, and calculation approaches used for this financial statement component.'
    },
    {
      title: 'Presentation Example',
      content: 'Practical examples of how this item appears in financial statements with real-world context and formatting.'
    },
    {
      title: 'Journal Entry Examples',
      content: 'Common journal entries and accounting transactions related to this line item with debits and credits.'
    },
    {
      title: 'Disclosure Items',
      content: 'Required and recommended disclosure items in the notes to financial statements for this component.'
    },
    {
      title: 'Common Mistakes',
      content: 'Frequent errors, misconceptions, and pitfalls to avoid when accounting for this financial statement element.'
    },
    {
      title: 'TODO Essay',
      content: 'Space reserved for detailed analysis, industry-specific considerations, and advanced topics to be added.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <div className="flex">
        <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-card border-r p-6 overflow-y-auto">
          <FSLISidebar currentSlug={itemSlug} />
        </aside>
        
        <main className="flex-1 ml-64">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <Breadcrumb items={breadcrumbItems} />
          
          <div className="bg-card rounded-lg p-8 shadow-sm border">
            {/* Header Section */}
            <div className="mb-8">
              <h1 className="text-h1 font-bold text-foreground mb-4">
                {item.english}
              </h1>
              <h2 className="text-h2 text-muted-foreground mb-6">
                {item.indonesian}
              </h2>
              
              {/* Financial Data */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">December 31, 2024</h3>
                  <p className="text-2xl font-bold text-primary">${item.dec2024}</p>
                  <p className="text-sm text-muted-foreground">Thousands USD</p>
                </div>
                
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">December 31, 2023</h3>
                  <p className="text-2xl font-bold text-muted-foreground">${item.dec2023}</p>
                  <p className="text-sm text-muted-foreground">Thousands USD</p>
                </div>

                <div className="bg-primary/10 p-4 rounded-lg">
                  <h3 className="font-semibold text-primary mb-2">Notes Reference</h3>
                  <p className="text-foreground text-lg font-medium">{item.notes}</p>
                </div>
              </div>
            </div>

            {/* Content Sections */}
            <div className="space-y-8">
              {sections.map((section, index) => (
                <section key={index} className="border-b border-border pb-6 last:border-b-0">
                  <h3 className="text-h3 font-semibold text-foreground mb-4">
                    {section.title}
                  </h3>
                  <div className="bg-muted/30 p-6 rounded-lg min-h-[120px]">
                    <p className="text-muted-foreground italic">
                      {section.content}
                    </p>
                  </div>
                </section>
              ))}
            </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

// Individual FSLI pages using the template
export const CashAndCashEquivalents = () => <FSLITemplate itemSlug="cash-and-cash-equivalents" />;
export const RestrictedCash = () => <FSLITemplate itemSlug="restricted-cash" />;
export const TradeReceivablesNet = () => <FSLITemplate itemSlug="trade-receivables-net" />;
export const ThirdParties = () => <FSLITemplate itemSlug="third-parties" />;
export const RelatedParties = () => <FSLITemplate itemSlug="related-parties" />;
export const OtherReceivablesNet = () => <FSLITemplate itemSlug="other-receivables-net" />;
export const DueFromGovernment = () => <FSLITemplate itemSlug="due-from-government" />;
export const InventoriesNet = () => <FSLITemplate itemSlug="inventories-net" />;
export const CorporateDividendTaxesReceivableCurrent = () => <FSLITemplate itemSlug="corporate-dividend-taxes-receivable-current" />;
export const AdvancesPrepaymentsC = () => <FSLITemplate itemSlug="advances-prepayments-current" />;
export const OtherCurrentAssets = () => <FSLITemplate itemSlug="other-current-assets" />;
export const OtherNonCurrentAssets = () => <FSLITemplate itemSlug="other-non-current-assets" />;
export const RestrictedCashNonCurrent = () => <FSLITemplate itemSlug="restricted-cash-non-current" />;
export const TradeReceivablesNetNonCurrent = () => <FSLITemplate itemSlug="trade-receivables-net-non-current" />;
export const FixedAssetsNet = () => <FSLITemplate itemSlug="fixed-assets-net" />;
export const InvestmentProperties = () => <FSLITemplate itemSlug="investment-properties" />;
export const DeferredTaxAssets = () => <FSLITemplate itemSlug="deferred-tax-assets" />;
export const LongTermInvestments = () => <FSLITemplate itemSlug="long-term-investments" />;
export const AdvancesPrepaymentsNonCurrent = () => <FSLITemplate itemSlug="advances-prepayments-non-current" />;
export const CorporateDividendTaxesReceivableNonCurrent = () => <FSLITemplate itemSlug="corporate-dividend-taxes-receivable-non-current" />;
export const OtherNonCurrentReceivables = () => <FSLITemplate itemSlug="other-non-current-receivables" />;
export const OilGasPropertiesNet = () => <FSLITemplate itemSlug="oil-gas-properties-net" />;
export const RightOfUseAssetsNet = () => <FSLITemplate itemSlug="right-of-use-assets-net" />;
export const OtherNonCurrentAssetsFinal = () => <FSLITemplate itemSlug="other-non-current-assets-final" />;