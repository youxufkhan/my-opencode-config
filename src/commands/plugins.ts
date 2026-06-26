// Required plugins for OpenCode
export function getRequiredPlugins(): string[] {
  return [
    'oh-my-opencode@latest',
  ];
}

// Merge plugins - add required if missing
export function mergePluginConfig(existingPlugins: string[] = [], required: string[]): string[] {
  let merged = [...existingPlugins];
  
  // Clean up legacy oh-my-openagent to avoid duplicate OMO plugin entries
  const requiresOmo = required.some(p => p.startsWith('oh-my-opencode'));
  if (requiresOmo) {
    merged = merged.filter(p => p !== 'oh-my-openagent' && p !== 'oh-my-openagent@latest');
  }

  const existing = new Set(merged);
  
  for (const plugin of required) {
    const baseName = plugin.replace(/@latest$/, '');
    const hasPlugin = existing.has(plugin) || 
                      existing.has(baseName) ||
                      existing.has(`${baseName}@latest`);
    
    if (!hasPlugin) {
      merged.push(plugin);
    }
  }
  
  // Deduplicate completely (in case existingPlugins had duplicates)
  return [...new Set(merged)];
}
