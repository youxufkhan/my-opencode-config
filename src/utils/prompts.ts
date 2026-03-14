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
