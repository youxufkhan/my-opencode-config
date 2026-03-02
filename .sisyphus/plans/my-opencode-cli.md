# my-opencode CLI - Implementation Plan

## TL;DR

> **Quick Summary**: npx CLI package that automates OpenCode setup - installs OpenCode if missing, configures plugins, optionally installs superpowers, handles Zen/Gemini authentication, fetches live models, and generates configs based on user selections.
> 
> **Deliverables**:
> - `my-opencode` npm package (TypeScript + Clack)
> - Docker-based E2E test suite
> - Config backup/restore functionality
> 
> **Estimated Effort**: Large
> **Parallel Execution**: YES - 4 waves
> **Critical Path**: Scaffold → Core Utils → Commands → Testing → Final Verification

---

## Context

### Original Request
User wants an npx CLI package (`my-opencode`) that:
1. Checks/installs OpenCode if not present
2. Configures plugins (oh-my-opencode, opencode-gemini-auth)
3. Optionally installs superpowers from GitHub
4. Handles authentication for OpenCode Zen and Gemini via `/connect`
5. Fetches live models from Zen API and Gemini
6. Shows free Zen models + all Gemini models together
7. Interactive model selection (main, small, agents)
8. Smart config handling (backup/restore, merge vs create)
9. Docker-based E2E testing

### User Requirements
- **Auth**: Interactive /connect (spawn OpenCode subprocess)
- **Package name**: my-opencode
- **Model fetch**: Live from Zen API
- **Backup**: Yes, with restore feature
- **Model selection**: Free Zen + All Gemini together
- **Testing**: Docker-based E2E
- **Quality**: No bugs, flawless execution, all scenarios covered

---

## Work Objectives

### Core Objective
Build a production-ready npx CLI package that automates OpenCode setup with zero manual configuration required from the user.

### Concrete Deliverables
- TypeScript CLI with Clack prompts
- package.json with bin entry for npx
- Source code in src/
- Docker test suite in tests/e2e/
- README.md with usage instructions

### Definition of Done
- [ ] `npx my-opencode` runs without errors
- [ ] All 8 flow steps work correctly
- [ ] Config files created/merged correctly
- [ ] Backup/restore works
- [ ] Docker tests pass
- [ ] No bugs in any scenario

### Must Have
- Fresh install detection and installation
- Existing config detection and smart merge
- Error handling for every step
- Rollback on failures
- Comprehensive logging

### Must NOT Have
- Hardcoded paths that break on different systems
- Unhandled promise rejections
- Silent failures (always show user what's happening)
- Config overwrites without backup

---

## Verification Strategy

### Test Decision
- **Infrastructure**: Docker-based E2E testing
- **Framework**: Custom test runner in tests/e2e/
- **Test Scenarios**: 5 core scenarios covering all user flows

### QA Policy
Every task MUST include agent-executed verification. Evidence saved to `.sisyphus/evidence/`.

**Test Scenarios to Cover:**
1. Fresh install - OpenCode not present
2. Existing OpenCode - no configs
3. Existing configs - merge behavior
4. Auth failed - retry flow
5. Model selection - verify config output

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Foundation - can all run in parallel):
├── T1: Project scaffolding (package.json, tsconfig, dir structure)
├── T2: Core types (TypeScript interfaces)
├── T3: Config file utilities (read, write, backup, merge)
├── T4: OpenCode detection utility
└── T5: Logging utility

Wave 2 (Core Logic - can run in parallel):
├── T6: Model fetching (Zen API + Gemini models)
├── T7: Plugin configuration generator
├── T8: Config template generators
├── T9: Interactive prompts (Clack wrappers)
└── T10: Auth handler (/connect spawner)

Wave 3 (Main Flow - sequential due to dependencies):
├── T11: Main CLI entry point (index.ts)
├── T12: Step 1: Check/install OpenCode
├── T13: Step 2: Install plugins
├── T14: Step 3: Superpowers installation
├── T15: Step 4: Authentication flow
├── T16: Step 5-6: Model selection
├── T17: Step 7: Config writing with backup
└── T18: Step 8: Summary output

Wave 4 (Testing - can run in parallel):
├── T19: Docker test setup (Dockerfile)
├── T20: E2E test runner script
├── T21: Test verification helpers
├── T22: README documentation
└── T23: Error handling polish
```

### Dependency Matrix

- **T1**: — — T2, T3, T4, T5
- **T2**: T1 — T6, T7, T8, T9
- **T3**: T1 — T17, T18
- **T4**: T1 — T12
- **T5**: T1 — T12, T13, T14, T15, T16, T17, T18
- **T6**: T2 — T16
- **T7**: T2 — T17
- **T8**: T2, T3 — T17
- **T9**: T2, T5 — T12, T13, T14, T15, T16
- **T10**: T2, T5 — T15
- **T11**: T1, T2, T3, T4, T5 — T12-T18
- **T12**: T4, T5, T9, T11 — T13
- **T13**: T5, T9, T11, T12 — T14
- **T14**: T5, T9, T11, T13 — T15
- **T15**: T5, T9, T10, T11, T14 — T16
- **T16**: T5, T6, T9, T11, T15 — T17
- **T17**: T3, T5, T7, T8, T11, T16 — T18
- **T18**: T3, T5, T11, T17 — T19-T23

### Agent Dispatch Summary

- **Wave 1**: **5 tasks** — T1-T5 → `quick` (scaffolding, types, utils)
- **Wave 2**: **5 tasks** — T6-T10 → `unspecified-high` (core logic)
- **Wave 3**: **8 tasks** — T11-T18 → `deep` (main flow, critical)
- **Wave 4**: **5 tasks** — T19-T23 → `unspecified-high` (testing, docs)

---

## TODOs

- [x] 1. **Project scaffolding** - Create package.json, tsconfig.json, directory structure

  **What to do**:
  - Create package.json with name "my-opencode", bin entry for CLI
  - Set up tsconfig.json for TypeScript compilation
  - Create src/ directory structure: commands/, utils/
  - Add dependencies: clack, @types/node
  - Add scripts: build, test, test:e2e

  **Must NOT do**:
  - Don't add any actual code yet - just scaffold

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T2-T5)
  - **Parallel Group**: Wave 1
  - **Blocks**: T2-T5
  - **Blocked By**: None

  **References**:
  - npm package.json bin field: https://docs.npmjs.com/cli/v10/configuring-npm/package-json#bin

  **Acceptance Criteria**:
  - [ ] package.json exists with correct bin entry
  - [ ] tsconfig.json exists
  - [ ] Directory structure created

  **Commit**: YES
  - Message: `chore: scaffold project structure`
  - Files: package.json, tsconfig.json, src/

- [x] 2. **Core types** - Define TypeScript interfaces

  **What to do**:
  - Create src/types.ts with interfaces:
    - Model { id, name, provider, isFree?, isRecommended? }
    - ConfigBackup { path, content, timestamp }
    - UserSelections { mainModel, smallModel, fastAgentModel, powerfulAgentModel, installSuperpowers }
    - CliOptions { skipAuth?, skipSuperpowers?, dryRun? }
  - Export all types

  **Must NOT do**:
  - Don't implement any functions

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T1, T3-T5)
  - **Parallel Group**: Wave 1
  - **Blocks**: T6-T10
  - **Blocked By**: T1

  **References**:
  - User's existing config files show the structure

  **Acceptance Criteria**:
  - [ ] src/types.ts created with all interfaces

  **Commit**: YES
  - Message: `chore: add TypeScript interfaces`
  - Files: src/types.ts

- [x] 3. **Config file utilities** - Read, write, backup, merge functions

  **What to do**:
  - Create src/utils/config.ts with functions:
    - getConfigPath(filename: string): string - returns ~/.config/opencode/{filename}
    - configExists(filename: string): boolean
    - readConfig(filename: string): Promise<object | null>
    - backupConfig(filename: string): Promise<ConfigBackup>
    - listBackups(): ConfigBackup[]
    - restoreBackup(backup: ConfigBackup): Promise<void>
    - writeConfig(filename: string, data: object): Promise<void>
    - mergeConfigs(existing: object, updates: object): object - deep merge preserving existing values

  **Edge Cases to Handle**:
  - Config file doesn't exist → return null from readConfig
  - Config file is invalid JSON → show error, don't overwrite
  - Backup directory doesn't exist → create it
  - Disk full → show error with clear message
  - Permission denied → show error with fix instructions

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T1, T2, T4, T5)
  - **Parallel Group**: Wave 1
  - **Blocks**: T17, T18
  - **Blocked By**: T1

  **References**:
  - OpenCode config paths: ~/.config/opencode/

  **Acceptance Criteria**:
  - [ ] All functions implemented
  - [ ] Deep merge works correctly (existing values preserved)
  - [ ] Backup creates timestamped files
  - [ ] Invalid JSON handled gracefully

  **QA Scenarios**:

  Scenario: Read non-existent config
    Tool: Bash
    Preconditions: No config file exists
    Steps:
      1. Call readConfig('nonexistent.json')
    Expected Result: Returns null, no error thrown
    Evidence: .sisyphus/evidence/task-3-read-null.{ext}

  Scenario: Merge configs - existing values preserved
    Tool: Bash
    Preconditions: Existing config with values
    Steps:
      1. Call mergeConfigs({a: 1, b: 2}, {b: 3, c: 4})
    Expected Result: {a: 1, b: 3, c: 4}
    Evidence: .sisyphus/evidence/task-3-merge.{ext}

  Scenario: Backup creates file
    Tool: Bash
    Preconditions: Config file exists
    Steps:
      1. Call backupConfig('opencode.json')
    Expected Result: File created in backup dir with timestamp
    Evidence: .sisyphus/evidence/task-3-backup.{ext}

  **Commit**: YES
  - Message: `feat: add config utilities with backup/restore`
  - Files: src/utils/config.ts

- [x] 4. **OpenCode detection utility** - Check if OpenCode is installed

  **What to do**:
  - Create src/utils/opencode.ts with functions:
    - isOpenCodeInstalled(): Promise<boolean> - checks 'which opencode'
    - getOpenCodeVersion(): Promise<string | null> - gets version if installed
    - installOpenCode(): Promise<void> - runs curl install script
    - getOpenCodePath(): string - returns path to OpenCode binary

  **Edge Cases to Handle**:
  - OpenCode installed but not in PATH → check common locations
  - Install script fails → show manual install instructions
  - No internet → show error, suggest manual install
  - Permission denied on install → suggest sudo or manual install

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T1-T3, T5)
  - **Parallel Group**: Wave 1
  - **Blocks**: T12
  - **Blocked By**: T1

  **References**:
  - OpenCode install: curl -fsSL https://opencode.ai/install | bash

  **Acceptance Criteria**:
  - [ ] Correctly detects OpenCode when installed
  - [ ] Correctly detects when NOT installed
  - [ ] installOpenCode works on fresh system

  **QA Scenarios**:

  Scenario: OpenCode not installed
    Tool: Bash
    Preconditions: opencode command not in PATH
    Steps:
      1. Call isOpenCodeInstalled()
    Expected Result: Returns false
    Evidence: .sisyphus/evidence/task-4-not-installed.{ext}

  Scenario: OpenCode installed
    Tool: Bash
    Preconditions: opencode command available
    Steps:
      1. Call isOpenCodeInstalled()
    Expected Result: Returns true
    Evidence: .sisyphus/evidence/task-4-installed.{ext}

  **Commit**: YES
  - Message: `feat: add OpenCode detection utility`
  - Files: src/utils/opencode.ts

- [x] 5. **Logging utility** - Consistent logging across CLI

  **What to do**:
  - Create src/utils/logging.ts with:
    - log(message, type): Console log with colors
    - info(msg), success(msg), warn(msg), error(msg)
    - step(stepNumber, message): Show "Step N: ..."
    - spinner(text): Show loading spinner (use clack)
    - table(data): Pretty print table

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T1-T4)
  - **Parallel Group**: Wave 1
  - **Blocks**: T12-T18
  - **Blocked By**: T1

  **Acceptance Criteria**:
  - [ ] All log functions work with proper colors
  - [ ] Spinner shows during async operations

  **Commit**: YES
  - Message: `feat: add logging utilities`
  - Files: src/utils/logging.ts

- [x] 6. **Model fetching** - Fetch Zen and Gemini models

  **What to do**:
  - Create src/commands/models.ts with functions:
    - fetchZenModels(): Promise<Model[]> - fetch from Zen API, filter free
    - getGeminiModels(): Model[] - return known Gemini models with flash recommended
    - fetchAllModels(): Promise<{ zen: Model[], gemini: Model[] }>

  **Model Lists**:
  - Zen free models: minimax-m2.5-free, zen-free, glm-5-free (filter by "free" suffix)
  - Gemini models: gemini-2.5-flash (recommended), gemini-2.5-pro, gemini-2.0-flash, etc.

  **Edge Cases to Handle**:
  - Zen API unreachable → show error, allow manual model entry
  - API returns unexpected format → fallback to hardcoded list
  - No free models available → warn user, suggest paid Zen

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T7-T10)
  - **Parallel Group**: Wave 2
  - **Blocks**: T16
  - **Blocked By**: T2

  **References**:
  - Zen API: https://opencode.ai/docs/zen/

  **Acceptance Criteria**:
  - [ ] Zen models fetched and filtered for "free"
  - [ ] Gemini models returned with flash marked as recommended

  **QA Scenarios**:

  Scenario: Fetch Zen models - API reachable
    Tool: Bash
    Preconditions: Network available
    Steps:
      1. Call fetchZenModels()
    Expected Result: Array of models with isFree=true for free models
    Evidence: .sisyphus/evidence/task-6-zen-fetch.{ext}

  Scenario: Fetch Zen models - API unreachable
    Tool: Bash
    Preconditions: Network disabled
    Steps:
      1. Call fetchZenModels()
    Expected Result: Falls back to hardcoded list, shows warning
    Evidence: .sisyphus/evidence/task-6-zen-fallback.{ext}

  **Commit**: YES
  - Message: `feat: add model fetching from Zen and Gemini`
  - Files: src/commands/models.ts

- [x] 7. **Plugin configuration generator** - Generate plugin array

  **What to do**:
  - Create src/commands/plugins.ts:
    - getRequiredPlugins(): string[] - returns ["opencode-gemini-auth@latest", "oh-my-opencode@latest"]
    - mergePluginConfig(existingPlugins: string[], required: string[]): string[] - adds required if missing

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T6, T8-T10)
  - **Parallel Group**: Wave 2
  - **Blocks**: T17
  - **Blocked By**: T2

  **Acceptance Criteria**:
  - [ ] Required plugins list correct
  - [ ] Merge adds missing plugins

  **Commit**: YES
  - Message: `feat: add plugin configuration generator`
  - Files: src/commands/plugins.ts

- [x] 8. **Config template generators** - Generate opencode.json and oh-my-opencode.json

  **What to do**:
  - Create src/commands/config-templates.ts:
    - generateOpencodeConfig(selections: UserSelections, existing: object): object
    - generateOhMyOpencodeConfig(selections: UserSelections, existing: object): object

  **Template Structure** (based on user's existing config):
  - opencode.json: model, small_model, plugin, provider, enabled_providers
  - oh-my-opencode.json: agents, categories

  **Edge Cases to Handle**:
  - Existing config has custom providers → merge, don't overwrite
  - Existing config has custom MCP servers → preserve them
  - Variant field missing → default appropriately

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T6, T7, T9, T10)
  - **Parallel Group**: Wave 2
  - **Blocks**: T17
  - **Blocked By**: T2, T3

  **Acceptance Criteria**:
  - [ ] Generates valid opencode.json
  - [ ] Generates valid oh-my-opencode.json
  - [ ] Merges correctly with existing configs

  **QA Scenarios**:

  Scenario: Generate config with selections
    Tool: Bash
    Preconditions: User selections available
    Steps:
      1. Call generateOpencodeConfig with selections
    Expected Result: Valid JSON matching template
    Evidence: .sisyphus/evidence/task-8-opencode.{ext}

  Scenario: Generate oh-my-opencode with selections
    Tool: Bash
    Preconditions: User selections available
    Steps:
      1. Call generateOhMyOpencodeConfig with selections
    Expected Result: Valid JSON matching template
    Evidence: .sisyphus/evidence/task-8-ohmy.{ext}

  **Commit**: YES
  - Message: `feat: add config template generators`
  - Files: src/commands/config-templates.ts

- [x] 9. **Interactive prompts** - Clack wrappers for user input

  **What to do**:
  - Create src/utils/prompts.ts:
    - confirm(message): Promise<boolean> - yes/no prompt
    - selectModel(message, models: Model[]): Promise<Model> - model selection
    - selectModels(message, models: Model[], count: number): Promise<Model[]> - multi-select
    - promptForText(message): Promise<string> - text input

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T6-T8, T10)
  - **Parallel Group**: Wave 2
  - **Blocks**: T12-T16
  - **Blocked By**: T2, T5

  **Acceptance Criteria**:
  - [ ] confirm works for yes/no
  - [ ] selectModel shows models with proper formatting
  - [ ] Free models marked in prompt
  - [ ] Gemini flash models marked as recommended

  **Commit**: YES
  - Message: `feat: add interactive prompt utilities`
  - Files: src/utils/prompts.ts

- [x] 10. **Auth handler** - Spawn /connect for Zen and Gemini

  **What to do**:
  - Create src/commands/auth.ts:
    - authenticateZen(): Promise<void> - spawn opencode /connect for Zen
    - authenticateGemini(): Promise<void> - spawn opencode /connect for Google
    - isAuthenticated(provider: 'zen' | 'gemini'): boolean - check auth.json
    - authenticateAll(): Promise<void> - run both in sequence

  **Edge Cases to Handle**:
  - User cancels /connect → allow skip, show instructions
  - /connect fails → show error, offer retry
  - Already authenticated → skip with notice

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T6-T9)
  - **Parallel Group**: Wave 2
  - **Blocks**: T15
  - **Blocked By**: T2, T5

  **References**:
  - Auth stored in: ~/.local/share/opencode/auth.json

  **Acceptance Criteria**:
  - [ ] Spawns opencode /connect correctly
  - [ ] Detects existing auth

  **Commit**: YES
  - Message: `feat: add authentication handler`
  - Files: src/commands/auth.ts

- [x] 11. **Main CLI entry point** - Orchestrate all steps

  **What to do**:
  - Create src/index.ts:
    - Main function that runs the full flow
    - Command line argument parsing (skipAuth, skipSuperpowers, dryRun)
    - Error handling wrapper
    - Summary output at end

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3
  - **Blocks**: T12-T18
  - **Blocked By**: T1, T2, T3, T4, T5

  **Acceptance Criteria**:
  - [ ] CLI runs without errors
  - [ ] All arguments parsed correctly

  **Commit**: YES
  - Message: `feat: add main CLI entry point`
  - Files: src/index.ts

- [x] 12. **Step 1: Check/install OpenCode** - First flow step

  **What to do**:
  - Create src/commands/steps/step1-check-opencode.ts:
    - run(): Promise<boolean> - returns true if OpenCode is now available
    - Logic: check → if missing, prompt user → install → verify

  **Edge Cases to Handle**:
  - User declines install → exit gracefully
  - Install fails → show manual instructions, exit
  - Already installed → skip with message

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3
  - **Blocks**: T13
  - **Blocked By**: T4, T5, T9, T11

  **Acceptance Criteria**:
  - [ ] Detects missing OpenCode
  - [ ] Prompts for installation
  - [ ] Installs successfully
  - [ ] Skips if already installed

  **QA Scenarios**:

  Scenario: OpenCode not present - user accepts install
    Tool: Bash
    Preconditions: opencode not installed
    Steps:
      1. Run step 1, user accepts install
    Expected Result: OpenCode installed, returns true
    Evidence: .sisyphus/evidence/task-12-install-accept.{ext}

  Scenario: OpenCode not present - user declines install
    Tool: Bash
    Preconditions: opencode not installed
    Steps:
      1. Run step 1, user declines
    Expected Result: Returns false, exits gracefully
    Evidence: .sisyphus/evidence/task-12-install-decline.{ext}

  **Commit**: YES
  - Message: `feat: add step 1 - check/install OpenCode`
  - Files: src/commands/steps/step1-check-opencode.ts

- [x] 13. **Step 2: Install plugins** - Configure oh-my-opencode and gemini-auth

  **What to do**:
  - Create src/commands/steps/step2-install-plugins.ts:
    - run(): Promise<void>
    - Reads existing opencode.json, merges plugin array

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3
  - **Blocks**: T14
  - **Blocked By**: T5, T9, T11, T12

  **Acceptance Criteria**:
  - [ ] Plugins added to config
  - [ ] Existing plugins preserved

  **Commit**: YES
  - Message: `feat: add step 2 - install plugins`
  - Files: src/commands/steps/step2-install-plugins.ts

- [x] 14. **Step 3: Superpowers installation** - Optional git clone + symlinks

  **What to do**:
  - Create src/commands/steps/step3-superpowers.ts:
    - run(): Promise<boolean> - returns true if installed
    - Prompt user: "Would you like to install superpowers?"
    - If yes: git clone + create symlinks
    - If no: skip

  **Edge Cases to Handle**:
  - Already installed → offer update
  - Git not installed → show error with fix instructions
  - Clone fails → show error, allow retry

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3
  - **Blocks**: T15
  - **Blocked By**: T5, T9, T11, T13

  **Acceptance Criteria**:
  - [ ] Prompt shown to user
  - [ ] Installs if user says yes
  - [ ] Skips if user says no

  **QA Scenarios**:

  Scenario: User accepts superpowers install
    Tool: Bash
    Preconditions: Git available
    Steps:
      1. Run step 3, user accepts
    Expected Result: Superpowers cloned and symlinked
    Evidence: .sisyphus/evidence/task-14-superpowers-yes.{ext}

  **Commit**: YES
  - Message: `feat: add step 3 - superpowers installation`
  - Files: src/commands/steps/step3-superpowers.ts

- [x] 15. **Step 4: Authentication flow** - Run /connect for Zen and Gemini

  **What to do**:
  - Create src/commands/steps/step4-auth.ts:
    - run(): Promise<void>
    - Prompt: "Authenticate with OpenCode Zen?" → /connect
    - Prompt: "Authenticate with Google Gemini?" → /connect
    - Option to skip any

  **Edge Cases to Handle**:
  - Already authenticated → skip with notice
  - User skips → don't block, show instructions
  - Auth fails → allow retry

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3
  - **Blocks**: T16
  - **Blocked By**: T5, T9, T10, T11, T14

  **Acceptance Criteria**:
  - [ ] Prompts for both Zen and Gemini
  - [ ] Spawns /connect correctly
  - [ ] Allows skip

  **Commit**: YES
  - Message: `feat: add step 4 - authentication flow`
  - Files: src/commands/steps/step4-auth.ts

- [x] 16. **Step 5-6: Model selection** - Interactive model picking

  **What to do**:
  - Create src/commands/steps/step5-6-model-selection.ts:
    - run(): Promise<UserSelections>
    - Step 5: Select main model (from free Zen)
    - Step 6: Select small model (from free Zen)
    - Step 7: Select agent models (fast + powerful from Zen + Gemini)

  **Model Categories**:
  - Free Zen models (for main, small, fast agents)
  - All Gemini models (for powerful agents, flash recommended)

  **Edge Cases to Handle**:
  - No free Zen models → warn, suggest paid
  - API fails → allow manual entry or retry

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3
  - **Blocks**: T17
  - **Blocked By**: T5, T6, T9, T11, T15

  **Acceptance Criteria**:
  - [ ] Shows free Zen models
  - [ ] Shows all Gemini models
  - [ ] Flash models marked as recommended
  - [ ] Returns complete UserSelections

  **Commit**: YES
  - Message: `feat: add step 5-6 - model selection`
  - Files: src/commands/steps/step5-6-model-selection.ts

- [x] 17. **Step 7: Config writing** - Generate and write all configs

  **What to do**:
  - Create src/commands/steps/step7-write-configs.ts:
    - run(selections: UserSelections): Promise<void>
    - Backup existing configs first
    - Generate opencode.json
    - Generate oh-my-opencode.json
    - Write both with proper formatting

  **Edge Cases to Handle**:
  - Write fails → restore from backup
  - Invalid JSON generated → don't write, show error
  - Disk full → restore backup, show error

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3
  - **Blocks**: T18
  - **Blocked By**: T3, T5, T7, T8, T11, T16

  **Acceptance Criteria**:
  - [ ] Backups created before write
  - [ ] Configs written correctly
  - [ ] Rollback works on failure

  **QA Scenarios**:

  Scenario: Write configs with selections
    Tool: Bash
    Preconditions: User selections made
    Steps:
      1. Run step 7 with selections
    Expected Result: Configs written with correct values
    Evidence: .sisyphus/evidence/task-17-write.{ext}

  Scenario: Write fails - rollback works
    Tool: Bash
    Preconditions: Disk full simulation
    Steps:
      1. Run step 7, write fails
    Expected Result: Backup restored, error shown
    Evidence: .sisyphus/evidence/task-17-rollback.{ext}

  **Commit**: YES
  - Message: `feat: add step 7 - write configurations`
  - Files: src/commands/steps/step7-write-configs.ts

- [x] 18. **Step 8: Summary output** - Final summary and next steps

  **What to do**:
  - Create src/commands/steps/step8-summary.ts:
    - run(selections: UserSelections): Promise<void>
    - Show what was configured
    - Show next steps (restart OpenCode)
    - Show how to restore if needed

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3
  - **Blocks**: T19-T23
  - **Blocked By**: T3, T5, T11, T17

  **Acceptance Criteria**:
  - [ ] Shows summary of selections
  - [ ] Shows next steps clearly

  **Commit**: YES
  - Message: `feat: add step 8 - summary output`
  - Files: src/commands/steps/step8-summary.ts

- [x] 19. **Docker test setup** - Create Dockerfile for E2E tests

  **What to do**:
  - Create tests/e2e/Dockerfile:
    - Ubuntu 22.04 base
    - Install Node.js, npm, git, curl
    - No OpenCode pre-installed (fresh install scenario)
    - Working directory: /test

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T20-T23)
  - **Parallel Group**: Wave 4
  - **Blocks**: T20
  - **Blocked By**: T18

  **Acceptance Criteria**:
  - [ ] Docker image builds
  - [ ] Has Node.js, git, curl

  **Commit**: YES
  - Message: `test: add Docker test setup`
  - Files: tests/e2e/Dockerfile

- [ ] 20. **E2E test runner** - Script to run Docker tests

  **What to do**:
  - Create tests/e2e/run.sh:
    - Build Docker image
    - Run container
    - Mount package files
    - Run CLI inside container
    - Capture output
    - Validate results

  **Test Scenarios**:
  1. Fresh install (OpenCode not present)
  2. Existing config merge
  3. Auth skipped
  4. Model selection
  5. Config output verification

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T19, T21-T23)
  - **Parallel Group**: Wave 4
  - **Blocks**: None
  - **Blocked By**: T18, T19

  **Acceptance Criteria**:
  - [ ] Script runs Docker
  - [ ] Captures test results

  **Commit**: YES
  - Message: `test: add E2E test runner`
  - Files: tests/e2e/run.sh

- [ ] 21. **Test verification helpers** - Validate test outputs

  **What to do**:
  - Create tests/e2e/verify.ts:
    - validateConfig(filename: string, expected: object): boolean
    - validateBackupExists(): boolean
    - validateModelsInConfig(): boolean

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T19-T20, T22-T23)
  - **Parallel Group**: Wave 4
  - **Blocks**: None
  - **Blocked By**: T18

  **Acceptance Criteria**:
  - [ ] All validators work

  **Commit**: YES
  - Message: `test: add verification helpers`
  - Files: tests/e2e/verify.ts

- [x] 22. **README documentation** - Usage instructions

  **What to do**:
  - Create README.md:
    - Installation: npx my-opencode
    - What it does (8 steps)
    - Requirements
    - Troubleshooting
    - Manual configuration instructions

  **Recommended Agent Profile**:
  - **Category**: `writing`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T19-T21, T23)
  - **Parallel Group**: Wave 4
  - **Blocks**: None
  - **Blocked By**: T18

  **Acceptance Criteria**:
  - [ ] Clear usage instructions
  - [ ] Troubleshooting section

  **Commit**: YES
  - Message: `docs: add README with usage instructions`
  - Files: README.md

- [ ] 23. **Error handling polish** - Final error handling pass

  **What to do**:
  - Review all error handling
  - Add missing try/catch
  - Ensure all errors show helpful messages
  - Test error scenarios

  **Edge Cases to Verify**:
  - Network failure during install
  - Permission denied
  - Invalid JSON in existing config
  - User cancels mid-flow

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with T19-T22)
  - **Parallel Group**: Wave 4
  - **Blocks**: None
  - **Blocked By**: T18

  **Acceptance Criteria**:
  - [ ] No unhandled promise rejections
  - [ ] All errors have helpful messages

  **Commit**: YES
  - Message: `fix: polish error handling`

---

## Final Verification Wave

- [ ] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file). For each "Must NOT Have": search codebase for forbidden patterns.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
  Run tsc --noEmit + linter. Review all changed files for: any/ts-ignore, empty catches, console.log in prod.
  Output: `Build [PASS/FAIL] | Lint [PASS/FAIL] | Files [N clean/N issues] | VERDICT`

- [ ] F3. **Docker E2E Tests** — `unspecified-high`
  Run Docker tests. Execute every scenario: fresh install, config merge, auth skip, model selection.
  Output: `Scenarios [N/N pass] | VERDICT`

- [ ] F4. **Manual Verification** — `deep`
  Run CLI locally with actual OpenCode. Verify all 8 steps work. Check config outputs.
  Output: `Steps [N/8 working] | Configs correct [YES/NO] | VERDICT`

---

## Commit Strategy

- Each task (T1-T23) commits independently with descriptive message
- Final verification wave does NOT commit (review only)

---

## Success Criteria

### Verification Commands
```bash
# Build
npm run build

# Type check
npx tsc --noEmit

# Run tests
npm run test:e2e

# Manual verification
npx my-opencode --dry-run
```

### Final Checklist
- [ ] All 23 tasks implemented
- [ ] TypeScript compiles without errors
- [ ] Docker tests pass
- [ ] All 8 flow steps work
- [ ] Config files generated correctly
- [ ] Backup/restore works
- [ ] Error handling complete
- [ ] No bugs in any scenario
