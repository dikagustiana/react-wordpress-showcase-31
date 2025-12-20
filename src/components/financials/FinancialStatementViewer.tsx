import React, { useState, useCallback, useMemo } from 'react';
import { Maximize2, Minimize2, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import FinancialStatementHeader from './FinancialStatementHeader';
import FinancialStatementTable from './FinancialStatementTable';
import useFinancialData from './useFinancialData';
import { RowData } from './FinancialStatementRow';

interface FinancialStatementViewerProps {
  fileUrl: string;
  sheetName: string;
  entityName?: string;
  statementTitle: string;
  period?: string;
  subtitle?: string;
}

/**
 * Big 4 Style Financial Statement Viewer
 * 
 * This component renders financial statements in the style of
 * Big 4 audit reports (Deloitte, PwC, EY, KPMG).
 * 
 * Design principles:
 * - Clean white space
 * - Minimal borders
 * - Clear typography hierarchy
 * - Professional audit report appearance
 */
const FinancialStatementViewer: React.FC<FinancialStatementViewerProps> = ({
  fileUrl,
  sheetName,
  entityName = 'PT Example Company Tbk',
  statementTitle,
  period = 'For the Year Ended 31 December 2024',
  subtitle
}) => {
  const { rows, columns, loading, error, retry } = useFinancialData(fileUrl, sheetName);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  
  // Toggle section collapse
  const toggleSection = useCallback((sectionId: string) => {
    setCollapsedSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  }, []);
  
  // Expand all sections
  const expandAll = useCallback(() => {
    setCollapsedSections(new Set());
  }, []);
  
  // Collapse all sections
  const collapseAll = useCallback(() => {
    const sectionIds = rows
      .filter(r => r.isSection && r.isCollapsible)
      .map(r => r.id);
    setCollapsedSections(new Set(sectionIds));
  }, [rows]);
  
  // Process rows with collapse state
  const processedRows = useMemo((): RowData[] => {
    const result: RowData[] = [];
    let currentSection: string | null = null;
    let hidingRows = false;
    
    for (const row of rows) {
      if (row.isSection) {
        currentSection = row.id;
        hidingRows = collapsedSections.has(row.id);
        
        result.push({
          ...row,
          isCollapsed: hidingRows
        });
      } else if (row.isSubtotal && currentSection && collapsedSections.has(currentSection)) {
        // Show subtotals even when collapsed
        result.push({
          ...row,
          isHidden: false
        });
        hidingRows = false; // Stop hiding after subtotal
      } else if (hidingRows && !row.isSection) {
        // Hide rows in collapsed section
        result.push({
          ...row,
          isHidden: true
        });
      } else {
        result.push({
          ...row,
          isHidden: false
        });
      }
    }
    
    return result;
  }, [rows, collapsedSections]);
  
  // Count collapsible sections
  const collapsibleCount = useMemo(() => 
    rows.filter(r => r.isSection && r.isCollapsible).length,
    [rows]
  );
  
  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading financial statement…</p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center max-w-md">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <h3 className="text-gray-800 font-medium mb-2">Unable to Load Statement</h3>
          <p className="text-gray-500 text-sm mb-4 whitespace-pre-wrap">{error}</p>
          <button
            onClick={retry}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  // Empty state
  if (rows.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white">
      {/* Header */}
      <FinancialStatementHeader
        entityName={entityName}
        statementTitle={statementTitle}
        period={period}
        subtitle={subtitle}
      />
      
      {/* Controls - subtle, top right */}
      {collapsibleCount > 0 && (
        <div className="flex justify-end gap-2 mb-4 px-4">
          <button
            onClick={expandAll}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5 mr-1.5" />
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
          >
            <Minimize2 className="w-3.5 h-3.5 mr-1.5" />
            Collapse All
          </button>
        </div>
      )}
      
      {/* Statement table */}
      <div className="px-4">
        <FinancialStatementTable
          rows={processedRows}
          columns={columns}
          onToggleSection={toggleSection}
          note="The accompanying notes form an integral part of these consolidated financial statements."
        />
      </div>
    </div>
  );
};

export default FinancialStatementViewer;

