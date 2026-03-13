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

// Known free Zen models (as fallback)
const KNOWN_ZEN_FREE_MODELS = [
  { id: 'minimax-m2.5-free', name: 'MiniMax M2.5 Free' },
  { id: 'zen-free', name: 'Zen Free' },
  { id: 'glm-5-free', name: 'GLM-5 Free' },
];

// Known Gemini models
const KNOWN_GEMINI_MODELS = [
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', recommended: true },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro' },
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash' },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
];

export async function fetchZenModels(): Promise<Model[]> {
  // Try to fetch from opencode CLI command - fallback to hardcoded list
  try {
    const { stdout } = await execAsync('opencode models opencode --verbose', {
      timeout: 30000,
    });
    
    // Output format: "opencode/model-id\n{...json...}\nopencode/model-id\n{...json...}"
    // Use regex match instead of split to avoid empty first element
    const modelBlocks = stdout.match(/^opencode\/[^\n]*\n(\{[\s\S]*?\})/gm);
    
    if (!modelBlocks) {
      // Fallback to known models if no models found
      console.error('[models] No models found in verbose output, using fallback');
      throw new Error('No models found');
    }
    
    const models: any[] = [];
    
    for (const block of modelBlocks) {
      // Extract JSON from the block (everything after the first line)
      const jsonStart = block.indexOf('{');
      if (jsonStart < 0) continue;
      
      const jsonStr = block.slice(jsonStart);
      try {
        models.push(JSON.parse(jsonStr));
      } catch (err) {
        console.error('[models] Failed to parse JSON block:', jsonStr.slice(0, 100), err instanceof Error ? err.message : 'Unknown error');
      }
    }
    
    const parsedModels = models
      .filter((m) => m.cost?.input === 0 && m.cost?.output === 0)
      .map((m) => {
        const capabilities: ModelCapabilities | undefined = m.capabilities;
        return {
          id: m.id,
          name: m.name || m.id,
          provider: 'zen' as const,
          isFree: true,
          capabilities,
          score: calculateScore(capabilities),
        };
      });

    // Find max score and mark all models with that score as recommended
    const maxScore = Math.max(...parsedModels.map(m => m.score ?? 10));
    return parsedModels.map(m => ({
      ...m,
      isRecommended: (m.score ?? 10) === maxScore,
    }));
  } catch {
    // Fallback to known models
  }
  
  return KNOWN_ZEN_FREE_MODELS.map(m => ({
    ...m,
    provider: 'zen' as const,
    isFree: true,
  }));
}

export function getGeminiModels(): Model[] {
  return KNOWN_GEMINI_MODELS.map(m => ({
    id: m.id,
    name: m.name,
    provider: 'google' as const,
    isRecommended: m.recommended,
  }));
}

export async function fetchAllModels(): Promise<{ zen: Model[], gemini: Model[] }> {
  const [zen, gemini] = await Promise.all([
    fetchZenModels(),
    Promise.resolve(getGeminiModels()),
  ]);
  
  return { zen, gemini };
}
