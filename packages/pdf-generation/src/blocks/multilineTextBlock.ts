import PDFDocument from 'pdfkit';
import { calculateColumns, validateColumns } from './utils';

export interface MultilineTextBlockOptions {
  lines: string[]; // Array of text lines
  startColumn?: number; // 1-12, column to start from
  columns?: number; // how many columns to span
  y?: number; // vertical position
  lineSpacing?: number; // spacing between lines (default uses moveDown)
}

export function drawMultilineTextBlock(doc: InstanceType<typeof PDFDocument>, options: MultilineTextBlockOptions) {
  const {
    lines,
    startColumn = 1,
    columns = 1,
    y = 72, // default top margin
    lineSpacing
  } = options;
  
  // Validate column parameters
  validateColumns(startColumn, columns);
  
  // Calculate column positioning based on current page
  const { x, width } = calculateColumns(doc, startColumn, columns);
  
  // Set initial position
  let currentY = y;
  
  // Render each line of text
  lines.forEach((line, index) => {
    if (index === 0) {
      // First line - use provided y position
      doc.text(line, x, currentY, { width });
    } else {
      // Subsequent lines - use moveDown or custom spacing
      if (lineSpacing !== undefined) {
        currentY += lineSpacing;
        doc.text(line, x, currentY, { width });
      } else {
        // Use PDFKit's moveDown for natural line spacing
        doc.moveDown();
        doc.text(line, { width });
      }
    }
  });
  
  // Move to new line after all text
  doc.moveDown();
  
  return doc;
}