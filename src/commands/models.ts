import { Model } from '../types';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

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
      timeout: 10000,
    });
    
    const models = JSON.parse(stdout.trim());
    
    return (models || [])
      .filter((m: any) => m.cost?.input === 0 && m.cost?.output === 0)
      .map((m: any) => ({
        id: m.id,
        name: m.name || m.id,
        provider: 'zen' as const,
        isFree: true,
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
