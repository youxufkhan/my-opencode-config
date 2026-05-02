import { confirm, select, spinner } from '@clack/prompts';
import { Model } from '../types';

export async function promptConfirm(message: string): Promise<boolean> {
  const value = await confirm({
    message,
  });
  
  return value === true;
}

export async function selectModel(message: string, models: Model[]): Promise<Model | null> {
  const options = models.map(m => ({
    value: m.id,
    label: formatModelLabel(m),
  }));
  
  const selected = await select({
    message,
    options,
  });
  
  if (!selected) return null;
  
  return models.find(m => m.id === selected) || null;
}

export async function selectModelStrategy(): Promise<'single' | 'individual'> {
  const strategy = await select({
    message: 'How would you like to select models?',
    options: [
      {
        value: 'single',
        label: 'Single model for all agents, main, and small tasks',
      },
      {
        value: 'individual',
        label: 'Different models for each (main, small, agents)',
      },
    ],
  });

  return strategy as 'single' | 'individual';
}

export async function selectProvider(): Promise<'google' | 'opencode'> {
  const provider = await select({
    message: 'Which provider would you like to use?',
    options: [
      {
        value: 'google',
        label: 'Google Gemini',
      },
      {
        value: 'opencode',
        label: 'OpenCode Zen',
      },
    ],
  });

  return provider as 'google' | 'opencode';
}

export async function selectModelFromProvider(
  message: string,
  models: Model[]
): Promise<Model | null> {
  if (models.length === 0) {
    return null;
  }

  const options = models.map(m => ({
    value: m.id,
    label: formatModelLabel(m),
  }));

  const selected = await select({
    message,
    options,
  });

  if (!selected) return null;

  return models.find(m => m.id === selected) || null;
}

export async function selectModelWithProvider(
  message: string,
  zenModels: Model[],
  geminiModels: Model[]
): Promise<string | null> {
  const provider = await selectProvider();

  const availableModels = provider === 'google' ? geminiModels : zenModels;
  const selectedModel = await selectModelFromProvider(message, availableModels);

  if (!selectedModel) return null;

  return `${selectedModel.provider}/${selectedModel.id}`;
}

export async function selectAgentCategoryModels(
  agents: string[],
  categories: string[],
  zenModels: Model[],
  geminiModels: Model[]
): Promise<Record<string, string>> {
  const agentModels: Record<string, string> = {};

  console.log('\n📋 Configuring models for each agent and category...\n');

  // Select models for agents
  for (const agent of agents) {
    const model = await selectModelWithProvider(
      `Select model for agent: ${agent}`,
      zenModels,
      geminiModels
    );

    if (model) {
      agentModels[agent] = model;
    }
  }

  // Select models for categories
  for (const category of categories) {
    const model = await selectModelWithProvider(
      `Select model for category: ${category}`,
      zenModels,
      geminiModels
    );

    if (model) {
      agentModels[category] = model;
    }
  }

  return agentModels;
}

export async function selectModels(
  message: string, 
  models: Model[], 
  count: number
): Promise<Model[]> {
  const selected: Model[] = [];
  
  for (let i = 0; i < count; i++) {
    const remaining = models.filter(m => !selected.some(s => s.id === m.id));
    
    if (remaining.length === 0) break;
    
    const remainingOptions = remaining.map(m => ({
      value: m.id,
      label: formatModelLabel(m),
    }));
    
    const selectedId = await select({
      message: `${message} (${i + 1}/${count})`,
      options: remainingOptions,
    });
    
    if (!selectedId) break;
    
    const model = models.find(m => m.id === selectedId);
    if (model) selected.push(model);
  }
  
  return selected;
}

function formatModelLabel(model: Model): string {
  const scoreStr = model.score !== undefined ? ` (Score: ${model.score})` : ' (Score: N/A)';
  let label = model.name + scoreStr;
  
  if (model.isFree) {
    label += ' [FREE]';
  }
  
  if (model.isRecommended) {
    label += ' ⭐';
  }
  
  return label;
}

export async function withSpinner<T>(
  message: string, 
  fn: () => Promise<T>
): Promise<T> {
  const s = spinner();
  s.start(message);
  
  try {
    const result = await fn();
    s.stop(message);
    return result;
  } catch (error) {
    s.stop(message);
    throw error;
  }
}
