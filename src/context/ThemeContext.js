/**
 * Theme Context for managing dark/light mode
 * Provides theme state and toggle functionality across the app
 */

'use client';

import { createContext, useState, useEffect, useCallback } from 'react';

export const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Initialize theme from localStorage on mount only
  useEffect(() => {
    // Check localStorage and system preference
    const stored = localStorage.getItem('theme-preference');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (stored === 'dark' || (!stored && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }

    setIsMounted(true);

    // Listen to system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e) => {
      if (!localStorage.getItem('theme-preference')) {
        setIsDark(e.matches);
        if (e.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  /**
   * Toggle between dark and light theme
   */
  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const newValue = !prev;
      localStorage.setItem('theme-preference', newValue ? 'dark' : 'light');

      if (newValue) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      return newValue;
    });
  }, []);

  const value = {
    isDark,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
