import { existsSync } from 'fs';
import chalk from 'chalk';
import { SupportedFormat } from '@programsmagic/toon-converter';
import { convertCommand } from './convert.js';

export async function streamCommand(
  file: string,
  options: { from?: string; to?: string; output?: string } = {}
): Promise<void> {
  try {
    if (!existsSync(file)) {
      console.error(chalk.red(`Error: File not found: ${file}`));
      process.exit(1);
    }

    console.log(
      chalk.yellow(
        'Note: Chunked streaming is not yet available. Falling back to full conversion.'
      )
    );

    const output = options.output || undefined;
    await convertCommand(file, output, {
      from: (options.from || 'auto') as SupportedFormat,
      to: (options.to || 'toon') as SupportedFormat,
      minimize: false,
    });
  } catch (error) {
    console.error(
      chalk.red(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    );
    process.exit(1);
  }
}
