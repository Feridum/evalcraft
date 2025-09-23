/**
 * Re-export types from handlebars-helpers for external use
 */

export type{
  TextBlockOptions,
  MultilineTextBlockOptions,
  MultiColumnTextBlockOptions,
  TableBlockOptions,
  ColumnContent
} from '../handlebars-helpers';

// Re-export core PDF types
export * from './pdf-types';