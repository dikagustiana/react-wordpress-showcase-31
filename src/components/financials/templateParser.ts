/**
 * Excel Template Parser
 * 
 * Extracts template structure from Excel exactly as laid out.
 * No interpretation. No rearranging. No smart guessing.
 * 
 * Excel defines structure. This parser preserves it.
 */

import * as XLSX from 'xlsx';
import { TemplateCell, TemplateRow, TemplateSheet, ParsedTemplate } from './types';

// Workbook cache
const templateCache = new Map<string, ParsedTemplate>();

/**
 * Detect if cell value indicates a section header
 */
function detectCellType(
  value: string | number | null,
  isBold: boolean,
  rowValues: (string | number | null)[]
): { isHeader: boolean; isSection: boolean; isSubtotal: boolean; isTotal: boolean } {
  if (value === null || value === undefined || value === '') {
    return { isHeader: false, isSection: false, isSubtotal: false, isTotal: false };
  }
  
  const str = String(value).trim().toUpperCase();
  
  // Total detection
  if (str.startsWith('TOTAL ') || str === 'TOTAL') {
    const isGrandTotal = 
      str.includes('TOTAL ASSETS') ||
      str.includes('TOTAL LIABILITIES') ||
      str.includes('TOTAL EQUITY') ||
      str.includes('COMPREHENSIVE INCOME FOR') ||
      str.includes('PROFIT FOR THE YEAR') ||
      str.includes('PROFIT FOR THE PERIOD');
    
    return { 
      isHeader: false, 
      isSection: false, 
      isSubtotal: !isGrandTotal, 
      isTotal: isGrandTotal 
    };
  }
  
  // Check if this is a header row (all cells are text, no numbers)
  const hasOnlyText = rowValues.every(v => 
    v === null || v === '' || typeof v === 'string'
  );
  
  // Section detection: bold text with no numeric values in row
  if (isBold && hasOnlyText && str.length > 2) {
    // Check for common section keywords
    const sectionKeywords = [
      'ASSETS', 'LIABILITIES', 'EQUITY', 'REVENUE', 'INCOME', 'EXPENSES',
      'CURRENT', 'NON-CURRENT', 'OPERATING', 'INVESTING', 'FINANCING',
      'CASH FLOW', 'ATTRIBUTABLE', 'RETAINED', 'SHARE CAPITAL',
      'OTHER COMPREHENSIVE', 'NOTES'
    ];
    
    const isSection = sectionKeywords.some(kw => str.includes(kw)) ||
                     (str === str.toUpperCase() && str.length > 3);
    
    return { isHeader: false, isSection, isSubtotal: false, isTotal: false };
  }
  
  return { isHeader: false, isSection: false, isSubtotal: false, isTotal: false };
}

/**
 * Detect indentation from cell value or position
 */
function detectIndent(value: string | number | null, colIndex: number): number {
  if (typeof value !== 'string') return 0;
  
  // Count leading spaces
  const leadingSpaces = value.match(/^(\s*)/)?.[1].length || 0;
  return Math.floor(leadingSpaces / 2);
}

/**
 * Parse a single worksheet into template format
 */
function parseSheet(worksheet: XLSX.WorkSheet, sheetName: string): TemplateSheet {
  const rows: TemplateRow[] = [];
  
  // Get range
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
  const totalColumns = range.e.c + 1;
  
  // Get column widths
  const cols = worksheet['!cols'] || [];
  const columnWidths: number[] = [];
  for (let c = 0; c <= range.e.c; c++) {
    const col = cols[c];
    // Convert Excel width to approximate pixels
    columnWidths.push(col?.wpx || (col?.wch ? col.wch * 7 : 80));
  }
  
  // Get merge information
  const merges = worksheet['!merges'] || [];
  const mergeMap = new Map<string, { rowSpan: number; colSpan: number; isStart: boolean }>();
  
  merges.forEach(merge => {
    const rowSpan = merge.e.r - merge.s.r + 1;
    const colSpan = merge.e.c - merge.s.c + 1;
    
    // Mark start cell
    mergeMap.set(`${merge.s.r}-${merge.s.c}`, { rowSpan, colSpan, isStart: true });
    
    // Mark other cells as skip
    for (let r = merge.s.r; r <= merge.e.r; r++) {
      for (let c = merge.s.c; c <= merge.e.c; c++) {
        if (r !== merge.s.r || c !== merge.s.c) {
          mergeMap.set(`${r}-${c}`, { rowSpan: 0, colSpan: 0, isStart: false });
        }
      }
    }
  });
  
  // Track sections for collapse grouping
  let currentSectionId: string | null = null;
  let sectionCounter = 0;
  
  // Parse each row
  for (let r = 0; r <= range.e.r; r++) {
    const cells: TemplateCell[] = [];
    const rowValues: (string | number | null)[] = [];
    
    // First pass: collect all values in row
    for (let c = 0; c <= range.e.c; c++) {
      const cellRef = XLSX.utils.encode_cell({ r, c });
      const cell = worksheet[cellRef];
      rowValues.push(cell?.v ?? null);
    }
    
    // Check if row is empty (spacing row)
    const isSpacingRow = rowValues.every(v => v === null || v === '');
    
    // Second pass: build cell objects
    let rowHasSection = false;
    
    for (let c = 0; c <= range.e.c; c++) {
      const mergeInfo = mergeMap.get(`${r}-${c}`);
      
      // Skip cells that are part of a merge but not the start
      if (mergeInfo && !mergeInfo.isStart) {
        continue;
      }
      
      const cellRef = XLSX.utils.encode_cell({ r, c });
      const cell = worksheet[cellRef];
      
      const value = cell?.w ?? cell?.v ?? null; // Prefer formatted value
      
      // Detect bold from cell style (if available)
      const isBold = cell?.s?.font?.bold || false;
      const isItalic = cell?.s?.font?.italic || false;
      
      // Detect alignment
      let align: 'left' | 'center' | 'right' = 'left';
      if (cell?.s?.alignment?.horizontal) {
        align = cell.s.alignment.horizontal as 'left' | 'center' | 'right';
      } else if (typeof cell?.v === 'number') {
        align = 'right'; // Numbers default to right
      }
      
      // Detect cell type
      const { isHeader, isSection, isSubtotal, isTotal } = detectCellType(value, isBold, rowValues);
      
      if (isSection) {
        rowHasSection = true;
      }
      
      // Detect borders
      const hasBorderTop = cell?.s?.border?.top?.style ? true : false;
      const hasBorderBottom = cell?.s?.border?.bottom?.style ? true : false;
      
      cells.push({
        colIndex: c,
        value,
        isBold: isBold || isSubtotal || isTotal || isSection,
        isItalic,
        align,
        colSpan: mergeInfo?.colSpan || 1,
        rowSpan: mergeInfo?.rowSpan || 1,
        isHeader,
        isSection,
        isSubtotal,
        isTotal,
        indent: detectIndent(value, c),
        hasBorderTop: hasBorderTop || isTotal,
        hasBorderBottom: hasBorderBottom || isTotal
      });
    }
    
    // Update section tracking
    if (rowHasSection) {
      sectionCounter++;
      currentSectionId = `section-${sectionCounter}`;
    }
    
    rows.push({
      rowIndex: r,
      cells,
      isSpacingRow,
      isCollapsible: rowHasSection,
      sectionId: rowHasSection ? currentSectionId : null,
      parentSectionId: !rowHasSection ? currentSectionId : null
    });
  }
  
  return {
    name: sheetName,
    rows,
    columnWidths,
    totalColumns
  };
}

/**
 * Load and parse Excel template
 */
export async function loadTemplate(fileUrl: string): Promise<ParsedTemplate> {
  // Check cache
  if (templateCache.has(fileUrl)) {
    return templateCache.get(fileUrl)!;
  }
  
  // Fetch file
  const response = await fetch(fileUrl);
  if (!response.ok) {
    throw new Error(`Failed to load template: ${response.status}`);
  }
  
  const arrayBuffer = await response.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { 
    type: 'array',
    cellStyles: true,
    cellNF: true
  });
  
  const sheets = new Map<string, TemplateSheet>();
  
  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName];
    sheets.set(sheetName, parseSheet(worksheet, sheetName));
  }
  
  const parsed: ParsedTemplate = {
    sheets,
    sheetNames: workbook.SheetNames
  };
  
  templateCache.set(fileUrl, parsed);
  return parsed;
}

/**
 * Find sheet by name with fallback matching
 */
export function findSheet(template: ParsedTemplate, sheetName: string): TemplateSheet | null {
  // Exact match
  if (template.sheets.has(sheetName)) {
    return template.sheets.get(sheetName)!;
  }
  
  // Case-insensitive match
  const lowerName = sheetName.toLowerCase();
  for (const [name, sheet] of template.sheets) {
    if (name.toLowerCase() === lowerName) {
      return sheet;
    }
  }
  
  // Partial match
  for (const [name, sheet] of template.sheets) {
    if (name.toLowerCase().includes(lowerName) || lowerName.includes(name.toLowerCase())) {
      return sheet;
    }
  }
  
  return null;
}

