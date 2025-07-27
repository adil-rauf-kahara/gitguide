#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { setApiKey } from './commands/config';
import { generateReadme } from './commands/generate';
import { checkApiKey } from './utils/config';

const program = new Command();

program
  .name('gitguide')
  .description('AI-powered README generator for any project directory')
  .version('1.0.0');

program
  .command('config')
  .description('Set your Gemini API key')
  .action(async () => {
    try {
      await setApiKey();
    } catch (error) {
      console.error(chalk.red('Error setting API key:'), error);
      process.exit(1);
    }
  });

program
  .command('generate')
  .alias('gen')
  .description('Generate README.md for current directory')
  .option('-d, --directory <path>', 'Target directory (default: current directory)', '.')
  .option('-o, --output <filename>', 'Output filename (default: README.md)', 'README.md')
  .option('--force', 'Overwrite existing README.md', false)
  .action(async (options) => {
    try {
      // Check if API key is configured
      if (!await checkApiKey()) {
        console.log(chalk.yellow('⚠️  Gemini API key not found.'));
        console.log(chalk.blue('ℹ️  Run'), chalk.cyan('gitguide config'), chalk.blue('to set your API key first.'));
        process.exit(1);
      }

      await generateReadme(options);
    } catch (error) {
      console.error(chalk.red('Error generating README:'), error);
      process.exit(1);
    }
  });

program
  .command('help')
  .description('Show help information')
  .action(() => {
    console.log(chalk.blue.bold('\n🚀 GitGuide - AI README Generator\n'));
    console.log(chalk.white('Available commands:\n'));
    console.log(chalk.cyan('  gitguide config'), '        Set your Gemini API key');
    console.log(chalk.cyan('  gitguide generate'), '      Generate README for current directory');
    console.log(chalk.cyan('  gitguide gen'), '           Alias for generate');
    console.log(chalk.cyan('  gitguide help'), '          Show this help message');
    console.log(chalk.white('\nOptions for generate:'));
    console.log(chalk.gray('  -d, --directory <path>'), '  Target directory (default: current)');
    console.log(chalk.gray('  -o, --output <filename>'), ' Output filename (default: README.md)');
    console.log(chalk.gray('  --force'), '                Overwrite existing README.md');
    console.log(chalk.white('\nExamples:'));
    console.log(chalk.gray('  gitguide generate'));
    console.log(chalk.gray('  gitguide gen -d ./my-project'));
    console.log(chalk.gray('  gitguide gen --output DOCUMENTATION.md --force'));
    console.log(chalk.blue('\nGet your Gemini API key at: https://makersuite.google.com/app/apikey\n'));
  });

// Default action
program.action(() => {
  program.help();
});

program.parse();