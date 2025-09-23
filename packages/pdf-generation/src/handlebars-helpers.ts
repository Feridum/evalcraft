import Handlebars from 'handlebars';

// =====================================================
// TYPES
// =====================================================

export interface TextBlockOptions {
  text?: string;
  startColumn?: number;
  columns?: number;
  y?: number;
}

export interface MultilineTextBlockOptions {
  lines?: string[];
  startColumn?: number;
  columns?: number;
  y?: number;
  lineSpacing?: number;
}

export interface MultiColumnTextBlockOptions {
  columns?: ColumnContent[];
  startColumn?: number;
  columnSpan?: number;
  y?: number;
  columnGap?: number;
}

export interface TableBlockOptions {
  headers?: string[];
  rows?: string[][];
  data?: any[];
  fields?: string[];
  startColumn?: number;
  y?: number;
}

export interface ColumnContent {
  lines: string[];
  startLine?: number;
  lineSpacing?: number;
}

export interface PDFBlock {
  type: string;
  [key: string]: any;
}

export interface PDFDocument {
  type: 'pdfDocument';
  blocks: PDFBlock[];
}

// =====================================================
// UTILITY HELPERS
// =====================================================

/**
 * Process text with handlebars variables
 * @param text - Text that may contain {{variable}} patterns
 * @param context - The handlebars context to use for variable substitution
 * @returns Processed text with variables substituted
 */
function processHandlebarsText(text: string, context: any): string {
  if (typeof text !== 'string') return text;
  
  if (text.includes('{{')) {
    try {
      const textTemplate = Handlebars.compile(text);
      return textTemplate(context);
    } catch (error) {
      // If template compilation fails, use the original text
      return text;
    }
  }
  
  return text;
}

/**
 * Helper to properly escape and format JSON string values
 */
Handlebars.registerHelper('json_val', function(value: any): Handlebars.SafeString {
  if (value === null || value === undefined) {
    return new Handlebars.SafeString('null');
  }
  if (typeof value === 'string') {
    return new Handlebars.SafeString(JSON.stringify(value));
  }
  return new Handlebars.SafeString(String(value));
});

/**
 * Helper to concatenate strings
 */
Handlebars.registerHelper('concat', function(...args: any[]): string {
  // Remove the options object from the end
  const strings = args.slice(0, -1);
  return strings.join('');
});

/**
 * Helper to create arrays from arguments
 */
Handlebars.registerHelper('array', function(...args: any[]): any[] {
// Remove the options object from the end
  return args.slice(0, -1);
});

/**
 * Helper to format arrays as JSON string arrays
 */
Handlebars.registerHelper('string_array', function(array: any[]): Handlebars.SafeString {
  if (!Array.isArray(array)) {
    return new Handlebars.SafeString('[]');
  }
  return new Handlebars.SafeString(JSON.stringify(array.map(item => String(item))));
});

/**
 * Simple helper to handle arrays without manually adding "last" properties
 */
Handlebars.registerHelper('each_json', function(context: any[], options: any): Handlebars.SafeString {
  if (!Array.isArray(context) || context.length === 0) {
    return new Handlebars.SafeString('');
  }
  
  let result = '';
  for (let i = 0; i < context.length; i++) {
    const item = context[i];
    // Add loop variables to the context
    item['@index'] = i;
    item['@first'] = i === 0;
    item['@last'] = i === context.length - 1;
    
    result += options.fn(item);
    
    // Add comma except for last item
    if (i < context.length - 1) {
      result += ',\n';
    }
  }
  
  return new Handlebars.SafeString(result);
});

/**
 * Conditional helper for equality comparison
 */
Handlebars.registerHelper('if_eq', function(this: any, a: any, b: any, options: any): Handlebars.SafeString {
  if (a === b) {
    return new Handlebars.SafeString(options.fn(this));
  }
  return new Handlebars.SafeString(options.inverse(this));
});

// =====================================================
// BLOCK-SPECIFIC HELPERS
// =====================================================

/**
 * Helper for creating text blocks
 * Usage: {{text_block text="Hello {{name}}" startColumn=1 columns=6 y=100}}
 */
Handlebars.registerHelper('text_block', function(this: any, options: any): Handlebars.SafeString {
  const {
    text = '',
    startColumn = 1,
    columns = 1,
    y = 72
  } = options.hash as TextBlockOptions;

  const processedText = processHandlebarsText(text, this);

  return new Handlebars.SafeString(JSON.stringify({
    type: 'textBlock',
    text: processedText,
    startColumn: startColumn,
    columns: columns,
    y: y
  }));
});

/**
 * Helper for creating multiline text blocks
 * Usage: {{multiline_text_block lines=textLines startColumn=2 columns=8 y=150}}
 * Lines can contain \\{{variables}} which will be processed
 */
Handlebars.registerHelper('multiline_text_block', function(this: any, options: any): Handlebars.SafeString {
  const {
    lines = [],
    startColumn = 1,
    columns = 1,
    y = 72,
    lineSpacing = null
  } = options.hash as MultilineTextBlockOptions;

  // Process each line for handlebars variables
  const processedLines = Array.isArray(lines) 
    ? lines.map(line => processHandlebarsText(line, this))
    : lines;

  const result: any = {
    type: 'multilineTextBlock',
    lines: processedLines,
    startColumn: startColumn,
    columns: columns,
    y: y
  };

  if (lineSpacing !== null && lineSpacing !== undefined) {
    result.lineSpacing = lineSpacing;
  }

  return new Handlebars.SafeString(JSON.stringify(result));
});

/**
 * Helper for creating multi-column text blocks
 * Usage: {{multi_column_text_block columns=columnData startColumn=1 columnSpan=12 y=250}}
 */
Handlebars.registerHelper('multi_column_text_block', function(options: any): Handlebars.SafeString {
  const {
    columns = [],
    startColumn = 1,
    columnSpan = 12,
    y = 72,
    columnGap = 15
  } = options.hash as MultiColumnTextBlockOptions;

  return new Handlebars.SafeString(JSON.stringify({
    type: 'multiColumnTextBlock',
    columns: columns,
    startColumn: startColumn,
    columnSpan: columnSpan,
    y: y,
    columnGap: columnGap
  }));
});

/**
 * Helper for creating table blocks
 * Usage: {{table_block headers=(array "Name" "Age") rows=staticRows startColumn=1 y=100}}
 * Or with dynamic data: {{table_block headers=(array "Name" "Age") data=people fields=(array "name" "age") startColumn=1 y=100}}
 */
Handlebars.registerHelper('table_block', function(this: any, options: any): Handlebars.SafeString {
  const {
    headers = [],
    rows = [],
    data = null,
    fields = [],
    startColumn = 1,
    y = 72
  } = options.hash as TableBlockOptions;

  let finalRows = rows;

  // If data and fields are provided, generate rows from object data
  if (data && Array.isArray(data) && fields && Array.isArray(fields)) {
    finalRows = data.map(item => 
      fields.map(field => {
        const value = item[field];
        return value !== undefined ? String(value) : '';
      })
    );
  }

  return new Handlebars.SafeString(JSON.stringify({
    type: 'tableBlock',
    headers: headers,
    rows: finalRows,
    startColumn: startColumn,
    y: y
  }));
});

// =====================================================
// TEMPLATE STRUCTURE HELPERS
// =====================================================

/**
 * Helper for creating a complete PDF document structure
 * Usage: {{#pdf_document}}...blocks...{{/pdf_document}}
 */
Handlebars.registerHelper('pdf_document', function(this: any, options: any): Handlebars.SafeString {
  const blocks = options.fn(this);
  
  return new Handlebars.SafeString(`{
  "type": "pdfDocument",
  "blocks": [
    ${blocks}
  ]
}`);
});

/**
 * Helper for adding blocks to the PDF with proper comma separation
 * Usage: {{#each_block blocks}}{{this}}{{/each_block}}
 */
Handlebars.registerHelper('each_block', function(context: any[], options: any): Handlebars.SafeString {
  if (!Array.isArray(context) || context.length === 0) {
    return new Handlebars.SafeString('');
  }
  
  let result = '';
  for (let i = 0; i < context.length; i++) {
    const item = context[i];
    result += options.fn(item);
    
    // Add comma except for last item
    if (i < context.length - 1) {
      result += ',\n    ';
    }
  }
  
  return new Handlebars.SafeString(result);
});

/**
 * Helper to create column content for multi-column blocks
 * Usage: {{column_content lines=["line1", "line2"] startLine=1 lineSpacing=20}}
 */
Handlebars.registerHelper('column_content', function(options: any): Handlebars.SafeString {
  const {
    lines = [],
    startLine = 1,
    lineSpacing = null
  } = options.hash as ColumnContent;

  const result: any = {
    lines: lines,
    startLine: startLine
  };

  if (lineSpacing !== null && lineSpacing !== undefined) {
    result.lineSpacing = lineSpacing;
  }

  return new Handlebars.SafeString(JSON.stringify(result));
});

export interface HandleBarsHelpers {
  json_val: typeof Handlebars.helpers.json_val;
  string_array: typeof Handlebars.helpers.string_array;
  each_json: typeof Handlebars.helpers.each_json;
  if_eq: typeof Handlebars.helpers.if_eq;
  text_block: typeof Handlebars.helpers.text_block;
  multiline_text_block: typeof Handlebars.helpers.multiline_text_block;
  multi_column_text_block: typeof Handlebars.helpers.multi_column_text_block;
  table_block: typeof Handlebars.helpers.table_block;
  pdf_document: typeof Handlebars.helpers.pdf_document;
  each_block: typeof Handlebars.helpers.each_block;
  column_content: typeof Handlebars.helpers.column_content;
}

export default {
  // Export helpers for testing or manual registration
  helpers: {
    json_val: Handlebars.helpers.json_val,
    string_array: Handlebars.helpers.string_array,
    each_json: Handlebars.helpers.each_json,
    if_eq: Handlebars.helpers.if_eq,
    text_block: Handlebars.helpers.text_block,
    multiline_text_block: Handlebars.helpers.multiline_text_block,
    multi_column_text_block: Handlebars.helpers.multi_column_text_block,
    table_block: Handlebars.helpers.table_block,
    pdf_document: Handlebars.helpers.pdf_document,
    each_block: Handlebars.helpers.each_block,
    column_content: Handlebars.helpers.column_content
  } as HandleBarsHelpers
};