import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs/promises';

const execAsync = promisify(exec);

export interface OpenCodeStatus {
  installed: boolean;
  version?: string;
  path?: string;
}

// Check if opencode command exists in PATH
export async function isOpenCodeInstalled(): Promise<boolean> {
  try {
    // Try which command
    const { stdout } = await execAsync('which opencode');
    return stdout.trim().length > 0;
  } catch {
    // Try where command (Windows)
    try {
      const { stdout } = await execAsync('where opencode');
      return stdout.trim().length > 0;
    } catch {
      return false;
    }
  }
}

// Get OpenCode version if installed
export async function getOpenCodeVersion(): Promise<string | null> {
  try {
    const { stdout } = await execAsync('opencode --version');
    const match = stdout.match(/v?(\d+\.\d+\.\d+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

// Get OpenCode binary path
export async function getOpenCodePath(): Promise<string | null> {
  try {
    const { stdout } = await execAsync('which opencode');
    return stdout.trim() || null;
  } catch {
    return null;
  }
}

// Check common installation locations
export async function checkCommonPaths(): Promise<string | null> {
  const possiblePaths = [
    '/usr/local/bin/opencode',
    '/usr/bin/opencode',
    path.join(os.homedir(), '.local', 'bin', 'opencode'),
    path.join(os.homedir(), '.cargo', 'bin', 'opencode'),
  ];
  
  for (const p of possiblePaths) {
    try {
      await fs.access(p);
      return p;
    } catch {
      continue;
    }
  }
  return null;
}

// Get full OpenCode status
export async function getOpenCodeStatus(): Promise<OpenCodeStatus> {
  const installed = await isOpenCodeInstalled();
  
  if (!installed) {
    // Check common paths as fallback
    const commonPath = await checkCommonPaths();
    if (commonPath) {
      return { installed: true, path: commonPath };
    }
    return { installed: false };
  }
  
  const version = await getOpenCodeVersion();
  const cmdPath = await getOpenCodePath();
  
  return { installed: true, version: version || undefined, path: cmdPath || undefined };
}

// Install OpenCode using official installer
export async function installOpenCode(): Promise<void> {
  // The official install script requires interactive input
  // For automated install, we need to handle this differently
  try {
    // Try non-interactive install
    const installScript = `curl -fsSL https://opencode.ai/install | bash`;
    await execAsync(installScript);
  } catch (error: any) {
    throw new Error(
      `Failed to install OpenCode: ${error.message}\n\n` +
      `Please install manually:\n` +
      `1. Visit https://opencode.ai\n` +
      `2. Download the installer for your platform\n` +
      `3. Follow the installation instructions`
    );
  }
  
  // Verify installation
  if (!(await isOpenCodeInstalled())) {
    throw new Error('OpenCode installation failed. Please install manually.');
  }
}
