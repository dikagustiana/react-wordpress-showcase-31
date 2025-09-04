import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Copy, ArrowUpDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QueryResult {
  rows: any[];
  columns: string[];
  rowCount: number;
  durationMs: number;
  executedAt: string;
  sql: string;
  downloadUrl?: string;
}

interface ResultsTableProps {
  data: QueryResult | null;
  isLoading: boolean;
}

const ResultsTable = ({ data, isLoading }: ResultsTableProps) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { toast } = useToast();

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const copyToClipboard = async () => {
    if (!data?.rows) return;
    
    const csv = [
      data.columns.join(','),
      ...data.rows.map(row => data.columns.map(col => String(row[col] ?? '')).join(','))
    ].join('\n');
    
    await navigator.clipboard.writeText(csv);
    toast({
      title: "Copied to clipboard",
      description: "Results copied as CSV format"
    });
  };

  const downloadResults = () => {
    if (!data?.downloadUrl) {
      toast({
        title: "Download unavailable",
        description: "No download URL provided",
        variant: "destructive"
      });
      return;
    }
    
    // In real implementation, this would trigger the download
    window.open(data.downloadUrl, '_blank');
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Executing query...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-2">No results yet</p>
          <p className="text-sm text-muted-foreground">Run a query to see aggregated results</p>
        </div>
      </div>
    );
  }

  const sortedData = [...data.rows].sort((a, b) => {
    if (!sortColumn) return 0;
    
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }
    
    const aStr = String(aVal).toLowerCase();
    const bStr = String(bVal).toLowerCase();
    return sortDirection === 'asc' 
      ? aStr.localeCompare(bStr)
      : bStr.localeCompare(aStr);
  });

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {data.rowCount} rows
          </Badge>
          <Badge variant="outline">
            {data.durationMs}ms
          </Badge>
          <Badge variant="outline">
            {new Date(data.executedAt).toLocaleTimeString()}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={copyToClipboard}>
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
          <Button variant="outline" size="sm" onClick={downloadResults}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      <div className="flex-1 border rounded-lg overflow-hidden">
        <div className="h-full overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background">
              <TableRow>
                {data.columns.map((column) => (
                  <TableHead 
                    key={column}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort(column)}
                  >
                    <div className="flex items-center gap-2">
                      <span>{column}</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((row, index) => (
                <TableRow key={index}>
                  {data.columns.map((column) => (
                    <TableCell key={column} className="font-mono text-sm">
                      {String(row[column] ?? '')}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* SQL Display */}
      <div className="bg-muted rounded-lg p-3">
        <h4 className="text-sm font-medium mb-2">Executed SQL</h4>
        <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono">
          {data.sql}
        </pre>
      </div>
    </div>
  );
};

export default ResultsTable;