import fs from 'fs';
import path from 'path';
import {
  GeneratePDFResult
} from '../types';

/**
 * File system utilities for PDF generation
 * Simplified to focus only on essential file operations
 */

// =====================================================
// FILE OPERATIONS
// =====================================================

/**
 * Ensure output directory exists
 * @param outputPath - Path to the output file
 */
export function ensureOutputDirectory(outputPath: string): void {
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
}

// =====================================================
// ERROR HANDLING UTILITIES
// =====================================================

/**
 * Create a standardized error result
 * @param error - The error that occurred
 * @param context - Additional context about where the error occurred
 * @returns Standardized error result
 */
export function createErrorResult(error: unknown, context: string = ''): GeneratePDFResult {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  const fullMessage = context ? `${context}: ${errorMessage}` : errorMessage;
  
  return {
    success: false,
    error: fullMessage,
    outputPath: ''
  };
}

/**
 * Wrap async operations with error handling
 * @param operation - The async operation to wrap
 * @param context - Context for error reporting
 * @returns Wrapped operation that returns standardized results
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  context: string
): Promise<{ success: boolean; result?: T; error?: string }> {
  try {
    const result = await operation();
    return {
      success: true,
      result
    };
  } catch (error) {
    return {
      success: false,
      error: `${context}: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}