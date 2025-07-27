import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import { DirectoryAnalyzer } from '../services/directoryAnalyzer';
import { GeminiService } from '../services/geminiService';
import { getConfig } from '../utils/config';

interface GenerateOptions {
  directory: string;
  output: string;
  force: boolean;
}

export async function generateReadme(options: GenerateOptions): Promise<void> {
  const targetDir = path.resolve(options.directory);
  const outputPath = path.join(targetDir, options.output);

  // Verify directory exists
  if (!await fs.pathExists(targetDir)) {
    console.error(chalk.red(`❌ Directory not found: ${targetDir}`));
    process.exit(1);
  }

  // Check if README already exists
  if (await fs.pathExists(outputPath) && !options.force) {
    const { shouldOverwrite } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'shouldOverwrite',
        message: `${options.output} already exists. Overwrite?`,
        default: false
      }
    ]);

    if (!shouldOverwrite) {
      console.log(chalk.blue('ℹ️  Operation cancelled.'));
      return;
    }
  }

  console.log(chalk.blue.bold('\n🚀 GitGuide - Generating README\n'));
  console.log(chalk.white('Target directory:'), chalk.cyan(targetDir));
  console.log(chalk.white('Output file:'), chalk.cyan(outputPath));

  let spinner = ora('Analyzing directory structure...').start();

  try {
    // Analyze directory
    const analyzer = new DirectoryAnalyzer();
    const projectData = await analyzer.analyzeDirectory(targetDir);
    
    spinner.succeed('Directory analysis complete');
    console.log(chalk.gray(`Found ${projectData.files.length} files across ${projectData.structure.directories} directories`));

    // Generate README
    spinner = ora('Generating README with AI...').start();
    
    const config = await getConfig();
    const geminiService = new GeminiService(config.apiKey!);
    const readme = await geminiService.generateReadme(projectData);
    
    spinner.succeed('README content generated');

    // Save README
    spinner = ora(`Saving ${options.output}...`).start();
    await fs.writeFile(outputPath, readme.content, 'utf8');
    spinner.succeed(`README saved as ${options.output}`);

    console.log(chalk.green('\n✅ README generated successfully!'));
    console.log(chalk.blue('📁 Location:'), chalk.cyan(outputPath));
    console.log(chalk.blue('📊 Sections:'), chalk.gray(readme.sections.join(', ')));
    
    // Offer to open the file
    const { shouldOpen } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'shouldOpen',
        message: 'Would you like to view the generated README?',
        default: true
      }
    ]);

    if (shouldOpen) {
      const content = await fs.readFile(outputPath, 'utf8');
      console.log(chalk.blue('\n📖 Generated README Preview:\n'));
      console.log(chalk.gray('─'.repeat(80)));
      console.log(content.slice(0, 500) + (content.length > 500 ? '\n...(truncated)' : ''));
      console.log(chalk.gray('─'.repeat(80)));
    }

  } catch (error) {
    spinner.fail('Failed to generate README');
    throw error;
  }
}