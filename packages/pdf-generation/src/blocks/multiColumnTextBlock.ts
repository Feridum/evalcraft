import PDFDocument from 'pdfkit';
import { calculateColumns, validateColumns, calculateLineHeight, calculateLinePosition } from './utils';

export interface ColumnContent {
  lines: string[]; // Array of text lines for this column
  startLine?: number; // Which line to start this column on (1-based, default: 1)
  lineSpacing?: number; // Custom spacing between lines for this column in points (default: 1.2 * fontSize)
}

export interface MultiColumnTextBlockOptions {
  columns: ColumnContent[]; // Array of column contents
  startColumn?: number; // 1-12, column to start from
  columnSpan?: number; // how many grid columns to span in total
  y?: number; // vertical position
  columnGap?: number; // gap between columns in points (default: 15)
}

export function drawMultiColumnTextBlock(doc: InstanceType<typeof PDFDocument>, options: MultiColumnTextBlockOptions) {
  const {
    columns,
    startColumn = 1,
    columnSpan = 12,
    y = 72, // default top margin
    columnGap = 15
  } = options;
  
  // Validate column parameters
  validateColumns(startColumn, columnSpan);
  
  // Calculate total available space
  const { x: startX, width: totalWidth } = calculateColumns(doc, startColumn, columnSpan);
  
  // Calculate width per column including gaps
  const numColumns = columns.length;
  const totalGapWidth = (numColumns - 1) * columnGap;
  const columnWidth = (totalWidth - totalGapWidth) / numColumns;
  
  // Calculate consistent line height
  const defaultLineHeight = calculateLineHeight(doc);
  
  // Track the maximum line count to determine overall height
  let maxLines = 0;
  columns.forEach(col => {
    const startLine = col.startLine || 1;
    const totalLines = startLine + col.lines.length - 1;
    maxLines = Math.max(maxLines, totalLines);
  });
  
  // Render each column
  columns.forEach((column, columnIndex) => {
    const { lines, startLine = 1, lineSpacing } = column;
    
    // Calculate x position for this column
    const columnX = startX + (columnIndex * (columnWidth + columnGap));
    
    // Use consistent line spacing
    const actualLineSpacing = lineSpacing !== undefined ? lineSpacing : defaultLineHeight;
    const columnStartY = calculateLinePosition(y, startLine - 1, actualLineSpacing);
    
    // Render each line in this column
    lines.forEach((line, lineIndex) => {
      const lineY = calculateLinePosition(columnStartY, lineIndex, actualLineSpacing);
      doc.text(line, columnX, lineY, { width: columnWidth });
    });
  });
  
  // Calculate total height and move cursor past the content
  const totalHeight = maxLines * defaultLineHeight;
  doc.y = y + totalHeight + defaultLineHeight; // Add extra spacing after
  
  return doc;
}