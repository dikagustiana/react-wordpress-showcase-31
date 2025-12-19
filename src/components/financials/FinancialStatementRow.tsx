import React from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

export interface RowData {
  id: string;
  label: string;
  level: number;
  values: Record<string, number | null>;
  isSection?: boolean;
  isSubtotal?: boolean;
  isTotal?: boolean;
  isCollapsible?: boolean;
  isCollapsed?: boolean;
  isHidden?: boolean;
}

interface FinancialStatementRowProps {
  row: RowData;
  columns: string[];
  onToggle?: (id: string) => void;
}

/**
 * Format number for Big 4 presentation:
 * - Thousands separators
 * - Negatives in parentheses
 * - Null/zero as dash
 */
function formatValue(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—';
  if (value === 0) return '—';
  
  const absValue = Math.abs(value);
  const formatted = absValue.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  
  return value < 0 ? `(${formatted})` : formatted;
}

/**
 * Big 4 Style Financial Statement Row
 * 
 * Styling rules:
 * - Section headers: bold, slightly larger, top border
 * - Subtotals: medium weight, subtle top border
 * - Totals: bold, double top border
 * - Line items: normal weight, indented by level
 */
const FinancialStatementRow: React.FC<FinancialStatementRowProps> = ({
  row,
  columns,
  onToggle
}) => {
  if (row.isHidden) return null;
  
  const indent = row.level * 16; // 16px per level
  
  // Determine row styling based on type
  let rowClasses = 'group';
  let labelClasses = 'py-2 pr-4 text-gray-800';
  let valueClasses = 'py-2 px-3 text-right tabular-nums';
  let borderClasses = '';
  
  if (row.isSection) {
    // Section header: bold, larger, clear separation
    labelClasses = 'py-3 pr-4 text-gray-900 font-semibold text-base';
    valueClasses = 'py-3 px-3 text-right tabular-nums font-semibold';
    borderClasses = 'border-t-2 border-gray-300 mt-4';
  } else if (row.isTotal) {
    // Grand total: bold, double border effect
    labelClasses = 'py-3 pr-4 text-gray-900 font-bold';
    valueClasses = 'py-3 px-3 text-right tabular-nums font-bold';
    borderClasses = 'border-t-2 border-gray-800 border-b-4 border-double';
  } else if (row.isSubtotal) {
    // Subtotal: medium weight, single top border
    labelClasses = 'py-2 pr-4 text-gray-800 font-medium';
    valueClasses = 'py-2 px-3 text-right tabular-nums font-medium';
    borderClasses = 'border-t border-gray-400';
  } else {
    // Regular line item
    rowClasses += ' hover:bg-gray-50';
  }
  
  const handleToggle = () => {
    if (row.isCollapsible && onToggle) {
      onToggle(row.id);
    }
  };
  
  return (
    <tr className={`${rowClasses} ${borderClasses}`}>
      {/* Label column */}
      <td 
        className={labelClasses}
        style={{ paddingLeft: `${16 + indent}px` }}
      >
        <div className="flex items-center">
          {/* Collapse toggle for sections */}
          {row.isCollapsible && (
            <button
              onClick={handleToggle}
              className="mr-2 p-0.5 rounded hover:bg-gray-200 transition-colors -ml-6"
              aria-label={row.isCollapsed ? 'Expand section' : 'Collapse section'}
            >
              {row.isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>
          )}
          <span>{row.label}</span>
        </div>
      </td>
      
      {/* Value columns */}
      {columns.map((col) => (
        <td key={col} className={valueClasses}>
          {formatValue(row.values[col])}
        </td>
      ))}
    </tr>
  );
};

export default FinancialStatementRow;

