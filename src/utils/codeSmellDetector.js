/**
 * Code Smell Detection Utility
 * Detects various code smells across different categories
 */

export class CodeSmellDetector {
  constructor(code, fileName = "unknown") {
    this.code = code;
    this.fileName = fileName;
    this.lines = code.split("\n");
    this.smells = [];
    this.metrics = {
      filesScanned: 1,
      totalLines: this.lines.length,
      avgComplexity: 0,
      refactorCandidates: 0,
    };
  }

  analyze() {
    this.detectBloaters();
    this.detectObjectOrientationAbusers();
    this.detectChangePreventers();
    this.detectDispensables();
    this.detectCouplers();
    this.calculateMetrics();
    return this.generateReport();
  }

  // BLOATERS CATEGORY
  detectBloaters() {
    this.detectLongMethods();
    this.detectLargeClass();
    this.detectPrimitiveObsession();
    this.detectLongParameterList();
    this.detectDataClumps();
  }

  detectLongMethods() {
    // Detect language based on file extension
    const isPython = this.fileName.endsWith('.py');
    const isJavaScript = this.fileName.endsWith('.js') || this.fileName.endsWith('.jsx') || this.fileName.endsWith('.ts') || this.fileName.endsWith('.tsx');

    if (isPython) {
      this.detectPythonLongMethods();
    } else if (isJavaScript) {
      this.detectJavaScriptLongMethods();
    } else {
      this.detectGenericLongMethods();
    }
  }

  detectPythonLongMethods() {
    const pythonFunctionRegex = /^( *)def\s+(\w+)\s*\(.*\):/;
    let inFunction = false;
    let currentFunctionName = '';
    let currentFunctionStartLine = 0;
    let currentFunctionLines = 0;
    let currentIndent = '';

    for (let i = 0; i < this.lines.length; i++) {
      const line = this.lines[i];
      const currentLineNum = i + 1;

      // Check for function definition
      const funcMatch = line.match(pythonFunctionRegex);
      if (funcMatch) {
        // If we were already in a function, check if it was too long
        if (inFunction) {
          if (currentFunctionLines > 50) {  // Threshold: 50 lines
            this.addSmell(
              "Long Method",
              `Function ${currentFunctionName} is too long: ${currentFunctionLines} lines`,
              currentFunctionStartLine,
              "BLOATERS",
              currentFunctionLines > 75 ? "CRITICAL" : "MAJOR"
            );
          }
        }

        // Start tracking new function
        inFunction = true;
        currentFunctionName = funcMatch[2];
        currentFunctionStartLine = currentLineNum;
        currentFunctionLines = 1;
        currentIndent = funcMatch[1];
      } else if (inFunction) {
        // If we're in a function, check if we've exited it
        const currentIndentLevel = line.match(/^ */)[0];
        // If the line is not empty and the indentation is less than or equal to function's indentation, we've exited
        if (line.trim() !== '' && currentIndentLevel.length <= currentIndent.length) {
          // Check if the last function was too long
          if (currentFunctionLines > 50) {
            this.addSmell(
              "Long Method",
              `Function ${currentFunctionName} is too long: ${currentFunctionLines} lines`,
              currentFunctionStartLine,
              "BLOATERS",
              currentFunctionLines > 75 ? "CRITICAL" : "MAJOR"
            );
          }
          inFunction = false;
        } else {
          currentFunctionLines++;
        }
      }
    }

    // Check the last function if it was too long
    if (inFunction && currentFunctionLines > 50) {
      this.addSmell(
        "Long Method",
        `Function ${currentFunctionName} is too long: ${currentFunctionLines} lines`,
        currentFunctionStartLine,
        "BLOATERS",
        currentFunctionLines > 75 ? "CRITICAL" : "MAJOR"
      );
    }
  }

  detectJavaScriptLongMethods() {
    const jsFunctionRegex = /\b(function\s+\w+\s*\(|const\s+\w+\s*=\s*function|let\s+\w+\s*=\s*function|var\s+\w+\s*=\s*function|\w+\s*[:=]\s*function|\w+\s*=\s*\([^)]*\)\s*=>)/;
    let inFunction = false;
    let currentFunctionName = '';
    let currentFunctionStartLine = 0;
    let currentFunctionLines = 0;
    let braceDepth = 0;

    for (let i = 0; i < this.lines.length; i++) {
      const line = this.lines[i];
      const currentLineNum = i + 1;

      // Check for function definition patterns
      if (line.trim().match(jsFunctionRegex)) {
        // If we were already in a function, check if it was too long
        if (inFunction) {
          if (currentFunctionLines > 50) {  // Threshold: 50 lines
            this.addSmell(
              "Long Method",
              `Function ${currentFunctionName} is too long: ${currentFunctionLines} lines`,
              currentFunctionStartLine,
              "BLOATERS",
              currentFunctionLines > 75 ? "CRITICAL" : "MAJOR"
            );
          }
        }

        // Extract function name
        const nameMatch = line.match(/\b(?:function|const|let|var)\s+(\w+)|(\w+)\s*[:=]/);
        currentFunctionName = nameMatch ? (nameMatch[1] || nameMatch[2]) : 'anonymous';
        currentFunctionStartLine = currentLineNum;
        currentFunctionLines = 1;
        inFunction = true;
        braceDepth = 0;

        // Count opening braces in the function definition line
        const openBraces = (line.match(/{/g) || []).length;
        braceDepth += openBraces;
      } else if (inFunction) {
        currentFunctionLines++;

        // Count braces to track when function ends
        const openBraces = (line.match(/{/g) || []).length;
        const closeBraces = (line.match(/}/g) || []).length;
        braceDepth += openBraces - closeBraces;

        // If brace depth goes to 0, we've exited the function
        if (braceDepth <= 0) {
          if (currentFunctionLines > 50) {
            this.addSmell(
              "Long Method",
              `Function ${currentFunctionName} is too long: ${currentFunctionLines} lines`,
              currentFunctionStartLine,
              "BLOATERS",
              currentFunctionLines > 75 ? "CRITICAL" : "MAJOR"
            );
          }
          inFunction = false;
        }
      }
    }

    // Check the last function if it was too long
    if (inFunction && currentFunctionLines > 50) {
      this.addSmell(
        "Long Method",
        `Function ${currentFunctionName} is too long: ${currentFunctionLines} lines`,
        currentFunctionStartLine,
        "BLOATERS",
        currentFunctionLines > 75 ? "CRITICAL" : "MAJOR"
      );
    }
  }

  detectGenericLongMethods() {
    // Basic long method detection for other languages
    let currentMethodLines = 0;
    let methodStartLine = 0;

    for (let i = 0; i < this.lines.length; i++) {
      const line = this.lines[i].trim();
      const currentLineNum = i + 1;

      if (line && !line.startsWith('/') && !line.startsWith('*') && !line.startsWith('#')) {
        currentMethodLines++;

        if (currentMethodLines === 1) {
          methodStartLine = currentLineNum;
        }

        if (currentMethodLines > 50) {  // Threshold: 50 lines
          this.addSmell(
            "Long Method",
            `Method is too long: ${currentMethodLines} lines`,
            methodStartLine,
            "BLOATERS",
            currentMethodLines > 75 ? "CRITICAL" : "MAJOR"
          );
          currentMethodLines = 0; // Reset for next potential method
        }
      } else {
        // If we hit a comment/empty line, reset if we're at the end of a potential method block
        if (currentMethodLines > 0 && currentMethodLines <= 50) {
          currentMethodLines = 0;
        }
      }
    }
  }

  detectLargeClass() {
    // Detect language based on file extension
    const isPython = this.fileName.endsWith('.py');
    const isJavaScript = this.fileName.endsWith('.js') || this.fileName.endsWith('.jsx') || this.fileName.endsWith('.ts') || this.fileName.endsWith('.tsx');

    if (isPython) {
      this.detectPythonLargeClass();
    } else if (isJavaScript) {
      this.detectJavaScriptLargeClass();
    } else {
      this.detectGenericLargeClass();
    }
  }

  detectPythonLargeClass() {
    const classRegex = /^( *)class\s+(\w+)/;
    let inClass = false;
    let currentClassName = '';
    let classStartLine = 0;
    let classLineCount = 0;
    let classMethodCount = 0;

    for (let i = 0; i < this.lines.length; i++) {
      const line = this.lines[i];
      const currentLineNum = i + 1;

      const classMatch = line.match(classRegex);
      if (classMatch) {
        if (inClass) {
          // End previous class and check if it was too large
          if (classLineCount > 200 || classMethodCount > 20) {  // Thresholds: 200 lines or 20 methods
            this.addSmell(
              "Large Class",
              `Class ${currentClassName} is too large: ${classLineCount} lines, ${classMethodCount} methods`,
              classStartLine,
              "BLOATERS",
              "MAJOR"
            );
          }
        }

        inClass = true;
        currentClassName = classMatch[2];
        classStartLine = currentLineNum;
        classLineCount = 1;
        classMethodCount = 0;
      } else if (inClass) {
        const currentIndentLevel = line.match(/^ */)[0];
        if (line.trim() !== '' && currentIndentLevel.length <= classMatch[1].length) {
          // Check if class was too large
          if (classLineCount > 200 || classMethodCount > 20) {
            this.addSmell(
              "Large Class",
              `Class ${currentClassName} is too large: ${classLineCount} lines, ${classMethodCount} methods`,
              classStartLine,
              "BLOATERS",
              "MAJOR"
            );
          }
          inClass = false;
        } else {
          classLineCount++;
          if (line.trim().startsWith('def ')) {
            classMethodCount++;
          }
        }
      }
    }

    // Check the last class if it was too large
    if (inClass && (classLineCount > 200 || classMethodCount > 20)) {
      this.addSmell(
        "Large Class",
        `Class ${currentClassName} is too large: ${classLineCount} lines, ${classMethodCount} methods`,
        classStartLine,
        "BLOATERS",
        "MAJOR"
      );
    }
  }

  detectJavaScriptLargeClass() {
    const classRegex = /class\s+(\w+)/g;
    let match;

    while ((match = classRegex.exec(this.code)) !== null) {
      const className = match[1];
      const classStart = match.index;
      let braceCount = 1;
      let classBodyLength = 0;

      for (let i = classStart + match[0].length; i < this.code.length && braceCount > 0; i++) {
        if (this.code[i] === "{") braceCount++;
        if (this.code[i] === "}") braceCount--;
        classBodyLength++;
      }

      const lineCount = this.code.substring(classStart, classStart + classBodyLength).split("\n").length;

      if (lineCount > 200) {
        this.addSmell(
          "Large Class",
          `Class "${className}" is ${lineCount} lines (threshold: 200). Too many responsibilities.`,
          this.code.substring(0, classStart).split("\n").length,
          "BLOATERS",
          "MAJOR"
        );
      }
    }
  }

  detectGenericLargeClass() {
    // Fallback for other languages
    const classRegex = /class\s+(\w+)\s*\{/g;
    let match;

    while ((match = classRegex.exec(this.code)) !== null) {
      const className = match[1];
      const classStart = match.index;
      let braceCount = 1;
      let classBodyLength = 0;

      for (let i = classStart + match[0].length; i < this.code.length && braceCount > 0; i++) {
        if (this.code[i] === "{") braceCount++;
        if (this.code[i] === "}") braceCount--;
        classBodyLength++;
      }

      const lineCount = this.code.substring(classStart, classStart + classBodyLength).split("\n").length;

      if (lineCount > 200) {
        this.addSmell(
          "Large Class",
          `Class "${className}" is ${lineCount} lines (threshold: 200). Too many responsibilities.`,
          this.code.substring(0, classStart).split("\n").length,
          "BLOATERS",
          "MAJOR"
        );
      }
    }
  }

  detectPrimitiveObsession() {
    // Detect excessive use of primitive types instead of objects
    const primitivePatterns = [
      { regex: /let\s+\w+\s*=\s*\{\s*\w+:\s*\d+\s*,\s*\w+:\s*\d+\s*,\s*\w+:\s*\d+/g, type: "numeric properties" },
      { regex: /let\s+\w+\s*=\s*\{\s*\w+:\s*['"][^'"]*['"]\s*,\s*\w+:\s*['"][^'"]*['"]\s*,\s*\w+:\s*['"][^'"]*['"]/g, type: "string properties" },
    ];

    primitivePatterns.forEach((pattern) => {
      let match;
      while ((match = pattern.regex.exec(this.code)) !== null) {
        this.addSmell(
          "Primitive Obsession",
          `Use of multiple ${pattern.type} instead of creating a proper object`,
          this.code.substring(0, match.index).split("\n").length,
          "BLOATERS",
          "MINOR"
        );
      }
    });
  }

  detectLongParameterList() {
    // Detect language based on file extension
    const isPython = this.fileName.endsWith('.py');
    const isJavaScript = this.fileName.endsWith('.js') || this.fileName.endsWith('.jsx') || this.fileName.endsWith('.ts') || this.fileName.endsWith('.tsx');

    if (isPython) {
      this.detectPythonLongParameterList();
    } else if (isJavaScript) {
      this.detectJavaScriptLongParameterList();
    } else {
      this.detectGenericLongParameterList();
    }
  }

  detectPythonLongParameterList() {
    for (let i = 0; i < this.lines.length; i++) {
      const line = this.lines[i];
      const currentLineNum = i + 1;

      const funcMatch = line.match(/def\s+(\w+)\s*\((.*)\):/);
      if (funcMatch) {
        const paramsStr = funcMatch[2];
        if (paramsStr) {
          const params = paramsStr.split(',').filter(p => p.trim() !== '' && p.trim() !== '*args' && p.trim() !== '**kwargs').length;
          if (params > 5) {  // Threshold: 5 parameters
            this.addSmell(
              "Long Parameter List",
              `Function ${funcMatch[1]} has ${params} parameters`,
              currentLineNum,
              "BLOATERS",
              params > 8 ? "MAJOR" : "MINOR"
            );
          }
        }
      }
    }
  }

  detectJavaScriptLongParameterList() {
    // Detect functions with too many parameters
    const functionRegex = /function\s+\w+\s*\(([^)]*)\)/g;
    let match;

    while ((match = functionRegex.exec(this.code)) !== null) {
      const params = match[1].split(",").filter((p) => p.trim().length > 0);

      if (params.length > 5) {
        const functionName = match[0].match(/\w+/)?.[1] || "anonymous";
        this.addSmell(
          "Long Parameter List",
          `Function "${functionName}" has ${params.length} parameters (threshold: 5)`,
          this.code.substring(0, match.index).split("\n").length,
          "BLOATERS",
          "MAJOR"
        );
      }
    }
  }

  detectGenericLongParameterList() {
    // Generic parameter detection for other languages
    const functionRegex = /function\s+\w+\s*\(([^)]*)\)/g;
    let match;

    while ((match = functionRegex.exec(this.code)) !== null) {
      const params = match[1].split(",").filter((p) => p.trim().length > 0);

      if (params.length > 5) {
        const functionName = match[0].match(/\w+/)?.[1] || "anonymous";
        this.addSmell(
          "Long Parameter List",
          `Function "${functionName}" has ${params.length} parameters (threshold: 5)`,
          this.code.substring(0, match.index).split("\n").length,
          "BLOATERS",
          "MAJOR"
        );
      }
    }
  }

  detectDataClumps() {
    // Detect language based on file extension
    const isPython = this.fileName.endsWith('.py');
    const isJavaScript = this.fileName.endsWith('.js') || this.fileName.endsWith('.jsx') || this.fileName.endsWith('.ts') || this.fileName.endsWith('.tsx');

    if (isPython) {
      this.detectPythonDataClumps();
    } else if (isJavaScript) {
      this.detectJavaScriptDataClumps();
    } else {
      this.detectGenericDataClumps();
    }
  }

  detectPythonDataClumps() {
    // Python-specific data clumps detection
    const paramGroups = new Map();
    const pythonFunctionRegex = /def\s+(\w+)\s*\((.*)\):/;

    for (let i = 0; i < this.lines.length; i++) {
      const line = this.lines[i];
      const funcMatch = line.match(pythonFunctionRegex);
      
      if (funcMatch) {
        const funcName = funcMatch[1];
        const paramsStr = funcMatch[2];
        if (paramsStr) {
          const params = paramsStr.split(',').map(p => p.trim()).filter(p => p !== '' && p !== '*args' && p !== '**kwargs');
          if (params.length >= 3) {
            // Create a key from the parameter names (sorted for consistency)
            const paramKey = params.sort().join(',');
            if (!paramGroups.has(paramKey)) {
              paramGroups.set(paramKey, []);
            }
            paramGroups.get(paramKey).push(funcName);
          }
        }
      }
    }

    // Find parameter groups that appear in multiple functions
    for (const [paramKey, funcNames] of paramGroups.entries()) {
      if (funcNames.length >= 3) {  // Threshold: 3+ functions
        this.addSmell(
          "Data Clump",
          `Parameters [${paramKey}] appear together in ${funcNames.length} functions. Consider grouping them in a class or object.`,
          1,  // Line number placeholder
          "BLOATERS",
          "MINOR"
        );
      }
    }
  }

  detectJavaScriptDataClumps() {
    // JavaScript-specific data clumps detection
    const paramGroups = new Map();
    const jsFunctionRegex = /function\s+(\w+)\s*\(([^)]*)\)|const\s+(\w+)\s*=\s*\(([^)]*)\)/;

    for (let i = 0; i < this.lines.length; i++) {
      const line = this.lines[i];
      const funcMatch = line.match(jsFunctionRegex);
      
      if (funcMatch) {
        const funcName = funcMatch[1] || funcMatch[3];
        const paramsStr = funcMatch[2] || funcMatch[4];
        if (paramsStr) {
          const params = paramsStr.split(',').map(p => p.trim()).filter(p => p !== '');
          if (params.length >= 3) {
            // Create a key from the parameter names (sorted for consistency)
            const paramKey = params.sort().join(',');
            if (!paramGroups.has(paramKey)) {
              paramGroups.set(paramKey, []);
            }
            paramGroups.get(paramKey).push(funcName);
          }
        }
      }
    }

    // Find parameter groups that appear in multiple functions
    for (const [paramKey, funcNames] of paramGroups.entries()) {
      if (funcNames.length >= 3) {  // Threshold: 3+ functions
        this.addSmell(
          "Data Clump",
          `Parameters [${paramKey}] appear together in ${funcNames.length} functions. Consider grouping them in a class or object.`,
          1,  // Line number placeholder
          "BLOATERS",
          "MINOR"
        );
      }
    }
  }

  detectGenericDataClumps() {
    // Detect when same group of variables appear together in multiple places
    const structurePatterns = [
      /(\w+)\s*=\s*\d+\s*;\s*(\w+)\s*=\s*\d+\s*;\s*(\w+)\s*=\s*['"][^'"]*['"]/g,
    ];

    structurePatterns.forEach((pattern) => {
      const matches = [...this.code.matchAll(pattern)];

      if (matches.length > 2) {
        this.addSmell(
          "Data Clumps",
          `Variables appear together in ${matches.length} places. Consider grouping them in a class or object.`,
          this.code.substring(0, matches[0].index).split("\n").length,
          "BLOATERS",
          "MINOR"
        );
      }
    });
  }

  // OBJECT-ORIENTATION ABUSERS
  detectObjectOrientationAbusers() {
    this.detectSwitchStatements();
    this.detectTemporaryFields();
    this.detectRefusedBequest();
    this.detectAlternativeClasses();
  }

  detectSwitchStatements() {
    // Detect long or multiple switch statements
    const switchRegex = /switch\s*\(([^)]+)\)\s*\{/g;
    let match;
    let switchCount = 0;

    while ((match = switchRegex.exec(this.code)) !== null) {
      switchCount++;
      const startIndex = match.index;
      let braceCount = 1;
      let switchLength = match[0].length;

      for (let i = startIndex + match[0].length; i < this.code.length && braceCount > 0; i++) {
        if (this.code[i] === "{") braceCount++;
        if (this.code[i] === "}") braceCount--;
        switchLength++;
      }

      const caseCount = this.code.substring(startIndex, startIndex + switchLength).match(/case\s+/g)?.length || 0;

      if (caseCount > 5) {
        this.addSmell(
          "Switch Statements",
          `Switch statement with ${caseCount} cases. Consider using polymorphism instead.`,
          this.code.substring(0, startIndex).split("\n").length,
          "OBJECT-ORIENTATION_ABUSERS",
          "MAJOR"
        );
      }
    }

    if (switchCount > 3) {
      this.addSmell(
        "Switch Statements",
        `Found ${switchCount} switch statements. Replace with polymorphism or strategy pattern.`,
        1,
        "OBJECT-ORIENTATION_ABUSERS",
        "MAJOR"
      );
    }
  }

  detectTemporaryFields() {
    // Detect fields that are only used in certain conditions
    const fieldUsageRegex = /this\.(\w+)\s*=/g;
    const fields = {};
    let match;

    while ((match = fieldUsageRegex.exec(this.code)) !== null) {
      const fieldName = match[1];
      if (!fields[fieldName]) fields[fieldName] = 0;
      fields[fieldName]++;
    }

    for (const [field, count] of Object.entries(fields)) {
      if (count === 1) {
        this.addSmell(
          "Temporary Field",
          `Field "${field}" is only assigned once. Consider making it a local variable instead.`,
          1,
          "OBJECT-ORIENTATION_ABUSERS",
          "MINOR"
        );
      }
    }
  }

  detectRefusedBequest() {
    // Detect when subclass doesn't use inherited methods
    const classRegex = /class\s+(\w+)\s+extends\s+(\w+)\s*\{/g;
    let match;

    while ((match = classRegex.exec(this.code)) !== null) {
      const childClass = match[1];
      const parentClass = match[2];
      
      // Simple detection: if child class overrides most methods
      const methodCount = (this.code.match(/\w+\s*\([^)]*\)\s*\{/g) || []).length;
      
      if (methodCount > 10) {
        this.addSmell(
          "Refused Bequest",
          `Class "${childClass}" may not be using methods from parent class "${parentClass}".`,
          this.code.substring(0, match.index).split("\n").length,
          "OBJECT-ORIENTATION_ABUSERS",
          "MINOR"
        );
      }
    }
  }

  detectAlternativeClasses() {
    // Detect classes with similar method names but different interfaces
    const methodRegex = /(?:class\s+(\w+)|(\w+)\s*\([^)]*\)\s*\{)/g;
    const classMethods = {};
    let currentClass = null;
    let match;

    while ((match = methodRegex.exec(this.code)) !== null) {
      if (match[1]) currentClass = match[1];
      if (currentClass && match[2]) {
        if (!classMethods[currentClass]) classMethods[currentClass] = [];
        classMethods[currentClass].push(match[2]);
      }
    }

    // Check for similar patterns
    const classes = Object.keys(classMethods);
    for (let i = 0; i < classes.length - 1; i++) {
      const similarity = classMethods[classes[i]].filter((m) => 
        classMethods[classes[i + 1]]?.includes(m)
      ).length;

      if (similarity > 0.7 * classMethods[classes[i]].length) {
        this.addSmell(
          "Alternative Classes with Different Interfaces",
          `Classes "${classes[i]}" and "${classes[i + 1]}" have similar functionality.`,
          1,
          "OBJECT-ORIENTATION_ABUSERS",
          "MAJOR"
        );
      }
    }
  }

  // CHANGE PREVENTERS
  detectChangePreventers() {
    this.detectDivergentChange();
    this.detectParallelInheritanceHierarchies();
    this.detectShotgunSurgery();
  }

  detectDivergentChange() {
    // Detect when a class needs to change for multiple reasons
    const classRegex = /class\s+(\w+)\s*\{([\s\S]*?)\n\s*\}/g;
    let match;

    while ((match = classRegex.exec(this.code)) !== null) {
      const className = match[1];
      const classBody = match[2];
      
      // Count different types of responsibilities
      const hasDataPersistence = /save|fetch|query|database|db\./i.test(classBody);
      const hasBusinessLogic = /calculate|process|validate|compute/i.test(classBody);
      const hasUILogic = /render|display|show|hide|dom|element/i.test(classBody);

      const responsibilities = [hasDataPersistence, hasBusinessLogic, hasUILogic].filter(Boolean).length;

      if (responsibilities > 2) {
        this.addSmell(
          "Divergent Change",
          `Class "${className}" has ${responsibilities} different reasons to change (SRP violation).`,
          this.code.substring(0, match.index).split("\n").length,
          "CHANGE_PREVENTERS",
          "CRITICAL"
        );
      }
    }
  }

  detectParallelInheritanceHierarchies() {
    // Detect when creating a subclass requires creating another subclass
    const classRegex = /class\s+(\w+)\s+extends\s+(\w+)/g;
    const hierarchies = {};
    let match;

    while ((match = classRegex.exec(this.code)) !== null) {
      const child = match[1];
      const parent = match[2];
      if (!hierarchies[parent]) hierarchies[parent] = [];
      hierarchies[parent].push(child);
    }

    for (const [parent, children] of Object.entries(hierarchies)) {
      if (children.length > 2) {
        this.addSmell(
          "Parallel Inheritance Hierarchies",
          `Excessive parallel class hierarchies under "${parent}".`,
          1,
          "CHANGE_PREVENTERS",
          "MAJOR"
        );
      }
    }
  }

  detectShotgunSurgery() {
    // Detect when making a change requires changes in many places
    const codePatterns = [
      { pattern: /if\s*\(\w+\.type\s*===?\s*['"][^'"]*['"]\)/g, name: "type checks" },
      { pattern: /\.status\s*===?\s*['"][^'"]*['"]/g, name: "status checks" },
    ];

    codePatterns.forEach(({ pattern, name }) => {
      const matches = [...this.code.matchAll(pattern)];
      if (matches.length > 4) {
        this.addSmell(
          "Shotgun Surgery",
          `Found ${matches.length} scattered ${name} across the code. Centralize this logic.`,
          1,
          "CHANGE_PREVENTERS",
          "MAJOR"
        );
      }
    });
  }

  // DISPENSABLES
  detectDispensables() {
    this.detectDuplicateCode();
    this.detectDeadCode();
    this.detectLazyClass();
    this.detectDataClass();
    this.detectComments();
    this.detectSpeculativeGenerality();
  }

  detectDuplicateCode() {
    // Language-specific duplicate detection
    const isPython = this.fileName.endsWith('.py');
    const isJavaScript = this.fileName.endsWith('.js') || this.fileName.endsWith('.jsx') || this.fileName.endsWith('.ts') || this.fileName.endsWith('.tsx');

    if (isPython) {
      this.detectPythonDuplicateCode();
    } else if (isJavaScript) {
      this.detectJavaScriptDuplicateCode();
    } else {
      this.detectGenericDuplicateCode();
    }
  }

  detectPythonDuplicateCode() {
    // Python-specific duplicate code detection
    const blocks = [];
    const minBlockSize = 6; // Minimum 6 lines to consider as a block

    for (let i = 0; i < this.lines.length - minBlockSize; i++) {
      const block = [];
      for (let j = 0; j < minBlockSize; j++) {
        const line = this.lines[i + j].trim();
        // Skip comments and empty lines
        if (line && !line.startsWith('#')) {
          block.push(line);
        }
      }
      
      if (block.length >= minBlockSize) {
        const blockStr = block.join(' ').trim();
        if (blockStr) {
          blocks.push({ content: blockStr, line: i + 1 });
        }
      }
    }

    // Find duplicate blocks
    const blockCounts = {};
    blocks.forEach(block => {
      if (!blockCounts[block.content]) {
        blockCounts[block.content] = [];
      }
      blockCounts[block.content].push(block.line);
    });

    for (const [content, lineNumbers] of Object.entries(blockCounts)) {
      if (lineNumbers.length >= 2) {
        this.addSmell(
          "Duplicate Code",
          `Duplicate code block found at lines ${lineNumbers.join(', ')}`,
          lineNumbers[0],
          "DISPENSABLES",
          "MINOR"
        );
      }
    }
  }

  detectJavaScriptDuplicateCode() {
    // JavaScript-specific duplicate code detection
    const blocks = [];
    const minBlockSize = 6; // Minimum 6 lines to consider as a block

    for (let i = 0; i < this.lines.length - minBlockSize; i++) {
      const block = [];
      for (let j = 0; j < minBlockSize; j++) {
        const line = this.lines[i + j].trim();
        // Skip comments and empty lines
        if (line && !line.startsWith('//') && !line.startsWith('/*') && !line.startsWith('*')) {
          block.push(line);
        }
      }
      
      if (block.length >= minBlockSize) {
        const blockStr = block.join(' ').trim();
        if (blockStr) {
          blocks.push({ content: blockStr, line: i + 1 });
        }
      }
    }

    // Find duplicate blocks
    const blockCounts = {};
    blocks.forEach(block => {
      if (!blockCounts[block.content]) {
        blockCounts[block.content] = [];
      }
      blockCounts[block.content].push(block.line);
    });

    for (const [content, lineNumbers] of Object.entries(blockCounts)) {
      if (lineNumbers.length >= 2) {
        this.addSmell(
          "Duplicate Code",
          `Duplicate code block found at lines ${lineNumbers.join(', ')}`,
          lineNumbers[0],
          "DISPENSABLES",
          "MINOR"
        );
      }
    }
  }

  detectGenericDuplicateCode() {
    // Simple duplicate detection - look for repeated code blocks
    const lines = this.code.split("\n").map((l) => l.trim()).filter((l) => l.length > 20);
    const seen = {};

    lines.forEach((line, idx) => {
      if (seen[line]) {
        this.addSmell(
          "Duplicate Code",
          `Code duplication detected at line ${idx + 1}. Extract to a common function.`,
          idx + 1,
          "DISPENSABLES",
          "MINOR"
        );
      }
      seen[line] = true;
    });
  }

  detectDeadCode() {
    // Detect unused variables and functions
    const unusedVars = [];
    const declaredVars = [...this.code.matchAll(/(?:let|const|var)\s+(\w+)/g)];
    
    declaredVars.forEach((match) => {
      const varName = match[1];
      const afterDeclaration = this.code.substring(match.index + match[0].length);
      
      // Simple check: if variable is declared but never used again
      if (!new RegExp(`\\b${varName}\\b`).test(afterDeclaration)) {
        unusedVars.push({
          name: varName,
          line: this.code.substring(0, match.index).split("\n").length,
        });
      }
    });

    unusedVars.forEach(({ name, line }) => {
      this.addSmell(
        "Dead Code",
        `Variable "${name}" is declared but never used.`,
        line,
        "DISPENSABLES",
        "MINOR"
      );
    });
  }

  detectLazyClass() {
    // Detect classes that don't do much
    const classRegex = /class\s+(\w+)\s*\{([\s\S]*?)\n\s*\}/g;
    let match;

    while ((match = classRegex.exec(this.code)) !== null) {
      const className = match[1];
      const classBody = match[2];
      const methodCount = (classBody.match(/\w+\s*\([^)]*\)\s*\{/g) || []).length;
      const propertyCount = (classBody.match(/(?:this\.)?(\w+)\s*=/g) || []).length;

      if (methodCount < 2 && propertyCount < 3) {
        this.addSmell(
          "Lazy Class",
          `Class "${className}" has minimal functionality. Consider removing it.`,
          this.code.substring(0, match.index).split("\n").length,
          "DISPENSABLES",
          "MINOR"
        );
      }
    }
  }

  detectDataClass() {
    // Detect classes that only hold data without behavior
    const classRegex = /class\s+(\w+)\s*\{([\s\S]*?)\n\s*\}/g;
    let match;

    while ((match = classRegex.exec(this.code)) !== null) {
      const className = match[1];
      const classBody = match[2];
      const methodCount = (classBody.match(/\w+\s*\([^)]*\)\s*\{/g) || []).length;
      const propertyCount = (classBody.match(/this\.(\w+)\s*=/g) || []).length;

      if (methodCount <= 2 && propertyCount > 5) {
        this.addSmell(
          "Data Class",
          `Class "${className}" is just a data container. Move business logic here or use a plain object.`,
          this.code.substring(0, match.index).split("\n").length,
          "DISPENSABLES",
          "MINOR"
        );
      }
    }
  }

  detectComments() {
    // Detect excessive comments (usually indicates unclear code)
    const commentCount = (this.code.match(/\/\//g) || []).length;
    const blockCommentCount = (this.code.match(/\/\*/g) || []).length;
    const totalComments = commentCount + blockCommentCount;
    const totalLines = this.lines.length;

    if (totalComments > totalLines * 0.3) {
      this.addSmell(
        "Comments",
        `Excessive comments (${totalComments}) suggest unclear code. Refactor for clarity.`,
        1,
        "DISPENSABLES",
        "MINOR"
      );
    }
  }

  detectSpeculativeGenerality() {
    // Detect unused parameters and abstract methods
    const functionRegex = /function\s+\w+\s*\(([^)]*)\)\s*\{([\s\S]*?)\n\s*\}/g;
    let match;

    while ((match = functionRegex.exec(this.code)) !== null) {
      const params = match[1].split(",").filter((p) => p.trim());
      const body = match[2];

      params.forEach((param) => {
        const paramName = param.trim().split("=")[0].trim();
        if (!body.includes(paramName)) {
          this.addSmell(
            "Speculative Generality",
            `Unused parameter "${paramName}". Remove or implement its usage.`,
            this.code.substring(0, match.index).split("\n").length,
            "DISPENSABLES",
            "MINOR"
          );
        }
      });
    }
  }

  // COUPLERS
  detectCouplers() {
    this.detectFeatureEnvy();
    this.detectInappropriateIntimacy();
    this.detectMessageChains();
    this.detectMiddleMan();
  }

  detectFeatureEnvy() {
    // Detect language based on file extension
    const isPython = this.fileName.endsWith('.py');
    const isJavaScript = this.fileName.endsWith('.js') || this.fileName.endsWith('.jsx') || this.fileName.endsWith('.ts') || this.fileName.endsWith('.tsx');

    if (isPython) {
      this.detectPythonFeatureEnvy();
    } else if (isJavaScript) {
      this.detectJavaScriptFeatureEnvy();
    } else {
      this.detectGenericFeatureEnvy();
    }
  }

  detectPythonFeatureEnvy() {
    // Python-specific feature envy detection
    const pythonFunctionRegex = /^( *)def\s+(\w+)\s*\(/;
    let inFunction = false;
    let currentFunctionName = '';
    let currentFunctionStartLine = 0;
    let selfAccesses = 0;
    let otherAccesses = 0;

    for (let i = 0; i < this.lines.length; i++) {
      const line = this.lines[i];
      const currentLineNum = i + 1;

      // Check for function definition
      const funcMatch = line.match(pythonFunctionRegex);
      if (funcMatch) {
        // If we were in a function, check if it showed feature envy
        if (inFunction && otherAccesses > 0 && otherAccesses > selfAccesses && otherAccesses >= 3) {
          this.addSmell(
            "Feature Envy",
            `Function ${currentFunctionName} uses other object's data more than its own (${otherAccesses} vs ${selfAccesses})`,
            currentFunctionStartLine,
            "COUPLERS",
            "MAJOR"
          );
        }

        // Start tracking new function
        inFunction = true;
        currentFunctionName = funcMatch[2];
        currentFunctionStartLine = currentLineNum;
        selfAccesses = 0;
        otherAccesses = 0;
      } else if (inFunction) {
        // Look for patterns like 'other_obj.method()' or 'other_obj.property'
        const selfMatches = line.match(/\bself\.(\w+)/g) || [];
        const otherMatches = line.match(/\b(?!self\b|cls\b)\w+\.(\w+)/g) || [];

        selfAccesses += selfMatches.length;
        otherAccesses += otherMatches.length;

        // If the line is not empty and the indentation is less than function's indentation, we've exited
        const currentIndentLevel = line.match(/^ */)[0];
        if (line.trim() !== '' && currentIndentLevel.length < funcMatch[1].length) {
          // Check if function showed feature envy
          if (otherAccesses > 0 && otherAccesses > selfAccesses && otherAccesses >= 3) {
            this.addSmell(
              "Feature Envy",
              `Function ${currentFunctionName} uses other object's data more than its own (${otherAccesses} vs ${selfAccesses})`,
              currentFunctionStartLine,
              "COUPLERS",
              "MAJOR"
            );
          }
          inFunction = false;
        }
      }
    }

    // Check the last function if it showed feature envy
    if (inFunction && otherAccesses > 0 && otherAccesses > selfAccesses && otherAccesses >= 3) {
      this.addSmell(
        "Feature Envy",
        `Function ${currentFunctionName} uses other object's data more than its own (${otherAccesses} vs ${selfAccesses})`,
        currentFunctionStartLine,
        "COUPLERS",
        "MAJOR"
      );
    }
  }

  detectJavaScriptFeatureEnvy() {
    // JavaScript-specific feature envy detection
    const methodRegex = /(\w+)\s*\([^)]*\)\s*\{([\s\S]*?)\n\s*\}/g;
    let match;

    while ((match = methodRegex.exec(this.code)) !== null) {
      const methodName = match[1];
      const methodBody = match[2];
      const thisAccesses = (methodBody.match(/\bthis\.\w+/g) || []).length;
      const otherAccesses = (methodBody.match(/\b(?!this\b)\w+\.\w+/g) || []).length;

      if (otherAccesses > 0 && otherAccesses > thisAccesses && otherAccesses >= 3) {
        this.addSmell(
          "Feature Envy",
          `Method "${methodName}" uses another object's data more than its own (${otherAccesses} vs ${thisAccesses})`,
          this.code.substring(0, match.index).split("\n").length,
          "COUPLERS",
          "MAJOR"
        );
      }
    }
  }

  detectGenericFeatureEnvy() {
    // Generic feature envy detection
    const methodRegex = /(\w+)\s*\([^)]*\)\s*\{([\s\S]*?)\n\s*\}/g;
    let match;

    while ((match = methodRegex.exec(this.code)) !== null) {
      const methodName = match[1];
      const methodBody = match[2];
      const objectAccessCount = (methodBody.match(/\w+\.\w+/g) || []).length;

      if (objectAccessCount > 5) {
        this.addSmell(
          "Feature Envy",
          `Method "${methodName}" is too interested in another object's data. Consider moving it.`,
          this.code.substring(0, match.index).split("\n").length,
          "COUPLERS",
          "MAJOR"
        );
      }
    }
  }

  detectInappropriateIntimacy() {
    // Detect excessive access between classes
    const privateAccessCount = (this.code.match(/\w+\.__\w+/g) || []).length;
    const protectedAccessCount = (this.code.match(/\w+\._\w+/g) || []).length;

    if (privateAccessCount > 2 || protectedAccessCount > 3) {
      this.addSmell(
        "Inappropriate Intimacy",
        `Classes are accessing each other's private members excessively.`,
        1,
        "COUPLERS",
        "MAJOR"
      );
    }
  }

  detectMessageChains() {
    // Detect language based on file extension
    const isPython = this.fileName.endsWith('.py');
    const isJavaScript = this.fileName.endsWith('.js') || this.fileName.endsWith('.jsx') || this.fileName.endsWith('.ts') || this.fileName.endsWith('.tsx');

    if (isPython) {
      this.detectPythonMessageChains();
    } else if (isJavaScript) {
      this.detectJavaScriptMessageChains();
    } else {
      this.detectGenericMessageChains();
    }
  }

  detectPythonMessageChains() {
    // Python-specific message chains detection
    for (let i = 0; i < this.lines.length; i++) {
      const line = this.lines[i];
      const currentLineNum = i + 1;

      // Look for patterns like obj.method1().method2().method3()
      const chainMatches = line.match(/\b\w+((\.\w+){3,})/g); // At least 3 method calls
      if (chainMatches) {
        for (const match of chainMatches) {
          const chainLength = (match.match(/\./g) || []).length;
          if (chainLength >= 3) {
            this.addSmell(
              "Message Chains",
              `Long method chain of ${chainLength} calls`,
              currentLineNum,
              "COUPLERS",
              chainLength > 5 ? "MAJOR" : "MINOR"
            );
          }
        }
      }
    }
  }

  detectJavaScriptMessageChains() {
    // JavaScript-specific message chains detection
    // Detect long method chains
    const chainRegex = /\w+(?:\.\w+){4,}/g;
    const matches = [...this.code.matchAll(chainRegex)];

    if (matches.length > 0) {
      matches.forEach((match) => {
        this.addSmell(
          "Message Chains",
          `Long message chain detected: "${match[0]}". Break it down into smaller steps.`,
          this.code.substring(0, match.index).split("\n").length,
          "COUPLERS",
          "MAJOR"
        );
      });
    }
  }

  detectGenericMessageChains() {
    // Generic message chains detection
    const chainRegex = /\w+(?:\.\w+){4,}/g;
    const matches = [...this.code.matchAll(chainRegex)];

    if (matches.length > 0) {
      matches.forEach((match) => {
        this.addSmell(
          "Message Chains",
          `Long message chain detected: "${match[0]}". Break it down into smaller steps.`,
          this.code.substring(0, match.index).split("\n").length,
          "COUPLERS",
          "MAJOR"
        );
      });
    }
  }

  detectMiddleMan() {
    // Detect excessive delegation
    const methodRegex = /(\w+)\s*\([^)]*\)\s*\{([\s\S]*?)\n\s*\}/g;
    let match;
    let delegationCount = 0;

    while ((match = methodRegex.exec(this.code)) !== null) {
      const methodBody = match[2];
      const returnStatements = (methodBody.match(/return\s+\w+\.\w+/g) || []).length;

      if (returnStatements > 0 && methodBody.split("\n").length < 5) {
        delegationCount++;
      }
    }

    if (delegationCount > 3) {
      this.addSmell(
        "Middle Man",
        `Multiple methods just delegate to other objects. Simplify or remove.`,
        1,
        "COUPLERS",
        "MINOR"
      );
    }
  }

  // JavaScript-specific additional detections
  detectJavaScriptSpecificSmells() {
    if (this.fileName.endsWith('.js') || this.fileName.endsWith('.jsx') || this.fileName.endsWith('.ts') || this.fileName.endsWith('.tsx')) {
      this.detectCallbackHell();
      this.detectLongPromiseChain();
    }
  }

  detectCallbackHell() {
    // Look for nested function calls that might indicate callback hell
    for (let i = 0; i < this.lines.length; i++) {
      const line = this.lines[i].trim();
      const currentLineNum = i + 1;

      // Check for nested anonymous functions (potential callback hell)
      const nestedFuncs = (line.match(/function\s*\(|=>|function\s+\w+\s*\(/g) || []).length;
      if (nestedFuncs > 3) {
        this.addSmell(
          "Callback Hell",
          `Potential callback hell with ${nestedFuncs} nested functions`,
          currentLineNum,
          "JAVASCRIPT_SPECIFIC",
          "MAJOR"
        );
      }
    }
  }

  detectLongPromiseChain() {
    let promiseChainLength = 0;
    let chainStartLine = 0;

    for (let i = 0; i < this.lines.length; i++) {
      const line = this.lines[i].trim();
      const currentLineNum = i + 1;

      if (line.endsWith('.then(') || line.endsWith('.catch(') || line.endsWith('.finally(')) {
        if (promiseChainLength === 0) {
          chainStartLine = currentLineNum;
        }
        promiseChainLength++;
      } else if (promiseChainLength > 0 && !line.startsWith('.') && !line.endsWith(')')) {
        // End of chain
        if (promiseChainLength > 4) {  // Threshold: 4 chain links
          this.addSmell(
            "Long Promise Chain",
            `Long promise chain with ${promiseChainLength} links`,
            chainStartLine,
            "JAVASCRIPT_SPECIFIC",
            "MINOR"
          );
        }
        promiseChainLength = 0;
      }
    }

    // Check for remaining chain at end of file
    if (promiseChainLength > 4) {
      this.addSmell(
        "Long Promise Chain",
        `Long promise chain with ${promiseChainLength} links`,
        chainStartLine,
        "JAVASCRIPT_SPECIFIC",
        "MINOR"
      );
    }
  }

  // Utility methods
  addSmell(type, description, line, category, severity) {
    // Avoid duplicates
    const isDuplicate = this.smells.some(
      (s) => s.type === type && s.description === description && s.line === line
    );

    if (!isDuplicate) {
      this.smells.push({
        id: `smell-${Date.now()}-${this.smells.length + 1}`,
        type,
        description,
        line: Math.max(1, line),
        file: this.fileName,
        category,
        severity,
      });
    }
  }

  calculateMetrics() {
    const severityCounts = {
      CRITICAL: 0,
      MAJOR: 0,
      MINOR: 0,
    };

    this.smells.forEach((smell) => {
      severityCounts[smell.severity]++;
    });

    this.metrics.refactorCandidates = Math.ceil(this.smells.length / 3);
    this.metrics.avgComplexity = Math.min(10, this.smells.length / 2);
    this.metrics.severityCounts = severityCounts;
  }

  generateReport() {
    const categories = {};
    this.smells.forEach((smell) => {
      if (!categories[smell.category]) categories[smell.category] = [];
      categories[smell.category].push(smell);
    });

    return {
      fileName: this.fileName,
      totalSmells: this.smells.length,
      smells: this.smells,
      categories,
      metrics: this.metrics,
      timestamp: new Date().toISOString(),
    };
  }
}

export default CodeSmellDetector;