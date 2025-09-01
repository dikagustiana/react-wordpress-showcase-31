import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Save, X } from 'lucide-react';
import { FSLIMetric } from '@/hooks/useContent';

interface MetricEditorProps {
  isOpen: boolean;
  onClose: () => void;
  metric: FSLIMetric;
  onSave: (updates: Partial<FSLIMetric>) => void;
}

export const MetricEditor: React.FC<MetricEditorProps> = ({
  isOpen,
  onClose,
  metric,
  onSave
}) => {
  const [label, setLabel] = useState(metric.label);
  const [value, setValue] = useState(metric.value?.toString() || '');
  const [unit, setUnit] = useState(metric.unit || '');

  React.useEffect(() => {
    if (isOpen) {
      setLabel(metric.label);
      setValue(metric.value?.toString() || '');
      setUnit(metric.unit || '');
    }
  }, [isOpen, metric]);

  const handleSave = () => {
    const numericValue = value ? parseFloat(value) : undefined;
    onSave({
      label,
      value: numericValue,
      unit: unit || undefined,
    });
    onClose();
  };

  const formatDisplayValue = (val: number | undefined, unit: string | undefined) => {
    if (val === undefined) return '';
    
    if (unit === 'Percent') {
      return `${val}%`;
    }
    
    if (unit === 'Thousands USD' || unit === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: val >= 1000000 ? 'compact' : 'standard',
        maximumFractionDigits: 0,
      }).format(val);
    }
    
    return new Intl.NumberFormat('en-US').format(val);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Metric</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="metric-label">Label</Label>
            <Input
              id="metric-label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g., December 31, 2024"
            />
          </div>
          
          <div>
            <Label htmlFor="metric-value">Value</Label>
            <Input
              id="metric-value"
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="e.g., 2614318"
            />
          </div>
          
          <div>
            <Label htmlFor="metric-unit">Unit</Label>
            <Input
              id="metric-unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="e.g., Thousands USD, Percent"
            />
          </div>
          
          {value && (
            <div className="p-3 bg-muted rounded-lg">
              <Label className="text-sm text-muted-foreground">Preview:</Label>
              <div className="font-medium">
                {formatDisplayValue(parseFloat(value), unit)}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};