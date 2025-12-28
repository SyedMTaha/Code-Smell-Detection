"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { generateAnalysisReportPDF } from "@/utils/generatePDF";

export default function AnalyzePage() {
	const router = useRouter();
	const [analysisResult, setAnalysisResult] = useState(null);
	const [loading, setLoading] = useState(true);
	const [selectedCategory, setSelectedCategory] = useState(null);

	useEffect(() => {
		// Retrieve analysis result from localStorage
		const storedResult = localStorage.getItem("analysisResult");
		if (storedResult) {
			try {
				const result = JSON.parse(storedResult);
				setAnalysisResult(result);
				setSelectedCategory("BLOATERS"); // Default category
			} catch (err) {
				console.error("Failed to parse analysis result:", err);
			}
		}
		setLoading(false);
	}, []);

	if (loading) {
		return (
			<main className="min-h-screen text-white flex items-center justify-center" style={{ backgroundColor: "#121621" }}>
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-slate-400">Loading analysis results...</p>
				</div>
			</main>
		);
	}

	if (!analysisResult) {
		return (
			<main className="min-h-screen text-white flex flex-col" style={{ backgroundColor: "#121621" }}>
				<div className="px-4 sm:px-6 py-4 sm:py-6">
					<button
						onClick={() => router.push("/upload")}
						className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<line x1="19" y1="12" x2="5" y2="12"></line>
							<polyline points="12 19 5 12 12 5"></polyline>
						</svg>
						Back
					</button>
				</div>
				<div className="flex-1 flex items-center justify-center">
					<div className="text-center max-w-2xl">
						<h2 className="text-2xl font-bold mb-4">No Analysis Results Found</h2>
						<p className="text-slate-400 mb-8">
							Please upload a file first to analyze for code smells.
						</p>
						<button
							onClick={() => router.push("/upload")}
							className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
						>
							Upload File
						</button>
					</div>
				</div>
			</main>
		);
	}

	const getCategoryColor = (severity) => {
		switch (severity) {
			case "CRITICAL":
				return { bg: "bg-red-900/40", text: "text-red-400", border: "border-red-700/50" };
			case "MAJOR":
				return { bg: "bg-orange-900/40", text: "text-orange-400", border: "border-orange-700/50" };
			case "MINOR":
				return { bg: "bg-yellow-900/40", text: "text-yellow-400", border: "border-yellow-700/50" };
			default:
				return { bg: "bg-slate-800", text: "text-slate-300", border: "border-slate-700/50" };
		}
	};

	const getSeverityCount = (severity) => {
		return analysisResult.metrics.severityCounts?.[severity] || 0;
	};

	const getCategoryLabel = (category) => {
		const labels = {
			BLOATERS: "Bloaters",
			"OBJECT-ORIENTATION_ABUSERS": "Object-Orientation Abusers",
			CHANGE_PREVENTERS: "Change Preventers",
			DISPENSABLES: "Dispensables",
			COUPLERS: "Couplers",
		};
		return labels[category] || category;
	};

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleString();
	};

	const filteredSmells = selectedCategory
		? analysisResult.smells.filter((smell) => smell.category === selectedCategory)
		: analysisResult.smells;

	const isSampleReport = analysisResult.isSample === true;

	return (
		<main className="min-h-screen text-white" style={{ backgroundColor: "#121621" }}>
			{/* Back Button */}
			<div className="px-4 sm:px-6 py-4 sm:py-6">
				<button
					onClick={() => router.push(isSampleReport ? "/" : "/upload")}
					className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm cursor-pointer"
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
					<div>
						<h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
							{isSampleReport ? "Sample Report" : "Analysis Results"}
						</h1>
						<p className="text-slate-400 text-sm">File: {analysisResult.fileName}</p>
					</div>

					{/* Status + Meta + Actions */}
					{!isSampleReport && (
					<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
						<div className="flex items-center gap-4 flex-wrap">
							<span className="px-3 py-1 rounded-md bg-green-900/30 text-green-400 border border-green-700/50 text-xs font-bold uppercase tracking-widest">
								COMPLETED
							</span>
							<span className="text-slate-400 text-sm">Analysis Date: <span className="text-slate-200">{formatDate(analysisResult.timestamp)}</span></span>
						</div>

						<div className="flex items-center gap-3">
							<a href="/upload" className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 transition-colors text-sm font-semibold">
								Re-analyze
							</a>
							<button
								onClick={() => {
									generateAnalysisReportPDF(analysisResult);
								}}
								className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white border border-blue-500 transition-colors text-sm font-semibold"
							>
								Export Report
							</button>
						</div>
					</div>
					)}
				</div>

				{/* Summary Cards */}
				<div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{/* Summary */}
					<div className="rounded-xl border border-slate-700 p-5" style={{ backgroundColor: "#1C1F26" }}>
						<p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Total Smells</p>
						<div className="flex items-end justify-between">
							<div>
								<div className="text-3xl font-bold">{analysisResult.totalSmells}</div>
								<div className="text-slate-400 text-sm">Code issues found</div>
							</div>
							<div className={analysisResult.totalSmells === 0 ? "text-green-400 text-xs" : "text-red-400 text-xs"}>
								{analysisResult.totalSmells === 0 ? "✓ Good" : "⚠ Refactor Recommended"}
							</div>
						</div>
					</div>

					{/* Severity */}
					<div className="rounded-xl border border-slate-700 p-5" style={{ backgroundColor: "#1C1F26" }}>
						<p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Severity</p>
						<ul className="space-y-2 text-sm">
							<li className="flex justify-between">
								<span className="text-slate-300">Critical</span>
								<span className="text-red-400 font-semibold">{getSeverityCount("CRITICAL")}</span>
							</li>
							<li className="flex justify-between">
								<span className="text-slate-300">Major</span>
								<span className="text-orange-400 font-semibold">{getSeverityCount("MAJOR")}</span>
							</li>
							<li className="flex justify-between">
								<span className="text-slate-300">Minor</span>
								<span className="text-yellow-300 font-semibold">{getSeverityCount("MINOR")}</span>
							</li>
						</ul>
					</div>

					{/* Categories Found */}
					<div className="rounded-xl border border-slate-700 p-5" style={{ backgroundColor: "#1C1F26" }}>
						<p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Categories</p>
						<div className="flex flex-wrap gap-2">
							{Object.keys(analysisResult.categories).length > 0 ? (
								Object.keys(analysisResult.categories).map((cat) => (
									<span key={cat} className="px-2 py-1 text-xs rounded bg-slate-800 text-slate-300">
										{getCategoryLabel(cat).split(" ")[0]}
									</span>
								))
							) : (
								<span className="text-slate-400 text-sm">No smells detected</span>
							)}
						</div>
					</div>

					{/* Metrics */}
					<div className="rounded-xl border border-slate-700 p-5" style={{ backgroundColor: "#1C1F26" }}>
						<p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Metrics</p>
						<ul className="space-y-2 text-sm">
							<li className="flex justify-between">
								<span className="text-slate-300">Files Scanned</span>
								<span className="text-slate-100 font-semibold">{analysisResult.metrics.filesScanned}</span>
							</li>
							<li className="flex justify-between">
								<span className="text-slate-300">Total Lines</span>
								<span className="text-slate-100 font-semibold">{analysisResult.metrics.totalLines}</span>
							</li>
							<li className="flex justify-between">
								<span className="text-slate-300">Refactor Candidates</span>
								<span className="text-slate-100 font-semibold">{analysisResult.metrics.refactorCandidates}</span>
							</li>
						</ul>
					</div>
				</div>

				{/* Category Tabs and Details */}
				<div className="mt-8">
					{/* Category Selector */}
					<div className="flex flex-wrap gap-2 mb-6">
						{Object.keys(analysisResult.categories).map((category) => (
							<button
								key={category}
								onClick={() => setSelectedCategory(category)}
								className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
									selectedCategory === category
										? "bg-blue-600 text-white"
										: "bg-slate-800 text-slate-300 hover:bg-slate-700"
								}`}
							>
								{getCategoryLabel(category)} ({analysisResult.categories[category].length})
							</button>
						))}
					</div>

					{/* Detailed Smells List */}
					{filteredSmells.length > 0 ? (
						<div className="rounded-xl border border-slate-700 p-6" style={{ backgroundColor: "#1C1F26" }}>
							<h2 className="text-lg font-bold mb-4">
								{selectedCategory ? getCategoryLabel(selectedCategory) : "All Smells"} ({filteredSmells.length})
							</h2>
							<div className="space-y-4">
								{filteredSmells.map((smell) => {
									const colors = getCategoryColor(smell.severity);
									return (
										<div key={smell.id} className="border border-slate-700 rounded-lg p-4 hover:bg-slate-800/50 transition-colors">
											<div className="flex items-start justify-between gap-4">
												<div className="flex-1">
													<div className="flex items-center gap-3 mb-2">
														<h3 className="text-slate-200 font-semibold">{smell.type}</h3>
														<span className={`px-2 py-1 text-xs rounded border ${colors.bg} ${colors.text} ${colors.border}`}>
															{smell.severity}
														</span>
													</div>
													<p className="text-slate-400 text-sm mb-2">{smell.description}</p>
													<div className="flex items-center gap-4 text-xs text-slate-500">
														<span>Line {smell.line}</span>
														<span>{smell.file}</span>
													</div>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					) : (
						<div className="rounded-xl border border-slate-700 p-8 text-center" style={{ backgroundColor: "#1C1F26" }}>
							<p className="text-slate-400 mb-4">No smells found in this category</p>
							<p className="text-slate-500 text-sm">Great code quality!</p>
						</div>
					)}
				</div>

				{/* Recommendations */}
				{analysisResult.totalSmells > 0 && (
					<div className="mt-8 rounded-xl border border-slate-700 p-6" style={{ backgroundColor: "#1C1F26" }}>
						<h2 className="text-lg font-bold mb-4">Refactoring Recommendations</h2>
						<ul className="space-y-3 text-slate-300 text-sm">
							{getSeverityCount("CRITICAL") > 0 && (
								<li className="flex gap-3">
									<span className="text-red-400 font-bold">•</span>
									<span>Address <strong>{getSeverityCount("CRITICAL")} critical</strong> code smell(s) immediately - they severely impact code quality and maintainability.</span>
								</li>
							)}
							{getSeverityCount("MAJOR") > 0 && (
								<li className="flex gap-3">
									<span className="text-orange-400 font-bold">•</span>
									<span>Fix <strong>{getSeverityCount("MAJOR")} major</strong> code smell(s) - these indicate significant design issues.</span>
								</li>
							)}
							{getSeverityCount("MINOR") > 0 && (
								<li className="flex gap-3">
									<span className="text-yellow-400 font-bold">•</span>
									<span>Consider refactoring <strong>{getSeverityCount("MINOR")} minor</strong> code smell(s) for improved code quality.</span>
								</li>
							)}
							<li className="flex gap-3 mt-4 pt-4 border-t border-slate-700">
								<span className="text-blue-400 font-bold">→</span>
								<span>Use the specific line numbers provided to locate and fix each issue in your code.</span>
							</li>
						</ul>
					</div>
				)}
			</div>

			{/* Footer */}
			<footer className="border-t border-slate-700 bg-slate-950 py-6 sm:py-8 text-center mt-12">
				<p className="text-slate-500 text-xs">© 2025 Code Smell Detection Tool. All rights reserved.</p>
			</footer>
		</main>
	);
}
