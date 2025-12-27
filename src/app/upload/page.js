/**
 * File Upload Page
 * Allows users to upload and analyze code files
 */

'use client';

import { Icon } from '@iconify/react';
import { Navbar, FileUpload } from '@/components';
import { useAnalysis } from '@/hooks/useAnalysis';
import { useRouter } from 'next/navigation';
import { MOCK_RESULTS } from '@/constants/smells';

export default function UploadPage() {
  const router = useRouter();
  const { uploadedFile, simulateUploadProgress, startAnalysis } = useAnalysis();

  /**
   * Handle analysis start
   */
  const handleAnalysis = async () => {
    if (!uploadedFile) return;

    // Simulate upload progress
    await simulateUploadProgress(2000);

    // Start analysis
    await startAnalysis(MOCK_RESULTS);

    // Redirect to results
    router.push('/results');
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Navbar />

      {/* Page Content */}
      <section className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-16 lg:py-20 flex flex-col items-center justify-center">
        {/* Header */}
        <div className="mb-10 sm:mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-5xl font-black text-white mb-4 tracking-tight">
            Analyze Your Source Code
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Detect code smells, anti-patterns, and maintainability issues. <br />
            Upload your project to generate a comprehensive quality report.
          </p>
        </div>

        {/* Upload Area */}
        <div className="w-full mb-8 sm:mb-10">
          <FileUpload />
        </div>

        {/* Start Analysis Button */}
        <button
          onClick={handleAnalysis}
          disabled={!uploadedFile}
          className={`w-full px-6 sm:px-8 py-3 sm:py-4 font-bold text-base sm:text-lg rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
            uploadedFile
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-60'
          }`}
        >
          <Icon icon="mdi:play" className="text-xl" />
          Start Analysis
        </button>

        {/* Security Notice */}
        <p className="text-slate-400 text-xs mt-8 flex items-center gap-2 justify-center">
          <Icon icon="mdi:lock" className="text-sm" />
          Files are processed securely and deleted after analysis.
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-950 py-6 sm:py-8 text-center">
        <p className="text-slate-500 text-xs">© 2025 Code Smell Detection Tool. All rights reserved.</p>
      </footer>
    </main>
  );
}
