import {
  generatePDFFromStructure,
} from './core/pdf-generator';
import {
  generatePDFStructure,
} from './core/template-processor';
import {
  ensureOutputDirectory,
  createErrorResult,
  withErrorHandling,
} from './utils';
import {
  PDFGeneratorOptions,
  GeneratePDFResult,
  HandlebarsTemplateData,
} from './types';

// =====================================================
// PRIMARY API FUNCTIONS
// =====================================================

/**
 * Generate a PDF document from a Handlebars template and data
 * 
 * @param template - Handlebars template string
 * @param data - Data object to populate the template
 * @param outputPath - Path where the PDF should be saved
 * @param options - Additional PDF generation options
 * @returns Promise<GeneratePDFResult>
 */
export async function generatePDFFromTemplate(
  template: string,
  data: HandlebarsTemplateData,
  outputPath: string,
  options: PDFGeneratorOptions = {}
): Promise<GeneratePDFResult> {
  
  return withErrorHandling(async () => {
    // Ensure output directory exists
    ensureOutputDirectory(outputPath);
    
    // Generate PDF structure from template
    const structureResult = generatePDFStructure(template, data);
    if (!structureResult.success || !structureResult.structure) {
      return createErrorResult(
        new Error(structureResult.error || 'Failed to generate PDF structure'),
        'Template processing'
      );
    }

    // Generate PDF from structure
    const pdfResult = await generatePDFFromStructure(
      structureResult.structure,
      outputPath,
      options
    );

    if (pdfResult.success) {
      return {
        success: true,
        outputPath: pdfResult.outputPath,
        generatedJson: structureResult.structure
      };
    } else {
      return pdfResult;
    }
  }, 'PDF generation from template').then(result => {
    return result.success && result.result 
      ? result.result as GeneratePDFResult
      : createErrorResult(new Error(result.error), 'PDF generation');
  });
}

export * from './types';