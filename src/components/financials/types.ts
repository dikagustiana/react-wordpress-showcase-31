/**
 * Template-based Financial Statement Types
 * 
 * These types represent the exact structure extracted from Excel templates.
 * No interpretation, no normalization - just faithful representation.
 */

export interface TemplateCell {
  colIndex: number;
  value: string | number | null;
  isBold: boolean;
  isItalic: boolean;
  align: 'left' | 'center' | 'right';
  colSpan: number;
  rowSpan: number;
  isHeader: boolean;
  isSection: boolean;
  isSubtotal: boolean;
  isTotal: boolean;
  indent: number;
  hasBorderTop: boolean;
  hasBorderBottom: boolean;
}

export interface TemplateRow {
  rowIndex: number;
  cells: TemplateCell[];
  isSpacingRow: boolean;
  isCollapsible: boolean;
  sectionId: string | null;
  parentSectionId: string | null;
}

export interface TemplateSheet {
  name: string;
  rows: TemplateRow[];
  columnWidths: number[];
  totalColumns: number;
}

export interface ParsedTemplate {
  sheets: Map<string, TemplateSheet>;
  sheetNames: string[];
}

