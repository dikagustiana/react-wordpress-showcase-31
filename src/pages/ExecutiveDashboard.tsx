import { useState } from 'react';
import { ArrowUp, ArrowDown, TrendingUp, AlertTriangle, Target, CheckCircle, User, Filter } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';

const ExecutiveDashboard = () => {
  const [period, setPeriod] = useState('monthly');
  const [segmentPeriod, setSegmentPeriod] = useState('2024-06-30');

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Finance 101', path: '/finance-101' },
    { label: 'Executive Dashboard' }
  ];

  // KPI Data
  const kpiData = [
    { label: 'Revenue', value: '$125.6M', change: '+12.3%', positive: true },
    { label: 'EBITDA', value: '$28.4M', change: '+8.7%', positive: true },
    { label: 'Cash Flow', value: '$19.2M', change: '-3.2%', positive: false },
    { label: 'Net Income', value: '$21.8M', change: '+15.6%', positive: true },
    { label: 'Debt Ratio', value: '0.42', change: '+2.1%', positive: false },
  ];

  // Chart Data
  const revenueBySegment = [
    { month: 'Jan', Europe: 25, 'North America': 35, 'Asia Pacific': 20, 'Latin America': 10, 'Middle East': 8, Total: 98 },
    { month: 'Feb', Europe: 28, 'North America': 38, 'Asia Pacific': 22, 'Latin America': 12, 'Middle East': 9, Total: 109 },
    { month: 'Mar', Europe: 30, 'North America': 40, 'Asia Pacific': 25, 'Latin America': 13, 'Middle East': 10, Total: 118 },
    { month: 'Apr', Europe: 32, 'North America': 42, 'Asia Pacific': 27, 'Latin America': 14, 'Middle East': 11, Total: 126 },
    { month: 'May', Europe: 35, 'North America': 45, 'Asia Pacific': 30, 'Latin America': 15, 'Middle East': 12, Total: 137 },
    { month: 'Jun', Europe: 38, 'North America': 48, 'Asia Pacific': 32, 'Latin America': 16, 'Middle East': 13, Total: 147 },
  ];

  const cashFlowData = [
    { month: 'Jan', Operating: 15, Investing: -5, Financing: 2 },
    { month: 'Feb', Operating: 18, Investing: -3, Financing: 1 },
    { month: 'Mar', Operating: 20, Investing: -7, Financing: 3 },
    { month: 'Apr', Operating: 22, Investing: -4, Financing: 2 },
    { month: 'May', Operating: 25, Investing: -6, Financing: 1 },
    { month: 'Jun', Operating: 28, Investing: -8, Financing: 4 },
  ];

  const operatingCostsData = [
    { name: 'CapEx', value: 35, color: '#0F1B2D' },
    { name: 'OpEx', value: 45, color: '#4CAF50' },
    { name: 'SG&A', value: 20, color: '#2196F3' },
  ];

  // Segment Data
  const segmentIncomeData = [
    { 
      item: 'Net Revenue',
      Europe: '38.2M',
      'North America': '48.1M',
      'Asia Pacific': '32.5M',
      'Latin America': '16.3M',
      'Middle East': '13.1M',
      Consolidation: '148.2M'
    },
    { 
      item: 'COGS Fixed',
      Europe: '15.3M',
      'North America': '19.2M',
      'Asia Pacific': '13.0M',
      'Latin America': '6.5M',
      'Middle East': '5.2M',
      Consolidation: '59.2M'
    },
    { 
      item: 'COGS Variable',
      Europe: '11.5M',
      'North America': '14.4M',
      'Asia Pacific': '9.8M',
      'Latin America': '4.9M',
      'Middle East': '3.9M',
      Consolidation: '44.5M'
    },
    { 
      item: 'Gross Profit',
      Europe: '11.4M',
      'North America': '14.5M',
      'Asia Pacific': '9.7M',
      'Latin America': '4.9M',
      'Middle East': '4.0M',
      Consolidation: '44.5M'
    },
    { 
      item: 'Net Profit',
      Europe: '4.2M',
      'North America': '5.8M',
      'Asia Pacific': '3.1M',
      'Latin America': '1.5M',
      'Middle East': '1.2M',
      Consolidation: '15.8M'
    },
  ];

  const segmentBalanceData = [
    { 
      item: 'Current Assets',
      Europe: '25.1M',
      'North America': '32.4M',
      'Asia Pacific': '18.7M',
      'Latin America': '9.3M',
      'Middle East': '7.8M',
      Consolidation: '93.3M'
    },
    { 
      item: 'Non-Current Assets',
      Europe: '45.2M',
      'North America': '58.1M',
      'Asia Pacific': '31.5M',
      'Latin America': '16.8M',
      'Middle East': '13.9M',
      Consolidation: '165.5M'
    },
    { 
      item: 'Total Assets',
      Europe: '70.3M',
      'North America': '90.5M',
      'Asia Pacific': '50.2M',
      'Latin America': '26.1M',
      'Middle East': '21.7M',
      Consolidation: '258.8M'
    },
  ];

  const risks = [
    { title: 'Currency Exchange Risk', impact: 'High', description: 'USD strengthening affecting international revenue' },
    { title: 'Supply Chain Disruption', impact: 'Medium', description: 'Potential delays in Asia Pacific operations' },
    { title: 'Regulatory Changes', impact: 'Medium', description: 'New compliance requirements in Europe' },
  ];

  const opportunities = [
    { title: 'Digital Transformation', potential: 'High', description: 'AI automation could reduce OpEx by 15%' },
    { title: 'Market Expansion', potential: 'High', description: 'Untapped markets in Latin America' },
    { title: 'Cost Optimization', potential: 'Medium', description: 'Consolidation opportunities in facilities' },
  ];

  const consultantInsights = [
    {
      category: 'Financial Performance',
      currentState: 'Strong revenue growth but declining margins',
      recommendation: 'Focus on high-margin products and cost optimization',
      timeline: 'Immediate'
    },
    {
      category: 'Cash Management',
      currentState: 'Working capital efficiency needs improvement',
      recommendation: 'Implement AI-driven inventory optimization',
      timeline: 'Q1 2025'
    },
    {
      category: 'Risk Mitigation',
      currentState: 'High exposure to currency fluctuations',
      recommendation: 'Implement comprehensive hedging strategy',
      timeline: 'Q2 2025'
    },
  ];

  const actionItems = [
    { task: 'Implement cost reduction program', completed: false },
    { task: 'Review pricing strategy for premium products', completed: true },
    { task: 'Optimize working capital management', completed: false },
    { task: 'Enhance financial reporting automation', completed: false },
    { task: 'Diversify revenue streams', completed: false },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F6F3EE' }}>
      <Header />
      
      <main className="flex-1">
        <div className="max-w-[1400px] mx-auto px-6 py-8">
          <Breadcrumb items={breadcrumbItems} />
          
          {/* Dashboard Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2" style={{ color: '#203040' }}>
                Executive Financial Dashboard
              </h1>
              <p className="text-lg text-gray-600">
                Comprehensive view of financial performance and strategic insights
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center space-x-2 bg-white rounded-lg px-4 py-2 shadow-sm">
                <User className="w-5 h-5 text-gray-600" />
                <span className="font-medium" style={{ color: '#203040' }}>Executive View</span>
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            {kpiData.map((kpi, index) => (
              <Card key={index} className="bg-white rounded-2xl shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">{kpi.label}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold" style={{ color: '#203040' }}>{kpi.value}</span>
                    <div className={`flex items-center ${kpi.positive ? 'text-green-600' : 'text-red-600'}`}>
                      {kpi.positive ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                      <span className="text-sm font-medium">{kpi.change}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">vs. last year</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Revenue by Segment */}
            <Card className="bg-white rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle style={{ color: '#203040' }}>Revenue by Segment</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueBySegment}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Europe" stroke="#0F1B2D" strokeWidth={2} />
                    <Line type="monotone" dataKey="North America" stroke="#4CAF50" strokeWidth={2} />
                    <Line type="monotone" dataKey="Asia Pacific" stroke="#2196F3" strokeWidth={2} />
                    <Line type="monotone" dataKey="Latin America" stroke="#FF9800" strokeWidth={2} />
                    <Line type="monotone" dataKey="Middle East" stroke="#E53935" strokeWidth={2} />
                    <Line type="monotone" dataKey="Total" stroke="#000000" strokeWidth={4} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Profitability by Segment */}
            <Card className="bg-white rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle style={{ color: '#203040' }}>Profitability by Segment</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueBySegment}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Europe" stroke="#0F1B2D" strokeWidth={2} />
                    <Line type="monotone" dataKey="North America" stroke="#4CAF50" strokeWidth={2} />
                    <Line type="monotone" dataKey="Asia Pacific" stroke="#2196F3" strokeWidth={2} />
                    <Line type="monotone" dataKey="Latin America" stroke="#FF9800" strokeWidth={2} />
                    <Line type="monotone" dataKey="Middle East" stroke="#E53935" strokeWidth={2} />
                    <Line type="monotone" dataKey="Total" stroke="#000000" strokeWidth={4} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Cash Flow Trend */}
            <Card className="bg-white rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle style={{ color: '#203040' }}>Cash Flow Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={cashFlowData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Operating" stroke="#4CAF50" strokeWidth={3} />
                    <Line type="monotone" dataKey="Investing" stroke="#E53935" strokeWidth={3} />
                    <Line type="monotone" dataKey="Financing" stroke="#2196F3" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Operating Costs Breakdown */}
            <Card className="bg-white rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle style={{ color: '#203040' }}>Operating Costs Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={operatingCostsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                    >
                      {operatingCostsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Risks & Opportunities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card className="bg-white rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center" style={{ color: '#203040' }}>
                  <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                  Top Risks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {risks.map((risk, index) => (
                    <div key={index} className="p-4 border-l-4 border-red-500 bg-red-50 rounded-r-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium" style={{ color: '#203040' }}>{risk.title}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          risk.impact === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {risk.impact}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{risk.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center" style={{ color: '#203040' }}>
                  <Target className="w-5 h-5 mr-2 text-green-600" />
                  Strategic Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {opportunities.map((opportunity, index) => (
                    <div key={index} className="p-4 border-l-4 border-green-500 bg-green-50 rounded-r-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium" style={{ color: '#203040' }}>{opportunity.title}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          opportunity.potential === 'High' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {opportunity.potential}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{opportunity.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Segment Information */}
          <Card className="bg-white rounded-2xl shadow-sm mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle style={{ color: '#203040' }}>Segment Information</CardTitle>
                <Select value={segmentPeriod} onValueChange={setSegmentPeriod}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024-06-30">30 June 2024</SelectItem>
                    <SelectItem value="2024-05-31">31 May 2024</SelectItem>
                    <SelectItem value="2024-04-30">30 April 2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4" style={{ color: '#203040' }}>Income Statement</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-48">Item</TableHead>
                        <TableHead>Europe</TableHead>
                        <TableHead>North America</TableHead>
                        <TableHead>Asia Pacific</TableHead>
                        <TableHead>Latin America</TableHead>
                        <TableHead>Middle East</TableHead>
                        <TableHead>Consolidation</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {segmentIncomeData.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{row.item}</TableCell>
                          <TableCell>{row.Europe}</TableCell>
                          <TableCell>{row['North America']}</TableCell>
                          <TableCell>{row['Asia Pacific']}</TableCell>
                          <TableCell>{row['Latin America']}</TableCell>
                          <TableCell>{row['Middle East']}</TableCell>
                          <TableCell className="font-semibold">{row.Consolidation}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4" style={{ color: '#203040' }}>Statement of Financial Position</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-48">Item</TableHead>
                        <TableHead>Europe</TableHead>
                        <TableHead>North America</TableHead>
                        <TableHead>Asia Pacific</TableHead>
                        <TableHead>Latin America</TableHead>
                        <TableHead>Middle East</TableHead>
                        <TableHead>Consolidation</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {segmentBalanceData.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{row.item}</TableCell>
                          <TableCell>{row.Europe}</TableCell>
                          <TableCell>{row['North America']}</TableCell>
                          <TableCell>{row['Asia Pacific']}</TableCell>
                          <TableCell>{row['Latin America']}</TableCell>
                          <TableCell>{row['Middle East']}</TableCell>
                          <TableCell className="font-semibold">{row.Consolidation}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Consultant Insights */}
          <Card className="bg-white rounded-2xl shadow-sm mb-8">
            <CardHeader>
              <CardTitle style={{ color: '#203040' }}>Consultant Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {consultantInsights.map((insight, index) => (
                  <div key={index} className="p-6 border rounded-2xl">
                    <h3 className="font-semibold mb-3" style={{ color: '#203040' }}>{insight.category}</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Current State</p>
                        <p className="text-sm text-gray-800">{insight.currentState}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Recommendation</p>
                        <p className="text-sm text-gray-800">{insight.recommendation}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Target Timeline</p>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          insight.timeline === 'Immediate' ? 'bg-red-100 text-red-800' :
                          insight.timeline === 'Q1 2025' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {insight.timeline}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Priority Action Items */}
          <Card className="bg-white rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle style={{ color: '#203040' }}>Priority Action Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                {actionItems.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className={`w-5 h-5 ${item.completed ? 'text-green-600' : 'text-gray-300'}`} />
                    <span className={`${item.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                      {item.task}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">Expected Aggregate Impact</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-green-700">Revenue Uplift</p>
                    <p className="text-lg font-bold text-green-800">+$18.2M</p>
                  </div>
                  <div>
                    <p className="text-sm text-green-700">Margin Improvement</p>
                    <p className="text-lg font-bold text-green-800">+4.3%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ExecutiveDashboard;