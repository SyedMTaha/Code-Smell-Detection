"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
	const router = useRouter();
	const [uploadedFile, setUploadedFile] = useState(null);
	const [isUploading, setIsUploading] = useState(false);
	const [error, setError] = useState(null);

	const simulateUploadProgress = async (ms = 1500) =>
		new Promise((resolve) => setTimeout(resolve, ms));

	const startAnalysis = async (file) => {
		try {
			const fileContent = await file.text();
			
			// Store the uploaded code in localStorage for the code viewer
			localStorage.setItem("uploadedCode", fileContent);
			
			// Send to API for analysis
			const response = await fetch("/api/analyze", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					code: fileContent,
					fileName: file.name,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Analysis failed");
			}

			const analysisResult = await response.json();
			
			// Store in localStorage for retrieve in analyze page
			localStorage.setItem("analysisResult", JSON.stringify(analysisResult));
			
			return analysisResult;
		} catch (err) {
			console.error("Error analyzing file:", err);
			throw err; // Re-throw to be handled by the caller
		}
	};

	const handleFileChange = (e) => {
		const file = e.target.files?.[0] ?? null;
		setUploadedFile(file);
		setError(null);
	};

	const handleAnalysis = async () => {
		if (!uploadedFile || isUploading) return;
		setIsUploading(true);
		setError(null);
		
		try {
			await simulateUploadProgress(2000);
			const result = await startAnalysis(uploadedFile);
			console.log('Analysis result:', result);
			setIsUploading(false);
			// Navigate to analyze page
			router.push("/analyze");
		} catch (err) {
			console.error('Analysis error:', err);
			setIsUploading(false);
			setError('Failed to analyze file: ' + err.message);
		}
	};

	// Loading component to show during analysis
	const AnalysisLoading = () => {
		const messages = [
			"Scanning for code bloaters",
			"Checking for object-orientation issues",
			"Identifying change preventers",
			"Detecting dispensable elements"
		];
		const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

		useEffect(() => {
			const interval = setInterval(() => {
				setCurrentMessageIndex(prevIndex => (prevIndex + 1) % messages.length);
			}, 1000);

			return () => clearInterval(interval);
		}, []);

		return (
			<div className="fixed inset-0 flex items-center justify-center bg-[#121621] z-50">
				<div className="text-center p-8 max-w-md">
					<div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-6"></div>
					<h3 className="text-xl font-bold text-white mb-4">Analyzing Your Code</h3>
					<div className="text-slate-300 min-h-[60px] flex items-center justify-center">
						<p className="flex items-center justify-center gap-2">
							<span className="w-2 h-2 bg-blue-500 rounded-full"></span> 
							{messages[currentMessageIndex]}
						</p>
					</div>
					<p className="mt-6 text-slate-400">This may take a moment...</p>
				</div>
			</div>
		);
	};

	return (
		<>
			{isUploading && <AnalysisLoading />}
			<main className="min-h-screen text-white flex flex-col" style={{ backgroundColor: "#121621" }}>
				{/* Back Button */}
				<div className="px-4 sm:px-6 py-4 sm:py-6">
					<button
						onClick={() => router.push("/")}
						className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm cursor-pointer"
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<line x1="19" y1="12" x2="5" y2="12"></line>
							<polyline points="12 19 5 12 12 5"></polyline>
						</svg>
						Back
					</button>
				</div>

				{/* Error Alert */}
				{error && (
					<div className="max-w-4xl mx-auto w-full px-4 sm:px-6 mb-6">
						<div className="rounded-lg bg-red-900/30 border border-red-700/50 p-4 text-red-300 text-sm">
							{error}
						</div>
					</div>
				)}

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

					{/* Upload Area + Actions (wrapped) */}
					<div className="w-full mb-8 sm:mb-10">
						<div className="rounded-2xl bg-[#1D232F] p-4 sm:p-6">
							<label className="block w-full">
								<div className="w-full border-2 border-dashed border-slate-700 rounded-xl p-6 sm:p-8 bg-slate-900/30 hover:bg-slate-900/40 transition-colors cursor-pointer text-center">
									<input
										type="file"
										className="hidden"
										accept=".zip,.tar,.tgz,.js,.ts,.jsx,.tsx,.py,.java,.cpp,.c,.rb,.go,.rs,.php,.cs"
										onChange={handleFileChange}
									/>
									<div className="flex flex-col items-center gap-3">
										<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300">
											<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
											<polyline points="7 10 12 5 17 10" />
											<line x1="12" y1="5" x2="12" y2="15" />
										</svg>
										{!uploadedFile ? (
											<>
												<p className="text-slate-300 text-sm sm:text-base">
													Click to select a file or drag and drop
												</p>
											</>
										) : (
											<div className="w-full flex flex-col items-center gap-3">
												<div className="flex items-center gap-2 text-green-400">
													<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
														<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
													</svg>
													<span className="font-semibold text-sm">File Selected</span>
												</div>
												<p className="text-white font-semibold text-base break-words max-w-xs">{uploadedFile.name}</p>
												<p className="text-slate-400 text-xs">
													{(uploadedFile.size / 1024).toFixed(2)} KB • Ready to analyze
												</p>
											</div>
										)}
									</div>
								</div>
							</label>

							{/* Start Analysis Button */}
							<div className="mt-6 sm:mt-8">
								<button
									onClick={handleAnalysis}
									disabled={!uploadedFile || isUploading}
									className={`w-full px-6 sm:px-8 py-3 sm:py-4 font-bold text-base sm:text-lg rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
									uploadedFile && !isUploading
										? "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg cursor-pointer"
										: "bg-slate-700 text-slate-400 cursor-not-allowed opacity-60"
								}`}
								>
									<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
										<polygon points="5 3 19 12 5 21 5 3"></polygon>
									</svg>
									{isUploading ? "Analyzing..." : "Start Analysis"}
								</button>
							</div>

							{/* Security Notice */}
							<p className="text-slate-400 text-xs mt-6 sm:mt-8 flex items-center gap-2 justify-center">
								<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
									<path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
								</svg>
								Files are processed securely and deleted after analysis.
							</p>
						</div>
					</div>
				</section>

				{/* Footer */}
				<footer className="border-t border-slate-700 bg-slate-950 py-6 sm:py-8 text-center">
					<p className="text-slate-500 text-xs">© 2025 Code Smell Detection Tool. All rights reserved.</p>
				</footer>
			</main>
		</>
	);
}
