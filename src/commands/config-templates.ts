import { UserSelections } from '../types';
import { mergeConfigs } from '../utils/config';

export function generateOpencodeConfig(selections: UserSelections, existing: any = {}): object {
  const updates = {
    $schema: 'https://opencode.ai/config.json',
    enabled_providers: ['opencode', 'google'],
    disabled_providers: ['anthropic', 'openai', 'cloudflare-ai-gateway', 'azure', 'deepseek'],
    model: selections.mainModel,
    small_model: selections.smallModel,
    plugin: [
      'opencode-gemini-auth@latest',
      'oh-my-opencode@latest'
    ],
    provider: {
      google: {
        models: {
          'gemini-2.5-flash': {
            options: {
              thinkingConfig: {
                includeThoughts: true,
                thinkingBudget: 8192
              }
            }
          },
          'gemini-2.5-pro': {
            options: {
              thinkingConfig: {
                includeThoughts: true,
                thinkingBudget: 8192
              }
            }
          }
        }
      },
      opencode: {
        models: {
          [selections.mainModel.replace('opencode/', '')]: {},
          [selections.smallModel.replace('opencode/', '')]: {},
        }
      }
    }
  };
  
  return mergeConfigs(existing, updates);
}

export function generateOhMyOpenagentConfig(selections: UserSelections, existing: any = {}): object {
  // If user selected granular agent models, use them directly
  if (selections.agentModels && Object.keys(selections.agentModels).length > 0) {
    const updates = {
      $schema: 'https://raw.githubusercontent.com/code-yeongyu/oh-my-openagent/main/assets/oh-my-openagent.schema.json',
      agents: {
        sisyphus: { model: selections.agentModels['sisyphus'] || selections.fastAgentModel, variant: 'max' },
        hephaestus: { model: selections.agentModels['hephaestus'] || selections.fastAgentModel, variant: 'max' },
        oracle: { model: selections.agentModels['oracle'] || selections.powerfulAgentModel, variant: 'high' },
        librarian: { model: selections.agentModels['librarian'] || selections.fastAgentModel },
        explore: { model: selections.agentModels['explore'] || selections.fastAgentModel },
        'multimodal-looker': { model: selections.agentModels['multimodal-looker'] || selections.powerfulAgentModel },
        prometheus: { model: selections.agentModels['prometheus'] || selections.fastAgentModel, variant: 'max' },
        metis: { model: selections.agentModels['metis'] || selections.fastAgentModel, variant: 'max' },
        momus: { model: selections.agentModels['momus'] || selections.powerfulAgentModel, variant: 'medium' },
        atlas: { model: selections.agentModels['atlas'] || selections.fastAgentModel }
      },
      categories: {
        'visual-engineering': { model: selections.agentModels['visual-engineering'] || selections.powerfulAgentModel, variant: 'high' },
        ultrabrain: { model: selections.agentModels['ultrabrain'] || selections.powerfulAgentModel, variant: 'high' },
        deep: { model: selections.agentModels['deep'] || selections.powerfulAgentModel, variant: 'high' },
        artistry: { model: selections.agentModels['artistry'] || selections.powerfulAgentModel, variant: 'high' },
        quick: { model: selections.agentModels['quick'] || selections.fastAgentModel },
        'unspecified-low': { model: selections.agentModels['unspecified-low'] || selections.fastAgentModel },
        'unspecified-high': { model: selections.agentModels['unspecified-high'] || selections.powerfulAgentModel },
        writing: { model: selections.agentModels['writing'] || selections.powerfulAgentModel }
      }
    };
    
    return mergeConfigs(existing, updates);
  }
  
  // Fall back to two-role model structure (fastAgentModel and powerfulAgentModel)
  const updates = {
    $schema: 'https://raw.githubusercontent.com/code-yeongyu/oh-my-openagent/main/assets/oh-my-openagent.schema.json',
    agents: {
      sisyphus: { model: selections.fastAgentModel, variant: 'max' },
      hephaestus: { model: selections.fastAgentModel, variant: 'max' },
      oracle: { model: selections.powerfulAgentModel, variant: 'high' },
      librarian: { model: selections.fastAgentModel },
      explore: { model: selections.fastAgentModel },
      'multimodal-looker': { model: selections.powerfulAgentModel },
      prometheus: { model: selections.fastAgentModel, variant: 'max' },
      metis: { model: selections.fastAgentModel, variant: 'max' },
      momus: { model: selections.powerfulAgentModel, variant: 'medium' },
      atlas: { model: selections.fastAgentModel }
    },
    categories: {
      'visual-engineering': { model: selections.powerfulAgentModel, variant: 'high' },
      ultrabrain: { model: selections.powerfulAgentModel, variant: 'high' },
      deep: { model: selections.powerfulAgentModel, variant: 'high' },
      artistry: { model: selections.powerfulAgentModel, variant: 'high' },
      quick: { model: selections.fastAgentModel },
      'unspecified-low': { model: selections.fastAgentModel },
      'unspecified-high': { model: selections.powerfulAgentModel },
      writing: { model: selections.powerfulAgentModel }
    }
  };
  
  return mergeConfigs(existing, updates);
}
