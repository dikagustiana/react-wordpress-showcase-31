import React from 'react';

interface FinancialStatementHeaderProps {
  entityName: string;
  statementTitle: string;
  period: string;
  subtitle?: string;
}

/**
 * Big 4 Style Statement Header
 * Centered, clean typography, no decorations
 */
const FinancialStatementHeader: React.FC<FinancialStatementHeaderProps> = ({
  entityName,
  statementTitle,
  period,
  subtitle
}) => {
  return (
    <header className="text-center mb-8 pt-4">
      <h1 className="text-lg font-semibold text-gray-800 tracking-wide uppercase mb-1">
        {entityName}
      </h1>
      <h2 className="text-xl font-bold text-gray-900 mb-1">
        {statementTitle}
      </h2>
      {subtitle && (
        <p className="text-sm text-gray-600 mb-1">{subtitle}</p>
      )}
      <p className="text-sm text-gray-500 italic">
        {period}
      </p>
    </header>
  );
};

export default FinancialStatementHeader;

