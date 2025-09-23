import PDFDocument from 'pdfkit';
import { calculateColumns, validateColumns } from './utils';

export interface TableBlockOptions {
  headers: string[];
  rows: string[][];
  startColumn?: number; // 1-12, column to start from
  y?: number; // vertical position
}

export function drawTableBlock(doc: InstanceType<typeof PDFDocument>, options: TableBlockOptions) {
  const {
    headers,
    rows,
    startColumn = 1,
    y = 72
  } = options;
  
  // Validate column parameters
  validateColumns(startColumn, 1); // Tables span automatically based on content
  
  // Calculate column positioning based on current page
  const { x } = calculateColumns(doc, startColumn, 1);
  
  // Prepare table data - combine headers and rows
  const tableData = [headers, ...rows];
  
  // Position the document cursor
  doc.x = x;
  doc.y = y;
  
  // Use PDFKit's built-in table method with minimal options
  doc.table({
    data: tableData
  });
  
  // Move to new line after table
  doc.moveDown();
  
  return doc;
}
