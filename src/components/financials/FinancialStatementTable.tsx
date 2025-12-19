import React from 'react';
import FinancialStatementRow, { RowData } from './FinancialStatementRow';

interface FinancialStatementTableProps {
  rows: RowData[];
  columns: string[];
  columnLabels?: Record<string, string>;
  onToggleSection?: (id: string) => void;
  note?: string;
}

/**
 * Big 4 Style Financial Statement Table
 * 
 * Design principles:
 * - No vertical gridlines
 * - Minimal horizontal lines (only for hierarchy)
 * - Sticky header with column labels
 * - Generous spacing
 * - Professional typography
 */
const FinancialStatementTable: React.FC<FinancialStatementTableProps> = ({
  rows,
  columns,
  columnLabels = {},
  onToggleSection,
  note
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px]">
        {/* Column headers - Big 4 style: centered, bold, bordered below */}
        <thead>
          <tr className="border-b-2 border-gray-800">
            {/* Description column - wider */}
            <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm w-1/2">
              {/* Empty or could be "Description" */}
            </th>
            
            {/* Period columns */}
            {columns.map((col) => (
              <th 
                key={col} 
                className="text-center py-3 px-3 font-semibold text-gray-700 text-sm min-w-[120px]"
              >
                <div className="flex flex-col items-center">
                  <span>{columnLabels[col] || col}</span>
                  <span className="text-xs font-normal text-gray-500">IDR '000</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody>
          {rows.map((row) => (
            <FinancialStatementRow
              key={row.id}
              row={row}
              columns={columns}
              onToggle={onToggleSection}
            />
          ))}
        </tbody>
      </table>
      
      {/* Notes section - Big 4 style */}
      {note && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 italic">{note}</p>
        </div>
      )}
    </div>
  );
};

export default FinancialStatementTable;

