/**
 * Loading State Component
 * Displays animated loader during analysis
 */

import { Icon } from '@iconify/react';

export function LoadingState({ message = 'Analyzing your code for smells…' }) {
  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-10 text-center max-w-md animate-slideUp border border-slate-200 dark:border-slate-800">
        {/* Animated Spinner */}
        <div className="flex justify-center mb-8">
          <div className="relative w-20 h-20">
            <Icon 
              icon="mdi:magnify" 
              className="text-blue-600 dark:text-blue-400 text-4xl animate-spin-slow"
            />
          </div>
        </div>

        {/* Loading Message */}
        <p className="text-lg font-bold text-slate-900 dark:text-white mb-2">
          Analyzing Code
        </p>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
          {message}
        </p>

        {/* Progress Indicator */}
        <div className="space-y-3">
          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 animate-pulse-slow"
              style={{ width: '60%' }}
            ></div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-500">
            This may take a few moments...
          </p>
        </div>
      </div>
    </div>
  );
}
