/**
 * Details Modal Component
 * Shows detailed information about a code smell with refactoring hints
 */

'use client';

import { Icon } from '@iconify/react';
import { formatMetric } from '@/utils/formatters';

const SMELL_DETAILS = {
  'long-method': {
    explanation:
      'A method that is too long, typically more than 10-15 lines, is harder to understand and test.',
    harmful:
      'Long methods violate the Single Responsibility Principle and make code harder to maintain, test, and reuse.',
    refactoring:
      'Extract smaller methods with single responsibilities. Use helper methods for distinct concerns.',
  },
  'large-class': {
    explanation:
      'A class with too many responsibilities, indicated by high line count and method count.',
    harmful:
      'Classes with too many responsibilities are difficult to maintain and change, violating SRP.',
    refactoring:
      'Split the class into smaller classes, each with a single responsibility. Use composition.',
  },
  'duplicate-code': {
    explanation:
      'Code that appears in multiple places in the codebase, especially similar logic.',
    harmful:
      'Duplicated code leads to maintenance issues - changes need to be made in multiple places.',
    refactoring:
      'Extract common code into a shared method or utility function. Use inheritance or composition.',
  },
  'feature-envy': {
    explanation:
      'A method uses more features from another class than its own class.',
    harmful:
      'Indicates tight coupling between classes and violates encapsulation principles.',
    refactoring:
      'Move the method to the class whose data it uses. Extract common functionality.',
  },
  'switch-statements': {
    explanation:
      'Complex switch statements that should be replaced with polymorphism.',
    harmful:
      'Hard to extend with new cases without modifying existing code, violating OCP.',
    refactoring:
      'Use polymorphism and inheritance. Create subclasses for each case instead of switch.',
  },
};

export function DetailsModal({ smell, isOpen, onClose }) {
  if (!isOpen || !smell) return null;

  const details =
    SMELL_DETAILS[smell.id] || {
      explanation: 'This code smell affects code maintainability and design.',
      harmful: 'May indicate structural issues that should be addressed.',
      refactoring: 'Consider refactoring to improve code quality.',
    };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-3 sm:p-4 animate-fadeIn"
    >
      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp border border-slate-200 dark:border-slate-800"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-900 border-b border-slate-200 dark:border-slate-700 p-4 sm:p-6 flex justify-between items-start gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {smell.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              {smell.category}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0"
          >
            <Icon icon="mdi:close" className="text-xl sm:text-2xl text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
          {/* Location Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Icon icon="mdi:map-marker" className="text-blue-600 dark:text-blue-400 text-lg" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">Location</h3>
            </div>
            <div className="space-y-3 bg-slate-50 dark:bg-slate-800 p-3 sm:p-4 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Class</p>
                  <p className="font-mono text-xs sm:text-sm text-slate-900 dark:text-white break-all mt-1">
                    {smell.className}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Method</p>
                  <p className="font-mono text-xs sm:text-sm text-slate-900 dark:text-white break-all mt-1">
                    {smell.methodName || 'N/A'}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">File</p>
                <p className="font-mono text-xs text-slate-900 dark:text-white break-all mt-1">
                  {smell.file}
                </p>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Icon icon="mdi:chart-line" className="text-blue-600 dark:text-blue-400 text-lg" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">Metrics</h3>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {Object.entries(smell.metrics).map(([key, value]) => (
                <div
                  key={key}
                  className="bg-slate-50 dark:bg-slate-800 p-3 sm:p-4 rounded-lg border border-slate-200 dark:border-slate-700"
                >
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    {formatMetric(key, value)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Explanation */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Icon icon="mdi:lightbulb-outline" className="text-blue-600 dark:text-blue-400 text-lg" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">What is this?</h3>
            </div>
            <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
              {details.explanation}
            </p>
          </div>

          {/* Why Harmful */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Icon icon="mdi:alert-circle-outline" className="text-orange-600 dark:text-orange-400 text-lg" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">Why is it harmful?</h3>
            </div>
            <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
              {details.harmful}
            </p>
          </div>

          {/* Refactoring Hint */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Icon icon="mdi:wrench" className="text-green-600 dark:text-green-400 text-lg" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">How to fix it</h3>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 p-3 sm:p-4 rounded-lg">
              <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                {details.refactoring}
              </p>
            </div>
          </div>

          {/* Reason */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Icon icon="mdi:information-outline" className="text-blue-600 dark:text-blue-400 text-lg" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">Detection reason</h3>
            </div>
            <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
              {smell.reason}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-4 sm:p-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm sm:text-base rounded-lg transition-colors flex items-center gap-2"
          >
            <Icon icon="mdi:close" />
            <span className="hidden sm:inline">Close</span>
          </button>
        </div>
      </div>
    </div>
  );
}
