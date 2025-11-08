import { existsSync } from 'fs';
import chalk from 'chalk';
import { auditFiles, ModelName } from '@toon/tokenizer';

export async function auditCommand(
  files: string[],
  options: { model?: string; json?: boolean } = {}
): Promise<void> {
  try {
    // Check all files exist
    const missingFiles = files.filter((f) => !existsSync(f));
    if (missingFiles.length > 0) {
      console.error(chalk.red(`Error: Files not found: ${missingFiles.join(', ')}`));
      process.exit(1);
    }

    const model = (options.model || 'gpt-4') as ModelName;
    const results = await auditFiles(files, model);

    if (options.json) {
      console.log(JSON.stringify(results, null, 2));
      return;
    }

    // Display results
    console.log(chalk.blue('\nToken Audit Report\n'));
    console.log(chalk.gray('─'.repeat(80)));

    let totalTokens = 0;
    let totalSavings = 0;

    for (const result of results) {
      console.log(chalk.white(`\n${result.file}`));
      console.log(chalk.gray(`  Format: ${result.format}`));
      console.log(chalk.blue(`  Tokens: ${result.tokens.toLocaleString()}`));
      totalTokens += result.tokens;

      if (result.potentialSavings) {
        console.log(chalk.green(`  Potential savings: ${result.potentialSavings.savings.toLocaleString()} tokens (${result.potentialSavings.percentage}%)`));
        totalSavings += result.potentialSavings.savings;
      }
    }

    console.log(chalk.gray('\n' + '─'.repeat(80)));
    console.log(chalk.blue(`\nTotal tokens: ${totalTokens.toLocaleString()}`));
    if (totalSavings > 0) {
      console.log(chalk.green(`Total potential savings: ${totalSavings.toLocaleString()} tokens`));
    }
  } catch (error) {
    console.error(chalk.red(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
    process.exit(1);
  }
}

