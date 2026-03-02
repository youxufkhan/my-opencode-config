import { Model } from '../types';

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
  // Try to fetch from Zen API - fallback to hardcoded list
  try {
    const response = await fetch('https://opencode.ai/zen/api/models');
    if (response.ok) {
      const data = await response.json() as any;
      return (data.models || [])
      return data.models
        ?.filter((m: any) => m.id?.toLowerCase().endsWith('free'))
        .map((m: any) => ({
          id: m.id,
          name: m.name || m.id,
          provider: 'zen' as const,
          isFree: true,
        })) || [];
    }
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
