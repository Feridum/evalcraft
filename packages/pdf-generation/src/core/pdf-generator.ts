import PDFDocument from 'pdfkit';
import {
  PDFGeneratorOptions,
  GeneratePDFResult,
  PDFDocument as PDFDocumentStructure,
  PDFBlock,
  TextBlock,
  MultilineTextBlock,
  MultiColumnTextBlock,
  TableBlock
} from '../types';
import {
  drawTextBlock,
  drawTableBlock,
  drawMultilineTextBlock,
  drawMultiColumnTextBlock,
  TextBlockOptions,
  TableBlockOptions,
  MultilineTextBlockOptions,
  MultiColumnTextBlockOptions
} from '../blocks';

/**
 * Core PDF generation functionality
 */

// =====================================================
// PDF DOCUMENT CREATION
// =====================================================

/**
 * Create a new PDF document with specified options
 * @param options - PDF generation options
 * @returns PDFKit document instance
 */
export function createPDFDocument(options: PDFGeneratorOptions = {}): PDFKit.PDFDocument {
  return new PDFDocument({
    size: options.pageSize || 'A4',
    margins: {
      top: options.margins?.top || 50,
      bottom: options.margins?.bottom || 50,
      left: options.margins?.left || 50,
      right: options.margins?.right || 50
    }
  });
}

// =====================================================
// BLOCK RENDERING
// =====================================================

/**
 * Render a single PDF block based on its type
 * @param doc - PDFKit document instance
 * @param block - The block to render
 */
export async function renderBlock(doc: PDFKit.PDFDocument, block: PDFBlock): Promise<void> {
  try {
    switch (block.type) {
      case 'textBlock':
        await renderTextBlock(doc, block as TextBlock);
        break;

      case 'multilineTextBlock':
        await renderMultilineTextBlock(doc, block as MultilineTextBlock);
        break;

      case 'multiColumnTextBlock':
        await renderMultiColumnTextBlock(doc, block as MultiColumnTextBlock);
        break;

      case 'tableBlock':
        await renderTableBlock(doc, block as TableBlock);
        break;

      default:
        console.warn(`Unknown block type: ${(block as any).type}`);
    }
  } catch (error) {
    const blockType = (block as any).type || 'unknown';
    throw new Error(`Failed to render ${blockType} block: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Render multiple blocks sequentially
 * @param doc - PDFKit document instance
 * @param blocks - Array of blocks to render
 */
export async function renderBlocks(doc: PDFKit.PDFDocument, blocks: PDFBlock[]): Promise<void> {
  for (let i = 0; i < blocks.length; i++) {
    try {
      await renderBlock(doc, blocks[i]);
    } catch (error) {
      throw new Error(`Failed to render block ${i}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// =====================================================
// INDIVIDUAL BLOCK RENDERERS
// =====================================================

/**
 * Render a text block
 */
async function renderTextBlock(doc: PDFKit.PDFDocument, block: TextBlock): Promise<void> {
  const options: TextBlockOptions = {
    text: block.text,
    startColumn: block.startColumn,
    columns: block.columns,
    y: block.y
  };
  drawTextBlock(doc, options);
}

/**
 * Render a multiline text block
 */
async function renderMultilineTextBlock(doc: PDFKit.PDFDocument, block: MultilineTextBlock): Promise<void> {
  const options: MultilineTextBlockOptions = {
    lines: block.lines,
    startColumn: block.startColumn,
    columns: block.columns,
    y: block.y,
    lineSpacing: block.lineSpacing
  };
  drawMultilineTextBlock(doc, options);
}

/**
 * Render a multi-column text block
 */
async function renderMultiColumnTextBlock(doc: PDFKit.PDFDocument, block: MultiColumnTextBlock): Promise<void> {
  const options: MultiColumnTextBlockOptions = {
    columns: block.columns,
    startColumn: block.startColumn,
    columnSpan: block.columnSpan,
    y: block.y,
    columnGap: block.columnGap
  };
  drawMultiColumnTextBlock(doc, options);
}

/**
 * Render a table block
 */
async function renderTableBlock(doc: PDFKit.PDFDocument, block: TableBlock): Promise<void> {
  const options: TableBlockOptions = {
    headers: block.headers,
    rows: block.rows,
    startColumn: block.startColumn,
    y: block.y
  };
  drawTableBlock(doc, options);
}

// =====================================================
// DOCUMENT GENERATION
// =====================================================

/**
 * Generate a complete PDF from a structure
 * @param structure - The PDF document structure
 * @param outputPath - Path where the PDF should be saved
 * @param options - PDF generation options
 * @returns Generation result
 */
export async function generatePDFFromStructure(
  structure: PDFDocumentStructure,
  outputPath: string,
  options: PDFGeneratorOptions = {}
): Promise<GeneratePDFResult> {
  try {
    const fs = await import('fs');
    const path = await import('path');

    // Create the PDF document
    const doc = createPDFDocument(options);

    // Create output directory if it doesn't exist
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Create write stream
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    // Render all blocks
    await renderBlocks(doc, structure.blocks);

    // Finalize the PDF
    if (options.autoEnd !== false) {
      doc.end();
    }

    // Wait for the file to be written
    await new Promise<void>((resolve, reject) => {
      stream.on('finish', resolve);
      stream.on('error', reject);
    });

    return {
      success: true,
      outputPath: outputPath
    };

  } catch (error) {
    console.error('Error generating PDF:', error);
    console.error('Stack:', error.stack);
    
    return {
      success: false,
      error: `PDF generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}