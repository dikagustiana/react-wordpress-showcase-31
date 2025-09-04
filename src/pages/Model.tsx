import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DatasetPicker from '@/components/model/DatasetPicker';
import PeriodPicker from '@/components/model/PeriodPicker';
import ParameterForm from '@/components/model/ParameterForm';
import FormulaEditor from '@/components/model/FormulaEditor';
import VariablePreviewTable from '@/components/model/VariablePreviewTable';
import ResultsTable from '@/components/model/ResultsTable';
import KPIPanel from '@/components/model/KPIPanel';
import MiniChart from '@/components/model/MiniChart';
import ExecLog from '@/components/model/ExecLog';
import ErrorBanner from '@/components/model/ErrorBanner';
import SampleSizeSelector from '@/components/model/SampleSizeSelector';

interface QueryResult {
  rows: any[];
  columns: string[];
  rowCount: number;
  durationMs: number;
  executedAt: string;
  sql: string;
  downloadUrl?: string;
}

interface PreviewData {
  rows: any[];
  columns: string[];
  rowCount: number;
  durationMs: number;
}

const Model = () => {
  const [activeTab, setActiveTab] = useState<'variables' | 'results'>('variables');
  const [selectedDataset, setSelectedDataset] = useState('warehouse_demand');
  const [period, setPeriod] = useState('2025-07');
  const [parameters, setParameters] = useState({
    city: 'Jakarta',
    asset: '',
    monthEnd: '2025-07-31'
  });
  const [formula, setFormula] = useState('');
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [sampleSize, setSampleSize] = useState(50);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [execHistory, setExecHistory] = useState<any[]>([]);

  // Load preview data on mount and when dataset/sample size changes
  useEffect(() => {
    loadPreviewData();
  }, [selectedDataset, sampleSize]);

  const loadPreviewData = async () => {
    try {
      setError(null);
      const response = await fetch('/api/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dataset: selectedDataset,
          select_cols: '*',
          limit: sampleSize,
          offset: 0
        })
      });

      if (!response.ok) {
        throw new Error(`API Error ${response.status}. Preview endpoint failed.`);
      }

      const data = await response.json();
      setPreviewData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Preview failed to load');
    }
  };

  const runQuery = async () => {
    if (!formula.trim()) {
      setError('Please enter a formula');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simple mapping logic - in real implementation this would be more sophisticated
      const mapping = {
        value_col: 'Amount',
        filters: [
          { col: 'City', op: '=', val: parameters.city },
          { col: 'MonthEnd', op: '=', val: parameters.monthEnd }
        ]
      };

      const response = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dataset: selectedDataset,
          formula: formula,
          mapping: mapping,
          select_cols: ['City', 'MonthEnd'],
          group_by: ['City', 'MonthEnd'],
          limit: 20000
        })
      });

      if (!response.ok) {
        throw new Error(`API Error ${response.status}. Endpoint /api/run not found.`);
      }

      const result = await response.json();
      setQueryResult(result);
      setActiveTab('results');
      
      // Add to execution history
      setExecHistory(prev => [{
        timestamp: new Date().toISOString(),
        formula: formula,
        duration: result.durationMs,
        rowCount: result.rowCount
      }, ...prev.slice(0, 9)]);

      // Cache in localStorage
      localStorage.setItem('lastQuery', JSON.stringify({
        formula,
        dataset: selectedDataset,
        parameters,
        timestamp: new Date().toISOString()
      }));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Query execution failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}
      
      <main className="max-w-[1800px] mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Financial Model Platform</h1>
          <p className="text-muted-foreground">Build and execute Excel-like formulas on BigQuery datasets</p>
        </div>

        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
          {/* Left Panel */}
          <div className="col-span-3 space-y-4 overflow-y-auto">
            <div className="bg-card rounded-lg border p-4">
              <h3 className="font-semibold mb-3">Dataset & Period</h3>
              <DatasetPicker 
                value={selectedDataset} 
                onChange={setSelectedDataset} 
              />
              <div className="mt-3">
                <PeriodPicker 
                  value={period} 
                  onChange={setPeriod} 
                />
              </div>
            </div>
            
            <div className="bg-card rounded-lg border p-4">
              <h3 className="font-semibold mb-3">Parameters</h3>
              <ParameterForm 
                parameters={parameters}
                onChange={setParameters}
              />
            </div>
          </div>

          {/* Center Panel */}
          <div className="col-span-6 flex flex-col">
            <div className="bg-card rounded-lg border p-4 mb-4">
              <h3 className="font-semibold mb-3">Formula Editor</h3>
              <FormulaEditor 
                value={formula}
                onChange={setFormula}
                onRun={runQuery}
                isLoading={isLoading}
              />
            </div>

            <div className="bg-card rounded-lg border flex-1 flex flex-col">
              <div className="p-4 border-b">
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'variables' | 'results')}>
                  <div className="flex items-center justify-between">
                    <TabsList>
                      <TabsTrigger value="variables">Raw Variables</TabsTrigger> 
                      <TabsTrigger value="results">Aggregated Results</TabsTrigger>
                    </TabsList>
                    {activeTab === 'variables' && (
                      <SampleSizeSelector 
                        value={sampleSize}
                        onChange={setSampleSize}
                        onRefresh={loadPreviewData}
                      />
                    )}
                  </div>
                </Tabs>
              </div>
              
              <div className="flex-1 p-4">
                <Tabs value={activeTab}>
                  <TabsContent value="variables" className="h-full mt-0">
                    <VariablePreviewTable 
                      data={previewData}
                      isLoading={!previewData && !error}
                    />
                  </TabsContent>
                  <TabsContent value="results" className="h-full mt-0">
                    <ResultsTable 
                      data={queryResult}
                      isLoading={isLoading}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="col-span-3 space-y-4 overflow-y-auto">
            <KPIPanel 
              data={activeTab === 'variables' ? previewData : queryResult}
              type={activeTab}
            />
            
            <div className="bg-card rounded-lg border p-4">
              <h3 className="font-semibold mb-3">Visualization</h3>
              <MiniChart 
                data={activeTab === 'variables' ? previewData : queryResult}
              />
            </div>
            
            <div className="bg-card rounded-lg border p-4">
              <h3 className="font-semibold mb-3">Execution Log</h3>
              <ExecLog history={execHistory} />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Model;