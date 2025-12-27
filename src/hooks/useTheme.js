/**
 * Custom hook for using Theme Context
 */

'use client';

import { useContext } from 'react';
import { ThemeContext } from '@/context/ThemeContext';

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    // Return default values if context is not available
    return {
      isDark: false,
      toggleTheme: () => {},
    };
  }

  return context;
}
