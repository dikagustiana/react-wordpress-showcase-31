import React, { useState } from 'react';
import { useRole } from '@/contexts/RoleContext';
import { InlineEditor } from '@/components/inline/InlineEditor';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, Download, Upload, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface JournalEntry {
  id: string;
  date: string;
  account: string;
  description: string;
  debit: number | null;
  credit: number | null;
}

interface JournalTableProps {
  id: string;
  pageKey: string;
  entries?: JournalEntry[];
  onEntriesChange?: (entries: JournalEntry[]) => void;
  className?: string;
}

export const JournalTable: React.FC<JournalTableProps> = ({
  id,
  pageKey,
  entries = [],
  onEntriesChange,
  className = ""
}) => {
  const { isAdmin } = useRole();
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(entries);
  const [isDense, setIsDense] = useState(false);

  const addEntry = () => {
    const newEntry: JournalEntry = {
      id: `entry_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      account: '',
      description: '',
      debit: null,
      credit: null
    };
    const updatedEntries = [...journalEntries, newEntry];
    setJournalEntries(updatedEntries);
    onEntriesChange?.(updatedEntries);
  };

  const removeEntry = (entryId: string) => {
    const updatedEntries = journalEntries.filter(entry => entry.id !== entryId);
    setJournalEntries(updatedEntries);
    onEntriesChange?.(updatedEntries);
  };

  const updateEntry = (entryId: string, field: keyof JournalEntry, value: any) => {
    const updatedEntries = journalEntries.map(entry =>
      entry.id === entryId ? { ...entry, [field]: value } : entry
    );
    setJournalEntries(updatedEntries);
    onEntriesChange?.(updatedEntries);
  };

  const formatCurrency = (value: number | null) => {
    if (value === null || value === 0) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const calculateTotals = () => {
    const totalDebit = journalEntries.reduce((sum, entry) => sum + (entry.debit || 0), 0);
    const totalCredit = journalEntries.reduce((sum, entry) => sum + (entry.credit || 0), 0);
    return { totalDebit, totalCredit };
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Account', 'Description', 'Debit', 'Credit'];
    const csvContent = [
      headers.join(','),
      ...journalEntries.map(entry => [
        entry.date,
        `"${entry.account}"`,
        `"${entry.description}"`,
        entry.debit || '',
        entry.credit || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'journal-entries.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const { totalDebit, totalCredit } = calculateTotals();

  return (
    <div className={`${className}`}>
      {/* Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {isAdmin && (
            <>
              <Button variant="outline" size="sm" onClick={addEntry}>
                <Plus className="h-4 w-4 mr-1" />
                Add Entry
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsDense(!isDense)}>
                {isDense ? 'Normal' : 'Dense'}
              </Button>
            </>
          )}
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={exportToCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </DropdownMenuItem>
            {isAdmin && (
              <DropdownMenuItem>
                <Upload className="h-4 w-4 mr-2" />
                Import CSV
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <div className="min-w-full border border-border rounded-lg overflow-hidden">
          <div className="overflow-y-auto max-h-96">
            <table className="w-full">
              <thead className="bg-muted/50 sticky top-0 z-10">
                <tr>
                  <th className={`text-left font-medium text-muted-foreground border-b border-border ${isDense ? 'px-2 py-1' : 'px-4 py-3'}`}>
                    Date
                  </th>
                  <th className={`text-left font-medium text-muted-foreground border-b border-border ${isDense ? 'px-2 py-1' : 'px-4 py-3'}`}>
                    Account
                  </th>
                  <th className={`text-left font-medium text-muted-foreground border-b border-border ${isDense ? 'px-2 py-1' : 'px-4 py-3'}`}>
                    Description
                  </th>
                  <th className={`text-right font-medium text-muted-foreground border-b border-border ${isDense ? 'px-2 py-1' : 'px-4 py-3'}`}>
                    Debit
                  </th>
                  <th className={`text-right font-medium text-muted-foreground border-b border-border ${isDense ? 'px-2 py-1' : 'px-4 py-3'}`}>
                    Credit
                  </th>
                  {isAdmin && (
                    <th className={`text-center font-medium text-muted-foreground border-b border-border ${isDense ? 'px-2 py-1' : 'px-4 py-3'}`}>
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {journalEntries.map((entry, index) => (
                  <tr key={entry.id} className="border-b border-border hover:bg-muted/30">
                    <td className={isDense ? 'px-2 py-1' : 'px-4 py-3'}>
                      <InlineEditor
                        pageKey={pageKey}
                        sectionKey={`${id}_entry_${entry.id}_date`}
                        placeholder="YYYY-MM-DD"
                        className="text-sm font-mono"
                      />
                    </td>
                    <td className={isDense ? 'px-2 py-1' : 'px-4 py-3'}>
                      <InlineEditor
                        pageKey={pageKey}
                        sectionKey={`${id}_entry_${entry.id}_account`}
                        placeholder="Account name"
                        className="text-sm font-medium"
                      />
                    </td>
                    <td className={isDense ? 'px-2 py-1' : 'px-4 py-3'}>
                      <InlineEditor
                        pageKey={pageKey}
                        sectionKey={`${id}_entry_${entry.id}_description`}
                        placeholder="Transaction description"
                        className="text-sm"
                      />
                    </td>
                    <td className={`text-right ${isDense ? 'px-2 py-1' : 'px-4 py-3'}`}>
                      <InlineEditor
                        pageKey={pageKey}
                        sectionKey={`${id}_entry_${entry.id}_debit`}
                        placeholder="0.00"
                        className="text-sm font-mono text-right"
                      />
                    </td>
                    <td className={`text-right ${isDense ? 'px-2 py-1' : 'px-4 py-3'}`}>
                      <InlineEditor
                        pageKey={pageKey}
                        sectionKey={`${id}_entry_${entry.id}_credit`}
                        placeholder="0.00"
                        className="text-sm font-mono text-right"
                      />
                    </td>
                    {isAdmin && (
                      <td className={`text-center ${isDense ? 'px-2 py-1' : 'px-4 py-3'}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeEntry(entry.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
                
                {/* Totals Row */}
                <tr className="bg-muted/50 font-medium">
                  <td colSpan={3} className={`text-right ${isDense ? 'px-2 py-1' : 'px-4 py-3'}`}>
                    Totals:
                  </td>
                  <td className={`text-right ${isDense ? 'px-2 py-1' : 'px-4 py-3'}`}>
                    {formatCurrency(totalDebit)}
                  </td>
                  <td className={`text-right ${isDense ? 'px-2 py-1' : 'px-4 py-3'}`}>
                    {formatCurrency(totalCredit)}
                  </td>
                  {isAdmin && <td></td>}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {journalEntries.map((entry) => (
          <Card key={entry.id} className="relative">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Date</span>
                  <InlineEditor
                    pageKey={pageKey}
                    sectionKey={`${id}_entry_${entry.id}_date`}
                    placeholder="YYYY-MM-DD"
                    className="text-sm font-mono"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Account</span>
                  <InlineEditor
                    pageKey={pageKey}
                    sectionKey={`${id}_entry_${entry.id}_account`}
                    placeholder="Account name"
                    className="text-sm font-medium"
                  />
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Description</span>
                  <InlineEditor
                    pageKey={pageKey}
                    sectionKey={`${id}_entry_${entry.id}_description`}
                    placeholder="Transaction description"
                    className="text-sm text-right max-w-[60%]"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Debit</span>
                  <InlineEditor
                    pageKey={pageKey}
                    sectionKey={`${id}_entry_${entry.id}_debit`}
                    placeholder="0.00"
                    className="text-sm font-mono"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Credit</span>
                  <InlineEditor
                    pageKey={pageKey}
                    sectionKey={`${id}_entry_${entry.id}_credit`}
                    placeholder="0.00"
                    className="text-sm font-mono"
                  />
                </div>
              </div>

              {isAdmin && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeEntry(entry.id)}
                  className="absolute top-2 right-2 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};