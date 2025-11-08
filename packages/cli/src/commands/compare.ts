import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import chalk from 'chalk';
import { compareAllFormats } from '@toon/converter';

export async function compareCommand(
  file: string,
  _options: { model?: string } = {}
): Promise<void> {
  try {
    if (!existsSync(file)) {
      console.error(chalk.red(`Error: File not found: ${file}`));
      process.exit(1);
    }

    const content = await readFile(file, 'utf-8');

    // Parse data
    let data: unknown;
    try {
      data = JSON.parse(content);
    } catch {
      console.error(chalk.red('Error: Could not parse file as JSON'));
      process.exit(1);
    }

    // Compare formats
    const comparison = compareAllFormats(data);

    console.log(chalk.blue('\nFormat Comparison\n'));
    console.log(chalk.gray('─'.repeat(80)));

    console.log(chalk.white(`\nBest format: ${chalk.green(comparison.best)}`));
    console.log(chalk.gray('\nSavings by format:'));

    for (const saving of comparison.savings) {
      const color = saving.sizeReduction > 0 ? chalk.green : chalk.red;
      console.log(
        color(`  ${saving.format}: ${saving.sizeReduction > 0 ? '+' : ''}${saving.sizeReduction}% size reduction`)
      );
      if (saving.tokenReduction) {
        console.log(
          color(`    Token reduction: ${saving.tokenReduction > 0 ? '+' : ''}${saving.tokenReduction}%`)
        );
      }
    }

    console.log(chalk.gray('\n' + '─'.repeat(80)));
  } catch (error) {
    console.error(chalk.red(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
    process.exit(1);
  }
}

