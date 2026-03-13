import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { ConfigBackup } from '../types';

// Get config path for a file
export function getConfigPath(filename: string): string {
  return path.join(os.homedir(), '.config', 'opencode', filename);
}

// Check if config exists
export async function configExists(filename: string): Promise<boolean> {
  try {
    await fs.access(getConfigPath(filename));
    return true;
  } catch {
    return false;
  }
}

// Read config file
export async function readConfig(filename: string): Promise<object | null> {
  const configPath = getConfigPath(filename);
  try {
    const content = await fs.readFile(configPath, 'utf-8');
    return JSON.parse(content);
  } catch (error: any) {
    if (error.code === 'ENOENT') return null;
    throw new Error(`Invalid JSON in ${filename}: ${error.message}`);
  }
}

// Ensure backup directory exists
async function ensureBackupDir(): Promise<string> {
  const backupDir = path.join(os.homedir(), '.config', 'opencode', 'backups');
  await fs.mkdir(backupDir, { recursive: true });
  return backupDir;
}

// Backup config file
export async function backupConfig(filename: string): Promise<ConfigBackup | null> {
  const configPath = getConfigPath(filename);
  try {
    const content = await fs.readFile(configPath, 'utf-8');
    const backupDir = await ensureBackupDir();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(backupDir, `${filename}-${timestamp}.json`);
    await fs.writeFile(backupPath, content, 'utf-8');
    return { path: backupPath, content, timestamp };
  } catch (error: any) {
    if (error.code === 'ENOENT') return null;
    throw new Error(`Backup failed: ${error.message}`);
  }
}

// List all backups
export async function listBackups(): Promise<ConfigBackup[]> {
  const backupDir = path.join(os.homedir(), '.config', 'opencode', 'backups');
  try {
    const files = await fs.readdir(backupDir);
    const backups: ConfigBackup[] = [];
    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(backupDir, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const timestamp = file.replace('.json', '').split('-').slice(-1).join('-');
        backups.push({ path: filePath, content, timestamp });
      }
    }
    return backups;
  } catch {
    return [];
  }
}

// Restore from backup
export async function restoreBackup(backup: ConfigBackup): Promise<void> {
  const filename = path.basename(backup.path);
  const originalPath = getConfigPath(filename.replace(/-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}.json$/, '.json'));
  await fs.writeFile(originalPath, backup.content, 'utf-8');
}

// Write config file
export async function writeConfig(filename: string, data: object): Promise<void> {
  const configPath = getConfigPath(filename);
  const configDir = path.dirname(configPath);
  await fs.mkdir(configDir, { recursive: true });
  await fs.writeFile(configPath, JSON.stringify(data, null, 2), 'utf-8');
}

// Deep merge - preserves existing values
export function mergeConfigs(existing: any, updates: any): any {
  if (!existing) return updates;
  if (!updates) return existing;
  
  const result: any = { ...existing };
  
  for (const key of Object.keys(updates)) {
    const existingValue = result[key];
    const updateValue = updates[key];
    
    if (Array.isArray(existingValue) && Array.isArray(updateValue)) {
      result[key] = [...new Set([...existingValue, ...updateValue])];
    } else if (typeof existingValue === 'object' && typeof updateValue === 'object' && 
               existingValue !== null && updateValue !== null && !Array.isArray(existingValue)) {
      result[key] = mergeConfigs(existingValue, updateValue);
    } else {
      result[key] = updateValue;
    }
  }
  
  return result;
}
