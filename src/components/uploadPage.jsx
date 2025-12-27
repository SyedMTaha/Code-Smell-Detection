"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
	const router = useRouter();
	const [uploadedFile, setUploadedFile] = useState(null);
	const [isUploading, setIsUploading] = useState(false);

	const simulateUploadProgress = async (ms = 1500) =>
		new Promise((resolve) => setTimeout(resolve, ms));

	const startAnalysis = async () => {
		// Placeholder: In a real app, run analysis and store results in state or server.
		return Promise.resolve();
	};

	const handleFileChange = (e) => {
		const file = e.target.files?.[0] ?? null;
		setUploadedFile(file);
	};

	const handleAnalysis = async () => {
		if (!uploadedFile || isUploading) return;
		setIsUploading(true);
		await simulateUploadProgress(2000);
		await startAnalysis();
		setIsUploading(false);
		// Navigate to a results or analyze page (adjust if you add /results route)
		router.push("/analyze");
	};

	return (
		<main className="min-h-screen text-white flex flex-col" style={{ backgroundColor: "#121621" }}>
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
									<p className="text-slate-300 text-sm sm:text-base">
										Click to select a file or drag and drop
									</p>
									{uploadedFile && (
										<p className="text-slate-400 text-xs">Selected: {uploadedFile.name}</p>
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
										? "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
										: "bg-slate-700 text-slate-400 cursor-not-allowed opacity-60"
								}`}
							>
								<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<polygon points="5 3 19 12 5 21 5 3"></polygon>
								</svg>
								{isUploading ? "Uploading..." : "Start Analysis"}
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
	);
}
