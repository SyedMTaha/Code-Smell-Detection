# Code Smell Detection Website - Project Report

## Table of Contents
1. [Introduction](#introduction)
2. [Project Objectives](#project-objectives)
3. [Approach and Methodology](#approach-and-methodology)
4. [System Architecture](#system-architecture)
5. [Technical Stack](#technical-stack)
6. [Code Smell Categories](#code-smell-categories)
7. [Features and Functionality](#features-and-functionality)
8. [User Guide](#user-guide)
9. [Implementation Details](#implementation-details)
10. [Code Analysis Algorithm](#code-analysis-algorithm)
11. [Results and Metrics](#results-and-metrics)
12. [Limitations and Future Enhancements](#limitations-and-future-enhancements)
13. [Conclusion](#conclusion)

---

## Introduction

The Code Smell Detection Website is a comprehensive web-based tool designed to identify and analyze code quality issues known as "code smells" in software projects. Code smells are surface-level indicators of potential deeper problems in code that may require refactoring. This tool automatically scans source code written in JavaScript/TypeScript and Python, categorizes the detected issues, and provides actionable recommendations for improvement.

The primary motivation behind this project is to support Software Quality Assurance (SQA) engineers and developers in maintaining code quality standards, reducing technical debt, and improving code maintainability through early detection of design and implementation issues. The web-based interface makes it accessible and easy to use without requiring local installation or complex configuration.

---

## Project Objectives

The key objectives of this Code Smell Detection project are:

1. **Automated Detection**: Develop an automated system capable of scanning source code and identifying common code smells without manual code review.

2. **Multi-Language Support**: Support analysis of multiple programming languages, specifically JavaScript/TypeScript and Python, with potential for future expansion.

3. **Categorized Analysis**: Organize detected code smells into distinct categories based on established software engineering principles for better understanding and prioritization.

4. **Severity Classification**: Assign severity levels (Critical, Major, Minor) to identified issues to help developers prioritize refactoring efforts.

5. **Accessibility**: Provide a user-friendly web interface that allows non-technical users to upload code and receive analysis results without specialized knowledge.

6. **Comprehensive Reporting**: Generate detailed reports with line-by-line code analysis and actionable refactoring suggestions.

7. **Exportability**: Enable users to export analysis results in PDF format for documentation and sharing with team members.

---

## Approach and Methodology

### Development Methodology

The project follows an **Iterative Development Approach** combined with **Component-Based Architecture**:

1. **Analysis Phase**: Comprehensive research into code smell definitions, detection patterns, and refactoring strategies from established software engineering literature and Martin Fowler's "Refactoring" principles.

2. **Design Phase**: 
   - Designed a modular architecture separating concerns (backend analysis, frontend presentation, PDF generation)
   - Created reusable React components for different pages and functionalities
   - Implemented a robust detection engine using pattern matching and heuristic analysis

3. **Implementation Phase**:
   - Built core detection algorithms for each code smell category
   - Developed API endpoints for backend processing
   - Created responsive UI components with Tailwind CSS
   - Integrated PDF export functionality

4. **Testing Phase**:
   - Tested detection algorithms with sample code files
   - Validated accuracy of code smell identification
   - Verified cross-browser compatibility and responsiveness

### Detection Strategy

The detection strategy employs:

- **Pattern Matching**: Regular expressions and text parsing to identify structural code issues
- **Heuristic Analysis**: Threshold-based detection (e.g., methods > 50 lines are flagged as "Long Methods")
- **Language-Specific Parsing**: Tailored detection algorithms for JavaScript and Python to account for syntax differences
- **Static Code Analysis**: Analysis without executing code, making it fast and safe

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    User Interface (Frontend)             │
│          Next.js React Components with Tailwind CSS      │
├──────────────────────┬──────────────────────────────────┤
│  Home Page           │  Upload Page    │   Analyze Page  │
│  (Introduction)      │  (File Upload)  │   (Results)     │
└──────────────────────┴──────────────────────────────────┘
                           ↓ HTTP POST ↑
┌──────────────────────────────────────────────────────────┐
│               API Layer (Backend)                         │
│               Next.js API Routes (/api/analyze)          │
└──────────────────────────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────┐
│           Core Analysis Engine                           │
│        CodeSmellDetector Class (1431 lines)              │
│  - Pattern Detection (Regex & String Matching)           │
│  - Heuristic Analysis (Thresholds)                       │
│  - Metrics Calculation                                   │
└──────────────────────────────────────────────────────────┘
                           ↓ JSON Result ↑
┌──────────────────────────────────────────────────────────┐
│            Utility Layer                                 │
│  - PDF Generation (generatePDF.js)                       │
│  - LocalStorage Management                               │
└──────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Action**: User uploads code file through Upload Page
2. **File Processing**: File is read and converted to text
3. **API Request**: Code sent to `/api/analyze` endpoint as JSON
4. **Analysis**: CodeSmellDetector processes the code
5. **Result Storage**: Analysis result stored in browser localStorage
6. **Display**: Analyze page retrieves and displays results
7. **Export**: User can export results as PDF

---

## Technical Stack

### Frontend
- **Framework**: Next.js 16.1.1 (React 19.2.3)
- **Styling**: Tailwind CSS v4 with PostCSS
- **State Management**: React Hooks (useState, useEffect, useRef)
- **Routing**: Next.js App Router with client-side navigation
- **Code Quality**: ESLint v9

### Backend
- **Runtime**: Node.js (via Next.js)
- **API Framework**: Next.js API Routes
- **Deployment**: Serverless (Next.js functions)

### Build Tools
- **Build System**: Next.js (webpack)
- **Compiler**: Babel with React Compiler plugin
- **Package Manager**: npm

### Development Environment
- **IDE**: Visual Studio Code
- **Version Control**: Git (implied)
- **Node.js Version**: 18+ (for Next.js 16 compatibility)

---

## Code Smell Categories

The tool detects and categorizes code smells into five main categories as per Martin Fowler's classification:

### 1. BLOATERS
**Description**: Code that has grown too large and cannot be refactored easily.

| Smell Type | Detection Method | Threshold | Severity |
|-----------|------------------|-----------|----------|
| **Long Method** | Function/method line counting | > 50 lines | CRITICAL (>75), MAJOR (>50) |
| **Large Class** | Class size and method count | > 200 lines OR > 20 methods | MAJOR |
| **Primitive Obsession** | Excessive use of primitive types | Multiple primitive properties | MINOR |
| **Long Parameter List** | Parameter count analysis | > 5 parameters (JS), > 4 (Python) | MAJOR |
| **Data Clumps** | Repeated group of variables | Same variables recurring | MAJOR |

**Detection Implementation**:
- JavaScript: Brace counting and regex pattern matching
- Python: Indentation-based scope analysis
- Generic: Line counting with comment filtering

### 2. OBJECT-ORIENTATION ABUSERS
**Description**: Improper or incomplete use of object-oriented principles.

| Smell Type | Detection Method | Threshold |
|-----------|------------------|-----------|
| **Switch Statements** | Regex pattern matching | Any switch with > 5 cases |
| **Temporary Fields** | Field usage analysis | Fields used in few methods |
| **Refused Bequest** | Method usage tracking | Unused inherited methods |

### 3. CHANGE PREVENTERS
**Description**: Code structures that make it difficult to change code.

| Smell Type | Description |
|-----------|-------------|
| **Divergent Change** | Class has multiple reasons to change (SRP violation) |
| **Shotgun Surgery** | Changes to one concept require changes in many places |
| **Parallel Inheritance Hierarchies** | New subclass of A requires new subclass of B |

### 4. DISPENSABLES
**Description**: Code that serves no purpose and can be safely removed.

| Smell Type | Detection Method |
|-----------|------------------|
| **Dead Code** | Variable declaration without usage |
| **Duplicate Code** | Identical code blocks at different locations |
| **Lazy Classes** | Classes with minimal functionality |
| **Speculative Generality** | Over-engineered code |
| **Comments** | Excessive or unnecessary comments |

### 5. COUPLERS
**Description**: Code with excessive dependencies between classes/modules.

| Smell Type | Detection Method |
|-----------|------------------|
| **Feature Envy** | Method too interested in another object's data |
| **Inappropriate Intimacy** | Classes overly dependent on internal implementation |
| **Message Chains** | Long chains of method calls |
| **Middle Man** | Class that does nothing but delegation |
| **Alien Data Types** | Excessive use of external library types |

---

## Features and Functionality

### 1. Home Page
- **Purpose**: Introduction and overview of the tool
- **Features**:
  - Project description and benefits
  - Sample analysis report demonstration
  - Navigation to upload and analysis sections
  - Real-world example of detected code smells

### 2. Upload Page
- **Purpose**: Accept code files for analysis
- **Features**:
  - File upload interface (drag-and-drop support)
  - Real-time file validation
  - Loading animation with dynamic analysis messages
  - Error handling and user feedback
  - Support for multiple file formats (.js, .jsx, .ts, .tsx, .py)

### 3. Analysis/Results Page
- **Purpose**: Display comprehensive analysis results
- **Features**:
  - Summary metrics (total smells, file info, complexity metrics)
  - Categorized smell listing with filtering
  - Inline code viewer with line numbers
  - Line highlighting for identified issues
  - Smell details panel with descriptions and recommendations
  - PDF export functionality
  - Severity-based color coding (Red: Critical, Orange: Major, Yellow: Minor)

### 4. PDF Report Generation
- **Purpose**: Export analysis results for documentation
- **Features**:
  - Formatted HTML-to-PDF conversion
  - Summary statistics
  - Detailed smell listings with descriptions
  - Severity indicators
  - Professional styling suitable for technical reports

---

## User Guide

### Getting Started

#### Installation & Setup

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd Code-Smell-Detection
   ```

2. **Install Dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Access Application**
   - Open browser and navigate to `http://localhost:3000`

#### Running the Tool

**Step 1: Navigate to Upload Page**
- From the home page, click on "Upload Code" or use the navigation menu

**Step 2: Upload Code File**
- Click the upload area or drag and drop your code file
- Supported formats: JavaScript, TypeScript, Python
- File size: Up to browser's file limit (typically 100+ MB)

**Step 3: Analyze Code**
- Click the "Analyze" button
- Wait for analysis to complete (typically 1-3 seconds)
- Loading screen shows current analysis phase

**Step 4: Review Results**
- Results automatically displayed on the Analysis page
- View summary metrics at the top
- Browse detected code smells by category
- Click individual smells to see details and code context

**Step 5: Export Report**
- Click "Download PDF" to export analysis results
- PDF opens in print dialog for saving or printing

### Interpreting Results

#### Summary Metrics
- **Total Code Smells**: Count of all detected issues
- **Files Scanned**: Number of files analyzed
- **Total Lines**: Number of lines in submitted code
- **Average Complexity**: Estimated complexity score
- **Refactor Candidates**: Classes/methods needing refactoring

#### Severity Levels
- **CRITICAL** (Red) - Major issues affecting code quality significantly. Address immediately.
- **MAJOR** (Orange) - Significant issues that should be addressed in near term.
- **MINOR** (Yellow) - Minor issues that can be addressed during refactoring.

#### Code Viewer
- Lines corresponding to detected smells are highlighted
- Hover over line numbers to see associated smell details
- Use category filters to focus on specific types of issues

---

## Implementation Details

### CodeSmellDetector Class

**Location**: `src/utils/codeSmellDetector.js` (1431 lines)

**Key Methods**:

```javascript
constructor(code, fileName)
  - Initializes detector with source code and filename
  
analyze()
  - Main entry point, orchestrates all detection methods
  - Returns comprehensive analysis report
  
// Detection Methods by Category:
detectBloaters()
  - Detects Long Methods, Large Classes, etc.
  
detectObjectOrientationAbusers()
  - Identifies OOP principle violations
  
detectChangePreventers()
  - Finds structures preventing easy changes
  
detectDispensables()
  - Locates unnecessary code
  
detectCouplers()
  - Detects excessive dependencies
  
calculateMetrics()
  - Computes code quality metrics
  
addSmell(type, description, line, category, severity)
  - Records detected smell with metadata
  
generateReport()
  - Formats results into final report object
```

### API Endpoint

**Location**: `src/app/api/analyze/route.js`

**Endpoint**: `POST /api/analyze`

**Request Format**:
```json
{
  "code": "source code as string",
  "fileName": "example.js"
}
```

**Response Format**:
```json
{
  "fileName": "example.js",
  "totalSmells": 12,
  "smells": [
    {
      "id": "smell-1",
      "type": "Long Method",
      "description": "Function 'processData' is 45 lines...",
      "line": 12,
      "file": "example.js",
      "category": "BLOATERS",
      "severity": "CRITICAL"
    }
  ],
  "metrics": {
    "filesScanned": 1,
    "totalLines": 250,
    "avgComplexity": 4.2,
    "refactorCandidates": 8
  }
}
```

### React Components

#### HomePage Component
- Path: `src/components/homePage.jsx`
- Lines: 318
- Displays landing page with sample analysis results

#### UploadPage Component
- Path: `src/components/uploadPage.jsx`
- Lines: 230
- Handles file upload and initiates analysis
- Features animated loading screen with status messages

#### AnalyzePage Component
- Path: `src/components/analyzePage.jsx`
- Lines: 404
- Displays analysis results with interactive features
- Line highlighting and smell detail viewing

### PDF Generation

**Location**: `src/utils/generatePDF.js` (381 lines)

**Features**:
- Converts analysis result to formatted HTML
- Client-side PDF generation via browser print
- Professional styling with color-coded severity indicators
- Summary statistics and smell listings

---

## Code Analysis Algorithm

### Language Detection

The analyzer detects the programming language based on file extension:

```
.js, .jsx, .ts, .tsx → JavaScript/TypeScript
.py → Python
Others → Generic mode
```

### Long Method Detection

**JavaScript/TypeScript Algorithm**:
1. Search for function definitions using regex patterns
2. Track opening and closing braces
3. Count lines within brace pairs
4. Flag methods exceeding 50 lines (MAJOR) or 75 lines (CRITICAL)

**Python Algorithm**:
1. Identify function definitions using `def` keyword
2. Track indentation levels for scope boundaries
3. Count lines within same indentation level
4. Apply same thresholds as JavaScript

### Large Class Detection

**Approach**:
1. Locate class definitions using regex pattern matching
2. Count lines within class body
3. Count number of methods in class
4. Flag if lines > 200 OR methods > 20

### Code Duplication Detection

**Algorithm**:
1. Normalize code (remove whitespace variations)
2. Compare code segments using string matching
3. Flag identical blocks at different locations
4. Report suspicious patterns

### Parameter List Analysis

**Detection**:
1. Extract function signatures
2. Count parameter count
3. Flag if JavaScript: parameters > 5, Python: parameters > 4

### Dead Code Detection

**Approach**:
1. Identify variable declarations using regex
2. Track variable usage throughout scope
3. Flag variables declared but never referenced
4. Exclude common patterns (exports, declarations)

---

## Results and Metrics

### Metric Calculations

The tool provides several metrics to evaluate code quality:

| Metric | Calculation | Significance |
|--------|-------------|--------------|
| **Total Lines** | Count of all lines in code | Code volume |
| **Files Scanned** | Number of files analyzed | Analysis scope |
| **Total Code Smells** | Sum of all detected issues | Overall quality |
| **Average Complexity** | Smells per 100 lines | Relative density |
| **Refactor Candidates** | Classes/methods needing work | Priority items |
| **Severity Distribution** | Count by severity level | Risk assessment |

### Sample Output Analysis

For a typical 250-line JavaScript file:
- **Detected Smells**: 12
- **Critical Issues**: 2 (Long methods)
- **Major Issues**: 6 (Large classes, long parameter lists)
- **Minor Issues**: 4 (Duplicate code, comments)

---

## Limitations and Future Enhancements

### Current Limitations

1. **Language Support**: Currently supports JavaScript/TypeScript and Python only. Extension to Java, C#, Go, and other languages would expand utility.

2. **Detection Accuracy**: Pattern-based detection has false positives/negatives compared to full AST (Abstract Syntax Tree) analysis.

3. **Semantic Analysis**: Cannot perform deep semantic analysis (e.g., detecting Feature Envy requires understanding object relationships beyond syntax).

4. **Context Awareness**: Detection rules are applied uniformly; doesn't account for different coding patterns or domains.

5. **Performance**: Large files (>10,000 lines) may experience slower analysis.

6. **Configuration**: No user-customizable thresholds; all detection parameters are hardcoded.

### Recommended Enhancements

#### Short-term Improvements
1. **Customizable Thresholds**: Allow users to adjust detection thresholds for their coding standards
2. **More Languages**: Add support for Java, C#, Python (enhanced), Ruby, Go
3. **AST-based Analysis**: Implement proper parsing using language-specific parsers for more accurate detection
4. **Configuration File**: Support `.smellrc` or similar config files for project-specific settings
5. **Incremental Analysis**: Cache results and only re-analyze changed files

#### Medium-term Enhancements
1. **Integration with IDEs**: VS Code extension, IntelliJ plugin
2. **CI/CD Integration**: GitHub Actions, GitLab CI, Jenkins plugins
3. **Comparison Reports**: Track code quality changes over time
4. **Automated Refactoring Suggestions**: Provide code snippets for fixing detected issues
5. **Team Collaboration**: Comments and discussions on smell details

#### Long-term Vision
1. **Machine Learning**: Train models to identify patterns from high-quality codebases
2. **Architectural Analysis**: Detect architectural smells at system level
3. **Test Coverage Integration**: Correlate code smells with test coverage
4. **Performance Impact Assessment**: Estimate how smells affect performance
5. **Automated Fixing**: AI-powered automatic refactoring suggestions

---

## Conclusion

The Code Smell Detection Website successfully implements an automated tool for identifying code quality issues in JavaScript and Python projects. By leveraging pattern-based static analysis and heuristic thresholds, the tool provides developers and QA engineers with actionable insights into code maintainability.

The web-based architecture makes the tool accessible to non-technical users while maintaining robust backend processing capabilities. The categorization of smells into five established categories helps users understand the nature of issues and prioritize refactoring efforts based on severity.

While the current implementation has limitations in semantic understanding and configurability, it provides a solid foundation for future enhancements including broader language support, IDE integration, and CI/CD pipeline integration. The modular design enables easy extension and customization for specific project needs.

### Key Achievements

✓ Automated detection of multiple code smell types  
✓ Multi-language support (JavaScript, TypeScript, Python)  
✓ User-friendly web interface with intuitive navigation  
✓ Comprehensive reporting with severity classification  
✓ PDF export for documentation and sharing  
✓ Real-time analysis without complex setup  

### Recommendations for Users

1. **Regular Scanning**: Use the tool as part of regular code review process
2. **Priority Management**: Focus on CRITICAL and MAJOR severity issues first
3. **Threshold Tuning**: Consider your project's standards when evaluating MINOR issues
4. **Team Standards**: Establish team guidelines for acceptable code smell thresholds
5. **Refactoring Planning**: Use reports to plan refactoring sprints and improve code quality

---

## Appendix: Technology References

### Technologies Used
- **Next.js**: https://nextjs.org
- **React**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com
- **ESLint**: https://eslint.org

### References
- Fowler, M. (2018). *Refactoring: Improving the Design of Existing Code* (2nd ed.)
- Martin, R. C. (2008). *Clean Code: A Handbook of Agile Software Craftsmanship*
- W3C Standards: HTML5, CSS3, JavaScript ES2020+

### Document Information
- **Project Name**: Code Smell Detection Website
- **Version**: 1.0.0
- **Date**: December 2025
- **Course**: Software Requirements Engineering (SRE)
- **Semester**: 7

---

*End of Report*
