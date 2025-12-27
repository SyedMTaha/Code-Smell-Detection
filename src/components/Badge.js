/**
 * Badge Component
 * Displays status badges for smell severity and categories
 */

import { Icon } from '@iconify/react';
import { getSeverityColor } from '@/utils/formatters';

const severityIcons = {
  critical: 'mdi:alert-octagon',
  warning: 'mdi:alert-box',
  info: 'mdi:information-outline',
  success: 'mdi:check-circle',
};

export function Badge({ label, severity = 'info', className = '' }) {
  const severityClass = getSeverityColor(severity);
  const iconName = severityIcons[severity] || 'mdi:information-outline';

  return (
    <span className={`badge ${severityClass} ${className}`}>
      <Icon icon={iconName} className="text-sm" />
      <span className="font-medium">{label}</span>
    </span>
  );
}
