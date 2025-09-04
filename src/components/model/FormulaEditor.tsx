import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Code, Lightbulb } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface FormulaEditorProps {
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
  isLoading: boolean;
}

const FormulaEditor = ({ value, onChange, onRun, isLoading }: FormulaEditorProps) => {
  const [showSQL, setShowSQL] = useState(false);
  const [showSnippets, setShowSnippets] = useState(false);

  const functions = [
    'SUM', 'SUMIF', 'SUMIFS', 'COUNT', 'COUNTIF', 'COUNTIFS', 
    'AVG', 'MIN', 'MAX', 'CASE WHEN', 'COALESCE', 'EOMONTH', 
    'YEAR', 'MONTH', 'DATE', 'JOIN'
  ];

  const snippets = [
    {
      name: 'SUMIFS Template',
      code: 'SUMIFS(Amount, City, "Jakarta", MonthEnd, "2025-07-31")'
    },
    {
      name: 'CASE WHEN Template', 
      code: 'CASE WHEN City = "Jakarta" THEN Amount * 1.1 ELSE Amount END'
    },
    {
      name: 'Date Functions',
      code: 'EOMONTH(DATE(YEAR(MonthEnd), MONTH(MonthEnd), 1), 0)'
    }
  ];

  const insertSnippet = (code: string) => {
    onChange(value + code);
  };

  // Mock SQL generation
  const generatedSQL = value ? `SELECT City, MonthEnd, ${value.replace(/"/g, "'")} as Result 
FROM \`project.dataset.${value.includes('warehouse') ? 'warehouse_demand' : 'table'}\` 
WHERE City = 'Jakarta' AND MonthEnd = '2025-07-31'
GROUP BY City, MonthEnd
LIMIT 20000` : '';

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">Formula</label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSnippets(!showSnippets)}
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            Snippets
          </Button>
        </div>
        
        <Textarea
          placeholder="Enter Excel-like formula (e.g., SUMIFS(Amount, City, 'Jakarta'))"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[120px] font-mono"
        />
        
        <div className="flex flex-wrap gap-1">
          {functions.map((fn) => (
            <Badge 
              key={fn} 
              variant="secondary" 
              className="cursor-pointer hover:bg-secondary/80"
              onClick={() => onChange(value + fn + '()')}
            >
              {fn}
            </Badge>
          ))}
        </div>
      </div>

      <Collapsible open={showSnippets} onOpenChange={setShowSnippets}>
        <CollapsibleContent className="space-y-2">
          <div className="bg-muted rounded-lg p-3">
            <h4 className="text-sm font-medium mb-2">Quick Snippets</h4>
            <div className="space-y-2">
              {snippets.map((snippet) => (
                <div key={snippet.name} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{snippet.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => insertSnippet(snippet.code)}
                  >
                    Insert
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <div className="flex items-center gap-2">
        <Button onClick={onRun} disabled={isLoading || !value.trim()}>
          <Play className="w-4 h-4 mr-2" />
          {isLoading ? 'Running...' : 'Run Query'}
        </Button>
        
        <Button
          variant="outline"
          onClick={() => setShowSQL(!showSQL)}
          disabled={!value.trim()}
        >
          <Code className="w-4 h-4 mr-2" />
          {showSQL ? 'Hide SQL' : 'Show SQL'}
        </Button>
      </div>

      <Collapsible open={showSQL} onOpenChange={setShowSQL}>
        <CollapsibleContent>
          <div className="bg-muted rounded-lg p-3">
            <h4 className="text-sm font-medium mb-2">Generated SQL</h4>
            <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-mono">
              {generatedSQL || 'Enter a formula to see generated SQL'}
            </pre>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default FormulaEditor;