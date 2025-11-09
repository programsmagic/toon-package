#!/usr/bin/env node

/**
 * Batch file processing example
 */
import { readdir, readFile, writeFile } from 'fs/promises';
import { join, extname } from 'path';
import { convert, convertFile } from '@programsmagic/toon-converter';
import { countTokensInData } from '@programsmagic/toon-tokenizer';

async function main() {
  const args = process.argv.slice(2);
  const inputDir = args[0] || './input';
  const outputDir = args[1] || './output';
  const targetFormat = args[2] || 'toon';
  const model = args.find((arg) => arg.startsWith('--model='))?.split('=')[1] || 'gpt-4';

  try {
    // Read all files from input directory
    const files = await readdir(inputDir);
    const jsonFiles = files.filter((file) => ['.json', '.csv', '.yaml'].includes(extname(file)));

    console.log(`Found ${jsonFiles.length} files to process`);

    let totalOriginalTokens = 0;
    let totalOptimizedTokens = 0;

    // Process each file
    for (const file of jsonFiles) {
      const inputPath = join(inputDir, file);
      const outputPath = join(outputDir, file.replace(extname(file), `.${targetFormat}`));

      try {
        // Convert file
        const result = await convertFile(inputPath, {
          to: targetFormat,
        });

        // Write output
        await writeFile(outputPath, result.content, 'utf-8');

        // Calculate token savings
        const originalContent = await readFile(inputPath, 'utf-8');
        const originalData = JSON.parse(originalContent);
        const originalTokens = countTokensInData(originalData, model);

        const optimizedData = JSON.parse(result.content);
        const optimizedTokens = countTokensInData(optimizedData, model);

        totalOriginalTokens += originalTokens.tokens;
        totalOptimizedTokens += optimizedTokens.tokens;

        const savings = originalTokens.tokens - optimizedTokens.tokens;
        const percentage = originalTokens.tokens > 0
          ? (savings / originalTokens.tokens) * 100
          : 0;

        console.log(`✓ ${file}: ${savings} tokens saved (${percentage.toFixed(2)}%)`);
      } catch (error) {
        console.error(`✗ ${file}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Summary
    const totalSavings = totalOriginalTokens - totalOptimizedTokens;
    const totalPercentage = totalOriginalTokens > 0
      ? (totalSavings / totalOriginalTokens) * 100
      : 0;

    console.log('\n--- Summary ---');
    console.log(`Total files processed: ${jsonFiles.length}`);
    console.log(`Total tokens saved: ${totalSavings} (${totalPercentage.toFixed(2)}%)`);
    console.log(`Original tokens: ${totalOriginalTokens}`);
    console.log(`Optimized tokens: ${totalOptimizedTokens}`);
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    process.exit(1);
  }
}

main();

