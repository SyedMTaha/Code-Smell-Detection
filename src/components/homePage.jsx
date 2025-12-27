import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col relative font-['Poppins']" style={{ backgroundColor: '#121621' }}>
      {/* Header */}
      <header className="w-full py-6 px-8 border-b border-gray-800" style={{ backgroundColor: '#121621' }}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Code Smell Detector</h1>
          <nav className="space-x-6">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/upload" className="text-gray-300 hover:text-white transition-colors">
              Upload
            </Link>
            <Link href="/analyze" className="text-gray-300 hover:text-white transition-colors">
              Analyze
            </Link>
          </nav>
        </div>
      </header>

      {/* Middle Content with Background (excludes header/footer) */}
      <div className="relative flex-1">
        {/* Background Image only between sections */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          <Image
            src="/home/bg-3.jpg"
            alt="Background"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>

        {/* Blur Decoration */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-900/30 rounded-full blur-3xl " />

        {/* Hero Section */}
        <main className="flex-1 flex items-center justify-center relative z-20 px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 mt-14">
              Code Smell<br />Detection Tool
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Upload your source code and instantly detect software design flaws. Our static analysis engine helps you refactor for academic excellence and industry-standard maintainability.
            </p>
            
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/analyze"
                className="flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-white transition-all hover:opacity-90"
                style={{ backgroundColor: '#195DE6' }}
              >
                Analyze Code
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
              
              <button 
                className="flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-white transition-all hover:opacity-90 border border-gray-600"
                style={{ backgroundColor: '#1E2430' }}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                View Sample Report
              </button>
            </div>
          </div>
        </main>

        {/* Example Detection Section */}
        <section className="px-4 sm:px-6 py-16 sm:py-24 lg:py-32 relative overflow-hidden z-10 bg-blur">
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
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="currentColor"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                    COMPLEX METHOD
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="w-full py-6 px-8 border-t border-gray-800 relative z-10">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>&copy; 2025 Code Smell Detector. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}