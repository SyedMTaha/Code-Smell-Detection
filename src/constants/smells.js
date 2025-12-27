/**
 * Code Smell Categories and Metadata
 * Defines all code smell types with their details for filtering and display
 */

export const SMELL_CATEGORIES = {
  BLOATERS: 'Bloaters',
  OBJECT_ORIENTED_ABUSERS: 'Object-Oriented Abusers',
  CHANGE_PREVENTERS: 'Change Preventers',
  DISPENSABLES: 'Dispensables',
  COUPLERS: 'Couplers',
};

export const SMELL_TYPES = {
  // Bloaters
  LONG_METHOD: {
    id: 'long-method',
    name: 'Long Method',
    category: SMELL_CATEGORIES.BLOATERS,
    description: 'Method is too long and handles too many responsibilities',
    severity: 'warning',
  },
  LARGE_CLASS: {
    id: 'large-class',
    name: 'Large Class',
    category: SMELL_CATEGORIES.BLOATERS,
    description: 'Class is doing too many things and has too many responsibilities',
    severity: 'critical',
  },
  PRIMITIVE_OBSESSION: {
    id: 'primitive-obsession',
    name: 'Primitive Obsession',
    category: SMELL_CATEGORIES.BLOATERS,
    description: 'Using primitives instead of small objects for simple tasks',
    severity: 'info',
  },
  LONG_PARAMETER_LIST: {
    id: 'long-parameter-list',
    name: 'Long Parameter List',
    category: SMELL_CATEGORIES.BLOATERS,
    description: 'Method has too many parameters, making it hard to use and maintain',
    severity: 'warning',
  },
  DATA_CLUMPS: {
    id: 'data-clumps',
    name: 'Data Clumps',
    category: SMELL_CATEGORIES.BLOATERS,
    description: 'Same group of variables appear together in multiple places',
    severity: 'warning',
  },

  // Object-Oriented Abusers
  SWITCH_STATEMENTS: {
    id: 'switch-statements',
    name: 'Switch Statements',
    category: SMELL_CATEGORIES.OBJECT_ORIENTED_ABUSERS,
    description: 'Complex switch statements that should be replaced with polymorphism',
    severity: 'warning',
  },
  PARALLEL_INHERITANCE: {
    id: 'parallel-inheritance',
    name: 'Parallel Inheritance Hierarchies',
    category: SMELL_CATEGORIES.OBJECT_ORIENTED_ABUSERS,
    description: 'Creating subclasses in parallel for different classes',
    severity: 'info',
  },
  LAZY_CLASS: {
    id: 'lazy-class',
    name: 'Lazy Class',
    category: SMELL_CATEGORIES.OBJECT_ORIENTED_ABUSERS,
    description: 'Class is not doing enough to justify its existence',
    severity: 'info',
  },
  SPECULATIVE_GENERALITY: {
    id: 'speculative-generality',
    name: 'Speculative Generality',
    category: SMELL_CATEGORIES.OBJECT_ORIENTED_ABUSERS,
    description: 'Created unused abstractions for "just in case" scenarios',
    severity: 'info',
  },

  // Change Preventers
  DIVERGENT_CHANGE: {
    id: 'divergent-change',
    name: 'Divergent Change',
    category: SMELL_CATEGORIES.CHANGE_PREVENTERS,
    description: 'One class is commonly changed in different ways for different reasons',
    severity: 'critical',
  },
  SHOTGUN_SURGERY: {
    id: 'shotgun-surgery',
    name: 'Shotgun Surgery',
    category: SMELL_CATEGORIES.CHANGE_PREVENTERS,
    description: 'One change requires modifying many different classes',
    severity: 'critical',
  },
  FEATURE_ENVY: {
    id: 'feature-envy',
    name: 'Feature Envy',
    category: SMELL_CATEGORIES.CHANGE_PREVENTERS,
    description: 'Method uses more features of another class than its own',
    severity: 'warning',
  },

  // Dispensables
  DEAD_CODE: {
    id: 'dead-code',
    name: 'Dead Code',
    category: SMELL_CATEGORIES.DISPENSABLES,
    description: 'Unreachable code that should be removed',
    severity: 'info',
  },
  DUPLICATE_CODE: {
    id: 'duplicate-code',
    name: 'Duplicate Code',
    category: SMELL_CATEGORIES.DISPENSABLES,
    description: 'Same code structure appears in multiple places',
    severity: 'warning',
  },
  COMMENTS: {
    id: 'comments',
    name: 'Comments',
    category: SMELL_CATEGORIES.DISPENSABLES,
    description: 'Excessive comments suggesting code should be refactored',
    severity: 'info',
  },

  // Couplers
  INAPPROPRIATE_INTIMACY: {
    id: 'inappropriate-intimacy',
    name: 'Inappropriate Intimacy',
    category: SMELL_CATEGORIES.COUPLERS,
    description: 'Classes are too closely coupled and should be separated',
    severity: 'warning',
  },
  MESSAGE_CHAINS: {
    id: 'message-chains',
    name: 'Message Chains',
    category: SMELL_CATEGORIES.COUPLERS,
    description: 'Long chains of method calls indicating tight coupling',
    severity: 'warning',
  },
  MIDDLE_MAN: {
    id: 'middle-man',
    name: 'Middle Man',
    category: SMELL_CATEGORIES.COUPLERS,
    description: 'Class is just delegating to another class without adding value',
    severity: 'info',
  },
};

export const SEVERITY_LEVELS = {
  info: { label: 'Info', color: 'blue', priority: 1 },
  warning: { label: 'Warning', color: 'yellow', priority: 2 },
  critical: { label: 'Critical', color: 'red', priority: 3 },
};

export const MOCK_RESULTS = {
  summary: {
    totalSmells: 42,
    filesAnalyzed: 8,
    classesAnalyzed: 24,
    linesOfCode: 12400,
    criticalIssues: 3,
    smellsByCategory: {
      [SMELL_CATEGORIES.BLOATERS]: 15,
      [SMELL_CATEGORIES.COUPLERS]: 12,
      [SMELL_CATEGORIES.DISPENSABLES]: 8,
      [SMELL_CATEGORIES.CHANGE_PREVENTERS]: 5,
      [SMELL_CATEGORIES.OBJECT_ORIENTED_ABUSERS]: 2,
    },
  },
  smells: [
    {
      id: 1,
      name: 'Long Method',
      category: SMELL_CATEGORIES.BLOATERS,
      severity: 'critical',
      className: 'UserService',
      methodName: 'authenticateUser',
      file: 'src/services/UserService.java',
      reason: 'Method exceeds 50 lines.',
      metrics: { lines: 250, complexity: 18 },
    },
    {
      id: 2,
      name: 'God Class',
      category: SMELL_CATEGORIES.BLOATERS,
      severity: 'critical',
      className: 'UserManager',
      methodName: '-',
      file: 'src/managers/UserManager.java',
      reason: 'Class has 45 methods...',
      metrics: { methods: 45, lines: 2000 },
    },
    {
      id: 3,
      name: 'Complex Conditional',
      category: SMELL_CATEGORIES.OBJECT_ORIENTED_ABUSERS,
      severity: 'warning',
      className: 'OrderProcessor',
      methodName: 'processOrder',
      file: 'src/processors/OrderProcessor.js',
      reason: 'Cyclomatic complexiti...',
      metrics: { occurrences: 3, lines: 45 },
    },
    {
      id: 4,
      name: 'Feature Envy',
      category: SMELL_CATEGORIES.CHANGE_PREVENTERS,
      severity: 'warning',
      className: 'PaymentValidator',
      methodName: 'validatePayment',
      file: 'src/validators/PaymentValidator.ts',
      reason: 'Method uses more d...',
      metrics: { foreignCalls: 12, localCalls: 3 },
    },
    {
      id: 5,
      name: 'Empty Catch Block',
      category: SMELL_CATEGORIES.DISPENSABLES,
      severity: 'critical',
      className: 'DataFetcher',
      methodName: 'fetchRemoteConfig',
      file: 'src/utils/DataFetcher.ts',
      reason: 'Exception is caught ...',
      metrics: { cases: 12, complexity: 14 },
    },
  ],
};
