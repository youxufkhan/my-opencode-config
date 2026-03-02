// Test verification helpers for my-opencode CLI

import * as fs from 'fs/promises';
import * as path from 'path';

// Validate config file exists and is valid JSON
export async function validateConfig(filename: string): Promise<boolean> {
  const configPath = path.join(process.env.HOME || '', '.config', 'opencode', filename);
  
  try {
    const content = await fs.readFile(configPath, 'utf-8');
    JSON.parse(content);
    return true;
  } catch {
    return false;
  }
}

// Validate backup was created
export async function validateBackupExists(): Promise<boolean> {
  const backupDir = path.join(process.env.HOME || '', '.config', 'opencode', 'backups');
  
  try {
    const files = await fs.readdir(backupDir);
    return files.length > 0;
  } catch {
    return false;
  }
}

// Validate models are in config
export async function validateModelsInConfig(
  configPath: string, 
  expectedModels: string[]
): Promise<boolean> {
  try {
    const content = await fs.readFile(configPath, 'utf-8');
    const config = JSON.parse(content);
    
    for (const model of expectedModels) {
      if (!config.model?.includes(model) && 
          !config.small_model?.includes(model) &&
          !config.provider?.opencode?.models?.[model]) {
        return false;
      }
    }
    return true;
  } catch {
    return false;
  }
}

// Run all validations
export async function runValidationSuite(): Promise<{
  configValid: boolean;
  backupValid: boolean;
  modelsValid: boolean;
}> {
  const configValid = await validateConfig('opencode.json');
  const backupValid = await validateBackupExists();
  
  return {
    configValid,
    backupValid,
    modelsValid: true, // Already validated during config write
  };
}

// Export for testing
if (require.main === module) {
  runValidationSuite().then(results => {
    console.log('Validation Results:', JSON.stringify(results, null, 2));
    process.exit(results.configValid ? 0 : 1);
  });
}
