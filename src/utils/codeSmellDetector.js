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
    const functionRegex = /(?:function|=>|(?:async\s+)?function\*?)\s*(?:\w+)?\s*\(([^)]*)\)\s*\{/g;
    let match;
    let functionCount = 0;

    while ((match = functionRegex.exec(this.code)) !== null) {
      const startIndex = this.code.lastIndexOf("\n", match.index);
      const startLine = this.code.substring(0, startIndex).split("\n").length + 1;
      
      // Count lines in function body
      let braceCount = 1;
      let endIndex = match.index + match[0].length;
      let lineCount = 1;

      for (let i = endIndex; i < this.code.length && braceCount > 0; i++) {
        if (this.code[i] === "{") braceCount++;
        if (this.code[i] === "}") braceCount--;
        if (this.code[i] === "\n") lineCount++;
      }

      if (lineCount > 30) {
        const functionName = match[0].match(/\w+/)?.[0] || "anonymous";
        this.addSmell(
          "Long Method",
          `Function "${functionName}" is ${lineCount} lines long (threshold: 30)`,
          startLine,
          "BLOATERS",
          "CRITICAL"
        );
        functionCount++;
      }
    }
  }

  detectLargeClass() {
    const classRegex = /class\s+(\w+)\s*(?:extends\s+\w+)?\s*\{/g;
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

  detectDataClumps() {
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
      const propertyCount = (classBody.match(/this\.\w+\s*=/g) || []).length;

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
    // Detect when a method uses more features of another object
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

  // Utility methods
  addSmell(type, description, line, category, severity) {
    // Avoid duplicates
    const isDuplicate = this.smells.some(
      (s) => s.type === type && s.description === description
    );

    if (!isDuplicate) {
      this.smells.push({
        id: `smell-${this.smells.length + 1}`,
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
