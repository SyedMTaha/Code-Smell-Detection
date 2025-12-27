/**
 * Custom hook for using Analysis Context
 */

'use client';

import { useContext } from 'react';
import { AnalysisContext } from '@/context/AnalysisContext';

export function useAnalysis() {
  const context = useContext(AnalysisContext);

  if (context === undefined) {
    throw new Error('useAnalysis must be used within AnalysisProvider');
  }

  return context;
}
