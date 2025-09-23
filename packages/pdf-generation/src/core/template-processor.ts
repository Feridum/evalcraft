import Handlebars from 'handlebars';
import '../handlebars-helpers'; // Register all helpers
import {
  PDFDocument,
  HandlebarsTemplateData,
  StructureGenerationResult,
  TemplateCompilationOptions
} from '../types';

/**
 * Compile and render a template in one step
 * @param template - The Handlebars template string
 * @param data - Data to populate the template
 * @returns Rendered template string
 */
export function compileAndRender(template: string, data: HandlebarsTemplateData): string {
  const compiled = Handlebars.compile(template);
  return compiled(data);
}

// =====================================================
// JSON STRUCTURE GENERATION
// =====================================================

/**
 * Generate PDF structure from template and data
 * @param template - Handlebars template string
 * @param data - Data object to populate the template
 * @param options - Additional processing options
 * @returns Structure generation result
 */
export function generatePDFStructure(
  template: string,
  data: HandlebarsTemplateData,
  options: TemplateCompilationOptions = {}
): StructureGenerationResult {
  try {
    // Step 1: Compile and render the template
    const renderedJson = compileAndRender(template, data);

    // Step 2: Parse the JSON structure
    let pdfStructure: PDFDocument;
    try {
      pdfStructure = JSON.parse(renderedJson);
    } catch (parseError) {
      return {
        success: false,
        error: `Failed to parse template output as JSON: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`,
        renderedJson: options.includeRenderedJson ? renderedJson : undefined
      };
    }

    return {
      success: true,
      structure: pdfStructure
    };

  } catch (error) {
    return {
      success: false,
      error: `Structure generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}