// Test utilities for the financial model platform

export const mockDatasets = {
  warehouse_demand: {
    name: 'Warehouse Demand',
    columns: ['City', 'WarehouseId', 'MonthEnd', 'Amount', 'Scenario'],
    sampleData: [
      { City: 'Jakarta', WarehouseId: 'WH001', MonthEnd: '2025-07-31', Amount: 150000, Scenario: 'Base' },
      { City: 'Surabaya', WarehouseId: 'WH002', MonthEnd: '2025-07-31', Amount: 120000, Scenario: 'Base' },
      { City: 'Bandung', WarehouseId: 'WH003', MonthEnd: '2025-07-31', Amount: 98000, Scenario: 'Optimistic' },
      { City: 'Medan', WarehouseId: 'WH004', MonthEnd: '2025-08-31', Amount: 87000, Scenario: 'Base' },
      { City: 'Semarang', WarehouseId: 'WH005', MonthEnd: '2025-08-31', Amount: 76000, Scenario: 'Conservative' }
    ]
  }
};

export const mockAPIResponses = {
  preview: {
    success: {
      rows: mockDatasets.warehouse_demand.sampleData,
      columns: mockDatasets.warehouse_demand.columns,
      rowCount: 50,
      durationMs: 120
    },
    error404: {
      error: 'Dataset not found',
      code: 404
    },
    error500: {
      error: 'Internal server error',
      code: 500
    },
    timeout: {
      error: 'Request timeout',
      code: 408
    },
    empty: {
      rows: [],
      columns: [],
      rowCount: 0,
      durationMs: 45
    }
  },
  run: {
    success: {
      rows: [
        { City: 'Jakarta', MonthEnd: '2025-07-31', TotalAmount: 270000 },
        { City: 'Surabaya', MonthEnd: '2025-07-31', TotalAmount: 240000 },
        { City: 'Bandung', MonthEnd: '2025-08-31', TotalAmount: 196000 }
      ],
      columns: ['City', 'MonthEnd', 'TotalAmount'],
      rowCount: 3,
      durationMs: 480,
      executedAt: '2025-09-03T15:02:11Z',
      sql: 'SELECT City, MonthEnd, SUM(Amount) as TotalAmount FROM warehouse_demand WHERE City = "Jakarta" GROUP BY City, MonthEnd',
      downloadUrl: 'gs://bucket/result_20250903_150211.csv'
    },
    error404: {
      error: 'API endpoint not found',
      code: 404
    }
  }
};

export const testFormulas = {
  valid: [
    'SUMIFS(Amount, City, "Jakarta")',
    'CASE WHEN City = "Jakarta" THEN Amount * 1.1 ELSE Amount END',
    'COUNT(WarehouseId)',
    'AVG(Amount)',
    'EOMONTH(DATE(YEAR(MonthEnd), MONTH(MonthEnd), 1), 0)'
  ],
  invalid: [
    'SUMIFS(Amount, City)',  // Missing parameter
    'UNKNOWN_FUNCTION(Amount)',  // Unknown function
    'SUM(Amount',  // Missing closing parenthesis
    '',  // Empty formula
    'SELECT * FROM table'  // SQL instead of formula
  ]
};

export const performanceThresholds = {
  previewLoad: 500, // ms
  largeSampleLoad: 2000, // ms
  formulaExecution: 5000, // ms
  chartRender: 1000, // ms
  tableScroll: 16, // ms (60fps)
  memoryUsage: 100 * 1024 * 1024 // 100MB
};

export const accessibilityChecks = {
  keyboardNavigation: [
    'Tab navigation through form elements',
    'Enter key to submit forms',
    'Arrow keys for table navigation',
    'Escape key to close modals'
  ],
  ariaLabels: [
    'Form inputs have proper labels',
    'Buttons have descriptive text',
    'Tables have proper headers',
    'Status messages are announced'
  ],
  colorContrast: [
    'Text on background meets WCAG AA',
    'Error states are clearly visible',
    'Focus indicators are visible',
    'Chart colors are distinguishable'
  ]
};

export const mobileBreakpoints = {
  mobile: 375,
  tablet: 768,
  desktop: 1024,
  wide: 1440
};

export const createMockServer = () => {
  const handlers = {
    '/api/preview': (body: any) => {
      const { dataset, limit } = body;
      
      if (!dataset || !mockDatasets[dataset as keyof typeof mockDatasets]) {
        return mockAPIResponses.preview.error404;
      }
      
      const data = mockDatasets[dataset as keyof typeof mockDatasets];
      return {
        ...mockAPIResponses.preview.success,
        rows: data.sampleData.slice(0, limit || 50),
        columns: data.columns,
        rowCount: limit || 50
      };
    },
    
    '/api/run': (body: any) => {
      const { dataset, formula } = body;
      
      if (!dataset || !formula) {
        return mockAPIResponses.run.error404;
      }
      
      return mockAPIResponses.run.success;
    }
  };
  
  return handlers;
};

export const measurePerformance = (name: string, fn: () => Promise<void>) => {
  return new Promise<number>(async (resolve) => {
    const start = performance.now();
    await fn();
    const end = performance.now();
    const duration = end - start;
    console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`);
    resolve(duration);
  });
};

export const simulateNetworkDelay = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const checkMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    return {
      used: memory.usedJSHeapSize,
      total: memory.totalJSHeapSize,
      limit: memory.jsHeapSizeLimit
    };
  }
  return null;
};

export const validateAccessibility = (element: HTMLElement) => {
  const checks = {
    hasAriaLabel: !!element.getAttribute('aria-label'),
    hasRole: !!element.getAttribute('role'),
    isFocusable: element.tabIndex >= 0 || ['INPUT', 'BUTTON', 'SELECT', 'TEXTAREA', 'A'].includes(element.tagName),
    hasKeyboardSupport: element.onkeydown !== null || element.onkeyup !== null || element.onkeypress !== null
  };
  
  return checks;
};