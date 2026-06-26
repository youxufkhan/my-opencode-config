import { spawn } from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { AuthStatus } from '../types';

const AUTH_FILE = path.join(os.homedir(), '.local', 'share', 'opencode', 'auth.json');

export async function isAuthenticated(): Promise<boolean> {
  try {
    const content = await fs.readFile(AUTH_FILE, 'utf-8');
    const auth = JSON.parse(content);
    
    return !!(auth.opencode || auth.zen);
  } catch {
    return false;
  }
}

export async function getAuthStatus(): Promise<AuthStatus> {
  const zen = await isAuthenticated();
  
  return { zen };
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

export async function authenticateIfNeeded(): Promise<void> {
  const status = await getAuthStatus();
  
  // If already fully authenticated, skip
  if (status.zen) {
    console.log('✅ Already authenticated for OpenCode Zen');
    return;
  }
  
  console.log(`\n📋 Providers to authenticate: OpenCode Zen\n`);
  
  // Spawn /connect ONCE
  await spawnOpencodeConnect();
  
  // Re-check and report
  const newStatus = await getAuthStatus();
  if (newStatus.zen && !status.zen) console.log('✅ Zen authenticated');
}
