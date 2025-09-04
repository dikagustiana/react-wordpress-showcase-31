import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface SampleSizeSelectorProps {
  value: number;
  onChange: (value: number) => void;
  onRefresh: () => void;
}

const SampleSizeSelector = ({ value, onChange, onRefresh }: SampleSizeSelectorProps) => {
  const sampleSizes = [50, 100, 500];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Sample:</span>
      <Select value={String(value)} onValueChange={(val) => onChange(Number(val))}>
        <SelectTrigger className="w-20 h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sampleSizes.map((size) => (
            <SelectItem key={size} value={String(size)}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant="outline" size="sm" onClick={onRefresh}>
        <RefreshCw className="w-3 h-3" />
      </Button>
    </div>
  );
};

export default SampleSizeSelector;