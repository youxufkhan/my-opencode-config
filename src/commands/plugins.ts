// Required plugins for OpenCode
export function getRequiredPlugins(): string[] {
  return [
    'opencode-gemini-auth@latest',
    'oh-my-openagent@latest',
  ];
}

// Merge plugins - add required if missing
export function mergePluginConfig(existingPlugins: string[] = [], required: string[]): string[] {
  const existing = new Set(existingPlugins);
  const merged = [...existingPlugins];
  
  for (const plugin of required) {
    const baseName = plugin.replace(/@latest$/, '');
    const hasPlugin = existing.has(plugin) || 
                      existing.has(baseName) ||
                      existing.has(`${baseName}@latest`);
    
    if (!hasPlugin) {
      merged.push(plugin);
    }
  }
  
  return merged;
}
