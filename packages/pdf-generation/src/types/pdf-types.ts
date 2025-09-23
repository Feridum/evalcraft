/**
 * Core type definitions for PDF generation with Handlebars templates
 */

// =====================================================
// PDF GENERATOR OPTIONS
// =====================================================

export interface PDFGeneratorOptions {
  outputPath?: string;
  pageSize?: 'A4' | 'letter' | 'legal';
  margins?: PDFMargins;
  autoEnd?: boolean;
}

export interface PDFMargins {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

// =====================================================
// PDF BLOCK TYPES
// =====================================================

export interface PDFBlock {
  type: 'textBlock' | 'multilineTextBlock' | 'multiColumnTextBlock' | 'tableBlock';
  [key: string]: any;
}

export interface TextBlock extends PDFBlock {
  type: 'textBlock';
  text: string;
  startColumn?: number;
  columns?: number;
  y?: number;
}

export interface MultilineTextBlock extends PDFBlock {
  type: 'multilineTextBlock';
  lines: string[];
  startColumn?: number;
  columns?: number;
  y?: number;
  lineSpacing?: number;
}

export interface MultiColumnTextBlock extends PDFBlock {
  type: 'multiColumnTextBlock';
  columns: ColumnContent[];
  startColumn?: number;
  columnSpan?: number;
  y?: number;
  columnGap?: number;
}

export interface TableBlock extends PDFBlock {
  type: 'tableBlock';
  headers: string[];
  rows: string[][];
  startColumn?: number;
  y?: number;
}

export interface ColumnContent {
  lines: string[];
  startLine?: number;
  lineSpacing?: number;
}

// =====================================================
// PDF DOCUMENT STRUCTURE
// =====================================================

export interface PDFDocument {
  type: 'pdfDocument';
  blocks: (TextBlock | MultilineTextBlock | MultiColumnTextBlock | TableBlock)[];
}

// =====================================================
// RESULT TYPES
// =====================================================

export interface GeneratePDFResult {
  success: boolean;
  outputPath?: string;
  error?: string;
  generatedJson?: any;
}

export interface StructureGenerationResult {
  success: boolean;
  structure?: PDFDocument;
  error?: string;
  renderedJson?: string;
}

// =====================================================
// TEMPLATE PROCESSING TYPES
// =====================================================

export interface TemplateCompilationOptions {
  includeRenderedJson?: boolean;
}

export interface HandlebarsTemplateData {
  [key: string]: any;
}

// =====================================================
// UTILITY TYPES
// =====================================================

export type PDFBlockType = PDFBlock['type'];

export type SupportedPageSize = PDFGeneratorOptions['pageSize'];

export interface FilePathOptions {
  templatePath: string;
  dataPath: string;
  outputPath: string;
}