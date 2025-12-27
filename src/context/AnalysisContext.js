/**
 * Context for managing analysis state and results
 * Provides global state for file upload, analysis progress, and results
 */

'use client';

import { createContext, useState, useCallback } from 'react';

export const AnalysisContext = createContext(undefined);

export function AnalysisProvider({ children }) {
  // Upload state
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * Handle file upload
   * @param {File} file - The uploaded file
   */
  const handleFileUpload = useCallback((file) => {
    setUploadedFile(file);
    setUploadProgress(0);
  }, []);

  /**
   * Simulate file upload progress
   * In production, this would track actual upload progress
   */
  const simulateUploadProgress = useCallback((duration = 2000) => {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            resolve();
            return 100;
          }
          return prev + Math.random() * 30;
        });
      }, 100);
    });
  }, []);

  /**
   * Start analysis (simulated)
   * In production, this would call the backend API
   */
  const startAnalysis = useCallback(async (mockResults) => {
    setIsAnalyzing(true);

    // Simulate analysis time
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setAnalysisResults(mockResults);
    setIsAnalyzing(false);
  }, []);

  /**
   * Reset analysis state
   */
  const resetAnalysis = useCallback(() => {
    setUploadedFile(null);
    setUploadProgress(0);
    setIsAnalyzing(false);
    setAnalysisResults(null);
    setSelectedCategory('all');
    setSearchQuery('');
  }, []);

  /**
   * Filter results based on category and search query
   */
  const getFilteredResults = useCallback(() => {
    if (!analysisResults) return [];

    let filtered = [...analysisResults.smells];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((smell) => smell.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (smell) =>
          smell.name.toLowerCase().includes(query) ||
          smell.className.toLowerCase().includes(query) ||
          smell.methodName.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [analysisResults, selectedCategory, searchQuery]);

  const value = {
    // Upload state
    uploadedFile,
    uploadProgress,
    handleFileUpload,
    simulateUploadProgress,

    // Analysis state
    isAnalyzing,
    analysisResults,
    selectedCategory,
    searchQuery,
    startAnalysis,
    resetAnalysis,
    setSelectedCategory,
    setSearchQuery,

    // Filtered data
    getFilteredResults,
  };

  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  );
}
