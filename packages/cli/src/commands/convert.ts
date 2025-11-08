import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname, extname, basename } from 'path';
import chalk from 'chalk';
import { convert, SupportedFormat } from '@toon/converter';

export async function convertCommand(
  input: string,
  output?: string,
  options: { from?: string; to?: string; minimize?: boolean } = {}
): Promise<void> {
  try {
    if (!existsSync(input)) {
      console.error(chalk.red(`Error: File not found: ${input}`));
      process.exit(1);
    }

    const content = await readFile(input, 'utf-8');
    const from = options.from === 'auto' ? undefined : (options.from as SupportedFormat);
    const to = (options.to || 'toon') as SupportedFormat;

    const result = await convert(content, {
      from,
      to,
      toon: {
        minimize: options.minimize,
      },
    });

    const outputPath = output || generateOutputPath(input, to);
    await writeFile(outputPath, result.content, 'utf-8');

    console.log(chalk.green(`✓ Converted: ${input} → ${outputPath}`));
    if (result.metadata?.tokenSavings) {
      console.log(chalk.blue(`  Token savings: ${result.metadata.tokenSavings}%`));
    }
  } catch (error) {
    console.error(chalk.red(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
    process.exit(1);
  }
}

function generateOutputPath(input: string, targetFormat: string): string {
  const dir = dirname(input);
  const base = basename(input, extname(input));
  const extension = targetFormat === 'yml' ? 'yaml' : targetFormat;
  return join(dir, `${base}.${extension}`);
}

