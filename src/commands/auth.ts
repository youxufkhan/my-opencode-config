import { spawn } from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { AuthStatus } from '../types';

const AUTH_FILE = path.join(os.homedir(), '.local', 'share', 'opencode', 'auth.json');

export async function isAuthenticated(provider: 'zen' | 'gemini'): Promise<boolean> {
  try {
    const content = await fs.readFile(AUTH_FILE, 'utf-8');
    const auth = JSON.parse(content);
    
    if (provider === 'zen') {
      return !!(auth.opencode || auth.zen);
    }
    if (provider === 'gemini') {
      return !!(auth.google);
    }
    return false;
  } catch {
    return false;
  }
}

export async function getAuthStatus(): Promise<AuthStatus> {
  const [zen, gemini] = await Promise.all([
    isAuthenticated('zen'),
    isAuthenticated('gemini'),
  ]);
  
  return { zen, gemini };
}

function spawnOpencodeConnect(): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn('opencode', ['/connect'], {
      stdio: 'inherit',
      shell: true,
    });
    
    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`opencode /connect exited with code ${code}`));
      }
    });
    
    proc.on('error', reject);
  });
}

export async function authenticateZen(): Promise<void> {
  console.log('\n🔐 Authenticating with OpenCode Zen...');
  console.log('Please follow the prompts in the OpenCode window.\n');
  
  try {
    await spawnOpencodeConnect();
    console.log('✅ Zen authentication complete!\n');
  } catch (error: any) {
    if (error.message?.includes('exited with code')) {
      console.log('⚠️  Authentication was cancelled or failed.');
      console.log('   You can run "opencode /connect" later to authenticate.\n');
    } else {
      throw error;
    }
  }
}

export async function authenticateGemini(): Promise<void> {
  console.log('\n🔐 Authenticating with Google Gemini...');
  console.log('Please follow the prompts in the OpenCode window.\n');
  
  try {
    await spawnOpencodeConnect();
    console.log('✅ Gemini authentication complete!\n');
  } catch (error: any) {
    if (error.message?.includes('exited with code')) {
      console.log('⚠️  Authentication was cancelled or failed.');
      console.log('   You can run "opencode /connect" later to authenticate.\n');
    } else {
      throw error;
    }
  }
}

export async function authenticateAll(): Promise<void> {
  await authenticateZen();
  await authenticateGemini();
}
