export { drawTextBlock, type TextBlockOptions } from './textBlock';
export { drawTableBlock, type TableBlockOptions } from './tableBlock';
export { drawMultilineTextBlock, type MultilineTextBlockOptions } from './multilineTextBlock';
export { drawMultiColumnTextBlock, type MultiColumnTextBlockOptions, type ColumnContent } from './multiColumnTextBlock';
export { calculateColumns, validateColumns, type ColumnCalculation } from './utils';

// Example usage:
/*
const PDFDocument = require('pdfkit');
const fs = require('fs');
const { drawTextBlock, drawTableBlock, drawMultilineTextBlock, drawMultiColumnTextBlock } = require('./blocks');

// Create a new PDF document
const doc = new PDFDocument();
doc.pipe(fs.createWriteStream('example.pdf'));

// Add text block starting from column 3, spanning 6 columns
drawTextBlock(doc, {
  text: 'This is a sample text that starts from column 3 and spans 6 columns.',
  startColumn: 3,
  columns: 6,
  y: 100
});

// Add multiline text block starting from column 2, spanning 8 columns
drawMultilineTextBlock(doc, {
  lines: [
    'First line of text',
    'Second line of text',
    'Third line with more content that might wrap',
    'Final line'
  ],
  startColumn: 2,
  columns: 8,
  y: 150
});

// Add multi-column text block with different starting lines
drawMultiColumnTextBlock(doc, {
  columns: [
    {
      lines: ['Column 1 Line 1', 'Column 1 Line 2', 'Column 1 Line 3'],
      startLine: 1
    },
    {
      lines: ['Column 2 Line 1', 'Column 2 Line 2'],
      startLine: 2 // Starts on line 2
    },
    {
      lines: ['Column 3 Line 1', 'Column 3 Line 2', 'Column 3 Line 3', 'Column 3 Line 4'],
      startLine: 1,
      lineSpacing: 20 // Custom spacing
    }
  ],
  startColumn: 1,
  columnSpan: 12,
  y: 250,
  columnGap: 20
});

// Add table starting from column 2
drawTableBlock(doc, {
  headers: ['Name', 'Age', 'City'],
  rows: [
    ['John Doe', '30', 'New York'],
    ['Jane Smith', '25', 'Los Angeles'],
    ['Bob Johnson', '35', 'Chicago']
  ],
  startColumn: 2,
  y: 400
});

doc.end();
*/