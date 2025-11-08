#!/usr/bin/env node

/**
 * Format conversion example
 */
import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { convert } from '@toon/converter';

async function main() {
  const args = process.argv.slice(2);
  const input = args[0];
  const output = args[1];
  const minimize = args.includes('--minimize');

  if (!input) {
    console.error('Usage: node convert.js <input> [output] [--minimize]');
    process.exit(1);
  }

  if (!existsSync(input)) {
    console.error(`Error: File not found: ${input}`);
    process.exit(1);
  }

  try {
    const content = await readFile(input, 'utf-8');
    const result = await convert(content, {
      to: 'toon',
      toon: { minimize },
    });

    const outputPath = output || input.replace(/\.[^.]+$/, '.toon');
    await writeFile(outputPath, result.content, 'utf-8');

    console.log(`✓ Converted: ${input} → ${outputPath}`);
    if (result.metadata?.tokenSavings) {
      console.log(`  Token savings: ${result.metadata.tokenSavings}%`);
    }
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    process.exit(1);
  }
}

main();

