#!/usr/bin/env node

/**
 * CLI binary entry point
 */
import { Command } from 'commander';
import { convertCommand } from './commands/convert.js';
import { optimizeCommand } from './commands/optimize.js';
import { auditCommand } from './commands/audit.js';
import { compareCommand } from './commands/compare.js';
import { streamCommand } from './commands/stream.js';

const program = new Command();

program
  .name('toon')
  .description('TOON format converter and token optimizer')
  .version('0.1.0');

// Convert command
program
  .command('convert')
  .description('Convert between formats (JSON, TOON, CSV, YAML)')
  .argument('<input>', 'Input file path')
  .argument('[output]', 'Output file path (auto-generated if not provided)')
  .option('-f, --from <format>', 'Source format (auto-detect if not provided)', 'auto')
  .option('-t, --to <format>', 'Target format', 'toon')
  .option('--minimize', 'Minimize output (for TOON format)')
  .action(convertCommand);

// Optimize command
program
  .command('optimize')
  .description('Optimize file for LLM (choose best format)')
  .argument('<file>', 'Input file path')
  .option('-o, --output <path>', 'Output file path')
  .option('-m, --model <model>', 'Model for token counting', 'gpt-4')
  .action(optimizeCommand);

// Audit command
program
  .command('audit')
  .description('Token audit report for file(s)')
  .argument('<files...>', 'Input file path(s)')
  .option('-m, --model <model>', 'Model for token counting', 'gpt-4')
  .option('-j, --json', 'Output as JSON')
  .action(auditCommand);

// Compare command
program
  .command('compare')
  .description('Compare formats for a file')
  .argument('<file>', 'Input file path')
  .option('-m, --model <model>', 'Model for token counting', 'gpt-4')
  .action(compareCommand);

// Stream command
program
  .command('stream')
  .description('Stream conversion (row-by-row for large files)')
  .argument('<file>', 'Input file path')
  .option('-f, --from <format>', 'Source format', 'auto')
  .option('-t, --to <format>', 'Target format', 'toon')
  .option('-o, --output <path>', 'Output file path')
  .action(streamCommand);

program.parse();

