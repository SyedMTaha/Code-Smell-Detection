"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { generateAnalysisReportPDF } from "@/utils/generatePDF";

export default function AnalyzePage() {
	const router = useRouter();
	const [analysisResult, setAnalysisResult] = useState(null);
	const [loading, setLoading] = useState(true);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [selectedSmell, setSelectedSmell] = useState(null);
	const [codeLines, setCodeLines] = useState([]);
	const codeViewerRef = useRef(null);

	useEffect(() => {
		// Retrieve analysis result from localStorage
		const storedResult = localStorage.getItem("analysisResult");
		const uploadedCode = localStorage.getItem("uploadedCode");
		
		console.log('Stored result:', storedResult);
		console.log('Uploaded code:', uploadedCode);
		
		if (storedResult) {
			try {
				const result = JSON.parse(storedResult);
				console.log('Parsed result:', result);
				setAnalysisResult(result);
				setSelectedCategory("BLOATERS"); // Default category
				
				// Set up code lines if uploaded code is available
				if (uploadedCode) {
					setCodeLines(uploadedCode.split('\n'));
				}
			} catch (err) {
				console.error("Failed to parse analysis result:", err);
			}
		}
		setLoading(false);
	}, []);

	// Function to scroll to specific line in code viewer and highlight a range
	const scrollToLine = (lineNumber, endLineNumber = null) => {
		if (codeViewerRef.current) {
			const startLineElement = document.getElementById(`line-${lineNumber}`);
			
			// Remove previous highlights
			const allLines = codeViewerRef.current.querySelectorAll('.code-line');
			allLines.forEach(line => line.classList.remove('bg-blue-900/50'));
			
			// If we have a range to highlight
			if (endLineNumber && endLineNumber !== lineNumber) {
				// Highlight all lines in the range
				for (let i = lineNumber; i <= endLineNumber; i++) {
					const lineElement = document.getElementById(`line-${i}`);
					if (lineElement) {
						lineElement.classList.add('bg-blue-900/50');
					}
				}
				// Scroll to the start of the range
				if (startLineElement) {
					startLineElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
				}
			} else {
				// Just highlight a single line
				if (startLineElement) {
					startLineElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
					startLineElement.classList.add('bg-blue-900/50');
				}
			}
		}
	};

	// Handle smell selection
	const handleSmellSelect = (smell) => {
		setSelectedSmell(smell);
		
		// Calculate the range of lines to highlight based on smell type
		const startLine = smell.line;
		let endLine = smell.line;
		
		// Determine how many lines to highlight based on smell type
		switch(smell.type) {
			case 'Long Method':
			case 'Large Class':
				// For long methods/classes, try to determine the actual range
				const linesMatch = smell.description.match(/(\d+) lines/);
				if (linesMatch) {
					const lineCount = parseInt(linesMatch[1]);
					endLine = Math.min(startLine + lineCount - 1, codeLines.length);
				} else {
					// Default range for long items
					endLine = Math.min(startLine + 10, codeLines.length);
				}
				break;
			case 'Duplicate Code':
				// For duplicate code, highlight the specific block
				endLine = Math.min(startLine + 5, codeLines.length); // Typical duplicate block size
				break;
			case 'Long Conditional':
			case 'Large Switch Statement':
			case 'Deep Nesting':
				// For conditional blocks, highlight a range
				endLine = Math.min(startLine + 8, codeLines.length);
				break;
			default:
				// For single-line smells, just highlight the specific line
				endLine = startLine;
				break;
		}
		
		// Scroll to and highlight the range after a small delay to ensure DOM is ready
		setTimeout(() => scrollToLine(startLine, endLine), 100);
	};

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

			<div className="flex flex-col min-h-screen max-w-7xl mx-auto px-4 sm:px-6 pt-4">
				{/* Header Row */}
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
					<div>
						<h1 className="text-2xl sm:text-3xl font-bold mb-1">
							{isSampleReport ? "Sample Report" : "Analysis Results"}
						</h1>
						<p className="text-slate-400 text-sm">File: {analysisResult.fileName}</p>
					</div>

					{/* Status + Actions */}
					{!isSampleReport && (
						<div className="flex flex-wrap items-center gap-3">
							<span className="px-3 py-1 rounded-md bg-green-900/30 text-green-400 border border-green-700/50 text-xs font-bold uppercase tracking-widest">
								COMPLETED
							</span>
							<a href="/upload" className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 transition-colors text-xs font-semibold">
								Re-analyze
							</a>
							<button
								onClick={() => {
									generateAnalysisReportPDF(analysisResult);
								}}
								className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white border border-blue-500 transition-colors text-xs font-semibold"
							>
								Export Report
							</button>
						</div>
					)}
				</div>

				{/* Summary Cards */}
				<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
					<div className="rounded-lg border border-slate-700 p-3" style={{ backgroundColor: "#1C1F26" }}>
						<p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Total Smells</p>
						<div className="text-xl font-bold">{analysisResult.totalSmells}</div>
						<div className="text-slate-400 text-xs">Issues found</div>
					</div>

					<div className="rounded-lg border border-slate-700 p-3" style={{ backgroundColor: "#1C1F26" }}>
						<p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Critical</p>
						<div className="text-xl font-bold text-red-400">{getSeverityCount("CRITICAL")}</div>
					</div>

					<div className="rounded-lg border border-slate-700 p-3" style={{ backgroundColor: "#1C1F26" }}>
						<p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Major</p>
						<div className="text-xl font-bold text-orange-400">{getSeverityCount("MAJOR")}</div>
					</div>

					<div className="rounded-lg border border-slate-700 p-3" style={{ backgroundColor: "#1C1F26" }}>
						<p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Minor</p>
						<div className="text-xl font-bold text-yellow-400">{getSeverityCount("MINOR")}</div>
					</div>
				</div>

				{/* Main Content Area - Split View */}
				<div className="flex flex-col md:flex-row gap-6 flex-1 overflow-hidden" style={{ minHeight: '90vh' }}>
					{/* Left Panel - Code Smells List */}
					<div className="w-full md:w-96 flex-shrink-0 flex flex-col border border-slate-700 rounded-lg" style={{ backgroundColor: "#1C1F26" }}>
						<div className="p-4 border-b border-slate-700">
							<h2 className="text-lg font-bold mb-3">Code Issues</h2>
								
							{/* Category Selector */}
							<div className="flex flex-wrap gap-2 mb-3">
								{Object.keys(analysisResult.categories).map((category) => (
									<button
										key={category}
										onClick={() => setSelectedCategory(category)}
										className={`px-3 py-1.5 rounded font-semibold text-xs transition-colors ${
											selectedCategory === category
												? "bg-blue-600 text-white"
												: "bg-slate-800 text-slate-300 hover:bg-slate-700"
										}`}
									>
										{getCategoryLabel(category).substring(0, 12)}{getCategoryLabel(category).length > 12 ? "..." : ""}
									</button>
								))}
							</div>
						</div>

						{/* Smells List */}
						<div className="flex-1 overflow-y-auto" style={{ minHeight: '90vh', maxHeight: '90vh' }}>
							{filteredSmells.length > 0 ? (
								<div className="space-y-2 p-2">
									{filteredSmells.map((smell) => {
										const colors = getCategoryColor(smell.severity);
										const isSelected = selectedSmell && selectedSmell.id === smell.id;
										return (
											<div 
												key={smell.id}
												className={`p-3 rounded cursor-pointer transition-colors ${isSelected ? 'bg-blue-900/30 border border-blue-500' : 'hover:bg-slate-800/50 border border-transparent'}`}
												onClick={() => handleSmellSelect(smell)}
											>
												<div className="flex items-start justify-between gap-2">
													<div className="flex-1 min-w-0">
														<h3 className="text-slate-200 font-semibold text-sm truncate">{smell.type}</h3>
														<p className="text-slate-400 text-xs mt-1 truncate">{smell.description}</p>
														<div className="flex items-center gap-2 mt-2">
															<span className="text-slate-500 text-xs">Line {smell.line}</span>
															<span className={`px-2 py-0.5 text-xs rounded border ${colors.bg} ${colors.text} ${colors.border}`}>
																{smell.severity}
															</span>
														</div>
													</div>
												</div>
											</div>
										);
									})}
								</div>
							) : (
								<div className="p-6 text-center text-slate-500 text-sm">
									No smells found in this category
								</div>
							)}
						</div>
					</div>

					{/* Right Panel - Code Viewer */}
					<div className="flex-1 flex flex-col border border-slate-700 rounded-lg overflow-hidden" style={{ backgroundColor: "#1C1F26" }}>
						<div className="p-4 border-b border-slate-700">
							<h2 className="text-lg font-bold">Code Viewer</h2>
							<p className="text-slate-400 text-sm mt-1">{analysisResult.fileName} - {codeLines.length} lines</p>
						</div>

						<div 
							ref={codeViewerRef}
							className="flex-1 overflow-y-auto font-mono text-sm p-4 bg-slate-900/50" 
							style={{ minHeight: '90vh', maxHeight: '90vh' }}
						>
							{codeLines.length > 0 ? (
								codeLines.map((line, index) => {
									const lineNumber = index + 1;
									return (
										<div 
											key={index}
											id={`line-${lineNumber}`}
											className="code-line py-1 flex hover:bg-slate-800/30"
										>
											<span className="text-slate-500 select-none w-12 flex-shrink-0 text-right pr-4">
												{lineNumber}
											</span>
											<span className="text-slate-200">
												{line}
											</span>
										</div>
									);
								})
							) : (
								<div className="flex items-center justify-center h-full text-slate-500">
									<p>No code available to display</p>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Recommendations */}
				{analysisResult.totalSmells > 0 && (
					<div className="mt-6 rounded-lg border border-slate-700 p-4" style={{ backgroundColor: "#1C1F26" }}>
						<h2 className="text-base font-bold mb-3">Refactoring Recommendations</h2>
						<ul className="space-y-2 text-slate-300 text-sm">
							{getSeverityCount("CRITICAL") > 0 && (
								<li className="flex gap-2">
									<span className="text-red-400 font-bold">•</span>
									<span>Address <strong>{getSeverityCount("CRITICAL")} critical</strong> code smell(s) immediately.</span>
								</li>
							)}
							{getSeverityCount("MAJOR") > 0 && (
								<li className="flex gap-2">
									<span className="text-orange-400 font-bold">•</span>
									<span>Fix <strong>{getSeverityCount("MAJOR")} major</strong> code smell(s) to improve design quality.</span>
								</li>
							)}
							{getSeverityCount("MINOR") > 0 && (
								<li className="flex gap-2">
									<span className="text-yellow-400 font-bold">•</span>
									<span>Consider refactoring <strong>{getSeverityCount("MINOR")} minor</strong> code smell(s).</span>
								</li>
							)}
							<li className="flex gap-2 mt-2 pt-2 border-t border-slate-700">
								<span className="text-blue-400 font-bold">→</span>
								<span>Click on any issue to view and highlight it in the code.</span>
							</li>
						</ul>
					</div>
				)}
			</div>

			{/* Footer */}
			<footer className="border-t border-slate-700 bg-slate-950 py-4 text-center mt-4">
				<p className="text-slate-500 text-xs">© 2025 Code Smell Detection Tool. All rights reserved.</p>
			</footer>
		</main>
	);
}