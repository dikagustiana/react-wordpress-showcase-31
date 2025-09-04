import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Building, Calendar } from 'lucide-react';

interface ParameterFormProps {
  parameters: {
    city: string;
    asset: string;
    monthEnd: string;
  };
  onChange: (parameters: any) => void;
}

const ParameterForm = ({ parameters, onChange }: ParameterFormProps) => {
  const cities = ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang'];
  
  const updateParameter = (key: string, value: string) => {
    onChange({ ...parameters, [key]: value });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          City
        </label>
        <Select value={parameters.city} onValueChange={(value) => updateParameter('city', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select city" />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <Building className="w-4 h-4" />
          Asset
        </label>
        <Input
          placeholder="Enter asset name"
          value={parameters.asset}
          onChange={(e) => updateParameter('asset', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Month End
        </label>
        <Input
          type="date"
          value={parameters.monthEnd}
          onChange={(e) => updateParameter('monthEnd', e.target.value)}
        />
      </div>
    </div>
  );
};

export default ParameterForm;