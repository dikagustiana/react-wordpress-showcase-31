import { useState, useEffect, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { RowData } from './FinancialStatementRow';

interface FinancialDataResult {
  rows: RowData[];
  columns: string[];
  loading: boolean;
  error: string | null;
  retry: () => void;
}

// Cache for workbook data
const workbookCache = new Map<string, XLSX.WorkBook>();

/**
 * Detect if a row is a section header based on patterns:
 * - All caps
 * - Specific keywords
 * - Empty value columns
 */
function detectRowType(label: string, values: (number | null)[]): {
  isSection: boolean;
  isSubtotal: boolean;
  isTotal: boolean;
} {
  const trimmed = label.trim();
  const upperLabel = trimmed.toUpperCase();
  
  // Total indicators
  if (
    upperLabel.startsWith('TOTAL ') ||
    upperLabel === 'TOTAL' ||
    upperLabel.startsWith('NET ') ||
    upperLabel.includes('COMPREHENSIVE INCOME') ||
    upperLabel.includes('PROFIT FOR THE') ||
    upperLabel.includes('LOSS FOR THE')
  ) {
    // Grand totals vs subtotals
    if (
      upperLabel.includes('TOTAL ASSETS') ||
      upperLabel.includes('TOTAL LIABILITIES AND EQUITY') ||
      upperLabel.includes('TOTAL EQUITY') ||
      upperLabel.includes('NET INCREASE') ||
      upperLabel.includes('NET DECREASE') ||
      upperLabel.includes('COMPREHENSIVE INCOME FOR') ||
      upperLabel.includes('PROFIT FOR THE YEAR') ||
      upperLabel.includes('LOSS FOR THE YEAR')
    ) {
      return { isSection: false, isSubtotal: false, isTotal: true };
    }
    return { isSection: false, isSubtotal: true, isTotal: false };
  }
  
  // Section headers: all caps and typically no values
  const hasNoValues = values.every(v => v === null || v === 0);
  if (trimmed === upperLabel && trimmed.length > 3 && hasNoValues) {
    return { isSection: true, isSubtotal: false, isTotal: false };
  }
  
  // Known section headers
  const sectionKeywords = [
    'ASSETS', 'LIABILITIES', 'EQUITY', 'REVENUE', 'EXPENSES',
    'CURRENT ASSETS', 'NON-CURRENT ASSETS', 'CURRENT LIABILITIES',
    'NON-CURRENT LIABILITIES', 'OPERATING ACTIVITIES', 'INVESTING ACTIVITIES',
    'FINANCING ACTIVITIES', 'CASH FLOWS FROM'
  ];
  
  if (sectionKeywords.some(kw => upperLabel.includes(kw)) && hasNoValues) {
    return { isSection: true, isSubtotal: false, isTotal: false };
  }
  
  return { isSection: false, isSubtotal: false, isTotal: false };
}

/**
 * Detect indentation level from label
 */
function detectLevel(label: string, isSection: boolean, isSubtotal: boolean, isTotal: boolean): number {
  if (isSection || isTotal) return 0;
  if (isSubtotal) return 1;
  
  // Count leading spaces
  const leadingSpaces = label.match(/^(\s*)/)?.[1].length || 0;
  const level = Math.floor(leadingSpaces / 2);
  
  return Math.min(level + 1, 4); // Cap at 4 levels
}

/**
 * Parse Excel sheet into normalized row data
 */
function parseSheet(worksheet: XLSX.WorkSheet): { rows: RowData[]; columns: string[] } {
  // Convert to 2D array
  const data: unknown[][] = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: null,
    blankrows: false
  });
  
  if (data.length === 0) {
    return { rows: [], columns: [] };
  }
  
  // Find header row (row with period dates like "31 December 2024")
  let headerRowIndex = 0;
  let columns: string[] = [];
  
  for (let i = 0; i < Math.min(10, data.length); i++) {
    const row = data[i];
    if (!row) continue;
    
    // Look for date patterns in columns
    const potentialCols: string[] = [];
    for (let j = 1; j < row.length; j++) {
      const cell = row[j];
      if (cell && typeof cell === 'string') {
        if (
          cell.includes('Dec') || 
          cell.includes('December') ||
          cell.includes('2024') ||
          cell.includes('2023') ||
          /\d{1,2}[/-]\d{1,2}[/-]\d{2,4}/.test(cell)
        ) {
          potentialCols.push(cell.trim());
        }
      }
    }
    
    if (potentialCols.length >= 1) {
      headerRowIndex = i;
      columns = potentialCols;
      break;
    }
  }
  
  // If no date columns found, use generic column names
  if (columns.length === 0) {
    // Find first row with numeric data
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      if (!row) continue;
      
      let numericCount = 0;
      for (let j = 1; j < row.length; j++) {
        if (typeof row[j] === 'number') numericCount++;
      }
      
      if (numericCount >= 1) {
        // Determine number of value columns
        columns = Array.from({ length: numericCount }, (_, idx) => 
          idx === 0 ? '31-Dec-24' : '31-Dec-23'
        ).slice(0, 2);
        headerRowIndex = Math.max(0, i - 1);
        break;
      }
    }
  }
  
  // Default columns if nothing found
  if (columns.length === 0) {
    columns = ['31-Dec-24', '31-Dec-23'];
  }
  
  // Parse data rows
  const rows: RowData[] = [];
  let currentSection = '';
  
  for (let i = headerRowIndex + 1; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length === 0) continue;
    
    const label = String(row[0] || '').trim();
    if (!label) continue;
    
    // Extract numeric values
    const values: Record<string, number | null> = {};
    let valueIndex = 0;
    
    for (let j = 1; j < row.length && valueIndex < columns.length; j++) {
      const cell = row[j];
      if (cell === null || cell === undefined || cell === '') {
        values[columns[valueIndex]] = null;
      } else if (typeof cell === 'number') {
        values[columns[valueIndex]] = cell;
      } else if (typeof cell === 'string') {
        // Try to parse string as number
        const parsed = parseFloat(cell.replace(/[,\s]/g, ''));
        values[columns[valueIndex]] = isNaN(parsed) ? null : parsed;
      } else {
        values[columns[valueIndex]] = null;
      }
      valueIndex++;
    }
    
    // Fill remaining columns with null
    while (valueIndex < columns.length) {
      values[columns[valueIndex]] = null;
      valueIndex++;
    }
    
    // Detect row type
    const numericValues = Object.values(values);
    const { isSection, isSubtotal, isTotal } = detectRowType(label, numericValues);
    
    // Update current section
    if (isSection) {
      currentSection = label;
    }
    
    // Detect level
    const level = detectLevel(label, isSection, isSubtotal, isTotal);
    
    rows.push({
      id: `row-${i}`,
      label: label.trim(),
      level,
      values,
      isSection,
      isSubtotal,
      isTotal,
      isCollapsible: isSection,
      isCollapsed: false,
      isHidden: false
    });
  }
  
  return { rows, columns };
}

/**
 * Custom hook to load and parse financial statement data
 */
export function useFinancialData(fileUrl: string, sheetName: string): FinancialDataResult {
  const [rows, setRows] = useState<RowData[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      let workbook: XLSX.WorkBook;
      
      // Check cache
      if (workbookCache.has(fileUrl)) {
        workbook = workbookCache.get(fileUrl)!;
      } else {
        const response = await fetch(fileUrl);
        if (!response.ok) {
          throw new Error(`Failed to load file: ${response.status}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        workbook = XLSX.read(arrayBuffer, { type: 'array' });
        workbookCache.set(fileUrl, workbook);
      }
      
      // Find sheet
      let worksheet = workbook.Sheets[sheetName];
      
      if (!worksheet) {
        // Try case-insensitive match
        const lowerName = sheetName.toLowerCase();
        const matchedName = workbook.SheetNames.find(
          n => n.toLowerCase() === lowerName || 
               n.toLowerCase().includes(lowerName) ||
               lowerName.includes(n.toLowerCase())
        );
        
        if (matchedName) {
          worksheet = workbook.Sheets[matchedName];
        }
      }
      
      if (!worksheet) {
        throw new Error(
          `Sheet "${sheetName}" not found.\n\nAvailable: ${workbook.SheetNames.join(', ')}`
        );
      }
      
      const { rows: parsedRows, columns: parsedColumns } = parseSheet(worksheet);
      
      setRows(parsedRows);
      setColumns(parsedColumns);
    } catch (err) {
      console.error('Financial data load error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [fileUrl, sheetName]);
  
  useEffect(() => {
    loadData();
  }, [loadData, retryCount]);
  
  const retry = useCallback(() => {
    setRetryCount(c => c + 1);
  }, []);
  
  return { rows, columns, loading, error, retry };
}

export default useFinancialData;

