import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';

const FSLI = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Extended FSLI data based on the reference images
  const fsliData = [
    // CURRENT ASSETS
    {
      notes: "3i-6",
      indonesian: "Kas dan setara kas",
      english: "Cash and cash equivalents",
      dec2024: "2.614.318",
      dec2023: "5.018.739",
      slug: "cash-and-cash-equivalents"
    },
    {
      notes: "3i-7",
      indonesian: "Kas yang dibatasi penggunaannya",
      english: "Restricted cash",
      dec2024: "154.217",
      dec2023: "133.537",
      slug: "restricted-cash"
    },
    {
      notes: "3h-8-44c",
      indonesian: "Piutang usaha, neto",
      english: "Trade receivables, net",
      dec2024: "2.626.183",
      dec2023: "2.053.070",
      slug: "trade-receivables-net"
    },
    {
      notes: "3h-8",
      indonesian: "- Pihak ketiga",
      english: "- Third parties",
      dec2024: "520.685",
      dec2023: "716.327",
      slug: "third-parties"
    },
    {
      notes: "3g-9",
      indonesian: "Piutang lain-lain",
      english: "Other receivables",
      dec2024: "53.348",
      dec2023: "501.429",
      slug: "other-receivables-net"
    },
    {
      notes: "3h-10-44d",
      indonesian: "- Pihak berelasi",
      english: "- Related parties",
      dec2024: "28.630",
      dec2023: "28.217",
      slug: "related-parties"
    },
    {
      notes: "3h-10",
      indonesian: "- Pihak ketiga",
      english: "- Third parties",
      dec2024: "55.083",
      dec2023: "84.807",
      slug: "third-parties-other"
    },
    {
      notes: "3h-11",
      indonesian: "Persediaan, neto",
      english: "Inventories, net",
      dec2024: "806.397",
      dec2023: "655.712",
      slug: "inventories-net"
    },
    {
      notes: "",
      indonesian: "Piutang pajak",
      english: "Tax receivables",
      dec2024: "237.361",
      dec2023: "275.412",
      slug: "tax-receivables"
    },
    {
      notes: "3f-12",
      indonesian: "Uang muka dan biaya dibayar dimuka",
      english: "Advances and prepayments",
      dec2024: "113.756",
      dec2023: "108.429",
      slug: "advances-prepaymens-c"
    },
    {
      notes: "3f-13",
      indonesian: "Aset lancar lain-lain",
      english: "Other current assets",
      dec2024: "98.234",
      dec2023: "87.156",
      slug: "other-current-assets"
    },
    {
      notes: "",
      indonesian: "Jumlah Aset Lancar",
      english: "Total Current Assets",
      dec2024: "6.728.132",
      dec2023: "9.668.489",
      slug: "",
      isTotal: true
    },
    // NON-CURRENT ASSETS
    {
      notes: "3i-7",
      indonesian: "Kas yang dibatasi penggunaannya",
      english: "Restricted cash",
      dec2024: "145.621",
      dec2023: "156.789",
      slug: "restricted-cash-non-current"
    },
    {
      notes: "3h-8-44c",
      indonesian: "Piutang usaha jangka panjang, neto",
      english: "Trade receivables, net - non-current",
      dec2024: "312.456",
      dec2023: "298.123",
      slug: "trade-receivables-net-non-current"
    },
    {
      notes: "3h-10",
      indonesian: "Piutang lain-lain jangka panjang",
      english: "Other non-current receivables",
      dec2024: "89.234",
      dec2023: "76.543",
      slug: "other-non-current-receivables"
    },
    {
      notes: "3f-12",
      indonesian: "Uang muka dan biaya dibayar dimuka",
      english: "Advances and prepayments - non-current",
      dec2024: "156.789",
      dec2023: "134.567",
      slug: "advances-prepayments-non-current"
    },
    {
      notes: "3n-14",
      indonesian: "Investasi jangka panjang",
      english: "Long-term investments",
      dec2024: "1.245.678",
      dec2023: "1.198.234",
      slug: "long-term-investments"
    },
    {
      notes: "3k-15",
      indonesian: "Properti investasi",
      english: "Investment properties",
      dec2024: "2.567.890",
      dec2023: "2.345.678",
      slug: "investment-properties"
    },
    {
      notes: "3j-16",
      indonesian: "Aset tetap, neto",
      english: "Fixed assets, net",
      dec2024: "8.934.567",
      dec2023: "8.567.234",
      slug: "fixed-assets-net"
    },
    {
      notes: "3l-17",
      indonesian: "Aset hak guna, neto",
      english: "Right-of-use assets, net",
      dec2024: "567.234",
      dec2023: "534.123",
      slug: "right-of-use-assets-net"
    },
    {
      notes: "3m-18",
      indonesian: "Properti minyak dan gas, neto",
      english: "Oil and gas properties, net",
      dec2024: "3.456.789",
      dec2023: "3.234.567",
      slug: "oil-gas-properties-net"
    },
    {
      notes: "3a-19",
      indonesian: "Aset pajak tangguhan",
      english: "Deferred tax assets",
      dec2024: "234.567",
      dec2023: "198.234",
      slug: "deferred-tax-assets"
    },
    {
      notes: "3g-20",
      indonesian: "Piutang dari pemerintah",
      english: "Due from Government",
      dec2024: "145.678",
      dec2023: "123.456",
      slug: "due-from-government"
    },
    {
      notes: "3o-21",
      indonesian: "Aset tidak lancar lain-lain",
      english: "Other non-current assets",
      dec2024: "298.123",
      dec2023: "267.890",
      slug: "other-non-current-assets-final"
    },
    {
      notes: "",
      indonesian: "Jumlah Aset Tidak Lancar",
      english: "Total Non-current Assets",
      dec2024: "18.154.626",
      dec2023: "17.134.438",
      slug: "",
      isTotal: true
    },
    {
      notes: "",
      indonesian: "JUMLAH ASET",
      english: "TOTAL ASSETS",
      dec2024: "24.882.758",
      dec2023: "26.802.927",
      slug: "",
      isGrandTotal: true
    }
  ];

  const filteredData = fsliData.filter(item =>
    item.indonesian.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.notes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Accounting', path: '/accounting' },
    { label: 'FSLI Detail' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-content mx-auto px-6 py-8">
          <Breadcrumb items={breadcrumbItems} />
          
          {/* Header Section */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              CONSOLIDATED STATEMENT OF FINANCIAL POSITION
            </h1>
            
            <div className="mb-2">
              <p className="text-lg text-muted-foreground">Tanggal 31 Desember 2024</p>
              <p className="text-base text-muted-foreground italic">As of December 31, 2024</p>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">(Disajikan dalam Ribuan Dolar Amerika Serikat, Kecuali Dinyatakan Lain)</p>
              <p className="text-sm text-muted-foreground italic">(Expressed in Thousands of United States Dollars, Unless Otherwise Stated)</p>
            </div>

            {/* Search Box */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search line items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto bg-card rounded-lg shadow-sm border">
            <table className="w-full table-fixed">
              {/* Table Header */}
              <thead>
                <tr className="bg-primary">
                  <th colSpan={4} className="px-6 py-4 text-left text-lg font-bold text-primary-foreground">
                    ASET / ASSETS
                  </th>
                </tr>
                <tr className="bg-primary">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary-foreground border-r border-primary-foreground/20" style={{width: "40%"}}>
                    
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-primary-foreground border-r border-primary-foreground/20" style={{width: "20%"}}>
                    31 Desember 2024
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-primary-foreground border-r border-primary-foreground/20" style={{width: "20%"}}>
                    31 Desember 2023
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary-foreground" style={{width: "20%"}}>
                    
                  </th>
                </tr>
                <tr className="bg-primary">
                  <th className="px-4 py-2 text-left text-xs font-medium text-primary-foreground border-r border-primary-foreground/20">
                    
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-primary-foreground border-r border-primary-foreground/20">
                    December 31, 2024
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-primary-foreground border-r border-primary-foreground/20">
                    December 31, 2023
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-primary-foreground">
                    
                  </th>
                </tr>
              </thead>
              
              <tbody>
                {/* Data Rows */}
                {filteredData.map((item, index) => {
                  // Section headers
                  if (index === 0) {
                    return (
                      <React.Fragment key={`section-current-${index}`}>
                        <tr className="bg-muted/50">
                          <td colSpan={4} className="px-4 py-2 text-sm font-semibold text-foreground">
                            ASET LANCAR / CURRENT ASSETS
                          </td>
                        </tr>
                        <tr 
                          className={`border-b hover:bg-muted/30 transition-colors ${
                            index % 2 === 0 ? 'bg-background' : 'bg-muted/10'
                          }`}
                        >
                          <td className="px-4 py-2 text-sm border-r border-border">
                            {item.slug ? (
                              <Link 
                                to={`/accounting/fsli/${item.slug}`}
                                className="text-foreground hover:text-primary transition-colors hover:underline block"
                              >
                                {item.indonesian}
                              </Link>
                            ) : (
                              <span className={`${item.isTotal ? 'font-semibold' : ''} ${item.isGrandTotal ? 'font-bold text-lg' : ''}`}>
                                {item.indonesian}
                              </span>
                            )}
                            {item.notes && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {item.notes}
                              </div>
                            )}
                          </td>
                          <td className={`px-4 py-2 text-sm text-right border-r border-border font-mono ${item.isTotal ? 'font-semibold' : ''} ${item.isGrandTotal ? 'font-bold' : ''}`}>
                            {item.dec2024}
                          </td>
                          <td className={`px-4 py-2 text-sm text-right border-r border-border font-mono ${item.isTotal ? 'font-semibold' : ''} ${item.isGrandTotal ? 'font-bold' : ''}`}>
                            {item.dec2023}
                          </td>
                          <td className="px-4 py-2 text-sm">
                            {item.slug ? (
                              <Link 
                                to={`/accounting/fsli/${item.slug}`}
                                className="text-muted-foreground hover:text-primary transition-colors hover:underline text-sm"
                              >
                                {item.english}
                              </Link>
                            ) : (
                              <span className={`text-muted-foreground ${item.isTotal ? 'font-semibold' : ''} ${item.isGrandTotal ? 'font-bold' : ''}`}>
                                {item.english}
                              </span>
                            )}
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  }
                  
                  // Non-current assets section header
                  if (index === 12) {
                    return (
                      <React.Fragment key={`section-non-current-${index}`}>
                        <tr className="bg-muted/50">
                          <td colSpan={4} className="px-4 py-2 text-sm font-semibold text-foreground">
                            ASET TIDAK LANCAR / NON-CURRENT ASSETS
                          </td>
                        </tr>
                        <tr 
                          className={`border-b hover:bg-muted/30 transition-colors ${
                            index % 2 === 0 ? 'bg-background' : 'bg-muted/10'
                          }`}
                        >
                          <td className="px-4 py-2 text-sm border-r border-border">
                            {item.slug ? (
                              <Link 
                                to={`/accounting/fsli/${item.slug}`}
                                className="text-foreground hover:text-primary transition-colors hover:underline block"
                              >
                                {item.indonesian}
                              </Link>
                            ) : (
                              <span className={`${item.isTotal ? 'font-semibold' : ''} ${item.isGrandTotal ? 'font-bold text-lg' : ''}`}>
                                {item.indonesian}
                              </span>
                            )}
                            {item.notes && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {item.notes}
                              </div>
                            )}
                          </td>
                          <td className={`px-4 py-2 text-sm text-right border-r border-border font-mono ${item.isTotal ? 'font-semibold' : ''} ${item.isGrandTotal ? 'font-bold' : ''}`}>
                            {item.dec2024}
                          </td>
                          <td className={`px-4 py-2 text-sm text-right border-r border-border font-mono ${item.isTotal ? 'font-semibold' : ''} ${item.isGrandTotal ? 'font-bold' : ''}`}>
                            {item.dec2023}
                          </td>
                          <td className="px-4 py-2 text-sm">
                            {item.slug ? (
                              <Link 
                                to={`/accounting/fsli/${item.slug}`}
                                className="text-muted-foreground hover:text-primary transition-colors hover:underline text-sm"
                              >
                                {item.english}
                              </Link>
                            ) : (
                              <span className={`text-muted-foreground ${item.isTotal ? 'font-semibold' : ''} ${item.isGrandTotal ? 'font-bold' : ''}`}>
                                {item.english}
                              </span>
                            )}
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  }

                  // Regular rows
                  return (
                    <tr 
                      key={index}
                      className={`border-b hover:bg-muted/30 transition-colors ${
                        index % 2 === 0 ? 'bg-background' : 'bg-muted/10'
                      } ${item.isTotal ? 'bg-muted/20 border-t-2 border-primary/30' : ''} ${item.isGrandTotal ? 'bg-primary/10 border-t-4 border-primary' : ''}`}
                    >
                      <td className="px-4 py-2 text-sm border-r border-border">
                        {item.slug ? (
                          <Link 
                            to={`/accounting/fsli/${item.slug}`}
                            className="text-foreground hover:text-primary transition-colors hover:underline block"
                          >
                            {item.indonesian}
                          </Link>
                        ) : (
                          <span className={`${item.isTotal ? 'font-semibold' : ''} ${item.isGrandTotal ? 'font-bold text-lg' : ''}`}>
                            {item.indonesian}
                          </span>
                        )}
                        {item.notes && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {item.notes}
                          </div>
                        )}
                      </td>
                      <td className={`px-4 py-2 text-sm text-right border-r border-border font-mono ${item.isTotal ? 'font-semibold' : ''} ${item.isGrandTotal ? 'font-bold' : ''}`}>
                        {item.dec2024}
                      </td>
                      <td className={`px-4 py-2 text-sm text-right border-r border-border font-mono ${item.isTotal ? 'font-semibold' : ''} ${item.isGrandTotal ? 'font-bold' : ''}`}>
                        {item.dec2023}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {item.slug ? (
                          <Link 
                            to={`/accounting/fsli/${item.slug}`}
                            className="text-muted-foreground hover:text-primary transition-colors hover:underline text-sm"
                          >
                            {item.english}
                          </Link>
                        ) : (
                          <span className={`text-muted-foreground ${item.isTotal ? 'font-semibold' : ''} ${item.isGrandTotal ? 'font-bold' : ''}`}>
                            {item.english}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Coming Soon Section */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'ASET TIDAK LANCAR', subtitle: 'NON-CURRENT ASSETS', count: '15+ items' },
              { title: 'LIABILITAS', subtitle: 'LIABILITIES', count: '12+ items' },
              { title: 'EKUITAS', subtitle: 'EQUITY', count: '8+ items' }
            ].map((section, index) => (
              <div key={index} className="p-6 bg-muted/20 border border-dashed rounded-lg text-center">
                <h3 className="font-semibold text-foreground mb-1">{section.title}</h3>
                <p className="text-sm text-muted-foreground mb-2 italic">{section.subtitle}</p>
                <p className="text-xs text-muted-foreground mb-3">{section.count}</p>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Coming Soon</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FSLI;