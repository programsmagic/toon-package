import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import chalk from 'chalk';
import { convertFile, selectOptimalFormat } from '@programsmagic/toon-converter';
import { countTokensInData, ModelName } from '@programsmagic/toon-tokenizer';

export async function optimizeCommand(
  file: string,
  options: { output?: string; model?: string } = {}
): Promise<void> {
  try {
    if (!existsSync(file)) {
      console.error(chalk.red(`Error: File not found: ${file}`));
      process.exit(1);
    }

    const content = await readFile(file, 'utf-8');
    const model = (options.model || 'gpt-4') as ModelName;

    // Parse data
    let data: unknown;
    try {
      data = JSON.parse(content);
    } catch {
      console.error(chalk.red('Error: Could not parse file as JSON'));
      process.exit(1);
    }

    // Select optimal format
    const selection = selectOptimalFormat(data);
    console.log(chalk.blue(`Recommended format: ${selection.recommended}`));

    // Convert to optimal format
    const result = await convertFile(content, file, {
      to: selection.recommended,
    });

    const outputPath = options.output || `${file}.${selection.recommended}`;
    await writeFile(outputPath, result.content, 'utf-8');

    // Calculate token savings
    const originalTokens = countTokensInData(data, model);
    const optimizedTokens = countTokensInData(JSON.parse(result.content), model);
    const savings = originalTokens.tokens - optimizedTokens.tokens;
    const percentage = originalTokens.tokens > 0
      ? (savings / originalTokens.tokens) * 100
      : 0;

    console.log(chalk.green(`✓ Optimized: ${file} → ${outputPath}`));
    console.log(chalk.blue(`  Token savings: ${savings} tokens (${percentage.toFixed(2)}%)`));
  } catch (error) {
    console.error(chalk.red(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
    process.exit(1);
  }
}

