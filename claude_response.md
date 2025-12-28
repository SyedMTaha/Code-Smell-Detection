# Complete Code Smell Detection Guide

## Overview
This guide provides comprehensive detection algorithms, AST patterns, thresholds, and implementation strategies for detecting code smells in Python and JavaScript.

---

## 1. AST-Based Detection Framework

### Python AST Analysis Setup
```python
import ast

class ASTAnalyzer(ast.NodeVisitor):
    def __init__(self):
        self.metrics = {}
        self.current_class = None
        self.current_function = None
    
    def visit_ClassDef(self, node):
        self.current_class = node.name
        # Analyze class
        self.generic_visit(node)
        self.current_class = None
    
    def visit_FunctionDef(self, node):
        self.current_function = node.name
        # Analyze function
        self.generic_visit(node)
        self.current_function = None
```

### JavaScript AST Analysis (using Acorn/Esprima)
```javascript
const acorn = require('acorn');
const walk = require('acorn-walk');

function analyzeJavaScript(code) {
    const ast = acorn.parse(code, { ecmaVersion: 2020, sourceType: 'module' });
    
    walk.full(ast, node => {
        // Analyze each node
        if (node.type === 'FunctionDeclaration') {
            // Analyze function
        }
    });
}
```

---

## 2. Detailed Detection Algorithms

### 2.1 Long Method Detection

**Algorithm:**
```
1. Parse function/method node
2. Calculate effective LOC (excluding comments, blank lines)
3. Count logical statements
4. Calculate cyclomatic complexity
5. If LOC > threshold OR complexity > threshold:
   - Flag as code smell
   - Severity = f(excess_amount)
```

**Python Implementation:**
```python
def detect_long_method(node, source_lines):
    start, end = node.lineno, node.end_lineno
    
    # Count actual code lines
    code_lines = 0
    for i in range(start - 1, end):
        line = source_lines[i].strip()
        if line and not line.startswith('#'):
            code_lines += 1
    
    # Calculate cyclomatic complexity
    complexity = calculate_cyclomatic_complexity(node)
    
    # Thresholds
    LOC_THRESHOLD = 50
    COMPLEXITY_THRESHOLD = 10
    
    if code_lines > LOC_THRESHOLD:
        severity = 'high' if code_lines > LOC_THRESHOLD * 1.5 else 'medium'
        return CodeSmell(
            type='LongMethod',
            line=start,
            severity=severity,
            description=f'{code_lines} lines, complexity {complexity}'
        )
```

**JavaScript Pattern:**
```javascript
function detectLongMethod(node) {
    const lines = node.loc.end.line - node.loc.start.line + 1;
    const complexity = calculateComplexity(node);
    
    if (lines > 50 || complexity > 10) {
        return {
            type: 'LongMethod',
            severity: lines > 75 ? 'high' : 'medium',
            suggestion: 'Break into smaller functions'
        };
    }
}
```

**AST Patterns to Look For:**
- `ast.FunctionDef`, `ast.AsyncFunctionDef` (Python)
- `FunctionDeclaration`, `FunctionExpression`, `ArrowFunctionExpression` (JavaScript)

**False Positive Scenarios:**
1. **Test functions**: Often legitimately long
   - Solution: Check for test decorators or file paths
2. **Generated code**: Auto-generated boilerplate
   - Solution: Check for generation markers in comments
3. **Configuration functions**: Setup with many parameters
   - Solution: Check parameter patterns

**Recommended Thresholds:**
- Methods: 30-50 lines
- Functions: 50-75 lines
- Test functions: 100 lines
- Cyclomatic complexity: 10

---

### 2.2 God Object Detection

**Algorithm:**
```
1. For each class, calculate:
   - Number of methods (M)
   - Number of attributes (A)
   - Lines of code (L)
   - Number of dependencies (D)
   - Average cyclomatic complexity (C)
2. God Score = (M * 2) + (A * 1.5) + (L * 0.1) + (D * 3) + (C * 0.5)
3. If Score > threshold: Flag as God Object
```

**Python Implementation:**
```python
def detect_god_object(class_node, ast_tree):
    methods = [n for n in class_node.body 
               if isinstance(n, (ast.FunctionDef, ast.AsyncFunctionDef))]
    
    # Count attributes
    attributes = set()
    for method in methods:
        for node in ast.walk(method):
            if isinstance(node, ast.Attribute):
                if isinstance(node.value, ast.Name) and node.value.id == 'self':
                    attributes.add(node.attr)
    
    # Count dependencies (imported/used classes)
    dependencies = set()
    for method in methods:
        for node in ast.walk(method):
            if isinstance(node, ast.Call):
                if isinstance(node.func, ast.Attribute):
                    if hasattr(node.func.value, 'id'):
                        dependencies.add(node.func.value.id)
    
    # Calculate metrics
    M = len(methods)
    A = len(attributes)
    L = (class_node.end_lineno - class_node.lineno)
    D = len(dependencies)
    C = sum(calculate_cyclomatic_complexity(m) for m in methods) / max(M, 1)
    
    god_score = (M * 2) + (A * 1.5) + (L * 0.1) + (D * 3) + (C * 0.5)
    
    if god_score > 100:
        return CodeSmell(
            type='GodObject',
            severity='critical',
            description=f'God Object score: {god_score:.1f}',
            confidence=0.85
        )
```

**JavaScript Pattern:**
```javascript
function detectGodObject(classNode) {
    const methods = classNode.body.body.filter(
        n => n.type === 'MethodDefinition'
    );
    
    const score = 
        methods.length * 2 +
        countProperties(classNode) * 1.5 +
        calculateLOC(classNode) * 0.1 +
        countDependencies(classNode) * 3;
    
    return score > 100 ? { type: 'GodObject', score } : null;
}
```

---

### 2.3 Feature Envy Detection

**Algorithm:**
```
1. For each method in class:
   - Count accesses to own class (self/this)
   - Count accesses to each external class
2. If max(external_accesses) > own_accesses:
   - Calculate confidence based on ratio
   - Flag as Feature Envy
```

**Python Implementation:**
```python
def detect_feature_envy(method_node, class_name):
    self_accesses = 0
    other_accesses = defaultdict(int)
    
    for node in ast.walk(method_node):
        if isinstance(node, ast.Attribute):
            if isinstance(node.value, ast.Name):
                if node.value.id == 'self':
                    self_accesses += 1
                else:
                    other_accesses[node.value.id] += 1
    
    if not other_accesses:
        return None
    
    max_other = max(other_accesses.values())
    envied_class = max(other_accesses, key=other_accesses.get)
    
    if max_other > self_accesses and max_other >= 3:
        confidence = min(0.9, max_other / (self_accesses + max_other))
        return CodeSmell(
            type='FeatureEnvy',
            description=f'Method uses {envied_class} more than own class',
            confidence=confidence
        )
```

**False Positives:**
1. **Utility methods**: Legitimately operate on passed objects
   - Solution: Check if method is static or has minimal state
2. **Adapters/Decorators**: Designed to work with other objects
   - Solution: Check class name patterns (Adapter, Decorator, Wrapper)

---

### 2.4 Data Clumps Detection

**Algorithm:**
```
1. Extract parameter lists from all functions
2. Find parameter groups that appear together in 3+ functions
3. Minimum group size: 3 parameters
4. Flag as data clump if found
```

**Python Implementation:**
```python
from itertools import combinations

def detect_data_clumps(functions):
    param_occurrences = defaultdict(list)
    
    for func in functions:
        params = [arg.arg for arg in func.args.args 
                  if arg.arg not in ('self', 'cls')]
        
        if len(params) >= 3:
            # Check all 3-parameter combinations
            for combo in combinations(sorted(params), 3):
                param_occurrences[combo].append((func.name, func.lineno))
    
    clumps = []
    for params, occurrences in param_occurrences.items():
        if len(occurrences) >= 3:
            clumps.append({
                'params': params,
                'occurrences': occurrences,
                'severity': 'medium' if len(occurrences) < 5 else 'high'
            })
    
    return clumps
```

**JavaScript Pattern:**
```javascript
function detectDataClumps(functions) {
    const paramGroups = new Map();
    
    functions.forEach(func => {
        const params = func.params.map(p => p.name).sort();
        if (params.length >= 3) {
            const key = params.slice(0, 3).join(',');
            if (!paramGroups.has(key)) {
                paramGroups.set(key, []);
            }
            paramGroups.get(key).push(func.name);
        }
    });
    
    return Array.from(paramGroups.entries())
        .filter(([_, funcs]) => funcs.length >= 3);
}
```

---

### 2.5 Message Chains Detection

**Algorithm:**
```
1. Traverse AST looking for chained attribute accesses
2. Count depth: a.b.c.d = depth 4
3. If depth > threshold (typically 3): Flag
```

**Python Implementation:**
```python
def get_chain_length(node):
    """Calculate length of method/attribute chain"""
    if not isinstance(node, ast.Attribute):
        return 0
    
    length = 1
    current = node.value
    
    while isinstance(current, ast.Attribute):
        length += 1
        current = current.value
    
    return length

def detect_message_chains(ast_tree):
    chains = []
    
    for node in ast.walk(ast_tree):
        chain_length = get_chain_length(node)
        
        if chain_length > 3:
            chains.append(CodeSmell(
                type='MessageChains',
                line=node.lineno,
                severity='medium' if chain_length < 5 else 'high',
                description=f'Method chain of length {chain_length}',
                suggestion='Use Law of Demeter: introduce intermediate methods'
            ))
    
    return chains
```

**JavaScript Pattern:**
```javascript
function detectMessageChains(node) {
    let depth = 0;
    let current = node;
    
    while (current.type === 'MemberExpression') {
        depth++;
        current = current.object;
    }
    
    if (depth > 3) {
        return {
            type: 'MessageChains',
            depth: depth,
            suggestion: 'Hide delegate or extract method'
        };
    }
}
```

---

### 2.6 Cyclomatic Complexity Calculation

**Algorithm (McCabe's):**
```
Complexity = E - N + 2P
Where:
  E = number of edges in control flow graph
  N = number of nodes
  P = number of connected components

Simplified:
Complexity = 1 + number of decision points
Decision points: if, elif, for, while, and, or, except, with
```

**Python Implementation:**
```python
def calculate_cyclomatic_complexity(node):
    """Calculate McCabe cyclomatic complexity"""
    complexity = 1  # Base complexity
    
    for child in ast.walk(node):
        # Decision points
        if isinstance(child, (ast.If, ast.While, ast.For, ast.AsyncFor)):
            complexity += 1
        elif isinstance(child, ast.BoolOp):
            # Each 'and'/'or' adds a decision point
            complexity += len(child.values) - 1
        elif isinstance(child, ast.ExceptHandler):
            complexity += 1
        elif isinstance(child, ast.With):
            complexity += 1
    
    return complexity
```

**JavaScript Implementation:**
```javascript
function calculateComplexity(node) {
    let complexity = 1;
    
    walk.simple(node, {
        IfStatement() { complexity++; },
        ForStatement() { complexity++; },
        WhileStatement() { complexity++; },
        ConditionalExpression() { complexity++; },
        LogicalExpression() { complexity++; },
        SwitchCase(node) { if (node.test) complexity++; },
        CatchClause() { complexity++; }
    });
    
    return complexity;
}
```

---

### 2.7 Deep Nesting Detection

**Algorithm:**
```
1. Track nesting depth while traversing function body
2. Increment on: if, for, while, try, with
3. Decrement when exiting block
4. Record maximum depth
5. If max_depth > threshold: Flag
```

**Python Implementation:**
```python
def calculate_nesting_depth(node, current_depth=0):
    """Calculate maximum nesting depth in function"""
    max_depth = current_depth
    
    for child in ast.iter_child_nodes(node):
        new_depth = current_depth
        
        # Increment depth for nested structures
        if isinstance(child, (ast.If, ast.For, ast.While, 
                             ast.With, ast.Try, ast.AsyncFor, ast.AsyncWith)):
            new_depth = current_depth + 1
        
        # Recursively calculate depth
        child_depth = calculate_nesting_depth(child, new_depth)
        max_depth = max(max_depth, child_depth)
    
    return max_depth

def detect_deep_nesting(function_node):
    depth = calculate_nesting_depth(function_node)
    
    if depth > 4:
        return CodeSmell(
            type='DeepNesting',
            severity='high' if depth > 6 else 'medium',
            description=f'Nesting depth: {depth}',
            suggestion='Use early returns, extract methods, or flatten conditionals'
        )
```

---

### 2.8 Duplicate Code Detection

**Algorithm (Token-based):**
```
1. Tokenize source code
2. Create sliding window of N tokens
3. Hash each window
4. Find duplicate hashes
5. Verify actual code similarity
6. Report duplicates with location
```

**Python Implementation:**
```python
import hashlib

def detect_duplicate_code(source_code, min_lines=6):
    lines = source_code.split('\n')
    duplicates = defaultdict(list)
    
    # Create sliding window of lines
    for i in range(len(lines) - min_lines + 1):
        window = []
        for j in range(i, min(i + min_lines, len(lines))):
            line = lines[j].strip()
            # Skip comments and blank lines
            if line and not line.startswith('#'):
                window.append(line)
        
        if len(window) >= min_lines:
            # Create hash of code block
            block_hash = hashlib.md5(
                '\n'.join(window).encode()
            ).hexdigest()
            duplicates[block_hash].append((i + 1, window))
    
    # Find actual duplicates
    results = []
    for block_hash, occurrences in duplicates.items():
        if len(occurrences) >= 2:
            results.append({
                'lines': [occ[0] for occ in occurrences],
                'code': occurrences[0][1],
                'count': len(occurrences)
            })
    
    return results
```

**Advanced: AST-based Clone Detection:**
```python
def ast_similarity(node1, node2):
    """Calculate structural similarity between AST nodes"""
    if type(node1) != type(node2):
        return 0.0
    
    if isinstance(node1, ast.AST):
        children1 = list(ast.iter_child_nodes(node1))
        children2 = list(ast.iter_child_nodes(node2))
        
        if len(children1) != len(children2):
            return 0.5  # Structural match but different size
        
        if not children1:
            return 1.0
        
        similarities = [
            ast_similarity(c1, c2) 
            for c1, c2 in zip(children1, children2)
        ]
        return sum(similarities) / len(similarities)
    
    return 1.0 if node1 == node2 else 0.0
```

---

## 3. JavaScript-Specific Patterns

### 3.1 Callback Hell Detection

**Pattern:**
```javascript
// Callback hell pattern
function callbackHell() {
    asyncOp1(function(result1) {
        asyncOp2(result1, function(result2) {
            asyncOp3(result2, function(result3) {
                asyncOp4(result3, function(result4) {
                    // Too deep!
                });
            });
        });
    });
}
```

**Detection Algorithm:**
```javascript
function detectCallbackHell(node) {
    let maxDepth = 0;
    
    function countCallbackDepth(node, depth = 0) {
        if (node.type === 'FunctionExpression' || 
            node.type === 'ArrowFunctionExpression') {
            maxDepth = Math.max(maxDepth, depth);
            
            walk.simple(node.body, {
                CallExpression(callNode) {
                    callNode.arguments.forEach(arg => {
                        if (arg.type === 'FunctionExpression' || 
                            arg.type === 'ArrowFunctionExpression') {
                            countCallbackDepth(arg, depth + 1);
                        }
                    });
                }
            });
        }
    }
    
    countCallbackDepth(node);
    
    if (maxDepth > 3) {
        return {
            type: 'CallbackHell',
            depth: maxDepth,
            suggestion: 'Use Promises or async/await'
        };
    }
}
```

### 3.2 Promise Chain Detection

**Pattern:**
```javascript
// Long promise chain
fetch(url)
    .then(r => r.json())
    .then(data => process(data))
    .then(result => transform(result))
    .then(final => save(final))
    .catch(handleError);
```

**Detection:**
```javascript
function detectLongPromiseChain(node) {
    let chainLength = 0;
    let current = node;
    
    while (current.type === 'CallExpression' &&
           current.callee.type === 'MemberExpression' &&
           (current.callee.property.name === 'then' ||
            current.callee.property.name === 'catch')) {
        chainLength++;
        current = current.callee.object;
    }
    
    if (chainLength > 4) {
        return {
            type: 'LongPromiseChain',
            length: chainLength,
            suggestion: 'Break into smaller functions or use async/await'
        };
    }
}
```

### 3.3 Memory Leak Detection (Closures)

**Pattern:**
```javascript
// Memory leak: closure holding large object
function createLeak() {
    const largeData = new Array(1000000);
    
    return function() {
        // Closure keeps largeData in memory
        console.log(largeData.length);
    };
}
```

**Detection:**
```javascript
function detectClosureLeak(node) {
    const largeAllocations = [];
    const closures = [];
    
    walk.simple(node, {
        VariableDeclarator(varNode) {
            if (varNode.init && varNode.init.type === 'NewExpression') {
                if (varNode.init.callee.name === 'Array' &&
                    varNode.init.arguments[0]?.value > 100000) {
                    largeAllocations.push(varNode.id.name);
                }
            }
        },
        FunctionExpression(funcNode) {
            closures.push(funcNode);
        }
    });
    
    // Check if closures reference large allocations
    for (const closure of closures) {
        for (const varName of largeAllocations) {
            if (referencesVariable(closure, varName)) {
                return {
                    type: 'PotentialMemoryLeak',
                    variable: varName,
                    suggestion: 'Nullify large objects when done'
                };
            }
        }
    }
}
```

---

## 4. Performance Optimization Strategies

### 4.1 Caching AST Parsing

```python
import functools
import hashlib

class ASTCache:
    def __init__(self, max_size=1000):
        self.cache = {}
        self.max_size = max_size
    
    def get_ast(self, source_code):
        # Create hash of source code
        code_hash = hashlib.sha256(source_code.encode()).hexdigest()
        
        if code_hash in self.cache:
            return self.cache[code_hash]
        
        # Parse and cache
        ast_tree = ast.parse(source_code)
        
        # Limit cache size
        if len(self.cache) >= self.max_size:
            # Remove oldest entry
            self.cache.pop(next(iter(self.cache)))
        
        self.cache[code_hash] = ast_tree
        return ast_tree
```

### 4.2 Incremental Analysis

```python
class IncrementalAnalyzer:
    def __init__(self):
        self.file_hashes = {}
        self.cached_results = {}
    
    def analyze_changed_files(self, files):
        results = {}
        
        for filepath, content in files.items():
            content_hash = hashlib.md5(content.encode()).hexdigest()
            
            # Check if file changed
            if filepath in self.file_hashes:
                if self.file_hashes[filepath] == content_hash:
                    # Use cached result
                    results[filepath] = self.cached_results[filepath]
                    continue
            
            # Analyze file
            smells = analyze_file(content)
            
            # Cache results
            self.file_hashes[filepath] = content_hash
            self.cached_results[filepath] = smells
            results[filepath] = smells
        
        return results
```

### 4.3 Parallel Processing

```python
from concurrent.futures import ProcessPoolExecutor
import multiprocessing

def analyze_codebase_parallel(files, max_workers=None):
    if max_workers is None:
        max_workers = multiprocessing.cpu_count()
    
    with ProcessPoolExecutor(max_workers=max_workers) as executor:
        futures = {
            executor.submit(analyze_file, content): filepath
            for filepath, content in files.items()
        }
        
        results = {}
        for future in concurrent.futures.as_completed(futures):
            filepath = futures[future]
            try:
                results[filepath] = future.result()
            except Exception as e:
                results[filepath] = {'error': str(e)}
        
        return results
```

---

## 5. Configuration and Thresholds

### Recommended Threshold Values

```json
{
  "methods": {
    "max_lines": 50,
    "max_complexity": 10,
    "max_parameters": 5,
    "max_nesting": 4
  },
  "classes": {
    "max_methods": 20,
    "max_attributes": 15,
    "max_inheritance_depth": 3,
    "min_methods_for_existence": 2
  },
  "code_structure": {
    "max_method_chain": 3,
    "max_duplicate_lines": 6,
    "max_boolean_operators": 3
  },
  "coupling": {
    "max_dependencies": 10,
    "max_god_object_score": 100
  }
}
```

### Adaptive Thresholds

```python
class AdaptiveThresholds:
    def __init__(self, codebase_stats):
        self.base_thresholds = DEFAULT_THRESHOLDS
        self.adjust_for_codebase(codebase_stats)
    
    def adjust_for_codebase(self, stats):
        # Adjust based on codebase size and style
        avg_method_length = stats['avg_method_length']
        
        if avg_method_length > 60:
            # Legacy codebase with long methods
            self.base_thresholds['max_method_lines'] = avg_method_length * 1.5
        
        # Adjust other thresholds similarly
```

---

## 6. False Positive Reduction

### Context-Aware Analysis

```python
def is_test_file(filepath):
    return 'test' in filepath.lower() or filepath.endswith('_test.py')

def should_apply_smell(smell, context):
    # Test files have different standards
    if context['is_test']:
        if smell.type in ('LongMethod', 'DuplicateCode'):
            return False
    
    # Generated files
    if context['is_generated']:
        return False
    
    # Configuration files can have long parameter lists
    if context['is_config'] and smell.type == 'LongParameterList':
        return False
    
    return True
```

### Machine Learning-Based Filtering

```python
from sklearn.ensemble import RandomForestClassifier

class MLSmellFilter:
    def __init__(self):
        self.model = RandomForestClassifier()
        self.trained = False
    
    def train(self, labeled_smells):
        X = [self.extract_features(smell) for smell, label in labeled_smells]
        y = [label for smell, label in labeled_smells]
        self.model.fit(X, y)
        self.trained = True
    
    def extract_features(self, smell):
        return [
            smell.line,
            len(smell.description),
            smell.confidence,
            # Add more features
        ]
    
    def is_true_positive(self, smell):
        if not self.trained:
            return True
        
        features = self.extract_features(smell)
        return self.model.predict([features])[0] == 1
```

---

## 7. Integration Example

```python
# Complete usage example
from code_smell_detector import PythonCodeSmellDetector

# Initialize detector with custom thresholds
detector = PythonCodeSmellDetector({
    'max_method_lines': 40,
    'max_parameters': 4
})

# Analyze code
with open('mycode.py', 'r') as f:
    source_code = f.read()

smells = detector.analyze(source_code)

# Filter and report
critical_smells = [s for s in smells if s.severity == 'critical']
print(f"Found {len(critical_smells)} critical code smells")

# Generate report
for smell in smells:
    print(f"{smell.line}: {smell.type} - {smell.description}")
    print(f"  Suggestion: {smell.suggestion}")
```

This guide provides the foundation for building a robust code smell detection system. Each algorithm can be further refined based on your specific needs and codebase characteristics.