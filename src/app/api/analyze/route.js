import { NextResponse } from "next/server";
import CodeSmellDetector from "@/utils/codeSmellDetector";

export async function POST(request) {
  try {
    const { code, fileName } = await request.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { error: "Invalid code provided" },
        { status: 400 }
      );
    }

    // Analyze the code
    const detector = new CodeSmellDetector(code, fileName || "uploaded-file");
    const report = detector.analyze();

    return NextResponse.json(report, { status: 200 });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze code", details: error.message },
      { status: 500 }
    );
  }
}
