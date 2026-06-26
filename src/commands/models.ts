import { Model, ModelCapabilities } from '../types';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Calculate score based on capabilities
function calculateScore(capabilities: ModelCapabilities | undefined): number {
  if (!capabilities) return 10;

  let score = 10; // Base score

  if (capabilities.reasoning) score += 5;
  if (capabilities.thinking) score += 10;
  if (capabilities.toolcall) score += 5;
  if (capabilities.attachment) score += 5;
  if (capabilities.input?.image) score += 3;
  if (capabilities.variants?.high) score += 3;
  if (capabilities.variants?.max) score += 3;
  if ((capabilities.limit?.context ?? 0) > 100000) score += 3;
  if ((capabilities.limit?.output ?? 0) > 100000) score += 3;

  return score;
}

export async function fetchZenModels(): Promise<Model[]> {
  try {
    const { stdout } = await execAsync('opencode models opencode --verbose', {
      timeout: 30000,
    });
    
    // Output format: "opencode/model-id\n{...json...}\nopencode/model-id\n{...json...}"
    // Need to properly parse JSON blocks by tracking brace depth
    const lines = stdout.split('\n');
    const models: any[] = [];
    let currentJson = '';
    let braceDepth = 0;
    let inJson = false;
    
    for (const line of lines) {
      if (line.startsWith('opencode/')) {
        // Start of new model block - reset
        currentJson = '';
        braceDepth = 0;
        inJson = false;
        continue;
      }
      
      if (!inJson && line.trim() === '{') {
        inJson = true;
        braceDepth = 0;
        currentJson = '';
      }
      
      if (inJson) {
        currentJson += line + '\n';
        // Count braces to track JSON object depth
        for (const char of line) {
          if (char === '{') braceDepth++;
          if (char === '}') braceDepth--;
        }
        
        // When we've closed the top-level object (braceDepth returns to 0)
        if (braceDepth === 0 && currentJson.trim()) {
          try {
            models.push(JSON.parse(currentJson.trim()));
          } catch (err) {
            console.error('[models] Failed to parse JSON block:', currentJson.slice(0, 100), err instanceof Error ? err.message : 'Unknown error');
          }
          currentJson = '';
          inJson = false;
        }
      }
    }
    
    const parsedModels = models
      .filter((m) => m.cost?.input === 0 && m.cost?.output === 0)
      .map((m) => {
        const capabilities: ModelCapabilities | undefined = m.capabilities;
        return {
          id: m.id,
          name: m.name || m.id,
          provider: 'opencode' as const,
          isFree: true,
          capabilities,
          score: calculateScore(capabilities),
        };
      });

    // Find max score and mark all models with that score as recommended
    if (parsedModels.length === 0) {
      throw new Error('No valid free models found from OpenCode API. Please check your connection.');
    }
    
    const maxScore = Math.max(...parsedModels.map(m => m.score ?? 10));
    return parsedModels.map(m => ({
      ...m,
      isRecommended: (m.score ?? 10) === maxScore,
    }));
  } catch (error: any) {
    console.error(`[models] Failed to fetch models: ${error.message}`);
    throw error;
  }
}

export async function fetchAllModels(): Promise<{ zen: Model[] }> {
  const zen = await fetchZenModels();
  return { zen };
}

let cachedModels: string[] | null = null;

async function getModelsList(): Promise<string[]> {
  if (cachedModels) return cachedModels;
  
  try {
    const { stdout } = await execAsync(`opencode models`, { timeout: 10000 });
    cachedModels = stdout.split('\n').filter(line => line.trim());
    return cachedModels;
  } catch {
    return [];
  }
}

export async function validateModel(model: string): Promise<boolean> {
  const models = await getModelsList();
  return models.some(m => m.includes(model));
}

export async function validateModels(config: any, configType: 'opencode' | 'oh-my-openagent'): Promise<string[]> {
  const errors: string[] = [];
  const allModels = await getModelsList();
  
  if (configType === 'opencode') {
    const check = (model: string, field: string) => {
      if (model && !allModels.some(m => m.includes(model))) {
        errors.push(`${field} not found: ${model}`);
      }
    };
    
    if (config.model) check(config.model, 'model');
    if (config.small_model) check(config.small_model, 'small_model');
    
    if (config.provider?.opencode?.models) {
      const modelKeys = Object.keys(config.provider.opencode.models);
      for (const key of modelKeys) {
        const modelId = `opencode/${key}`;
        if (!allModels.some(m => m.includes(modelId))) {
          errors.push(`Provider model not found: ${modelId}`);
        }
      }
    }
  } else if (configType === 'oh-my-openagent') {
    const check = (model: string, field: string) => {
      if (model && !allModels.some(m => m.includes(model))) {
        errors.push(`${field} not found: ${model}`);
      }
    };
    
    if (config.agents) {
      for (const [agent, agentConfig] of Object.entries(config.agents)) {
        if (agentConfig && typeof agentConfig === 'object' && 'model' in agentConfig) {
          check((agentConfig as any).model, `agents.${agent}.model`);
        }
      }
    }
    
    if (config.categories) {
      for (const [category, catConfig] of Object.entries(config.categories)) {
        if (catConfig && typeof catConfig === 'object' && 'model' in catConfig) {
          check((catConfig as any).model, `categories.${category}.model`);
        }
      }
    }
  }
  
  return errors;
}
