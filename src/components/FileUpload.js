/**
 * File Upload Component
 * Handles drag-and-drop file upload with validation
 */

'use client';

import { useState, useRef } from 'react';
import { Icon } from '@iconify/react';
import { validateFile, getFileTypeIcon } from '@/utils/validators';
import { formatFileSize } from '@/utils/formatters';
import { useAnalysis } from '@/hooks/useAnalysis';

export function FileUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const { uploadedFile, handleFileUpload, uploadProgress } = useAnalysis();

  /**
   * Handle file selection
   */
  const processFile = (file) => {
    const validation = validateFile(file);

    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setError('');
    handleFileUpload(file);
  };

  /**
   * Handle drop event
   */
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  /**
   * Handle input change
   */
  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  /**
   * Handle click to select file
   */
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  /**
   * Clear selected file
   */
  const clearFile = () => {
    handleFileUpload(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getIconForFile = (fileName) => {
    if (fileName.endsWith('.java')) return 'mdi:language-java';
    if (fileName.endsWith('.zip')) return 'mdi:package-variant';
    return 'mdi:file-document';
  };

  return (
    <div className="space-y-5 sm:space-y-6 w-full">
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onClick={handleClick}
        className={`p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 border-2 border-dashed rounded-2xl ${
          isDragging
            ? 'border-blue-400 bg-blue-900/20 shadow-lg'
            : 'border-slate-600 hover:border-slate-500 hover:shadow-md'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".java,.zip"
          onChange={handleInputChange}
          className="hidden"
        />

        {!uploadedFile ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center">
                <Icon icon="mdi:cloud-upload-outline" className="text-3xl text-slate-300" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-slate-300 text-sm sm:text-base">
                <span className="text-blue-400 font-bold cursor-pointer hover:underline">Click to upload</span> or drag and drop
              </p>
              <p className="text-slate-500 text-xs sm:text-sm">
                Supports .java and .zip archives (max 50MB)
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Selected File */}
            <div className="bg-slate-800 p-4 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center flex-shrink-0">
                  <Icon icon={getIconForFile(uploadedFile.name)} className="text-xl text-white" />
                </div>
                <div className="text-left min-w-0">
                  <p className="text-white font-semibold truncate">{uploadedFile.name}</p>
                  <p className="text-slate-400 text-xs">{formatFileSize(uploadedFile.size)} • Zip Archive</p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearFile();
                }}
                className="text-slate-400 hover:text-white transition-colors flex-shrink-0 ml-3"
              >
                <Icon icon="mdi:close" className="text-xl" />
              </button>
            </div>

            {/* Upload Progress */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="space-y-2">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                  Parsing Abstract Syntax Tree...
                </p>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-300 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-slate-400 text-xs text-right">{Math.round(uploadProgress)}%</p>
              </div>
            )}

            {uploadProgress === 100 && (
              <p className="text-green-400 text-sm font-bold flex items-center justify-center gap-2">
                <Icon icon="mdi:check-circle" className="text-lg" /> Upload complete
              </p>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-900/20 border border-red-700/50 rounded-lg">
          <p className="text-red-400 text-sm font-bold flex items-center gap-2">
            <Icon icon="mdi:alert-circle" className="text-lg" />
            {error}
          </p>
        </div>
      )}
    </div>
  );
}
