import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, Database, Code } from 'lucide-react';

interface ExecLogProps {
  history: Array<{
    timestamp: string;
    formula: string;
    duration: number;
    rowCount: number;
  }>;
}

const ExecLog = ({ history }: ExecLogProps) => {
  if (history.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No executions yet</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-48">
      <div className="space-y-2">
        {history.map((entry, index) => (
          <div key={index} className="p-3 bg-muted/50 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">
                {new Date(entry.timestamp).toLocaleTimeString()}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {entry.duration}ms
              </div>
            </div>
            
            <div className="text-sm font-mono text-foreground truncate">
              <Code className="w-3 h-3 inline mr-1" />
              {entry.formula}
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                <Database className="w-3 h-3 mr-1" />
                {entry.rowCount.toLocaleString()} rows
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default ExecLog;