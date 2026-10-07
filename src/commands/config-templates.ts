import { UserSelections } from '../types';
import { mergeConfigs } from '../utils/config';

export function generateOpencodeConfig(selections: UserSelections, existing: any = {}): object {
  const updates = {
    $schema: 'https://opencode.ai/config.json',
    enabled_providers: ['opencode'],
    disabled_providers: ['google', 'anthropic', 'openai', 'cloudflare-ai-gateway', 'azure', 'deepseek'],
    model: selections.mainModel,
    small_model: selections.smallModel,
    plugin: [
      'oh-my-opencode@latest'
    ],
    provider: {
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
  const baseUpdates: any = {
    $schema: 'https://raw.githubusercontent.com/code-yeongyu/oh-my-openagent/dev/assets/omo.schema.json',
  };

  if (selections.enableTeams) {
    baseUpdates.team_mode = {
      enabled: true,
      max_parallel_members: 4,
      max_members: 8,
      tmux_visualization: false
    };
  }

  // If user selected granular agent models, use them directly
  if (selections.agentModels && Object.keys(selections.agentModels).length > 0) {
    const planConsultantModel = selections.agentModels['plan-consultant'] || selections.agentModels['metis'] || selections.fastAgentModel;
    const planReviewerModel = selections.agentModels['plan-reviewer'] || selections.agentModels['momus'] || selections.powerfulAgentModel;

    const agents = {
      sisyphus: { model: selections.agentModels['sisyphus'] || selections.fastAgentModel, reasoning: 'max', variant: 'max' },
      hephaestus: { model: selections.agentModels['hephaestus'] || selections.fastAgentModel, reasoning: 'max', variant: 'max' },
      oracle: { model: selections.agentModels['oracle'] || selections.powerfulAgentModel, reasoning: 'high', variant: 'high' },
      librarian: { model: selections.agentModels['librarian'] || selections.fastAgentModel },
      explore: { model: selections.agentModels['explore'] || selections.fastAgentModel },
      'multimodal-looker': { model: selections.agentModels['multimodal-looker'] || selections.powerfulAgentModel },
      prometheus: { model: selections.agentModels['prometheus'] || selections.fastAgentModel, reasoning: 'max', variant: 'max' },
      'plan-consultant': { model: planConsultantModel, reasoning: 'max', variant: 'max' },
      metis: { model: planConsultantModel, reasoning: 'max', variant: 'max' },
      'plan-reviewer': { model: planReviewerModel, reasoning: 'high', variant: 'high' },
      momus: { model: planReviewerModel, reasoning: 'high', variant: 'high' },
      atlas: { model: selections.agentModels['atlas'] || selections.fastAgentModel }
    };

    const categories = {
      'visual-engineering': { model: selections.agentModels['visual-engineering'] || selections.powerfulAgentModel, reasoning: 'high', variant: 'high' },
      ultrabrain: { model: selections.agentModels['ultrabrain'] || selections.powerfulAgentModel, reasoning: 'high', variant: 'high' },
      deep: { model: selections.agentModels['deep'] || selections.powerfulAgentModel, reasoning: 'high', variant: 'high' },
      artistry: { model: selections.agentModels['artistry'] || selections.powerfulAgentModel, reasoning: 'high', variant: 'high' },
      quick: { model: selections.agentModels['quick'] || selections.fastAgentModel, reasoning: 'low', variant: 'low' },
      'unspecified-low': { model: selections.agentModels['unspecified-low'] || selections.fastAgentModel, reasoning: 'low', variant: 'low' },
      'unspecified-high': { model: selections.agentModels['unspecified-high'] || selections.powerfulAgentModel, reasoning: 'high', variant: 'high' },
      writing: { model: selections.agentModels['writing'] || selections.powerfulAgentModel }
    };

    const updates = {
      ...baseUpdates,
      agents,
      categories,
      '[opencode]': {
        agents,
        categories,
        ...(selections.enableTeams ? {
          team_mode: {
            enabled: true,
            max_parallel_members: 4,
            max_members: 8,
            tmux_visualization: false
          }
        } : {})
      }
    };
    
    return mergeConfigs(existing, updates);
  }
  
  // Fall back to two-role model structure (fastAgentModel and powerfulAgentModel)
  const agents = {
    sisyphus: { model: selections.fastAgentModel, reasoning: 'max', variant: 'max' },
    hephaestus: { model: selections.fastAgentModel, reasoning: 'max', variant: 'max' },
    oracle: { model: selections.powerfulAgentModel, reasoning: 'high', variant: 'high' },
    librarian: { model: selections.fastAgentModel },
    explore: { model: selections.fastAgentModel },
    'multimodal-looker': { model: selections.powerfulAgentModel },
    prometheus: { model: selections.fastAgentModel, reasoning: 'max', variant: 'max' },
    'plan-consultant': { model: selections.fastAgentModel, reasoning: 'max', variant: 'max' },
    metis: { model: selections.fastAgentModel, reasoning: 'max', variant: 'max' },
    'plan-reviewer': { model: selections.powerfulAgentModel, reasoning: 'high', variant: 'high' },
    momus: { model: selections.powerfulAgentModel, reasoning: 'high', variant: 'high' },
    atlas: { model: selections.fastAgentModel }
  };

  const categories = {
    'visual-engineering': { model: selections.powerfulAgentModel, reasoning: 'high', variant: 'high' },
    ultrabrain: { model: selections.powerfulAgentModel, reasoning: 'high', variant: 'high' },
    deep: { model: selections.powerfulAgentModel, reasoning: 'high', variant: 'high' },
    artistry: { model: selections.powerfulAgentModel, reasoning: 'high', variant: 'high' },
    quick: { model: selections.fastAgentModel, reasoning: 'low', variant: 'low' },
    'unspecified-low': { model: selections.fastAgentModel, reasoning: 'low', variant: 'low' },
    'unspecified-high': { model: selections.powerfulAgentModel, reasoning: 'high', variant: 'high' },
    writing: { model: selections.powerfulAgentModel }
  };

  const updates = {
    ...baseUpdates,
    agents,
    categories,
    '[opencode]': {
      agents,
      categories,
      ...(selections.enableTeams ? {
        team_mode: {
          enabled: true,
          max_parallel_members: 4,
          max_members: 8,
          tmux_visualization: false
        }
      } : {})
    }
  };
  
  return mergeConfigs(existing, updates);
}
