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
      'oh-my-openagent@latest'
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
