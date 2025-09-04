import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { BarChart3, LineChart as LineChartIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MiniChartProps {
  data: any;
}

const MiniChart = ({ data }: MiniChartProps) => {
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [xColumn, setXColumn] = useState<string>('');
  const [yColumn, setYColumn] = useState<string>('');

  if (!data?.rows?.length || !data?.columns?.length) {
    return (
      <Card className="p-4">
        <div className="text-center text-muted-foreground py-8">
          <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No data for visualization</p>
        </div>
      </Card>
    );
  }

  const numericColumns = data.columns.filter(col => 
    typeof data.rows[0][col] === 'number'
  );
  
  const allColumns = data.columns;

  // Auto-select columns if not set
  if (!xColumn && allColumns.length > 0) {
    setXColumn(allColumns[0]);
  }
  if (!yColumn && numericColumns.length > 0) {
    setYColumn(numericColumns[0]);
  }

  const chartData = data.rows.slice(0, 20).map(row => ({
    x: String(row[xColumn] || ''),
    y: Number(row[yColumn]) || 0
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          variant={chartType === 'line' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setChartType('line')}
        >
          <LineChartIcon className="w-4 h-4" />
        </Button>
        <Button
          variant={chartType === 'bar' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setChartType('bar')}
        >
          <BarChart3 className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-muted-foreground">X Axis</label>
          <Select value={xColumn} onValueChange={setXColumn}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Select X" />
            </SelectTrigger>
            <SelectContent>
              {allColumns.map(col => (
                <SelectItem key={col} value={col}>{col}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Y Axis</label>
          <Select value={yColumn} onValueChange={setYColumn}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Select Y" />
            </SelectTrigger>
            <SelectContent>
              {numericColumns.map(col => (
                <SelectItem key={col} value={col}>{col}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" fontSize={10} />
              <YAxis fontSize={10} />
              <Line 
                type="monotone" 
                dataKey="y" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          ) : (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" fontSize={10} />
              <YAxis fontSize={10} />
              <Bar dataKey="y" fill="hsl(var(--primary))" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MiniChart;