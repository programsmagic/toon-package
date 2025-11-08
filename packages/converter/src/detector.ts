/**
 * Format auto-detection
 */
import { SupportedFormat, FormatDetectionResult } from './types.js';

/**
 * Detect format from file extension
 */
export function detectFormatFromExtension(filename: string): SupportedFormat | null {
  const ext = filename.toLowerCase().split('.').pop();
  
  const extensionMap: Record<string, SupportedFormat> = {
    json: 'json',
    toon: 'toon',
    csv: 'csv',
    yaml: 'yaml',
    yml: 'yaml',
  };

  return extensionMap[ext || ''] || null;
}

/**
 * Detect format from content
 */
export function detectFormatFromContent(content: string): FormatDetectionResult {
  const trimmed = content.trim();

  // Check for TOON+ metadata
  if (trimmed.startsWith('#toon+')) {
    return {
      format: 'toon',
      confidence: 0.95,
      reason: 'TOON+ metadata header detected',
    };
  }

  // Check for JSON
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      JSON.parse(trimmed);
      return {
        format: 'json',
        confidence: 0.9,
        reason: 'Valid JSON structure detected',
      };
    } catch {
      // Might be TOON or other format
    }
  }

  // Check for YAML
  if (trimmed.includes('---') || trimmed.includes(':')) {
    // Simple YAML detection
    const yamlIndicators = trimmed.match(/^[\w-]+:\s/m);
    if (yamlIndicators) {
      return {
        format: 'yaml',
        confidence: 0.7,
        reason: 'YAML-like structure detected',
      };
    }
  }

  // Check for CSV
  const lines = trimmed.split('\n');
  if (lines.length > 1) {
    const firstLine = lines[0];
    const commaCount = (firstLine.match(/,/g) || []).length;
    const tabCount = (firstLine.match(/\t/g) || []).length;
    
    if (commaCount > 0 || tabCount > 0) {
      // Check if all lines have similar structure
      const allLinesSimilar = lines.slice(1, Math.min(10, lines.length)).every((line) => {
        const lineCommas = (line.match(/,/g) || []).length;
        const lineTabs = (line.match(/\t/g) || []).length;
        return lineCommas === commaCount || lineTabs === tabCount;
      });

      if (allLinesSimilar) {
        return {
          format: 'csv',
          confidence: 0.8,
          reason: 'CSV-like structure detected',
        };
      }
    }
  }

  // Check for TOON (simple structure without brackets)
  if (!trimmed.includes('{') && !trimmed.includes('[') && !trimmed.includes(',')) {
    // Might be TOON format
    return {
      format: 'toon',
      confidence: 0.6,
      reason: 'TOON-like structure detected',
    };
  }

  // Default to JSON with low confidence
  return {
    format: 'json',
    confidence: 0.5,
    reason: 'Default format (low confidence)',
  };
}

/**
 * Auto-detect format from filename and content
 */
export function autoDetectFormat(
  filename?: string,
  content?: string
): FormatDetectionResult {
  // Try filename first
  if (filename) {
    const extFormat = detectFormatFromExtension(filename);
    if (extFormat) {
      return {
        format: extFormat,
        confidence: 0.85,
        reason: `File extension: .${extFormat}`,
      };
    }
  }

  // Try content detection
  if (content) {
    return detectFormatFromContent(content);
  }

  // Default fallback
  return {
    format: 'json',
    confidence: 0.3,
    reason: 'No detection method available',
  };
}

