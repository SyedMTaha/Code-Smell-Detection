/**
 * Results Table Component
 * Displays code smells in a detailed table with expandable rows
 */

'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { Badge } from './Badge';
import { DetailsModal } from './DetailsModal';
import { useAnalysis } from '@/hooks/useAnalysis';
import { truncateString } from '@/utils/formatters';

export function ResultsTable() {
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [selectedSmell, setSelectedSmell] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getFilteredResults } = useAnalysis();

  const smells = getFilteredResults();

  /**
   * Toggle expanded row
   */
  const toggleRow = (id) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  /**
   * Open details modal
   */
  const openDetails = (smell) => {
    setSelectedSmell(smell);
    setIsModalOpen(true);
  };

  if (smells.length === 0) {
    return (
      <div className="card p-8 sm:p-12 text-center">
        <Icon icon="mdi:check-circle" className="text-5xl text-green-600 dark:text-green-400 mx-auto mb-3" />
        <p className="text-lg font-bold text-slate-900 dark:text-white">
          No code smells found
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Smell Name
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider hidden md:table-cell">
                  Class
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider hidden lg:table-cell">
                  Method
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider hidden lg:table-cell">
                  File
                </th>
                <th className="relative px-3 sm:px-6 py-3 sm:py-4">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {smells.map((smell) => (
                <React.Fragment key={smell.id}>
                  {/* Main Row */}
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                      {smell.name}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <Badge label={smell.severity} severity={smell.severity} />
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                      <code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 sm:px-3 py-1 sm:py-1.5 rounded text-slate-900 dark:text-white break-all font-mono">
                        {truncateString(smell.className, 20)}
                      </code>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 hidden lg:table-cell">
                      <code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 sm:px-3 py-1 sm:py-1.5 rounded text-slate-900 dark:text-white break-all font-mono">
                        {truncateString(smell.methodName, 20)}
                      </code>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs text-slate-600 dark:text-slate-400 hidden lg:table-cell">
                      {truncateString(smell.file, 25)}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-right space-x-1 sm:space-x-2">
                      <button
                        onClick={() => openDetails(smell)}
                        className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="View details"
                      >
                        <Icon icon="mdi:information-outline" className="text-sm sm:text-base" />
                        <span className="hidden sm:inline">Details</span>
                      </button>
                      <button
                        onClick={() => toggleRow(smell.id)}
                        className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        title="Toggle metrics"
                      >
                        <Icon icon={expandedRows.has(smell.id) ? "mdi:chevron-up" : "mdi:chevron-down"} />
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Details Row */}
                  {expandedRows.has(smell.id) && (
                    <tr className="bg-slate-50 dark:bg-slate-800/30">
                      <td colSpan="6" className="px-3 sm:px-6 py-4 sm:py-6">
                        <div className="space-y-4 sm:space-y-6">
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                              <Icon icon="mdi:text-box" className="text-lg" />
                              Reason
                            </h4>
                            <p className="text-sm text-slate-700 dark:text-slate-300">
                              {smell.reason}
                            </p>
                          </div>

                          <div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                              <Icon icon="mdi:chart-line" className="text-lg" />
                              Metrics
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                              {Object.entries(smell.metrics).map(([key, value]) => (
                                <div
                                  key={key}
                                  className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700"
                                >
                                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium uppercase tracking-wider">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                  </p>
                                  <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                                    {value}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                              <Icon icon="mdi:file-outline" className="text-lg" />
                              Location
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400 font-mono break-all bg-slate-100 dark:bg-slate-900 p-3 rounded-lg">
                              {smell.file}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Footer */}
        <div className="bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 px-6 py-4">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Showing <span className="font-bold text-slate-900 dark:text-white">{smells.length}</span> code{' '}
            {smells.length === 1 ? 'smell' : 'smells'}
          </p>
        </div>
      </div>

      {/* Details Modal */}
      <DetailsModal
        smell={selectedSmell}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
