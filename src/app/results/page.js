/**
 * Results Page
 * Displays analysis results with filtering and detailed view options
 */

'use client';

import Link from 'next/link';
import { Icon } from '@iconify/react';
import { Navbar, SummaryCard, LoadingState, FilterBar, ResultsTable } from '@/components';
import { useAnalysis } from '@/hooks/useAnalysis';
import { useRouter } from 'next/navigation';

export default function ResultsPage() {
  const router = useRouter();
  const { isAnalyzing, analysisResults, resetAnalysis } = useAnalysis();

  /**
   * Handle new analysis
   */
  const handleNewAnalysis = () => {
    resetAnalysis();
    router.push('/upload');
  };

  // Show loading state
  if (isAnalyzing) {
    return (
      <main className="min-h-screen bg-slate-950">
        <Navbar />
        <LoadingState />
      </main>
    );
  }

  // Show no results state
  if (!analysisResults) {
    return (
      <main className="min-h-screen bg-slate-950">
        <Navbar />
        <section className="max-w-4xl mx-auto px-6 py-12">
          <div className="p-12 text-center">
            <Icon icon="mdi:file-document-outline" className="text-6xl text-slate-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              No Analysis Results
            </h2>
            <p className="text-slate-400 mb-6">
              Upload code to see analysis results
            </p>
            <Link
              href="/upload"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Icon icon="mdi:cloud-upload-outline" />
              Upload Code
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const { summary } = analysisResults;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      {/* Page Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 mb-8 sm:mb-10">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <span>Project Alpha</span>
          <span>/</span>
          <span className="text-white">Analysis Results</span>
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-8 sm:mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">Analysis Results</h1>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm">
              <span className="px-3 py-1 bg-green-500/20 border border-green-500/50 text-green-400 font-bold rounded-full uppercase tracking-wider">
                Completed
              </span>
              <span className="text-slate-400">Scan ID: #8392-A • 2 mins ago</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 border border-slate-600 hover:border-slate-500 text-white font-bold text-sm sm:text-base rounded-lg transition-colors whitespace-nowrap">
              <Icon icon="mdi:reload" className="text-lg" />
              <span className="hidden sm:inline">Re-scan</span>
            </button>
            <button className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base rounded-lg transition-colors whitespace-nowrap">
              <Icon icon="mdi:download" className="text-lg" />
              <span className="hidden sm:inline">Export Report</span>
              <span className="sm:hidden">Export</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
          <div className="bg-slate-900/50 border border-slate-700 p-5 sm:p-6 rounded-lg hover:border-slate-600 transition-colors">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-slate-400 text-xs sm:text-sm font-medium">Total Code Smells</h3>
              <div className="w-8 h-8 bg-red-500/20 rounded flex items-center justify-center flex-shrink-0">
                <Icon icon="mdi:heart-pulse" className="text-red-400 text-lg" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl sm:text-4xl font-black text-white">{summary.totalSmells}</p>
              <span className="text-red-400 text-xs sm:text-sm font-bold">+3</span>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-700 p-5 sm:p-6 rounded-lg hover:border-slate-600 transition-colors">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-slate-400 text-xs sm:text-sm font-medium">Files Analyzed</h3>
              <div className="w-8 h-8 bg-blue-500/20 rounded flex items-center justify-center flex-shrink-0">
                <Icon icon="mdi:folder-multiple" className="text-blue-400 text-lg" />
              </div>
            </div>
            <p className="text-3xl sm:text-4xl font-black text-white">{summary.filesAnalyzed}</p>
          </div>

          <div className="bg-slate-900/50 border border-slate-700 p-5 sm:p-6 rounded-lg hover:border-slate-600 transition-colors">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-slate-400 text-xs sm:text-sm font-medium">Lines of Code</h3>
              <div className="w-8 h-8 bg-cyan-500/20 rounded flex items-center justify-center flex-shrink-0">
                <Icon icon="mdi:code-braces" className="text-cyan-400 text-lg" />
              </div>
            </div>
            <p className="text-3xl sm:text-4xl font-black text-white">
              {(summary.linesOfCode / 1000).toFixed(1)}k
            </p>
          </div>

          <div className="bg-slate-900/50 border border-slate-700 p-5 sm:p-6 rounded-lg hover:border-slate-600 transition-colors">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-slate-400 text-xs sm:text-sm font-medium">Critical Issues</h3>
              <div className="w-8 h-8 bg-orange-500/20 rounded flex items-center justify-center flex-shrink-0">
                <Icon icon="mdi:alert-octagon" className="text-orange-400 text-lg" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl sm:text-4xl font-black text-white">{summary.criticalIssues}</p>
              <span className="text-green-400 text-xs sm:text-sm font-bold">-2</span>
            </div>
          </div>
        </div>

        {/* Filter & Results */}
        <div className="space-y-6 sm:space-y-8">
          <FilterBar />
          <ResultsTable />
        </div>
      </section>
    </main>
  );
}
