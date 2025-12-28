/**
 * PDF Generation Utility for Code Smell Analysis Reports
 */

export const generateAnalysisReportPDF = (analysisResult) => {
  // Create HTML content for the PDF
  const htmlContent = createHTMLReport(analysisResult);

  // Create a temporary container
  const printWindow = window.open("", "", "height=800,width=1000");
  printWindow.document.write(htmlContent);
  printWindow.document.close();

  // Print to PDF
  setTimeout(() => {
    printWindow.print();
    // Close the window after printing
    setTimeout(() => {
      printWindow.close();
    }, 500);
  }, 250);
};

function createHTMLReport(analysisResult) {
  const getCategoryColor = (severity) => {
    switch (severity) {
      case "CRITICAL":
        return { bg: "#991b1b", text: "#fee2e2" };
      case "MAJOR":
        return { bg: "#92400e", text: "#fef3c7" };
      case "MINOR":
        return { bg: "#713f12", text: "#fef08a" };
      default:
        return { bg: "#1e293b", text: "#e2e8f0" };
    }
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

  const getSeverityCount = (severity) => {
    return analysisResult.metrics.severityCounts?.[severity] || 0;
  };

  const smellsHTML = analysisResult.smells
    .map((smell) => {
      const colors = getCategoryColor(smell.severity);
      return `
        <div style="margin-bottom: 20px; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; page-break-inside: avoid;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
            <div>
              <h4 style="margin: 0 0 8px 0; color: #1e293b; font-size: 16px; font-weight: 600;">${smell.type}</h4>
              <p style="margin: 0 0 8px 0; color: #475569; font-size: 13px; line-height: 1.5;">${smell.description}</p>
              <div style="display: flex; gap: 16px; font-size: 12px; color: #64748b;">
                <span>Line ${smell.line}</span>
                <span>${smell.file}</span>
              </div>
            </div>
            <span style="background-color: ${colors.bg}; color: ${colors.text}; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; white-space: nowrap;">${smell.severity}</span>
          </div>
        </div>
      `;
    })
    .join("");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Code Smell Analysis Report</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Poppins', sans-serif;
            color: #1e293b;
            background-color: #ffffff;
            line-height: 1.6;
            padding: 40px;
          }
          .container {
            max-width: 850px;
            margin: 0 auto;
          }
          .header {
            margin-bottom: 40px;
            border-bottom: 2px solid #0ea5e9;
            padding-bottom: 20px;
          }
          .header h1 {
            font-size: 32px;
            font-weight: 700;
            color: #0c4a6e;
            margin-bottom: 8px;
          }
          .header p {
            color: #64748b;
            font-size: 14px;
          }
          .meta-info {
            display: flex;
            gap: 20px;
            margin-bottom: 30px;
            flex-wrap: wrap;
          }
          .meta-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
            color: #475569;
          }
          .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
          }
          .badge-success {
            background-color: #dcfce7;
            color: #166534;
          }
          .summary-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            margin-bottom: 40px;
          }
          .summary-card {
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 16px;
            background-color: #f8fafc;
          }
          .summary-card h3 {
            font-size: 12px;
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 12px;
          }
          .summary-card .value {
            font-size: 28px;
            font-weight: 700;
            color: #0c4a6e;
          }
          .summary-card .subtitle {
            font-size: 12px;
            color: #64748b;
            margin-top: 4px;
          }
          .severity-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-size: 13px;
            border-bottom: 1px solid #f1f5f9;
          }
          .severity-row:last-child {
            border-bottom: none;
          }
          .severity-value {
            font-weight: 600;
          }
          .critical { color: #dc2626; }
          .major { color: #ea580c; }
          .minor { color: #ca8a04; }
          .section-title {
            font-size: 18px;
            font-weight: 700;
            color: #0c4a6e;
            margin-bottom: 16px;
            margin-top: 32px;
            padding-bottom: 12px;
            border-bottom: 1px solid #e2e8f0;
          }
          .smells-list {
            margin-bottom: 40px;
          }
          .category-group {
            margin-bottom: 32px;
          }
          .category-title {
            font-size: 16px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 12px;
            padding: 8px 12px;
            background-color: #f1f5f9;
            border-radius: 4px;
          }
          .recommendations {
            background-color: #f0f9ff;
            border-left: 4px solid #0ea5e9;
            padding: 16px;
            border-radius: 4px;
            margin-top: 40px;
          }
          .recommendations h3 {
            color: #0c4a6e;
            font-size: 14px;
            font-weight: 700;
            margin-bottom: 12px;
          }
          .recommendations ul {
            list-style: none;
            padding: 0;
          }
          .recommendations li {
            margin-bottom: 8px;
            font-size: 13px;
            color: #475569;
            padding-left: 20px;
            position: relative;
          }
          .recommendations li:before {
            content: "→";
            position: absolute;
            left: 0;
            color: #0ea5e9;
            font-weight: bold;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            font-size: 12px;
            color: #94a3b8;
          }
          @media print {
            body {
              padding: 0;
            }
            .container {
              max-width: 100%;
            }
            .page-break {
              page-break-after: always;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">
            <h1>Code Smell Analysis Report</h1>
            <p>Comprehensive static code analysis results</p>
          </div>

          <!-- Meta Information -->
          <div class="meta-info">
            <div class="meta-item">
              <span class="badge badge-success">COMPLETED</span>
            </div>
            <div class="meta-item">
              <strong>File:</strong> ${analysisResult.fileName}
            </div>
            <div class="meta-item">
              <strong>Date:</strong> ${formatDate(analysisResult.timestamp)}
            </div>
          </div>

          <!-- Summary Cards -->
          <div class="summary-grid">
            <div class="summary-card">
              <h3>Total Smells</h3>
              <div class="value">${analysisResult.totalSmells}</div>
              <div class="subtitle">Code issues found</div>
            </div>

            <div class="summary-card">
              <h3>Critical</h3>
              <div class="value critical">${getSeverityCount("CRITICAL")}</div>
              <div class="subtitle">Highest priority</div>
            </div>

            <div class="summary-card">
              <h3>Major</h3>
              <div class="value major">${getSeverityCount("MAJOR")}</div>
              <div class="subtitle">Significant issues</div>
            </div>

            <div class="summary-card">
              <h3>Minor</h3>
              <div class="value minor">${getSeverityCount("MINOR")}</div>
              <div class="subtitle">Low priority</div>
            </div>
          </div>

          <!-- Metrics Section -->
          <h2 class="section-title">Metrics</h2>
          <div class="summary-grid" style="grid-template-columns: repeat(3, 1fr); margin-bottom: 40px;">
            <div class="summary-card">
              <h3>Files Scanned</h3>
              <div class="value">${analysisResult.metrics.filesScanned}</div>
            </div>
            <div class="summary-card">
              <h3>Total Lines</h3>
              <div class="value">${analysisResult.metrics.totalLines}</div>
            </div>
            <div class="summary-card">
              <h3>Refactor Candidates</h3>
              <div class="value">${analysisResult.metrics.refactorCandidates}</div>
            </div>
          </div>

          <!-- Detailed Smells -->
          <h2 class="section-title">Detected Code Smells</h2>
          <div class="smells-list">
            ${Object.keys(analysisResult.categories)
              .map(
                (category) => `
              <div class="category-group">
                <div class="category-title">${getCategoryLabel(category)} (${analysisResult.categories[category].length} found)</div>
                ${analysisResult.smells
                  .filter((s) => s.category === category)
                  .map(
                    (smell) => `
                  <div style="margin-bottom: 16px; border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px; background-color: #f8fafc;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                      <strong style="color: #0c4a6e; font-size: 14px;">${smell.type}</strong>
                      <span style="background-color: ${getCategoryColor(smell.severity).bg}; color: ${getCategoryColor(smell.severity).text}; padding: 2px 8px; border-radius: 3px; font-size: 11px; font-weight: bold;">${smell.severity}</span>
                    </div>
                    <p style="margin: 0 0 8px 0; color: #475569; font-size: 13px;">${smell.description}</p>
                    <div style="display: flex; gap: 16px; font-size: 12px; color: #64748b;">
                      <span>Line ${smell.line}</span>
                      <span>${smell.file}</span>
                    </div>
                  </div>
                `
                  )
                  .join("")}
              </div>
            `
              )
              .join("")}
          </div>

          <!-- Recommendations -->
          <div class="recommendations">
            <h3>Refactoring Recommendations</h3>
            <ul>
              ${getSeverityCount("CRITICAL") > 0 ? `<li>Address <strong>${getSeverityCount("CRITICAL")} critical</strong> code smell(s) immediately.</li>` : ""}
              ${getSeverityCount("MAJOR") > 0 ? `<li>Fix <strong>${getSeverityCount("MAJOR")} major</strong> code smell(s) to improve design quality.</li>` : ""}
              ${getSeverityCount("MINOR") > 0 ? `<li>Consider refactoring <strong>${getSeverityCount("MINOR")} minor</strong> code smell(s).</li>` : ""}
              <li>Use the provided line numbers to locate each issue in your codebase.</li>
              <li>Prioritize critical and major issues for immediate attention.</li>
            </ul>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p>Generated by Code Smell Detection Tool &copy; 2025</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
