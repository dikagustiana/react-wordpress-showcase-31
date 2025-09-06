import React, { useState } from 'react';
import * as XLSX from 'xlsx';

interface ExcelEmbedProps {
  embedUrl?: string;
  storagePath?: string;
  rangeRef?: string;
  height?: number;
  title?: string;
  type: 'live' | 'static';
}

interface ExcelData {
  headers: string[];
  rows: (string | number)[][];
}

export const ExcelEmbed: React.FC<ExcelEmbedProps> = ({
  embedUrl,
  storagePath,
  rangeRef = 'A1:Z100',
  height = 400,
  title,
  type
}) => {
  const [excelData, setExcelData] = useState<ExcelData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Load and parse Excel file for static mode
  const loadExcelFile = async (filePath: string) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(filePath);
      if (!response.ok) throw new Error('Failed to load file');
      
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer);
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      
      // Parse range
      const range = XLSX.utils.decode_range(rangeRef);
      const data = XLSX.utils.sheet_to_json(worksheet, { 
        range: range,
        header: 1 
      }) as (string | number)[][];
      
      if (data.length > 0) {
        const headers = data[0] as string[];
        const rows = data.slice(1);
        setExcelData({ headers, rows });
      }
    } catch (err) {
      setError('Failed to load or parse Excel file');
      console.error('Excel loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (type === 'static' && storagePath) {
      loadExcelFile(storagePath);
    }
  }, [type, storagePath, rangeRef]);

  if (type === 'live' && embedUrl) {
    return (
      <div className="my-6">
        {title && <h4 className="text-lg font-semibold mb-3">{title}</h4>}
        <div className="border border-border rounded-lg overflow-hidden shadow-sm">
          <iframe
            src={embedUrl}
            width="100%"
            height={height}
            frameBorder="0"
            className="w-full"
            title={title || 'Excel Document'}
          />
        </div>
      </div>
    );
  }

  if (type === 'static') {
    if (loading) {
      return (
        <div className="my-6">
          {title && <h4 className="text-lg font-semibold mb-3">{title}</h4>}
          <div className="border border-border rounded-lg p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading Excel data...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="my-6">
          {title && <h4 className="text-lg font-semibold mb-3">{title}</h4>}
          <div className="border border-destructive rounded-lg p-4 text-destructive">
            <p>{error}</p>
          </div>
        </div>
      );
    }

    if (excelData) {
      return (
        <div className="my-6">
          {title && <h4 className="text-lg font-semibold mb-3">{title}</h4>}
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto" style={{ maxHeight: `${height}px` }}>
              <table className="w-full text-sm">
                <thead className="bg-muted sticky top-0 z-10">
                  <tr>
                    {excelData.headers.map((header, index) => (
                      <th
                        key={index}
                        className="px-3 py-2 text-left font-medium border-r border-border last:border-r-0"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {excelData.rows.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className="border-b border-border hover:bg-muted/50"
                    >
                      {row.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="px-3 py-2 border-r border-border last:border-r-0"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {storagePath && (
            <div className="mt-2">
              <a
                href={storagePath}
                download
                className="text-sm text-primary hover:underline"
              >
                Download original file
              </a>
            </div>
          )}
        </div>
      );
    }
  }

  return null;
};