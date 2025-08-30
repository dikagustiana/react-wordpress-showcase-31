import { TrendingUp, ArrowUp, ArrowDown, AlertTriangle, Target, Users, Building, Globe, DollarSign, BarChart3, PieChart as LucidePieChart, Activity, CheckCircle, Clock, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import { useState } from 'react';

const FinanceWorkspace = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30 June 2024');
  const [activeTab, setActiveTab] = useState('SOPL');
  const [activeStatement, setActiveStatement] = useState('PL');
  const [activePeriod, setActivePeriod] = useState('Yearly');
  const [activeMainTab, setActiveMainTab] = useState('Assumptions');

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Finance Workspace' }
  ];

  const periods = [
    '30 June 2024',
    '31 May 2024', 
    '30 April 2024',
    '31 March 2024',
    '29 February 2024',
    '31 January 2024'
  ];

  const kpiData = [
    { title: 'Revenue', value: '$125.6M', change: '+12.3%', isPositive: true },
    { title: 'EBITDA', value: '$28.4M', change: '+8.7%', isPositive: true },
    { title: 'Cash Flow', value: '$19.2M', change: '-3.2%', isPositive: false },
    { title: 'Net Income', value: '$21.8M', change: '+15.6%', isPositive: true },
    { title: 'Debt Ratio', value: '32.4%', change: '-2.1%', isPositive: true }
  ];

  const risks = [
    { title: 'Supply Chain Disruption', impact: 'High', description: 'Potential 15% cost increase in APAC region', severity: 'high' },
    { title: 'Currency Volatility', impact: 'Medium', description: 'EUR/USD fluctuation affecting European margins', severity: 'medium' },
    { title: 'Regulatory Changes', impact: 'Medium', description: 'New compliance costs in North America', severity: 'medium' }
  ];

  const opportunities = [
    { title: 'Digital Transformation', potential: 'High', description: '20% efficiency gain through automation', priority: 'high' },
    { title: 'Market Expansion', potential: 'Medium', description: 'Entry into Southeast Asian markets', priority: 'medium' },
    { title: 'Product Innovation', potential: 'High', description: 'New product line launch Q2 2025', priority: 'high' }
  ];

  const consultantInsights = [
    {
      title: 'Financial Performance',
      currentState: 'Strong revenue growth but declining cash conversion',
      recommendation: 'Optimize working capital management and accelerate collections',
      timeline: 'Immediate'
    },
    {
      title: 'Cash Management',
      currentState: 'High cash balance with underutilized liquidity',
      recommendation: 'Deploy excess cash in growth initiatives or debt reduction',
      timeline: 'Q1 2025'
    },
    {
      title: 'Risk Mitigation',
      currentState: 'Exposure to currency and supply chain risks',
      recommendation: 'Implement hedging strategies and diversify supplier base',
      timeline: 'Q2 2025'
    }
  ];

  const actionItems = [
    { task: 'Negotiate payment terms with top 10 customers', completed: false },
    { task: 'Implement automated cash forecasting system', completed: true },
    { task: 'Complete supply chain risk assessment', completed: false },
    { task: 'Review and optimize capital allocation strategy', completed: false },
    { task: 'Establish currency hedging framework', completed: false }
  ];

  // Chart data
  const revenueData = [
    { month: 'Jan', europe: 62.5, north_america: 21.4, asia_pacific: 18.9, latin_america: 12.6, middle_east: 9.8, total: 125.2 },
    { month: 'Feb', europe: 58.3, north_america: 23.1, asia_pacific: 19.7, latin_america: 11.2, middle_east: 8.9, total: 121.2 },
    { month: 'Mar', europe: 65.7, north_america: 25.8, asia_pacific: 21.3, latin_america: 13.8, middle_east: 10.2, total: 136.8 },
    { month: 'Apr', europe: 61.2, north_america: 22.6, asia_pacific: 20.1, latin_america: 12.9, middle_east: 9.5, total: 126.3 },
    { month: 'May', europe: 59.8, north_america: 24.3, asia_pacific: 18.5, latin_america: 11.7, middle_east: 8.7, total: 123.0 },
    { month: 'Jun', europe: 67.1, north_america: 26.4, asia_pacific: 22.8, latin_america: 14.2, middle_east: 11.1, total: 141.6 },
    { month: 'Jul', europe: 63.9, north_america: 25.1, asia_pacific: 21.6, latin_america: 13.5, middle_east: 10.3, total: 134.4 },
    { month: 'Aug', europe: 60.4, north_america: 23.7, asia_pacific: 19.9, latin_america: 12.8, middle_east: 9.2, total: 126.0 },
    { month: 'Sep', europe: 66.3, north_america: 27.2, asia_pacific: 23.1, latin_america: 14.8, middle_east: 11.6, total: 143.0 },
    { month: 'Oct', europe: 64.7, north_america: 26.8, asia_pacific: 22.4, latin_america: 14.1, middle_east: 10.9, total: 138.9 },
    { month: 'Nov', europe: 62.1, north_america: 25.5, asia_pacific: 21.7, latin_america: 13.3, middle_east: 10.1, total: 132.7 },
    { month: 'Dec', europe: 68.5, north_america: 28.1, asia_pacific: 24.6, latin_america: 15.7, middle_east: 12.3, total: 149.2 }
  ];

  const profitabilityData = [
    { month: 'Jan', europe: 8.2, north_america: 5.1, asia_pacific: 3.8, latin_america: 1.6, middle_east: 0.9, total: 19.6 },
    { month: 'Feb', europe: 7.5, north_america: 4.8, asia_pacific: 3.5, latin_america: 1.4, middle_east: 0.8, total: 18.0 },
    { month: 'Mar', europe: 9.1, north_america: 5.7, asia_pacific: 4.2, latin_america: 1.9, middle_east: 1.1, total: 22.0 },
    { month: 'Apr', europe: 8.7, north_america: 5.3, asia_pacific: 3.9, latin_america: 1.7, middle_east: 1.0, total: 20.6 },
    { month: 'May', europe: 8.3, north_america: 5.0, asia_pacific: 3.6, latin_america: 1.5, middle_east: 0.9, total: 19.3 },
    { month: 'Jun', europe: 9.4, north_america: 5.9, asia_pacific: 4.4, latin_america: 2.0, middle_east: 1.2, total: 22.9 },
    { month: 'Jul', europe: 8.9, north_america: 5.5, asia_pacific: 4.1, latin_america: 1.8, middle_east: 1.1, total: 21.4 },
    { month: 'Aug', europe: 8.5, north_america: 5.2, asia_pacific: 3.8, latin_america: 1.6, middle_east: 1.0, total: 20.1 },
    { month: 'Sep', europe: 9.6, north_america: 6.1, asia_pacific: 4.5, latin_america: 2.1, middle_east: 1.3, total: 23.6 },
    { month: 'Oct', europe: 9.2, north_america: 5.8, asia_pacific: 4.3, latin_america: 1.9, middle_east: 1.2, total: 22.4 },
    { month: 'Nov', europe: 8.8, north_america: 5.4, asia_pacific: 4.0, latin_america: 1.7, middle_east: 1.1, total: 21.0 },
    { month: 'Dec', europe: 10.1, north_america: 6.4, asia_pacific: 4.8, latin_america: 2.3, middle_east: 1.4, total: 25.0 }
  ];

  const cashFlowData = [
    { month: 'Jan', operating: 18.5, investing: -7.2, financing: -3.8 },
    { month: 'Feb', operating: 16.3, investing: -5.9, financing: -2.1 },
    { month: 'Mar', operating: 21.7, investing: -8.4, financing: -4.2 },
    { month: 'Apr', operating: 19.2, investing: -6.8, financing: -3.5 },
    { month: 'May', operating: 17.8, investing: -6.1, financing: -2.9 },
    { month: 'Jun', operating: 23.1, investing: -9.3, financing: -4.8 },
    { month: 'Jul', operating: 20.4, investing: -7.7, financing: -3.9 },
    { month: 'Aug', operating: 18.9, investing: -6.5, financing: -3.2 },
    { month: 'Sep', operating: 24.3, investing: -9.8, financing: -5.1 },
    { month: 'Oct', operating: 22.1, investing: -8.6, financing: -4.5 },
    { month: 'Nov', operating: 20.6, investing: -7.9, financing: -4.1 },
    { month: 'Dec', operating: 25.8, investing: -10.2, financing: -5.4 }
  ];

  const costsData = [
    { name: 'CapEx', value: 35, color: '#757D8A' },
    { name: 'OpEx', value: 45, color: '#0F1B2D' },
    { name: 'SG&A', value: 20, color: '#4CAF50' }
  ];

  const segmentData = {
    regions: ['Europe', 'North America', 'Asia Pacific', 'Latin America', 'Middle East', 'Consolidation'],
    incomeStatement: [
      { item: 'Net Revenue', Europe: '45.2M', 'North America': '38.7M', 'Asia Pacific': '28.4M', 'Latin America': '8.9M', 'Middle East': '4.4M', Consolidation: '125.6M' },
      { item: 'COGS Fixed', Europe: '12.3M', 'North America': '10.8M', 'Asia Pacific': '8.2M', 'Latin America': '2.8M', 'Middle East': '1.4M', Consolidation: '35.5M' },
      { item: 'COGS Variable', Europe: '18.7M', 'North America': '15.9M', 'Asia Pacific': '11.6M', 'Latin America': '3.6M', 'Middle East': '1.8M', Consolidation: '51.6M' },
      { item: 'Gross Profit', Europe: '14.2M', 'North America': '12.0M', 'Asia Pacific': '8.6M', 'Latin America': '2.5M', 'Middle East': '1.2M', Consolidation: '38.5M' },
      { item: 'Expenses', Europe: '8.9M', 'North America': '7.2M', 'Asia Pacific': '5.4M', 'Latin America': '1.8M', 'Middle East': '0.9M', Consolidation: '24.2M' },
      { item: 'Profit Before Tax', Europe: '5.3M', 'North America': '4.8M', 'Asia Pacific': '3.2M', 'Latin America': '0.7M', 'Middle East': '0.3M', Consolidation: '14.3M' },
      { item: 'Net Profit', Europe: '4.2M', 'North America': '3.8M', 'Asia Pacific': '2.5M', 'Latin America': '0.5M', 'Middle East': '0.2M', Consolidation: '11.2M' }
    ],
    balanceSheet: [
      { item: 'Current Assets', Europe: '25.8M', 'North America': '22.4M', 'Asia Pacific': '16.8M', 'Latin America': '5.2M', 'Middle East': '2.6M', Consolidation: '72.8M' },
      { item: 'Non-Current Assets', Europe: '45.2M', 'North America': '38.9M', 'Asia Pacific': '29.1M', 'Latin America': '9.2M', 'Middle East': '4.6M', Consolidation: '127.0M' },
      { item: 'Total Assets', Europe: '71.0M', 'North America': '61.3M', 'Asia Pacific': '45.9M', 'Latin America': '14.4M', 'Middle East': '7.2M', Consolidation: '199.8M' }
    ]
  };

  // Financial statement data based on period
  const getStatementData = () => {
    const yearlyData = {
      PL: [
        { item: 'REVENUE', '2022': '$120,000', '2023': '$135,000', '2024': '$152,000', '2025': '$168,000', '2026': '$185,000' },
        { item: 'Segment A', '2022': '$48,000', '2023': '$54,000', '2024': '$61,000', '2025': '$67,000', '2026': '$74,000' },
        { item: 'Segment B', '2022': '$42,000', '2023': '$47,000', '2024': '$53,000', '2025': '$58,000', '2026': '$64,000' },
        { item: 'Segment C', '2022': '$30,000', '2023': '$34,000', '2024': '$38,000', '2025': '$43,000', '2026': '$47,000' },
        { item: 'COST OF REVENUE', '2022': '$72,000', '2023': '$81,000', '2024': '$91,000', '2025': '$101,000', '2026': '$111,000' },
        { item: 'Segment A', '2022': '$29,000', '2023': '$32,000', '2024': '$37,000', '2025': '$40,000', '2026': '$44,000' },
        { item: 'Segment B', '2022': '$25,000', '2023': '$28,000', '2024': '$32,000', '2025': '$35,000', '2026': '$38,000' },
        { item: 'Segment C', '2022': '$18,000', '2023': '$21,000', '2024': '$22,000', '2025': '$26,000', '2026': '$29,000' },
        { item: 'GROSS PROFIT', '2022': '$48,000', '2023': '$54,000', '2024': '$61,000', '2025': '$67,000', '2026': '$74,000', bold: true },
        { item: 'OPERATING EXPENSES', '2022': '$28,000', '2023': '$31,000', '2024': '$34,000', '2025': '$37,000', '2026': '$40,000' },
        { item: 'Sales and Marketing Expenses', '2022': '$12,000', '2023': '$13,500', '2024': '$15,200', '2025': '$16,800', '2026': '$18,500' },
        { item: 'General and Administrative Expenses', '2022': '$10,000', '2023': '$11,200', '2024': '$12,500', '2025': '$13,800', '2026': '$15,200' },
        { item: 'Other Operating Expenses', '2022': '$6,000', '2023': '$6,300', '2024': '$6,300', '2025': '$6,400', '2026': '$6,300' },
        { item: 'EBITDA', '2022': '$20,000', '2023': '$23,000', '2024': '$27,000', '2025': '$30,000', '2026': '$34,000', bold: true },
        { item: 'NET PROFIT', '2022': '$15,500', '2023': '$18,250', '2024': '$21,900', '2025': '$25,350', '2026': '$29,300', bold: true }
      ],
      BS: [
        { item: 'ASSETS', '2022': '', '2023': '', '2024': '', '2025': '', '2026': '', bold: true },
        { item: 'Current Assets', '2022': '', '2023': '', '2024': '', '2025': '', '2026': '' },
        { item: 'Cash and Cash Equivalents', '2022': '$25,000', '2023': '$28,000', '2024': '$32,000', '2025': '$35,000', '2026': '$39,000' },
        { item: 'Account Receivable', '2022': '$18,000', '2023': '$20,000', '2024': '$23,000', '2025': '$25,000', '2026': '$28,000' },
        { item: 'Prepaid Taxes', '2022': '$2,000', '2023': '$2,200', '2024': '$2,500', '2025': '$2,700', '2026': '$3,000' },
        { item: 'Prepaid Expenses', '2022': '$3,000', '2023': '$3,300', '2024': '$3,600', '2025': '$4,000', '2026': '$4,400' },
        { item: 'Operational Supplies', '2022': '$1,500', '2023': '$1,600', '2024': '$1,800', '2025': '$2,000', '2026': '$2,200' },
        { item: 'Operational Deposit', '2022': '$1,000', '2023': '$1,100', '2024': '$1,200', '2025': '$1,300', '2026': '$1,400' },
        { item: 'Total Current Assets', '2022': '$50,500', '2023': '$56,200', '2024': '$64,100', '2025': '$70,000', '2026': '$78,000', bold: true },
        { item: 'TOTAL ASSETS', '2022': '$199,500', '2023': '$220,200', '2024': '$245,100', '2025': '$270,000', '2026': '$298,000', bold: true }
      ],
      CF: [
        { item: 'CASH FLOW FROM OPERATING ACTIVITIES', '2022': '', '2023': '', '2024': '', '2025': '', '2026': '', bold: true },
        { item: 'Profit before income tax', '2022': '$15,500', '2023': '$18,250', '2024': '$21,900', '2025': '$25,350', '2026': '$29,300' },
        { item: 'Depreciation of Fixed Assets', '2022': '$3,000', '2023': '$3,200', '2024': '$3,500', '2025': '$3,800', '2026': '$4,000' },
        { item: 'Depreciation of Right of Use Assets', '2022': '$1,000', '2023': '$1,000', '2024': '$1,000', '2025': '$1,000', '2026': '$1,000' },
        { item: 'Interest expense working capital', '2022': '$1,200', '2023': '$1,300', '2024': '$1,400', '2025': '$1,500', '2026': '$1,600' },
        { item: 'Amortization of Unamortized loan Cost', '2022': '$200', '2023': '$200', '2024': '$200', '2025': '$200', '2026': '$200' },
        { item: 'Account Receivable', '2022': '($2,000)', '2023': '($2,000)', '2024': '($3,000)', '2025': '($2,000)', '2026': '($3,000)' },
        { item: 'Prepaid Taxes', '2022': '($500)', '2023': '($200)', '2024': '($300)', '2025': '($200)', '2026': '($300)' },
        { item: 'Prepaid Expenses', '2022': '($800)', '2023': '($300)', '2024': '($300)', '2025': '($400)', '2026': '($400)' },
        { item: 'NET CASH PROVIDED BY OPERATING ACTIVITIES', '2022': '$17,600', '2023': '$21,450', '2024': '$24,400', '2025': '$29,250', '2026': '$32,400', bold: true },
        { item: 'CASH FLOW FROM INVESTING ACTIVITIES', '2022': '', '2023': '', '2024': '', '2025': '', '2026': '', bold: true },
        { item: 'Addition of fixed assets', '2022': '($5,000)', '2023': '($6,000)', '2024': '($7,000)', '2025': '($8,000)', '2026': '($9,000)' },
        { item: 'NET CASH PROVIDED BY INVESTING ACTIVITIES', '2022': '($5,000)', '2023': '($6,000)', '2024': '($7,000)', '2025': '($8,000)', '2026': '($9,000)', bold: true },
        { item: 'CASH FLOW FROM FINANCING ACTIVITIES', '2022': '', '2023': '', '2024': '', '2025': '', '2026': '', bold: true },
        { item: 'Receipt of Loan', '2022': '$10,000', '2023': '$8,000', '2024': '$6,000', '2025': '$4,000', '2026': '$2,000' },
        { item: 'Repayment of Loan', '2022': '($8,000)', '2023': '($6,000)', '2024': '($4,000)', '2025': '($2,000)', '2026': '($1,000)' },
        { item: 'NET CASH PROVIDED BY FINANCING ACTIVITIES', '2022': '$2,000', '2023': '$2,000', '2024': '$2,000', '2025': '$2,000', '2026': '$1,000', bold: true }
      ]
    };
    
    return yearlyData[activeStatement as keyof typeof yearlyData] || [];
  };

  const renderStatementData = () => {
    const data = getStatementData();
    const periods = activePeriod === 'Yearly' ? ['2022', '2023', '2024', '2025', '2026'] :
                   activePeriod === 'Half-Yearly' ? ['H1 2024', 'H2 2024', 'H1 2025', 'H2 2025'] :
                   ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'];

    return data.map((row, index) => (
      <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-cream-50'} hover:bg-gray-50`}>
        <td className={`p-4 border-r border-gray-200 ${row.bold ? 'font-bold text-navy-900' : 'text-gray-800'}`} 
            style={{ 
              fontFamily: 'Plus Jakarta Sans',
              color: row.bold ? '#0F1B2D' : '#203040'
            }}>
          {row.item}
        </td>
        {periods.map((period) => (
          <td key={period} className={`p-4 text-center border-r border-gray-200 ${row.bold ? 'font-bold' : ''}`}
              style={{ 
                fontFamily: 'Plus Jakarta Sans',
                color: row.bold ? '#0F1B2D' : '#203040'
              }}>
            {row[period as keyof typeof row] || '-'}
          </td>
        ))}
      </tr>
    ));
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F6F3EE' }}>
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb items={breadcrumbItems} />
          
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6" style={{ color: '#0F1B2D', fontFamily: 'Plus Jakarta Sans' }}>
              This is what mastery in Accounting & Finance looks like.
            </h1>
            <p className="text-xl max-w-4xl mx-auto" style={{ color: '#203040' }}>
              From consolidated financials to dashboards and strategic insights — just like a finance professional does.
            </p>
          </div>

          {/* Section 1 - Consolidation */}
          <section className="mb-16">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-3xl font-bold mb-4" style={{ color: '#0F1B2D' }}>
                Consolidation (Foundation Data)
              </h2>
              <p className="text-lg mb-8" style={{ color: '#203040' }}>
                Every analysis starts with a solid foundation: consolidated financials. This is the data that drives all further insights.
              </p>
              
              <div className="border-b border-gray-200 mb-6">
                <div className="flex space-x-8">
                  {['SOPL', 'SOFP', 'SOCF', 'SOCE'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-3 px-6 font-medium border-b-2 transition-colors ${
                        activeTab === tab 
                          ? 'border-blue-600 text-blue-600' 
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-center text-gray-600">
                  {activeTab} - Consolidated Financial Statement would be embedded here
                </p>
              </div>
            </div>
          </section>

          {/* Section 2 - 3 Statement Model */}
          <section className="mb-16">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              {/* Hero Intro */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4" style={{ color: '#0F1B2D', fontFamily: 'Plus Jakarta Sans' }}>
                  3-Statement Financial Model
                </h2>
                <p className="text-lg" style={{ color: '#203040' }}>
                  From consolidated data to structured models — this is how finance professionals connect performance, position, and cash flow.
                </p>
              </div>

              {/* Main Navigation Tabs */}
              <div className="flex justify-center mb-8">
                <div className="flex space-x-2 bg-gray-100 rounded-lg p-1">
                  {[
                    { key: 'Assumptions', label: 'Assumptions' },
                    { key: '3 Statements', label: '3 Statements' },
                    { key: 'Output', label: 'Output' }
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveMainTab(tab.key)}
                      className={`px-8 py-3 rounded-md font-bold transition-all ${
                        activeMainTab === tab.key 
                          ? 'text-white shadow-sm' 
                          : 'text-white'
                      }`}
                      style={{ 
                        fontFamily: 'Plus Jakarta Sans',
                        backgroundColor: activeMainTab === tab.key ? '#4CAF50' : '#0F1B2D'
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              {activeMainTab === 'Assumptions' && (
                <div>
                  <div className="text-center mb-8">
                    <p className="text-lg font-medium" style={{ color: '#203040', fontFamily: 'Plus Jakarta Sans' }}>
                      "Every model starts with assumptions — the levers that drive the future."
                    </p>
                  </div>

                  {/* Key Drivers Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-green-50 rounded-2xl p-6 shadow-sm">
                      <h3 className="text-sm font-medium text-gray-600 mb-2">Revenue Growth</h3>
                      <div className="text-3xl font-bold text-green-600">8.0%</div>
                      <p className="text-xs text-gray-500 mt-1">Annual target</p>
                    </div>
                    <div className="bg-blue-50 rounded-2xl p-6 shadow-sm">
                      <h3 className="text-sm font-medium text-gray-600 mb-2">COGS %</h3>
                      <div className="text-3xl font-bold text-blue-600">58.5%</div>
                      <p className="text-xs text-gray-500 mt-1">% of Revenue</p>
                    </div>
                    <div className="bg-purple-50 rounded-2xl p-6 shadow-sm">
                      <h3 className="text-sm font-medium text-gray-600 mb-2">CapEx/Sales</h3>
                      <div className="text-3xl font-bold text-purple-600">12.0%</div>
                      <p className="text-xs text-gray-500 mt-1">Investment ratio</p>
                    </div>
                    <div className="bg-orange-50 rounded-2xl p-6 shadow-sm">
                      <h3 className="text-sm font-medium text-gray-600 mb-2">Working Capital Days</h3>
                      <div className="text-3xl font-bold text-orange-600">45</div>
                      <p className="text-xs text-gray-500 mt-1">Days outstanding</p>
                    </div>
                  </div>

                  {/* Assumptions Table */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                      <h3 className="text-xl font-semibold" style={{ color: '#0F1B2D', fontFamily: 'Plus Jakarta Sans' }}>
                        Key Model Drivers
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left p-4 font-semibold text-gray-900 border-r border-gray-200">Driver</th>
                            <th className="text-center p-4 font-semibold text-gray-900 border-r border-gray-200">2024</th>
                            <th className="text-center p-4 font-semibold text-gray-900 border-r border-gray-200">2025</th>
                            <th className="text-center p-4 font-semibold text-gray-900 border-r border-gray-200">2026</th>
                            <th className="text-center p-4 font-semibold text-gray-900">Rationale</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="bg-white hover:bg-gray-50">
                            <td className="p-4 border-r border-gray-200 font-medium" style={{ color: '#0F1B2D' }}>Revenue Growth Rate</td>
                            <td className="p-4 text-center border-r border-gray-200">12.5%</td>
                            <td className="p-4 text-center border-r border-gray-200">10.5%</td>
                            <td className="p-4 text-center border-r border-gray-200">8.0%</td>
                            <td className="p-4 text-center text-sm text-gray-600">Market maturation</td>
                          </tr>
                          <tr className="bg-gray-50 hover:bg-gray-100">
                            <td className="p-4 border-r border-gray-200 font-medium" style={{ color: '#0F1B2D' }}>COGS as % of Revenue</td>
                            <td className="p-4 text-center border-r border-gray-200">59.9%</td>
                            <td className="p-4 text-center border-r border-gray-200">60.1%</td>
                            <td className="p-4 text-center border-r border-gray-200">60.0%</td>
                            <td className="p-4 text-center text-sm text-gray-600">Scale efficiencies</td>
                          </tr>
                          <tr className="bg-white hover:bg-gray-50">
                            <td className="p-4 border-r border-gray-200 font-medium" style={{ color: '#0F1B2D' }}>OpEx Growth Rate</td>
                            <td className="p-4 text-center border-r border-gray-200">8.9%</td>
                            <td className="p-4 text-center border-r border-gray-200">8.8%</td>
                            <td className="p-4 text-center border-r border-gray-200">8.1%</td>
                            <td className="p-4 text-center text-sm text-gray-600">Operational leverage</td>
                          </tr>
                          <tr className="bg-gray-50 hover:bg-gray-100">
                            <td className="p-4 border-r border-gray-200 font-medium" style={{ color: '#0F1B2D' }}>CapEx as % of Revenue</td>
                            <td className="p-4 text-center border-r border-gray-200">4.6%</td>
                            <td className="p-4 text-center border-r border-gray-200">4.8%</td>
                            <td className="p-4 text-center border-r border-gray-200">4.9%</td>
                            <td className="p-4 text-center text-sm text-gray-600">Expansion investments</td>
                          </tr>
                          <tr className="bg-white hover:bg-gray-50">
                            <td className="p-4 border-r border-gray-200 font-medium" style={{ color: '#0F1B2D' }}>Working Capital Days</td>
                            <td className="p-4 text-center border-r border-gray-200">45</td>
                            <td className="p-4 text-center border-r border-gray-200">42</td>
                            <td className="p-4 text-center border-r border-gray-200">40</td>
                            <td className="p-4 text-center text-sm text-gray-600">Process improvements</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeMainTab === '3 Statements' && (
                <div>
                  {/* Sub-tabs for 3 Statements */}
                  <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    {/* Statement Tabs */}
                    <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                      {[
                        { key: 'PL', label: 'Income Statement (P&L)' },
                        { key: 'BS', label: 'Balance Sheet (BS)' },
                        { key: 'CF', label: 'Cash Flow Statement (CF)' }
                      ].map((tab) => (
                        <button
                          key={tab.key}
                          onClick={() => setActiveStatement(tab.key)}
                          className={`px-6 py-2 rounded-md font-medium transition-all ${
                            activeStatement === tab.key 
                              ? 'bg-green-500 text-white shadow-sm' 
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                          style={{ fontFamily: 'Plus Jakarta Sans' }}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Period Toggle */}
                    <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                      {['Quarterly', 'Half-Yearly', 'Yearly'].map((period) => (
                        <button
                          key={period}
                          onClick={() => setActivePeriod(period)}
                          className={`px-4 py-2 rounded-md font-medium transition-all ${
                            activePeriod === period 
                              ? 'bg-navy-600 text-white shadow-sm' 
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                          style={{ 
                            fontFamily: 'Plus Jakarta Sans',
                            backgroundColor: activePeriod === period ? '#0F1B2D' : 'transparent'
                          }}
                        >
                          {period}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Table Container */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    {/* Mini KPI Cards */}
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex flex-wrap gap-4">
                        {activeStatement === 'PL' && (
                          <>
                            <div className="bg-green-50 rounded-lg p-4 min-w-[120px]">
                              <div className="text-sm text-gray-600">Revenue Growth</div>
                              <div className="text-lg font-bold text-green-600">+10.1%</div>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-4 min-w-[120px]">
                              <div className="text-sm text-gray-600">Net Margin</div>
                              <div className="text-lg font-bold text-blue-600">12.7%</div>
                            </div>
                          </>
                        )}
                        {activeStatement === 'BS' && (
                          <>
                            <div className="bg-red-50 rounded-lg p-4 min-w-[120px]">
                              <div className="text-sm text-gray-600">Debt Ratio</div>
                              <div className="text-lg font-bold text-red-600">26.7%</div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4 min-w-[120px]">
                              <div className="text-sm text-gray-600">Current Ratio</div>
                              <div className="text-lg font-bold text-green-600">2.72</div>
                            </div>
                          </>
                        )}
                        {activeStatement === 'CF' && (
                          <>
                            <div className="bg-green-50 rounded-lg p-4 min-w-[120px]">
                              <div className="text-sm text-gray-600">Operating Cash Flow</div>
                              <div className="text-lg font-bold text-green-600">$33,690</div>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-4 min-w-[120px]">
                              <div className="text-sm text-gray-600">Free Cash Flow</div>
                              <div className="text-lg font-bold text-blue-600">$25,490</div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Financial Statement Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 sticky top-0">
                          <tr>
                            <th className="text-left p-4 font-semibold text-gray-900 border-r border-gray-200">
                              {activeStatement === 'PL' ? 'P&L MODEL' : 
                               activeStatement === 'BS' ? 'ASSETS' : 
                               'CASH FLOW MODEL'}
                            </th>
                            {(activePeriod === 'Yearly' ? ['2022', '2023', '2024', '2025', '2026'] :
                              activePeriod === 'Half-Yearly' ? ['H1 2024', 'H2 2024', 'H1 2025', 'H2 2025'] :
                              ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024']).map((period) => (
                              <th key={period} className="text-center p-4 font-semibold text-gray-900 border-r border-gray-200 min-w-[120px]">
                                {period}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {renderStatementData()}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeMainTab === 'Output' && (
                <div>
                  <div className="text-center mb-8">
                    <p className="text-lg font-medium" style={{ color: '#203040', fontFamily: 'Plus Jakarta Sans' }}>
                      "Outputs turn the model into a decision tool — what matters most for executives."
                    </p>
                  </div>

                  {/* Key Ratios */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-blue-50 rounded-2xl p-6 shadow-sm">
                      <h3 className="text-sm font-medium text-gray-600 mb-2">Gross Margin</h3>
                      <div className="text-3xl font-bold text-blue-600">40.2%</div>
                      <div className="text-sm text-green-600 mt-1">+1.5% YoY</div>
                    </div>
                    <div className="bg-green-50 rounded-2xl p-6 shadow-sm">
                      <h3 className="text-sm font-medium text-gray-600 mb-2">EBITDA Margin</h3>
                      <div className="text-3xl font-bold text-green-600">22.6%</div>
                      <div className="text-sm text-green-600 mt-1">+0.8% YoY</div>
                    </div>
                    <div className="bg-purple-50 rounded-2xl p-6 shadow-sm">
                      <h3 className="text-sm font-medium text-gray-600 mb-2">ROA</h3>
                      <div className="text-3xl font-bold text-purple-600">11.2%</div>
                      <div className="text-sm text-green-600 mt-1">+2.1% YoY</div>
                    </div>
                    <div className="bg-orange-50 rounded-2xl p-6 shadow-sm">
                      <h3 className="text-sm font-medium text-gray-600 mb-2">ROE</h3>
                      <div className="text-3xl font-bold text-orange-600">18.4%</div>
                      <div className="text-sm text-green-600 mt-1">+3.2% YoY</div>
                    </div>
                  </div>

                  {/* Valuation Multiples */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <h3 className="text-xl font-semibold mb-4" style={{ color: '#0F1B2D', fontFamily: 'Plus Jakarta Sans' }}>
                        Valuation Multiples
                      </h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">EV/EBITDA</span>
                          <span className="text-2xl font-bold" style={{ color: '#0F1B2D' }}>12.5x</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">P/E Ratio</span>
                          <span className="text-2xl font-bold" style={{ color: '#0F1B2D' }}>15.8x</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">P/B Ratio</span>
                          <span className="text-2xl font-bold" style={{ color: '#0F1B2D' }}>2.9x</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <h3 className="text-xl font-semibold mb-4" style={{ color: '#0F1B2D', fontFamily: 'Plus Jakarta Sans' }}>
                        Financial Health
                      </h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Debt/Equity</span>
                          <span className="text-2xl font-bold text-green-600">0.36</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Current Ratio</span>
                          <span className="text-2xl font-bold text-green-600">2.72</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Interest Coverage</span>
                          <span className="text-2xl font-bold text-green-600">8.4x</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sensitivity Analysis */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-semibold mb-4" style={{ color: '#0F1B2D', fontFamily: 'Plus Jakarta Sans' }}>
                      Sensitivity Analysis: Revenue Growth vs Net Profit
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="p-3 text-left font-semibold text-gray-900">Revenue Growth</th>
                            <th className="p-3 text-center font-semibold text-gray-900">5%</th>
                            <th className="p-3 text-center font-semibold text-gray-900">7.5%</th>
                            <th className="p-3 text-center font-semibold text-gray-900 bg-green-100">10%</th>
                            <th className="p-3 text-center font-semibold text-gray-900">12.5%</th>
                            <th className="p-3 text-center font-semibold text-gray-900">15%</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="hover:bg-gray-50">
                            <td className="p-3 font-medium text-gray-900">Net Profit ($M)</td>
                            <td className="p-3 text-center">$18.2</td>
                            <td className="p-3 text-center">$19.8</td>
                            <td className="p-3 text-center bg-green-100 font-bold text-green-700">$21.9</td>
                            <td className="p-3 text-center">$24.1</td>
                            <td className="p-3 text-center">$26.5</td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="p-3 font-medium text-gray-900">Net Margin</td>
                            <td className="p-3 text-center">11.8%</td>
                            <td className="p-3 text-center">12.2%</td>
                            <td className="p-3 text-center bg-green-100 font-bold text-green-700">12.7%</td>
                            <td className="p-3 text-center">13.1%</td>
                            <td className="p-3 text-center">13.6%</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer Copy */}
              <div className="text-center mt-8">
                <p className="text-sm text-gray-600 italic" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                  "Finance guys don't just build models. They tell the story of numbers — where we are, where we're going, and what we need to do."
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 - Executive Dashboard */}
          <section className="mb-16">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-3xl font-bold mb-4" style={{ color: '#0F1B2D' }}>
                Executive Dashboard (Insights)
              </h2>
              <p className="text-lg mb-8" style={{ color: '#203040' }}>
                Data becomes meaningful when it's translated into executive-ready insights.
              </p>
              
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                {kpiData.map((kpi, index) => (
                  <div key={index} className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">{kpi.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold" style={{ color: '#0F1B2D' }}>{kpi.value}</span>
                      <div className={`flex items-center ${kpi.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {kpi.isPositive ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                        <span className="text-sm font-medium">{kpi.change}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">vs. last year</p>
                  </div>
                ))}
              </div>
              
              {/* Charts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Revenue by Segment */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-semibold mb-2" style={{ color: '#0F1B2D', fontFamily: 'Plus Jakarta Sans' }}>Revenue by Segment</h3>
                  <p className="text-sm text-gray-600 mb-4">Monthly revenue performance by region ($M)</p>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E6E6E6" />
                        <XAxis 
                          dataKey="month" 
                          stroke="#203040"
                          fontSize={12}
                          fontFamily="Plus Jakarta Sans"
                        />
                        <YAxis 
                          stroke="#203040"
                          fontSize={12}
                          fontFamily="Plus Jakarta Sans"
                          tickFormatter={(value) => `${value.toFixed(1)}`}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #E6E6E6',
                            borderRadius: '8px',
                            fontFamily: 'Plus Jakarta Sans'
                          }}
                          formatter={(value, name) => [`$${value}M`, name]}
                        />
                        <Legend 
                          wrapperStyle={{ paddingTop: '20px', fontFamily: 'Plus Jakarta Sans' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="europe" 
                          stroke="#0F1B2D" 
                          strokeWidth={2}
                          name="Europe"
                          dot={{ r: 3 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="north_america" 
                          stroke="#2E7D32" 
                          strokeWidth={2}
                          name="North America"
                          dot={{ r: 3 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="asia_pacific" 
                          stroke="#1976D2" 
                          strokeWidth={2}
                          name="Asia Pacific"
                          dot={{ r: 3 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="latin_america" 
                          stroke="#F57C00" 
                          strokeWidth={2}
                          name="Latin America"
                          dot={{ r: 3 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="middle_east" 
                          stroke="#D32F2F" 
                          strokeWidth={2}
                          name="Middle East"
                          dot={{ r: 3 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="total" 
                          stroke="#000000" 
                          strokeWidth={3}
                          name="Total Revenue"
                          dot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {/* Profitability by Segment */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-semibold mb-2" style={{ color: '#0F1B2D', fontFamily: 'Plus Jakarta Sans' }}>Profitability by Segment</h3>
                  <p className="text-sm text-gray-600 mb-4">Operating profit by business region ($M)</p>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={profitabilityData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E6E6E6" />
                        <XAxis 
                          dataKey="month" 
                          stroke="#203040"
                          fontSize={12}
                          fontFamily="Plus Jakarta Sans"
                        />
                        <YAxis 
                          stroke="#203040"
                          fontSize={12}
                          fontFamily="Plus Jakarta Sans"
                          tickFormatter={(value) => `${value.toFixed(1)}`}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #E6E6E6',
                            borderRadius: '8px',
                            fontFamily: 'Plus Jakarta Sans'
                          }}
                          formatter={(value, name) => [`$${value}M`, name]}
                        />
                        <Legend 
                          wrapperStyle={{ paddingTop: '20px', fontFamily: 'Plus Jakarta Sans' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="europe" 
                          stroke="#0F1B2D" 
                          strokeWidth={2}
                          name="Europe"
                          dot={{ r: 3 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="north_america" 
                          stroke="#2E7D32" 
                          strokeWidth={2}
                          name="North America"
                          dot={{ r: 3 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="asia_pacific" 
                          stroke="#1976D2" 
                          strokeWidth={2}
                          name="Asia Pacific"
                          dot={{ r: 3 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="latin_america" 
                          stroke="#F57C00" 
                          strokeWidth={2}
                          name="Latin America"
                          dot={{ r: 3 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="middle_east" 
                          stroke="#D32F2F" 
                          strokeWidth={2}
                          name="Middle East"
                          dot={{ r: 3 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="total" 
                          stroke="#000000" 
                          strokeWidth={3}
                          name="Total Profitability"
                          dot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {/* Cash Flow Trend */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-semibold mb-2" style={{ color: '#0F1B2D', fontFamily: 'Plus Jakarta Sans' }}>Cash Flow Trend</h3>
                  <p className="text-sm text-gray-600 mb-4">Operating, investing, and financing activities ($M)</p>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={cashFlowData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E6E6E6" />
                        <XAxis 
                          dataKey="month" 
                          stroke="#203040"
                          fontSize={12}
                          fontFamily="Plus Jakarta Sans"
                        />
                        <YAxis 
                          stroke="#203040"
                          fontSize={12}
                          fontFamily="Plus Jakarta Sans"
                          tickFormatter={(value) => `${value.toFixed(1)}`}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #E6E6E6',
                            borderRadius: '8px',
                            fontFamily: 'Plus Jakarta Sans'
                          }}
                          formatter={(value, name) => [`$${value}M`, name]}
                        />
                        <Legend 
                          wrapperStyle={{ paddingTop: '20px', fontFamily: 'Plus Jakarta Sans' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="operating" 
                          stroke="#43A047" 
                          strokeWidth={2}
                          name="Operating"
                          dot={{ r: 3 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="investing" 
                          stroke="#E53935" 
                          strokeWidth={2}
                          name="Investing"
                          dot={{ r: 3 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="financing" 
                          stroke="#1E88E5" 
                          strokeWidth={2}
                          name="Financing"
                          dot={{ r: 3 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {/* Operating Costs Breakdown */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-semibold mb-2" style={{ color: '#0F1B2D', fontFamily: 'Plus Jakarta Sans' }}>Operating Costs Breakdown</h3>
                  <p className="text-sm text-gray-600 mb-4">Cost distribution by category</p>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #E6E6E6',
                            borderRadius: '8px',
                            fontFamily: 'Plus Jakarta Sans'
                          }}
                          formatter={(value, name) => [`${value}%`, name]}
                        />
                        <Legend 
                          wrapperStyle={{ paddingTop: '20px', fontFamily: 'Plus Jakarta Sans' }}
                        />
                        <Pie
                          data={costsData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {costsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4 - Risks & Opportunities */}
          <section className="mb-16">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-3xl font-bold mb-4" style={{ color: '#0F1B2D' }}>
                Risks & Opportunities (Strategic Thinking)
              </h2>
              <p className="text-lg mb-8" style={{ color: '#203040' }}>
                A true finance partner doesn't just analyze the past — but also navigates the future.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Risks */}
                <div>
                  <h3 className="text-xl font-semibold mb-6" style={{ color: '#E53935' }}>Top Risks</h3>
                  <div className="space-y-4">
                    {risks.map((risk, index) => (
                      <div key={index} className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                          <h4 className="font-semibold text-red-800">{risk.title}</h4>
                          <span className={`ml-auto px-2 py-1 text-xs rounded ${
                            risk.severity === 'high' ? 'bg-red-200 text-red-800' : 'bg-orange-200 text-orange-800'
                          }`}>
                            {risk.impact}
                          </span>
                        </div>
                        <p className="text-red-700 text-sm">{risk.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Opportunities */}
                <div>
                  <h3 className="text-xl font-semibold mb-6" style={{ color: '#4CAF50' }}>Strategic Opportunities</h3>
                  <div className="space-y-4">
                    {opportunities.map((opportunity, index) => (
                      <div key={index} className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Target className="w-5 h-5 text-green-600 mr-2" />
                          <h4 className="font-semibold text-green-800">{opportunity.title}</h4>
                          <span className={`ml-auto px-2 py-1 text-xs rounded ${
                            opportunity.priority === 'high' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
                          }`}>
                            {opportunity.potential}
                          </span>
                        </div>
                        <p className="text-green-700 text-sm">{opportunity.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5 - Segment Information */}
          <section className="mb-16">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold" style={{ color: '#0F1B2D' }}>
                  Segment Information (Detail Mastery)
                </h2>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-4 py-2 border rounded-lg"
                >
                  {periods.map((period) => (
                    <option key={period} value={period}>{period}</option>
                  ))}
                </select>
              </div>
              <p className="text-lg mb-8" style={{ color: '#203040' }}>
                Drill down into details: performance by business unit, region, or period.
              </p>
              
              {/* Income Statement Table */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4" style={{ color: '#0F1B2D' }}>Segment Income Statement</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-3 text-left">Item</th>
                        {segmentData.regions.map((region) => (
                          <th key={region} className="border border-gray-300 p-3 text-center">{region}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {segmentData.incomeStatement.map((row, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="border border-gray-300 p-3 font-medium">{row.item}</td>
                          {segmentData.regions.map((region) => (
                            <td key={region} className="border border-gray-300 p-3 text-center">
                              {row[region as keyof typeof row]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Balance Sheet Table */}
              <div>
                <h3 className="text-xl font-semibold mb-4" style={{ color: '#0F1B2D' }}>Segment Statement of Financial Position</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-3 text-left">Item</th>
                        {segmentData.regions.map((region) => (
                          <th key={region} className="border border-gray-300 p-3 text-center">{region}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {segmentData.balanceSheet.map((row, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="border border-gray-300 p-3 font-medium">{row.item}</td>
                          {segmentData.regions.map((region) => (
                            <td key={region} className="border border-gray-300 p-3 text-center">
                              {row[region as keyof typeof row]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* Section 6 - Consultant Insights & Priority Actions */}
          <section className="mb-16">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-3xl font-bold mb-4" style={{ color: '#0F1B2D' }}>
                Consultant Insights & Priority Action Items (Leadership)
              </h2>
              <p className="text-lg mb-8" style={{ color: '#203040' }}>
                Finance mastery means turning analysis into action, with clear recommendations for leadership.
              </p>
              
              {/* Consultant Insights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {consultantInsights.map((insight, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold mb-3" style={{ color: '#0F1B2D' }}>{insight.title}</h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="font-medium text-gray-600">Current State:</p>
                        <p className="text-gray-800">{insight.currentState}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-600">Recommendation:</p>
                        <p className="text-gray-800">{insight.recommendation}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-600">Target Timeline:</p>
                        <span className={`inline-block px-2 py-1 rounded text-xs ${
                          insight.timeline === 'Immediate' 
                            ? 'bg-red-100 text-red-800' 
                            : insight.timeline === 'Q1 2025'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {insight.timeline}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Priority Action Items */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4" style={{ color: '#0F1B2D' }}>Priority Action Items</h3>
                <div className="space-y-3 mb-6">
                  {actionItems.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className={`w-5 h-5 ${item.completed ? 'text-green-600' : 'text-gray-300'}`} />
                      <span className={item.completed ? 'line-through text-gray-500' : 'text-gray-800'}>
                        {item.task}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2" style={{ color: '#0F1B2D' }}>Expected Aggregate Impact</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded p-4">
                      <p className="text-sm text-gray-600">Revenue Uplift</p>
                      <p className="text-2xl font-bold" style={{ color: '#4CAF50' }}>+$18.5M</p>
                    </div>
                    <div className="bg-white rounded p-4">
                      <p className="text-sm text-gray-600">Margin Improvement</p>
                      <p className="text-2xl font-bold" style={{ color: '#4CAF50' }}>+3.2%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FinanceWorkspace;