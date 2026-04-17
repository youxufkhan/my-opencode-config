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
      
      if (line.trim() === '{') {
        inJson = true;
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
          provider: 'zen' as const,
          isFree: true,
          capabilities,
          score: calculateScore(capabilities),
        };
      });

    // Find max score and mark all models with that score as recommended
    if (parsedModels.length === 0) {
      console.error('[models] No valid free models found, using fallback');
      throw new Error('No valid models found');
    }
    
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
