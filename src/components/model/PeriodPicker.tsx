import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from 'lucide-react';

interface PeriodPickerProps {
  value: string;
  onChange: (value: string) => void;
}

const PeriodPicker = ({ value, onChange }: PeriodPickerProps) => {
  const periods = [
    '2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06',
    '2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12'
  ];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        Period
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent>
          {periods.map((period) => (
            <SelectItem key={period} value={period}>
              {new Date(period + '-01').toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long' 
              })}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default PeriodPicker;