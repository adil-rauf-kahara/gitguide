import fs from 'fs-extra';
import path from 'path';
import os from 'os';

interface Config {
  apiKey?: string;
}

const CONFIG_DIR = path.join(os.homedir(), '.gitguide');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

export async function getConfig(): Promise<Config> {
  try {
    await fs.ensureDir(CONFIG_DIR);
    if (await fs.pathExists(CONFIG_FILE)) {
      const content = await fs.readFile(CONFIG_FILE, 'utf8');
      return JSON.parse(content);
    }
  } catch (error) {
    // Ignore errors, return empty config
  }
  return {};
}

export async function saveConfig(config: Config): Promise<void> {
  await fs.ensureDir(CONFIG_DIR);
  await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf8');
}

export async function checkApiKey(): Promise<boolean> {
  const config = await getConfig();
  return !!config.apiKey;
}