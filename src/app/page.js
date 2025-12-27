'use client';

import Link from 'next/link';
import { Icon } from '@iconify/react';
import { Navbar } from '@/components';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 sm:px-6 py-16 sm:py-24 lg:py-32 relative overflow-hidden">
        {/* Background Blur */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-900/30 rounded-full blur-3xl" />
        </div>

        <div className="w-full max-w-3xl text-center space-y-8 sm:space-y-10 relative z-10">
          {/* V2.0 Beta Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/50 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Icon icon="mdi:lightning-bolt" className="text-lg" />
              v2.0 Beta Live
            </div>
          </div>

          {/* Title - Extra Large */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-[1.05] tracking-tight">
            Code Smell<br />Detection Tool
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed mx-auto font-normal max-w-2xl">
            Upload your source code and instantly detect software design flaws. Our static analysis engine helps you refactor for academic excellence and industry-standard maintainability.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4 sm:pt-6">
            <Link
              href="/upload"
              className="inline-flex items-center justify-center gap-2 px-8 sm:px-10 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-lg transition-all duration-200 whitespace-nowrap"
            >
              Analyze Code
              <Icon icon="mdi:arrow-right" className="text-lg" />
            </Link>
            <button className="inline-flex items-center justify-center gap-2 px-8 sm:px-10 py-3 sm:py-4 border border-slate-400 text-white font-bold text-base rounded-lg transition-colors hover:border-slate-200 hover:bg-slate-800/50 whitespace-nowrap">
              <Icon icon="mdi:file-document-outline" className="text-lg" />
              View Sample Report
            </button>
          </div>
        </div>
      </section>

      {/* Code Block Section */}
      <section className="px-4 sm:px-6 py-16 sm:py-24 lg:py-32 relative overflow-hidden">
        <div className="w-full max-w-3xl mx-auto">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-8 sm:mb-10 text-center">Example Detection</p>

          {/* Terminal */}
          <div className="bg-slate-900/40 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-slate-800 px-4 sm:px-6 py-3 flex items-center gap-3 border-b border-slate-700">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-slate-400 text-xs font-medium flex-1 text-center">analysis_results.py</span>
            </div>

            <div className="p-6 sm:p-8 font-mono text-sm leading-relaxed space-y-2 overflow-x-auto">
              <div className="text-slate-300">
                <span className="text-purple-400">class</span>
                <span className="text-cyan-400 ml-2">DataProcessor</span>
                <span className="text-slate-400">:</span>
              </div>
              <div className="text-slate-300 ml-4">
                <span className="text-purple-400">def</span>
                <span className="text-yellow-400 ml-2">process_massive_data</span>
                <span className="text-slate-400">(</span>
                <span className="text-orange-400">self</span>
                <span className="text-slate-400">,</span>
                <span className="text-cyan-400 ml-1">data</span>
                <span className="text-slate-400">):</span>
              </div>
              <div className="text-slate-500 ml-8">... 200 lines of nested loops ...</div>
              <div className="text-slate-300 ml-4">
                <span className="text-purple-400">return</span>
                <span className="text-cyan-400 ml-2">result</span>
              </div>
              <div className="text-slate-500 ml-4"># Analysis Complete: 1 Critical Smell Found</div>

              <div className="pt-4 sm:pt-6">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-950/50 border border-red-700/60 rounded text-red-400 text-xs font-bold uppercase tracking-wider">
                  <Icon icon="mdi:alert-circle" className="text-sm" />
                  COMPLEX METHOD
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-950 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div className="flex gap-6 sm:gap-8 text-xs text-slate-400">
              <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#docs" className="hover:text-white transition-colors">Documentation</a>
              <a href="#status" className="hover:text-white transition-colors">API Status</a>
            </div>

            <div className="flex gap-4">
              <a href="#github" className="text-slate-400 hover:text-white transition-colors text-lg">
                <Icon icon="mdi:github" />
              </a>
              <a href="#twitter" className="text-slate-400 hover:text-white transition-colors text-lg">
                <Icon icon="mdi:twitter" />
              </a>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-slate-500">
            <p>Code Smell Detector</p>
            <p>v1.0.0 • Built with Next.js & Tailwind CSS</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
