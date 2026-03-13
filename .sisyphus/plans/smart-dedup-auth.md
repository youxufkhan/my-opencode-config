# Work Plan: Smart Deduplication & Authentication

## TL;DR

> **Quick Summary**: Fix two issues - (1) config merge deduplication so plugins/models don't duplicate on each run, and (2) smart authentication that only prompts for providers not already authenticated.
> 
> **Deliverables**:
> - Config merge deduplicates arrays (plugins, models, providers)
> - Auth flow checks existing providers and only prompts for missing ones
> 
> **Estimated Effort**: Short
> **Parallel Execution**: NO - sequential (small fixes)
> **Critical Path**: Fix merge → Fix auth → Build → Test

---

## Context

### Issue 1: Duplicate Plugins/Models
**Root Cause**: `src/utils/config.ts` line 102-103:
```typescript
result[key] = [...existingValue, ...updateValue]; // Concatenates!
```

**Evidence from ~/.config/opencode/opencode.json**:
- `disabled_providers` has duplicates: `["anthropic", "openai", ..., "anthropic", "openai", ...]`
- `plugin` array would grow on each run
- Models get added repeatedly

### Issue 2: Always Prompts for Auth
**Current behavior**: Always asks "Would you like to authenticate?" even if already authenticated.

**Expected behavior**: Check auth.json, only prompt for unauthenticated providers.

### Auth File Location
`~/.local/share/opencode/auth.json` contains:
- `opencode` → OpenCode Zen (API key)
- `google` → Gemini (OAuth)

---

## Work Objectives

### Must Have
- [ ] Arrays in config merge use Set to remove duplicates
- [ ] Auth flow checks existing providers before prompting
- [ ] Only prompts for unauthenticated providers (zen, gemini)

### Must NOT Have
- [ ] Don't break existing functionality
- [ ] Don't lose existing config values

---

## Verification Strategy

### Test Decision
- **Infrastructure exists**: NO
- **Automated tests**: None
- **Framework**: N/A

### QA Policy
- Run CLI multiple times, verify no duplicates in config
- Test auth flow with already-authenticated provider

---

## Execution Strategy

### Sequential Execution

**Wave 1:**
1. Fix config merge deduplication
2. Fix smart authentication

**Wave 2:**
3. Build and test

---

## TODOs

- [x] 1. Fix config merge deduplication

  **What to do**:
  - Modify `src/utils/config.ts` - the `mergeConfigs` function
  - Change array merge logic from concatenation to Set-based deduplication
  - Line 102-103: Change `[...existingValue, ...updateValue]` to `[...new Set([...existingValue, ...updateValue])]`
  - This handles: `plugin[]`, `enabled_providers[]`, `disabled_providers[]`, and nested model arrays

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Blocks**: Task 2
  - **Blocked By**: None

  **References**:
  - `src/utils/config.ts:92-113` - mergeConfigs function

  **Acceptance Criteria**:
  - [ ] Run CLI twice, verify plugins don't duplicate
  - [ ] disabled_providers stays clean

  **QA Scenarios**:

  Scenario: No duplicate plugins after multiple runs
    Tool: Bash
    Preconditions: Existing opencode.json with plugins
    Steps:
      1. Run CLI with same options
      2. Check ~/.config/opencode/opencode.json
    Expected Result: plugin array has unique items only
    Failure Indicators: Duplicates in array

- [x] 2. Fix smart authentication

  **What to do**:
  - Modify `src/index.ts` auth step (lines 134-143)
  - Add NEW function in `src/commands/auth.ts` for smart auth:
    ```typescript
    export async function authenticateIfNeeded(): Promise<void> {
      const status = await getAuthStatus();
      
      // If already fully authenticated, skip
      if (status.zen && status.gemini) {
        console.log('✅ Already authenticated for all providers');
        return;
      }
      
      // Show which providers need authentication
      const missing = [];
      if (!status.zen) missing.push('OpenCode Zen');
      if (!status.gemini) missing.push('Google Gemini');
      
      console.log(`\n📋 Providers to authenticate: ${missing.join(', ')}\n`);
      
      // Spawn /connect ONCE (user can select multiple providers)
      await spawnOpencodeConnect();
      
      // Re-check and report
      const newStatus = await getAuthStatus();
      if (newStatus.zen && !status.zen) console.log('✅ Zen authenticated');
      if (newStatus.gemini && !status.gemini) console.log('✅ Gemini authenticated');
    }
    ```
  - Replace the current auth step in index.ts to call `authenticateIfNeeded()`
  - Remove or deprecate the old `authenticateAll()` function (it has a bug - spawns /connect twice!)

  **Key insight**: The old `authenticateAll()` calls `authenticateZen()` then `authenticateGemini()`, each spawning `/connect`. This is wrong - `/connect` allows selecting multiple providers in one session.

  **Must NOT do**:
  - Don't break the spawn subprocess behavior

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Blocks**: Task 3
  - **Blocked By**: Task 1

  **References**:
  - `src/commands/auth.ts:26-33` - getAuthStatus function
  - `src/commands/auth.ts:9-24` - isAuthenticated function

  **Acceptance Criteria**:
  - [ ] If zen is authenticated, don't prompt for zen
  - [ ] If gemini is authenticated, don't prompt for gemini
  - [ ] Only prompt for providers that aren't authenticated

  **QA Scenarios**:

  Scenario: Already authenticated - no prompt
    Tool: interactive_bash
    Preconditions: Both zen and google authenticated in auth.json
    Steps:
      1. Run CLI
      2. Observe no auth prompt appears
    Expected Result: Skips authentication step silently or shows "already authenticated"
    Failure Indicators: Still prompts even when authenticated

- [ ] 3. Build and verify

  **What to do**:
  - Run `npm run build`
  - Verify no errors

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Acceptance Criteria**:
  - [ ] Build passes
  - [ ] dist/index.js exists

---

## Final Verification Wave

- [ ] F1. **Integration Test** — Run CLI twice, verify config doesn't grow
- [ ] F2. **Auth Test** — Verify smart auth works correctly

---

## Commit Strategy

- **1**: `fix(config): deduplicate arrays on merge` — src/utils/config.ts
- **2**: `feat(auth): smart auth - only prompt for unauthenticated providers` — src/index.ts

---

## Success Criteria

### Verification Commands
```bash
npm run build  # Passes
# Run CLI twice, check opencode.json has no duplicates
```

### Final Checklist
- [x] Arrays deduplicated on merge
- [x] Smart auth only prompts for missing providers
- [x] Build passes
