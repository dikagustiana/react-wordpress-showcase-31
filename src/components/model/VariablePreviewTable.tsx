import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, ArrowUpDown } from 'lucide-react';

interface PreviewData {
  rows: any[];
  columns: string[];
  rowCount: number;
  durationMs: number;
}

interface VariablePreviewTableProps {
  data: PreviewData | null;
  isLoading: boolean;
}

const VariablePreviewTable = ({ data, isLoading }: VariablePreviewTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const filteredAndSortedData = useMemo(() => {
    if (!data?.rows) return [];

    let filtered = data.rows.filter(row =>
      Object.values(row).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    if (sortColumn) {
      filtered.sort((a, b) => {
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
    }

    return filtered;
  }, [data?.rows, searchTerm, sortColumn, sortDirection]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getColumnType = (columnName: string, value: any) => {
    if (typeof value === 'number') return 'number';
    if (value instanceof Date || /\d{4}-\d{2}-\d{2}/.test(String(value))) return 'date';
    return 'text';
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading preview...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search variables..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredAndSortedData.length} of {data.rowCount} rows • {data.durationMs}ms
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
                      <Badge variant="outline" className="text-xs">
                        {data.rows[0] ? getColumnType(column, data.rows[0][column]) : 'text'}
                      </Badge>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedData.map((row, index) => (
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
    </div>
  );
};

export default VariablePreviewTable;