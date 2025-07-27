import inquirer from 'inquirer';
import chalk from 'chalk';
import { saveConfig, getConfig } from '../utils/config';

export async function setApiKey(): Promise<void> {
  console.log(chalk.blue.bold('\n🔧 GitGuide Configuration\n'));
  
  const currentConfig = await getConfig();
  
  if (currentConfig.apiKey) {
    console.log(chalk.green('✓ Current API key:'), chalk.gray('*'.repeat(20) + currentConfig.apiKey.slice(-8)));
    
    const { shouldUpdate } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'shouldUpdate',
        message: 'Do you want to update your API key?',
        default: false
      }
    ]);
    
    if (!shouldUpdate) {
      console.log(chalk.blue('ℹ️  Configuration unchanged.'));
      return;
    }
  }

  console.log(chalk.white('Get your Gemini API key at:'), chalk.cyan('https://makersuite.google.com/app/apikey'));
  console.log(chalk.gray('Your API key will be stored locally and never shared.\n'));

  const { apiKey } = await inquirer.prompt([
    {
      type: 'password',
      name: 'apiKey',
      message: 'Enter your Gemini API key:',
      validate: (input: string) => {
        if (!input.trim()) {
          return 'API key is required';
        }
        if (input.length < 20) {
          return 'API key seems too short. Please check and try again.';
        }
        return true;
      },
      mask: '*'
    }
  ]);

  try {
    await saveConfig({ apiKey: apiKey.trim() });
    console.log(chalk.green('\n✅ API key saved successfully!'));
    console.log(chalk.blue('ℹ️  You can now run'), chalk.cyan('gitguide generate'), chalk.blue('to create README files.'));
  } catch (error) {
    console.error(chalk.red('\n❌ Failed to save API key:'), error);
    throw error;
  }
}