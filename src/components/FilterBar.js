/**
 * Filter Bar Component
 * Provides filtering and search capabilities for results
 */

'use client';

import { Icon } from '@iconify/react';
import { useAnalysis } from '@/hooks/useAnalysis';
import { SMELL_CATEGORIES } from '@/constants/smells';

export function FilterBar() {
  const { selectedCategory, searchQuery, setSelectedCategory, setSearchQuery, analysisResults } =
    useAnalysis();

  if (!analysisResults) return null;

  const categories = [
    { label: 'All Categories', value: 'all' },
    ...Object.entries(SMELL_CATEGORIES).map(([key, value]) => ({
      label: value,
      value: value,
    })),
  ];

  return (
    <div className="card p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Search */}
      <div>
        <label className="block text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-2 sm:mb-3 flex items-center gap-2">
          <Icon icon="mdi:magnify" />
          Search Smells
        </label>
        <div className="relative">
          <Icon icon="mdi:magnify" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
          <input
            type="text"
            placeholder="Search by name, class, or method..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10 w-full text-sm"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-2 sm:mb-3 flex items-center gap-2">
          <Icon icon="mdi:filter-outline" />
          Category
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 text-left border ${
                selectedCategory === category.value
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
