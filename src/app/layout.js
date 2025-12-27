import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AnalysisProvider } from "@/context/AnalysisContext";
import { ThemeProvider } from "@/context/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Code Smell Detection Tool",
  description: "Upload your source code and detect design & maintainability issues",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50 transition-colors duration-200`}
      >
        <ThemeProvider>
          <AnalysisProvider>
            {children}
          </AnalysisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
