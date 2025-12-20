import React from 'react';
import { TemplateCell } from './types';

interface StatementCellProps {
  cell: TemplateCell;
  columnWidth: number;
}

/**
 * Format numeric value for financial statement presentation
 * - Thousands separator
 * - Negatives in parentheses
 * - Null/zero as dash
 */
function formatValue(value: string | number | null): string {
  if (value === null || value === undefined || value === '') {
    return '';
  }
  
  // If already a formatted string, return as-is
  if (typeof value === 'string') {
    // Check if it's a numeric string that needs formatting
    const num = parseFloat(value.replace(/[,\s]/g, ''));
    if (!isNaN(num) && /^[\d,.\-\s()]+$/.test(value.trim())) {
      return formatNumber(num);
    }
    return value;
  }
  
  if (typeof value === 'number') {
    return formatNumber(value);
  }
  
  return String(value);
}

function formatNumber(num: number): string {
  if (num === 0) return '—';
  
  const absValue = Math.abs(num);
  const formatted = absValue.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  
  return num < 0 ? `(${formatted})` : formatted;
}

/**
 * Statement Cell Component
 * 
 * Renders a single cell with proper alignment, formatting, and styling.
 * Preserves Excel template structure exactly.
 */
const StatementCell: React.FC<StatementCellProps> = ({ cell, columnWidth }) => {
  const isNumeric = typeof cell.value === 'number' || 
    (typeof cell.value === 'string' && /^[\d,.\-\s()]+$/.test(cell.value.trim()) && cell.value.trim() !== '');
  
  // Determine text alignment
  let textAlign = cell.align;
  if (isNumeric && textAlign === 'left') {
    textAlign = 'right'; // Numbers should be right-aligned
  }
  
  // Build class names
  const classes = [
    'px-2 py-1.5',
    'text-sm',
    'leading-relaxed',
  ];
  
  // Typography
  if (cell.isBold) classes.push('font-semibold');
  if (cell.isItalic) classes.push('italic');
  if (cell.isTotal) classes.push('font-bold text-gray-900');
  if (cell.isSubtotal) classes.push('font-medium');
  if (cell.isSection) classes.push('font-semibold text-gray-800 pt-3');
  
  // Alignment
  if (textAlign === 'right') classes.push('text-right');
  else if (textAlign === 'center') classes.push('text-center');
  else classes.push('text-left');
  
  // Numeric styling
  if (isNumeric) classes.push('tabular-nums font-mono text-gray-700');
  
  // Calculate indent padding
  const indentPx = cell.indent * 16;
  
  // Style object
  const style: React.CSSProperties = {
    width: `${columnWidth}px`,
    minWidth: `${columnWidth}px`,
    paddingLeft: indentPx > 0 ? `${8 + indentPx}px` : undefined,
  };
  
  // Span styles
  if (cell.colSpan > 1) {
    style.gridColumn = `span ${cell.colSpan}`;
  }
  
  return (
    <div className={classes.join(' ')} style={style}>
      {formatValue(cell.value)}
    </div>
  );
};

export default StatementCell;

