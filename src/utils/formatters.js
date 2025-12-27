/**
 * Utility functions for formatting data
 */

/**
 * Format file size to human-readable format
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Format date to readable format
 */
export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Truncate string to specified length
 */
export function truncateString(str, maxLength = 50) {
  if (!str) return '';
  return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
}

/**
 * Get severity badge color
 */
export function getSeverityColor(severity) {
  const colors = {
    critical: 'badge-critical',
    warning: 'badge-warning',
    info: 'badge-info',
  };

  return colors[severity] || 'badge-info';
}

/**
 * Format metric for display
 */
export function formatMetric(key, value) {
  const formatters = {
    lines: (v) => `${v} lines`,
    methods: (v) => `${v} methods`,
    complexity: (v) => `Complexity: ${v}`,
    parameters: (v) => `${v} parameters`,
    occurrences: (v) => `${v} occurrences`,
    foreignCalls: (v) => `${v} foreign calls`,
    localCalls: (v) => `${v} local calls`,
    chainDepth: (v) => `Chain depth: ${v}`,
    reasons: (v) => `${v} reasons for change`,
    cases: (v) => `${v} switch cases`,
  };

  return formatters[key] ? formatters[key](value) : `${key}: ${value}`;
}
