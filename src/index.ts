#!/usr/bin/env node

import { intro, outro } from '@clack/prompts';
import { isOpenCodeInstalled, installOpenCode } from './utils/opencode';
import { getRequiredPlugins, mergePluginConfig } from './commands/plugins';
import { fetchAllModels } from './commands/models';
import { generateOpencodeConfig, generateOhMyOpencodeConfig } from './commands/config-templates';
import { authenticateIfNeeded } from './commands/auth';
import { promptConfirm, selectModel, withSpinner } from './utils/prompts';
import { getConfigPath, configExists, readConfig, backupConfig, writeConfig } from './utils/config';
import { info, success, error, warn, section, step, resetSteps } from './utils/logging';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

interface UserSelections {
  mainModel: string;
  smallModel: string;
  fastAgentModel: string;
  powerfulAgentModel: string;
  installSuperpowers: boolean;
}

async function main() {
  // Parse CLI arguments
  const args = process.argv.slice(2);
  let dryRun = false;
  
  if (args.includes('--help')) {
    console.log(`Usage: my-opencode-config [OPTIONS]

Options:
  --help        Show this help message and exit
  --dry-run     Run without writing any files`);
    process.exit(0);
  }
  
  if (args.includes('--dry-run')) {
    dryRun = true;
    info('Running in dry-run mode - no files will be written');
  }
  
  resetSteps();
  
  intro('my-opencode-config - OpenCode Setup CLI');

  try {
    // Step 1: Check OpenCode installation
    step('Checking OpenCode installation');
    let opencodeInstalled = await isOpenCodeInstalled();
    
    if (!opencodeInstalled) {
      info('OpenCode is not installed.');
      const shouldInstall = await promptConfirm('Would you like to install OpenCode now?');
      
      if (shouldInstall) {
        info('Installing OpenCode...');
        await installOpenCode();
        opencodeInstalled = await isOpenCodeInstalled();
        
        if (opencodeInstalled) {
          success('OpenCode installed successfully!');
        } else {
          error('Failed to install OpenCode. Please install manually from https://opencode.ai');
        }
      } else {
        warn('Skipping OpenCode installation. You can install it later.');
      }
    } else {
      success('OpenCode is already installed!');
    }

    // Step 2: Install plugins
    step('Configuring plugins');
    const opencodeJsonPath = getConfigPath('opencode.json');
    let opencodeConfig: any = {};
    
    try {
      if (await configExists('opencode.json')) {
        opencodeConfig = await readConfig('opencode.json') || {};
      }
    } catch (e) {
      info('No existing OpenCode config found, creating new one.');
    }
    
    // Add plugins
    await withSpinner('Configuring plugins...', async () => {
      const requiredPlugins = getRequiredPlugins();
      const existingPlugins = opencodeConfig.plugin || [];
      opencodeConfig.plugin = mergePluginConfig(existingPlugins, requiredPlugins);
    });
    success('Plugins configured!');

    // Step 3: Superpowers installation (optional)
    step('Superpowers installation');
    let installSuperpowers = false;
    
    const existingSuperpowers = await fs.access(
      path.join(os.homedir(), '.config', 'opencode', 'superpowers')
    ).then(() => true).catch(() => false);
    
    if (existingSuperpowers) {
      info('Superpowers is already installed.');
    } else {
      installSuperpowers = await promptConfirm('Would you like to install Superpowers?');
      
      if (installSuperpowers) {
        if (dryRun) {
          info('Skipped Superpowers installation (dry-run)');
        } else {
          try {
            await withSpinner('Installing Superpowers...', async () => {
              const { exec } = await import('child_process');
              const { promisify } = await import('util');
              const execAsync = promisify(exec);
              
              await execAsync('git clone https://github.com/obra/superpowers.git ~/.config/opencode/superpowers');
              
              await fs.mkdir(path.join(os.homedir(), '.config', 'opencode', 'plugins'), { recursive: true });
              await fs.mkdir(path.join(os.homedir(), '.config', 'opencode', 'skills'), { recursive: true });
              
              await fs.symlink(
                path.join(os.homedir(), '.config', 'opencode', 'superpowers', '.opencode', 'plugins', 'superpowers.js'),
                path.join(os.homedir(), '.config', 'opencode', 'plugins', 'superpowers.js')
              );
              
              await fs.symlink(
                path.join(os.homedir(), '.config', 'opencode', 'superpowers', 'skills'),
                path.join(os.homedir(), '.config', 'opencode', 'skills', 'superpowers')
              );
            });
            
            success('Superpowers installed successfully!');
          } catch (e: any) {
            error(`Failed to install Superpowers: ${e.message}`);
          }
        }
      }
    }

    // Step 4: Authentication
    step('Authentication');
    await authenticateIfNeeded();

    // Step 5-6: Model selection
    step('Model selection');
    
    const models = await withSpinner('Fetching available models...', () => fetchAllModels());
    
    info('Select your main model (for general use):');
    const mainModel = await selectModel('Choose main model:', models.zen);
    if (!mainModel) {
      error('No model selected. Exiting.');
      process.exit(1);
    }
    
    info('Select your small model (for quick tasks):');
    const smallModel = await selectModel('Choose small model:', models.zen);
    if (!smallModel) {
      error('No model selected. Exiting.');
      process.exit(1);
    }
    
    info('Select model for fast agents (librarian, explore, quick):');
    const fastAgentModel = await selectModel('Choose fast agent model:', models.zen);
    if (!fastAgentModel) {
      error('No model selected. Exiting.');
      process.exit(1);
    }
    
    info('Select model for powerful agents (oracle, ultrabrain, deep):');
    const powerfulAgentModel = await selectModel('Choose powerful agent model:', models.gemini);
    if (!powerfulAgentModel) {
      error('No model selected. Exiting.');
      process.exit(1);
    }
    
    const selections: UserSelections = {
      mainModel: `opencode/${mainModel.id}`,
      smallModel: `opencode/${smallModel.id}`,
      fastAgentModel: `opencode/${fastAgentModel.id}`,
      powerfulAgentModel: `google/${powerfulAgentModel.id}`,
      installSuperpowers,
    };
    
    success('Models selected!');

    // Step 7: Write configs
    step('Writing configurations');
    
    if (!dryRun) {
      await withSpinner('Writing configuration files...', async () => {
        if (await configExists('opencode.json')) {
          await backupConfig('opencode.json');
          info('Backed up existing opencode.json');
        }
        if (await configExists('oh-my-opencode.json')) {
          await backupConfig('oh-my-opencode.json');
          info('Backed up existing oh-my-opencode.json');
        }
        
        const newOpencodeConfig = generateOpencodeConfig(selections, opencodeConfig);
        await writeConfig('opencode.json', newOpencodeConfig);
        success('Written opencode.json');
        
        const ohMyOpencodeConfig = generateOhMyOpencodeConfig(selections);
        await writeConfig('oh-my-opencode.json', ohMyOpencodeConfig);
        success('Written oh-my-opencode.json');
      });
    } else {
      info('Skipped writing config files (dry-run)');
    }

    // Step 8: Summary
    section('Setup Complete!');
    
    console.log('\n✅ OpenCode has been configured with your selected models!\n');
    console.log('Selected configuration:');
    console.log(`  Main model: ${selections.mainModel}`);
    console.log(`  Small model: ${selections.smallModel}`);
    console.log(`  Fast agents: ${selections.fastAgentModel}`);
    console.log(`  Powerful agents: ${selections.powerfulAgentModel}`);
    console.log(`  Superpowers: ${installSuperpowers ? 'Yes' : 'No'}`);
    console.log('\n📋 Next steps:');
    console.log('  1. Restart OpenCode');
    console.log('  2. Run "opencode /connect" if not authenticated');
    console.log('\n💾 Config files:');
    console.log('  ~/.config/opencode/opencode.json');
    console.log('  ~/.config/opencode/oh-my-opencode.json');
    console.log('\n🔄 To restore previous config:');
    console.log('  Check ~/.config/opencode/backups/');
    
    outro('Happy coding!');
    
  } catch (e: any) {
    error(`Error: ${e.message}`);
    process.exit(1);
  }
}

main();
