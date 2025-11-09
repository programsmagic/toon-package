#!/usr/bin/env node

/**
 * Token optimization example
 */
import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { selectOptimalFormat, convert } from '@programsmagic/toon-converter';
import { countTokensInData } from '@programsmagic/toon-tokenizer';

async function main() {
  const args = process.argv.slice(2);
  const file = args[0];
  const model = args.find((arg) => arg.startsWith('--model='))?.split('=')[1] || 'gpt-4';

  if (!file) {
    console.error('Usage: node optimize.js <file> [--model=gpt-4]');
    process.exit(1);
  }

  if (!existsSync(file)) {
    console.error(`Error: File not found: ${file}`);
    process.exit(1);
  }

  try {
    const content = await readFile(file, 'utf-8');
    const data = JSON.parse(content);

    // Select optimal format
    const selection = selectOptimalFormat(data);
    console.log(`Recommended format: ${selection.recommended}`);

    // Convert to optimal format
    const result = await convert(content, {
      to: selection.recommended,
    });

    const outputPath = `${file}.${selection.recommended}`;
    await writeFile(outputPath, result.content, 'utf-8');

    // Calculate token savings
    const originalTokens = countTokensInData(data, model);
    const optimizedData = JSON.parse(result.content);
    const optimizedTokens = countTokensInData(optimizedData, model);
    const savings = originalTokens.tokens - optimizedTokens.tokens;
    const percentage = originalTokens.tokens > 0
      ? (savings / originalTokens.tokens) * 100
      : 0;

    console.log(`✓ Optimized: ${file} → ${outputPath}`);
    console.log(`  Token savings: ${savings} tokens (${percentage.toFixed(2)}%)`);
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    process.exit(1);
  }
}

main();

