# Changelog

All notable changes to this project will be documented in this file.

## [0.2.0] - 2026-05-03

### Fixed
- **Model provider name**: Changed provider from `'zen'` to `'opencode'` to match actual OpenCode provider (models.ts, types.ts)
- **Plugin package name**: Fixed NPM package name from `oh-my-openagent@latest` to `oh-my-opencode@latest` (config-templates.ts, plugins.ts)
- **Dynamic model fetching**: Replaced hardcoded model lists with dynamic fetch from `opencode models` CLI
- **Post-write validation**: Added `validateModels()` function to verify models exist before writing config
- **Caching**: Optimized validation to cache `opencode models` output (calls once, not per model)
- **Local config override**: Removed broken local `.opencode/opencode.json` that was overriding global config

### Added
- `validateModel()` - checks if a model exists in OpenCode
- `validateModels()` - validates both opencode.json and oh-my-openagent.json configs
- Post-write validation in wizard (index.ts) with error reporting
- `getModelsList()` - cached model list fetcher

### Changed
- `fetchZenModels()` effectively renamed to dynamic `fetchOpencodeModels()` behavior
- Minimal fallback list for network failures only (removed extensive hardcoded lists)
- Provider type: `'zen' | 'google'` → `'opencode' | 'google'`

## [0.1.1] - 2026-03-14

### Initial release
- Interactive CLI wizard for OpenCode configuration
- Support for OpenCode Zen free models
- Support for Google Gemini models
- oh-my-openagent plugin integration
- Superpowers skill integration
- Single model / individual model selection strategies
