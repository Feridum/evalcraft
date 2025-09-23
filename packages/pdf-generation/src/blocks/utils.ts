import PDFDocument from 'pdfkit';

const COLUMNS = 12;
const DEFAULT_MARGIN = 36; // 0.5 inch margin on each side

export interface ColumnCalculation {
  x: number;
  width: number;
  usableWidth: number;
  columnWidth: number;
}

/**
 * Calculate column positioning based on current page dimensions
 * @param doc - PDFDocument instance
 * @param startColumn - Starting column (1-12)
 * @param columns - Number of columns to span
 * @param margin - Optional custom margin (defaults to 36pt)
 * @returns Column calculation with x position and width
 */
export function calculateColumns(
  doc: InstanceType<typeof PDFDocument>, 
  startColumn: number = 1, 
  columns: number = 1,
  margin: number = DEFAULT_MARGIN
): ColumnCalculation {
  // Get current page width
  const pageWidth = doc.page.width;
  
  // Calculate usable width after margins
  const usableWidth = pageWidth - (2 * margin);
  
  // Calculate width per column
  const columnWidth = usableWidth / COLUMNS;
  
  // Calculate x position with margin
  const x = margin + (startColumn - 1) * columnWidth;
  
  // Calculate total width for spanning columns
  const width = columns * columnWidth;
  
  return {
    x,
    width,
    usableWidth,
    columnWidth
  };
}

/**
 * Validate column parameters
 * @param startColumn - Starting column (should be 1-12)
 * @param columns - Number of columns to span
 * @throws Error if parameters are invalid
 */
export function validateColumns(startColumn: number, columns: number): void {
  if (startColumn < 1 || startColumn > COLUMNS) {
    throw new Error(`startColumn must be between 1 and ${COLUMNS}, got ${startColumn}`);
  }
  
  if (columns < 1) {
    throw new Error(`columns must be at least 1, got ${columns}`);
  }
  
  if (startColumn + columns - 1 > COLUMNS) {
    throw new Error(`startColumn (${startColumn}) + columns (${columns}) exceeds maximum columns (${COLUMNS})`);
  }
}

/**
 * Calculate line height based on current font size
 * @param doc - PDFDocument instance
 * @param lineHeightMultiplier - Multiplier for font size (default: 1.2)
 * @returns Line height in points
 */
export function calculateLineHeight(
  doc: InstanceType<typeof PDFDocument>,
  lineHeightMultiplier: number = 1.2
): number {
  const fontSize = (doc as any)._fontSize || 12;
  return fontSize * lineHeightMultiplier;
}

/**
 * Update document cursor position to the next line
 * @param doc - PDFDocument instance
 * @param currentY - Current Y position
 * @param customSpacing - Optional custom spacing (defaults to calculated line height)
 * @returns New Y position
 */
export function moveToNextLine(
  doc: InstanceType<typeof PDFDocument>,
  currentY: number,
  customSpacing?: number
): number {
  const spacing = customSpacing !== undefined ? customSpacing : calculateLineHeight(doc);
  const newY = currentY + spacing;
  doc.y = newY;
  return newY;
}

/**
 * Calculate Y position for a specific line number
 * @param startY - Starting Y position
 * @param lineNumber - Line number (0-based)
 * @param lineHeight - Height of each line
 * @returns Y position for the specified line
 */
export function calculateLinePosition(
  startY: number,
  lineNumber: number,
  lineHeight: number
): number {
  return startY + (lineNumber * lineHeight);
}