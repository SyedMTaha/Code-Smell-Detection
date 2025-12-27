/**
 * Summary Card Component
 * Displays aggregate statistics from analysis results
 */

import { Icon } from '@iconify/react';

const iconMap = {
  '🔍': 'mdi:magnify',
  '📁': 'mdi:folder-multiple',
  '⚡': 'mdi:lightning-bolt',
  '📊': 'mdi:chart-box',
  '🎯': 'mdi:target',
  '✨': 'mdi:sparkles',
  '🏗️': 'mdi:home-city',
  '⚠️': 'mdi:alert-circle',
};

export function SummaryCard({ icon, title, value, description, trend }) {
  // Handle both emoji and direct Iconify icon names
  const iconName = icon?.startsWith('mdi:') ? icon : (iconMap[icon] || 'mdi:information');

  return (
    <div className="card p-6 sm:p-8 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 rounded-2xl">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 sm:gap-4 mb-4">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50 rounded-xl flex-shrink-0">
              <Icon icon={iconName} className="text-blue-600 dark:text-blue-400 text-xl sm:text-2xl" />
            </div>
            <h3 className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">
              {title}
            </h3>
          </div>
          <p className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-2">
            {value}
          </p>
          {description && (
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-3 font-medium">
              {description}
            </p>
          )}
        </div>
        {trend !== undefined && (
          <div
            className={`text-xs sm:text-sm font-black px-2 sm:px-3 py-1 sm:py-2 rounded-lg flex-shrink-0 ${
              trend > 0
                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-200'
                : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-200'
            }`}
          >
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}
          </div>
        )}
      </div>
    </div>
  );
}
