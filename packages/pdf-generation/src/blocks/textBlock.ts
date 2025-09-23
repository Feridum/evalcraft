import PDFDocument from 'pdfkit';
import { calculateColumns, validateColumns } from './utils';

export interface TextBlockOptions {
  text: string;
  startColumn?: number; // 1-12, column to start from
  columns?: number; // how many columns to span
  y?: number; // vertical position
}

export function drawTextBlock(doc: InstanceType<typeof PDFDocument>, options: TextBlockOptions) {
  const {
    text,
    startColumn = 1,
    columns = 1,
    y = 72 // default top margin
  } = options;
  
  // Validate column parameters
  validateColumns(startColumn, columns);
  
  // Calculate column positioning based on current page
  const { x, width } = calculateColumns(doc, startColumn, columns);
  
  // Render text
  doc.text(text, x, y, { width });
  
  // Move to new line after text
  doc.moveDown();
  
  return doc;
}
