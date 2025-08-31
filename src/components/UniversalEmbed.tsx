import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Download, Search } from 'lucide-react';
import { validateIframeUrl } from '@/utils/wordpress';

interface UniversalEmbedProps {
  dataSourceType: 'media' | 'onedrive' | 'gsheet' | 'api_json';
  dataSourceUrl: string;
  embedType: 'iframe' | 'sheetjs' | 'json_table';
  excelSheet?: string;
  excelRange?: string;
  tablePageSize?: number;
}

interface TableData {
  headers: string[];
  rows: (string | number)[][];
}

export function UniversalEmbed({
  dataSourceType,
  dataSourceUrl,
  embedType,
  excelSheet = 'Sheet1',
  excelRange = '',
  tablePageSize = 10
}: UniversalEmbedProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: tableData, isLoading, error } = useQuery({
    queryKey: ['embed-data', dataSourceUrl, embedType, excelSheet, excelRange],
    queryFn: async (): Promise<TableData | null> => {
      if (embedType === 'iframe') return null;

      if (embedType === 'sheetjs' && dataSourceType === 'media') {
        const response = await fetch(dataSourceUrl);
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const worksheet = workbook.Sheets[excelSheet];
        
        if (!worksheet) {
          throw new Error(`Sheet "${excelSheet}" not found`);
        }

        const range = excelRange || undefined;
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
          header: 1, 
          range,
          defval: ''
        }) as (string | number)[][];

        if (jsonData.length === 0) {
          return { headers: [], rows: [] };
        }

        const headers = jsonData[0].map(h => String(h));
        const rows = jsonData.slice(1);

        return { headers, rows };
      }

      if (embedType === 'json_table') {
        const response = await fetch(dataSourceUrl);
        const jsonData = await response.json();
        
        if (!Array.isArray(jsonData) || jsonData.length === 0) {
          return { headers: [], rows: [] };
        }

        const headers = Object.keys(jsonData[0]);
        const rows = jsonData.map(item => 
          headers.map(header => item[header] ?? '')
        );

        return { headers, rows };
      }

      return null;
    },
    enabled: !!dataSourceUrl && embedType !== 'iframe',
    staleTime: 60000, // 1 minute
    refetchOnWindowFocus: false
  });

  // Filter and paginate data
  const filteredRows = tableData?.rows.filter(row =>
    row.some(cell => 
      String(cell).toLowerCase().includes(searchTerm.toLowerCase())
    )
  ) || [];

  const totalPages = Math.ceil(filteredRows.length / tablePageSize);
  const paginatedRows = filteredRows.slice(
    (currentPage - 1) * tablePageSize,
    currentPage * tablePageSize
  );

  const downloadCSV = () => {
    if (!tableData) return;
    
    const csvContent = Papa.unparse({
      fields: tableData.headers,
      data: filteredRows
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (embedType === 'iframe') {
    if (!validateIframeUrl(dataSourceUrl)) {
      return (
        <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <p className="text-destructive">Invalid or unsafe URL for iframe embedding</p>
        </div>
      );
    }

    return (
      <div className="w-full">
        <div className="relative w-full h-0 pb-[56.25%] rounded-lg overflow-hidden border">
          <iframe
            src={dataSourceUrl}
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            allowFullScreen
            aria-label="Embedded content"
          />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-12 w-full" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
        <AlertCircle className="h-5 w-5 text-destructive" />
        <p className="text-destructive">
          Error loading data: {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      </div>
    );
  }

  if (!tableData || tableData.headers.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 bg-muted/30 border border-dashed border-muted-foreground/25 rounded-lg">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search data..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={downloadCSV} variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Download CSV
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {tableData.headers.map((header, index) => (
                  <TableHead key={index} className="whitespace-nowrap">
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex} className="whitespace-nowrap">
                      {String(cell)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * tablePageSize) + 1} to{' '}
            {Math.min(currentPage * tablePageSize, filteredRows.length)} of{' '}
            {filteredRows.length} results
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}