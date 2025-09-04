import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Clock, Database, TrendingUp } from 'lucide-react';

interface KPIPanelProps {
  data: any;
  type: 'variables' | 'results';
}

const KPIPanel = ({ data, type }: KPIPanelProps) => {
  if (!data) {
    return (
      <Card className="p-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          KPI Summary
        </h3>
        <div className="space-y-3">
          <div className="text-center text-muted-foreground py-8">
            No data available
          </div>
        </div>
      </Card>
    );
  }

  const kpis = [
    {
      label: 'Row Count',
      value: data.rowCount?.toLocaleString() || '0',
      icon: <Database className="w-4 h-4" />,
      color: 'bg-blue-500'
    },
    {
      label: 'Query Time',
      value: `${data.durationMs || 0}ms`,
      icon: <Clock className="w-4 h-4" />,
      color: 'bg-green-500'
    },
    {
      label: 'Data Scanned',
      value: type === 'results' ? 'BigQuery' : 'Preview',
      icon: <TrendingUp className="w-4 h-4" />,
      color: 'bg-purple-500'
    }
  ];

  // Calculate additional metrics for results
  if (type === 'results' && data.rows?.length > 0) {
    const firstNumericColumn = data.columns?.find(col => 
      typeof data.rows[0][col] === 'number'
    );
    
    if (firstNumericColumn) {
      const values = data.rows.map(row => row[firstNumericColumn]).filter(v => typeof v === 'number');
      const sum = values.reduce((a, b) => a + b, 0);
      const avg = sum / values.length;
      
      kpis.push({
        label: 'Average Value',
        value: avg.toFixed(2),
        icon: <TrendingUp className="w-4 h-4" />,
        color: 'bg-orange-500'
      });
    }
  }

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-3 flex items-center gap-2">
        <BarChart3 className="w-4 h-4" />
        KPI Summary
        <Badge variant="outline" className="ml-auto">
          {type === 'variables' ? 'Raw Data' : 'Query Results'}
        </Badge>
      </h3>
      
      <div className="space-y-3">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-full ${kpi.color} text-white`}>
                {kpi.icon}
              </div>
              <span className="text-sm font-medium">{kpi.label}</span>
            </div>
            <span className="text-sm font-mono font-semibold">{kpi.value}</span>
          </div>
        ))}
      </div>

      {type === 'results' && data.executedAt && (
        <div className="mt-4 pt-3 border-t">
          <div className="text-xs text-muted-foreground">
            Last executed: {new Date(data.executedAt).toLocaleString()}
          </div>
        </div>
      )}
    </Card>
  );
};

export default KPIPanel;