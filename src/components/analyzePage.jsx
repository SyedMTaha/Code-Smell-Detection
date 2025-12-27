"use client";

import { useRouter } from "next/navigation";

export default function AnalyzePage() {
	const router = useRouter();
	return (
		<main className="min-h-screen text-white" style={{ backgroundColor: '#121621' }}>
			{/* Back Button */}
			<div className="px-4 sm:px-6 py-4 sm:py-6">
				<button
					onClick={() => router.back()}
					className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<line x1="19" y1="12" x2="5" y2="12"></line>
						<polyline points="12 19 5 12 12 5"></polyline>
					</svg>
					Back
				</button>
			</div>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
				{/* Header Row */}
				<div className="flex flex-col gap-6">
					<h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Analysis Results</h1>

					{/* Status + Meta + Actions */}
					<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
						<div className="flex items-center gap-4 flex-wrap">
							<span className="px-3 py-1 rounded-md bg-green-900/30 text-green-400 border border-green-700/50 text-xs font-bold uppercase tracking-widest">COMPLETED</span>
							<span className="text-slate-400 text-sm">Scan ID: <span className="text-slate-200">#A7F-1294</span></span>
							<span className="text-slate-400 text-sm">2 mins ago</span>
						</div>

						<div className="flex items-center gap-3">
							<a href="/upload" className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 transition-colors text-sm font-semibold">Re-scan</a>
							<button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white border border-blue-500 transition-colors text-sm font-semibold">Export Report</button>
						</div>
					</div>
				</div>

				{/* Cards Grid */}
				<div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{/* Summary */}
				<div className="rounded-xl border border-slate-700 p-5" style={{ backgroundColor: '#1C1F26' }}>
						<p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Summary</p>
						<div className="flex items-end justify-between">
							<div>
								<div className="text-3xl font-bold">18</div>
								<div className="text-slate-400 text-sm">Total Smells</div>
							</div>
							<div className="text-green-400 text-xs">+ Refactor Recommended</div>
						</div>
					</div>

					{/* Severity */}
				<div className="rounded-xl border border-slate-700 p-5" style={{ backgroundColor: '#1C1F26' }}>
						<p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Severity</p>
						<ul className="space-y-2 text-sm">
							<li className="flex justify-between"><span className="text-slate-300">Critical</span><span className="text-red-400 font-semibold">2</span></li>
							<li className="flex justify-between"><span className="text-slate-300">Major</span><span className="text-orange-400 font-semibold">6</span></li>
							<li className="flex justify-between"><span className="text-slate-300">Minor</span><span className="text-yellow-300 font-semibold">10</span></li>
						</ul>
					</div>

					{/* Categories */}
				<div className="rounded-xl border border-slate-700 p-5" style={{ backgroundColor: '#1C1F26' }}>
						<p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Categories</p>
						<div className="flex flex-wrap gap-2">
							<span className="px-2 py-1 text-xs rounded bg-slate-800 text-slate-300">Long Method</span>
							<span className="px-2 py-1 text-xs rounded bg-slate-800 text-slate-300">God Class</span>
							<span className="px-2 py-1 text-xs rounded bg-slate-800 text-slate-300">Duplicate Code</span>
							<span className="px-2 py-1 text-xs rounded bg-slate-800 text-slate-300">Feature Envy</span>
						</div>
					</div>

					{/* Metrics */}
				<div className="rounded-xl border border-slate-700 p-5" style={{ backgroundColor: '#1C1F26' }}>
						<p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Metrics</p>
						<ul className="space-y-2 text-sm">
							<li className="flex justify-between"><span className="text-slate-300">Files Scanned</span><span className="text-slate-100 font-semibold">42</span></li>
							<li className="flex justify-between"><span className="text-slate-300">Avg. Complexity</span><span className="text-slate-100 font-semibold">6.2</span></li>
							<li className="flex justify-between"><span className="text-slate-300">Refactor Candidates</span><span className="text-slate-100 font-semibold">8</span></li>
						</ul>
					</div>
				</div>

				{/* Detailed Cards */}
				<div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Top Files */}
				<div className="rounded-xl border border-slate-700 p-6" style={{ backgroundColor: '#1C1F26' }}>
						<p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Top Files</p>
						<ul className="space-y-3 text-sm">
							<li className="flex justify-between"><span className="text-slate-300">src/utils/processor.js</span><span className="text-red-400 font-semibold">5 smells</span></li>
							<li className="flex justify-between"><span className="text-slate-300">src/services/api.js</span><span className="text-orange-400 font-semibold">3 smells</span></li>
							<li className="flex justify-between"><span className="text-slate-300">src/components/Editor.jsx</span><span className="text-yellow-300 font-semibold">2 smells</span></li>
						</ul>
					</div>

					{/* Recent Smells */}
				<div className="rounded-xl border border-slate-700 p-6" style={{ backgroundColor: '#1C1F26' }}>
						<p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Recent Smells</p>
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-slate-200 font-medium">Long Method in `DataProcessor.process()`</p>
									<p className="text-slate-400 text-xs">src/utils/processor.js</p>
								</div>
								<span className="px-2 py-1 text-xs rounded bg-red-900/40 text-red-400 border border-red-700/50">Critical</span>
							</div>
							<div className="flex items-center justify-between">
								<div>
									<p className="text-slate-200 font-medium">God Class in `Editor`</p>
									<p className="text-slate-400 text-xs">src/components/Editor.jsx</p>
								</div>
								<span className="px-2 py-1 text-xs rounded bg-orange-900/40 text-orange-400 border border-orange-700/50">Major</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
