/**
 * Navigation Bar Component
 * Professional SaaS navbar with logo, menu, and CTA buttons
 */

'use client';

import Link from 'next/link';
import { Icon } from '@iconify/react';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 h-20 border-b border-slate-700 bg-slate-950 backdrop-blur-sm">
      <div className="h-full max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon icon="mdi:code-braces" className="text-xl text-white" />
          </div>
          <span className="text-lg font-black text-white">Code Smell Detector</span>
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <a href="#docs" className="hidden sm:flex items-center gap-2 text-slate-300 hover:text-white text-sm font-medium transition-colors">
            <Icon icon="mdi:book-outline" className="text-lg" />
            Docs
          </a>
          <a href="#github" className="flex items-center gap-2 px-4 py-2 border border-slate-600 hover:border-slate-400 text-white text-sm font-medium rounded-lg transition-colors hover:bg-slate-800/50">
            <Icon icon="mdi:github" className="text-lg" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
