// Model from Zen or Gemini
export interface ModelCapabilities {
  reasoning?: boolean;
  thinking?: boolean;
  toolcall?: boolean;
  attachment?: boolean;
  input?: { image?: boolean };
  limit?: { context?: number; output?: number };
  variants?: { high?: boolean; max?: boolean };
}

export interface Model {
  id: string;
  name: string;
  provider: 'zen' | 'google';
  isFree?: boolean;
  isRecommended?: boolean;
  score?: number;
  capabilities?: ModelCapabilities;
}

// Backup entry for config files
export interface ConfigBackup {
  path: string;
  content: string;
  timestamp: string;
}

// User's model selections
export interface UserSelections {
  mainModel: string;      // e.g., "opencode/minimax-m2.5-free"
  smallModel: string;     // e.g., "opencode/minimax-m2.5-free"
  fastAgentModel: string; // e.g., "opencode/minimax-m2.5-free"
  powerfulAgentModel: string; // e.g., "google/gemini-2.5-flash"
  installSuperpowers: boolean;
}

// CLI options
export interface CliOptions {
  skipAuth?: boolean;
  skipSuperpowers?: boolean;
  dryRun?: boolean;
}

// Result of checking if OpenCode is installed
export interface OpenCodeStatus {
  installed: boolean;
  version?: string;
  path?: string;
}

// Auth status for providers
export interface AuthStatus {
  zen: boolean;
  gemini: boolean;
}
