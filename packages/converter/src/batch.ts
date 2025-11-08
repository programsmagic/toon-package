/**
 * Batch file processing
 */
import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname, extname, basename } from 'path';
import { ConversionOptions, BatchConversionResult } from './types.js';
import { convertFile } from './converter.js';

/**
 * Process batch of files
 */
export async function batchConvert(
  files: Array<{ input: string; output?: string }>,
  options: Omit<ConversionOptions, 'from'>
): Promise<BatchConversionResult> {
  const result: BatchConversionResult = {
    success: [],
    errors: [],
    summary: {
      total: files.length,
      successful: 0,
      failed: 0,
    },
  };

  let totalTokenSavings = 0;

  for (const file of files) {
    try {
      // Check if input file exists
      if (!existsSync(file.input)) {
        result.errors.push({
          file: file.input,
          error: 'File not found',
        });
        continue;
      }

      // Read input file
      const content = await readFile(file.input, 'utf-8');

      // Determine output path
      const outputPath = file.output || generateOutputPath(file.input, options.to);

      // Convert
      const conversionResult = await convertFile(content, file.input, options);

      // Write output file
      await writeFile(outputPath, conversionResult.content, 'utf-8');

      result.success.push({
        file: file.input,
        result: conversionResult,
      });

      if (conversionResult.metadata?.tokenSavings) {
        totalTokenSavings += conversionResult.metadata.tokenSavings;
      }
    } catch (error) {
      result.errors.push({
        file: file.input,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  result.summary.successful = result.success.length;
  result.summary.failed = result.errors.length;
  result.summary.totalTokenSavings = totalTokenSavings;

  return result;
}

/**
 * Generate output path from input path and target format
 */
function generateOutputPath(inputPath: string, targetFormat: string): string {
  const dir = dirname(inputPath);
  const base = basename(inputPath, extname(inputPath));
  const extension = targetFormat === 'yml' ? 'yaml' : targetFormat;
  return join(dir, `${base}.${extension}`);
}

