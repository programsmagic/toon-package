/**
 * Multi-format conversion engine
 */
import { encodeToon, parseToon } from '@programsmagic/toon-format';
import * as yaml from 'js-yaml';
import Papa from 'papaparse';
import { SupportedFormat, ConversionOptions, ConversionResult } from './types.js';
import { autoDetectFormat } from './detector.js';
import { compareFormats } from './selector.js';

/**
 * Convert between formats
 */
export async function convert(
  content: string,
  options: ConversionOptions
): Promise<ConversionResult> {
  const { from, to, csv, toon, yaml: yamlOpts } = options;

  // Auto-detect source format if not provided
  const detected = from ? { format: from, confidence: 1.0 } : autoDetectFormat(undefined, content);
  const sourceFormat = detected.format;

  // Parse source format
  let data: unknown;
  try {
    data = await parseSourceFormat(content, sourceFormat);
  } catch (error) {
    throw new Error(
      `Failed to parse ${sourceFormat} format: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }

  // Convert to target format
  let converted: string;
  try {
    converted = encodeTargetFormat(data, to, { csv, toon, yaml: yamlOpts });
  } catch (error) {
    throw new Error(
      `Failed to convert to ${to} format: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }

  // Calculate metadata
  const originalSize = content.length;
  const convertedSize = converted.length;
  const tokenSavings = originalSize > 0
    ? Math.round(((originalSize - convertedSize) / originalSize) * 100)
    : 0;

  const formatComparison = compareFormats(data);

  return {
    content: converted,
    detectedFormat: detected.format,
    metadata: {
      size: convertedSize,
      tokenSavings,
      formatComparison,
    },
  };
}

/**
 * Parse source format
 */
async function parseSourceFormat(content: string, format: SupportedFormat): Promise<unknown> {
  switch (format) {
    case 'json':
      return JSON.parse(content);
    case 'toon': {
      const result = await parseToon(content);
      return result.data;
    }
    case 'csv': {
      const result = Papa.parse(content, {
        header: true,
        skipEmptyLines: true,
      });
      return result.data;
    }
    case 'yaml':
    case 'yml':
      return yaml.load(content);
    default:
      throw new Error(`Unsupported source format: ${format}`);
  }
}

/**
 * Encode target format
 */
function encodeTargetFormat(
  data: unknown,
  format: SupportedFormat,
  options: {
    csv?: { header?: boolean; delimiter?: string };
    toon?: { minimize?: boolean; toonPlus?: boolean };
    yaml?: { indent?: number; lineWidth?: number };
  } = {}
): string {
  switch (format) {
    case 'json':
      return JSON.stringify(data, null, 2);
    case 'toon':
      return encodeToon(data, {
        minimize: options.toon?.minimize,
        toonPlus: options.toon?.toonPlus,
      });
    case 'csv': {
      if (!Array.isArray(data)) {
        throw new Error('CSV format requires array data');
      }
      const header = options.csv?.header !== false;
      const delimiter = options.csv?.delimiter || ',';
      return Papa.unparse(data, {
        header,
        delimiter,
      });
    }
    case 'yaml':
    case 'yml':
      return yaml.dump(data, {
        indent: options.yaml?.indent || 2,
        lineWidth: options.yaml?.lineWidth || 80,
      });
    default:
      throw new Error(`Unsupported target format: ${format}`);
  }
}

/**
 * Convert file (with filename detection)
 */
export async function convertFile(
  content: string,
  filename: string,
  options: Omit<ConversionOptions, 'from'>
): Promise<ConversionResult> {
  const detected = autoDetectFormat(filename, content);
  return await convert(content, {
    ...options,
    from: detected.format,
  });
}

