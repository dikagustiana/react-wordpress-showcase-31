import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Database } from 'lucide-react';

interface DatasetPickerProps {
  value: string;
  onChange: (value: string) => void;
}

const DatasetPicker = ({ value, onChange }: DatasetPickerProps) => {
  const datasets = [
    'warehouse_demand',
    'sales_forecast',
    'inventory_levels',
    'customer_analytics',
    'financial_metrics'
  ];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground flex items-center gap-2">
        <Database className="w-4 h-4" />
        Dataset
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select dataset" />
        </SelectTrigger>
        <SelectContent>
          {datasets.map((dataset) => (
            <SelectItem key={dataset} value={dataset}>
              {dataset.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DatasetPicker;