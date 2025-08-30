
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { fsliData, getTotalCurrentAssets, getTotalNonCurrentAssets, getTotalAssets } from '../lib/fsliData';

const Table = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = fsliData.filter(item =>
    item.indonesian.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.notes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatNumber = (value: string) => {
    if (!value) return '';
    const numValue = parseFloat(value.replace(/,/g, ''));
    return numValue.toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Search Box */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <input
          type="text"
          placeholder="Search line items"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-card rounded-lg shadow-sm border">
        <table className="w-full">
          <thead>
            {/* Main Header */}
            <tr className="bg-blue-600">
              <td className="px-6 py-4 text-left text-lg font-bold text-white" colSpan={4}>
                ASET / ASSETS
              </td>
            </tr>
            {/* Column Headers */}
            <tr className="bg-blue-600">
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                Catatan / Notes
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-white">
                31 Desember 2024 / December 31, 2024
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-white">
                31 Desember 2023 / December 31, 2023
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                English Description
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Current Assets Section */}
            <tr className="bg-gray-200">
              <td className="px-6 py-3 text-sm font-semibold text-gray-800" colSpan={4}>
                ASET LANCAR / CURRENT ASSETS
              </td>
            </tr>
            
            {filteredData.slice(0, 12).map((item, index) => (
              <tr 
                key={item.slug}
                className={`border-b hover:bg-gray-50 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <td className="px-6 py-3 text-sm">
                  <div className="space-y-1">
                    <div className="text-gray-900 font-medium">
                      <Link 
                        to={`/accounting/fsli/${item.slug}`}
                        className="hover:text-blue-600 transition-colors hover:underline"
                      >
                        {item.indonesian}
                      </Link>
                    </div>
                    <div className="text-blue-600 text-xs">
                      {item.notes}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-3 text-sm text-right text-gray-900 font-mono">
                  {formatNumber(item.dec2024)}
                </td>
                <td className="px-6 py-3 text-sm text-right text-gray-900 font-mono">
                  {formatNumber(item.dec2023)}
                </td>
                <td className="px-6 py-3 text-sm">
                  <Link 
                    to={`/accounting/fsli/${item.slug}`}
                    className="text-blue-600 hover:text-blue-800 transition-colors hover:underline"
                  >
                    {item.english}
                  </Link>
                </td>
              </tr>
            ))}

            {/* Total Current Assets */}
            <tr className="bg-gray-100 border-b font-semibold">
              <td className="px-6 py-3 text-sm text-gray-900">
                Total Current Assets
              </td>
              <td className="px-6 py-3 text-sm text-right text-gray-900 font-mono">
                {formatNumber(getTotalCurrentAssets())}
              </td>
              <td className="px-6 py-3 text-sm text-right text-gray-900 font-mono">
                9,879,635
              </td>
              <td className="px-6 py-3 text-sm text-gray-900">
                Total Current Assets
              </td>
            </tr>

            {/* Non-Current Assets Section */}
            <tr className="bg-gray-200">
              <td className="px-6 py-3 text-sm font-semibold text-gray-800" colSpan={4}>
                ASET TIDAK LANCAR / NON-CURRENT ASSETS
              </td>
            </tr>

            {filteredData.slice(12).map((item, index) => (
              <tr 
                key={item.slug}
                className={`border-b hover:bg-gray-50 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <td className="px-6 py-3 text-sm">
                  <div className="space-y-1">
                    <div className="text-gray-900 font-medium">
                      <Link 
                        to={`/accounting/fsli/${item.slug}`}
                        className="hover:text-blue-600 transition-colors hover:underline"
                      >
                        {item.indonesian}
                      </Link>
                    </div>
                    <div className="text-blue-600 text-xs">
                      {item.notes}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-3 text-sm text-right text-gray-900 font-mono">
                  {formatNumber(item.dec2024)}
                </td>
                <td className="px-6 py-3 text-sm text-right text-gray-900 font-mono">
                  {formatNumber(item.dec2023)}
                </td>
                <td className="px-6 py-3 text-sm">
                  <Link 
                    to={`/accounting/fsli/${item.slug}`}
                    className="text-blue-600 hover:text-blue-800 transition-colors hover:underline"
                  >
                    {item.english}
                  </Link>
                </td>
              </tr>
            ))}

            {/* Total Non-Current Assets */}
            <tr className="bg-gray-100 border-b font-semibold">
              <td className="px-6 py-3 text-sm text-gray-900">
                Total Non-Current Assets
              </td>
              <td className="px-6 py-3 text-sm text-right text-gray-900 font-mono">
                {formatNumber(getTotalNonCurrentAssets())}
              </td>
              <td className="px-6 py-3 text-sm text-right text-gray-900 font-mono">
                21,009,221
              </td>
              <td className="px-6 py-3 text-sm text-gray-900">
                Total Non-Current Assets
              </td>
            </tr>

            {/* Total Assets */}
            <tr className="bg-blue-600 border-b font-bold">
              <td className="px-6 py-4 text-sm text-white">
                TOTAL ASSETS
              </td>
              <td className="px-6 py-4 text-sm text-right text-white font-mono">
                {formatNumber(getTotalAssets())}
              </td>
              <td className="px-6 py-4 text-sm text-right text-white font-mono">
                30,888,916
              </td>
              <td className="px-6 py-4 text-sm text-white">
                TOTAL ASSETS
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
