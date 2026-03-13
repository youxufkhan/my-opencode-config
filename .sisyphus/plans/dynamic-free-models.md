# Work Plan: Dynamic Free Models Fetching

## TL;DR

> **Quick Summary**: Replace hardcoded fallback models with dynamic fetching from `opencode models` command. Filter for free models (cost.input === 0 && cost.output === 0), with fallback to hardcoded list.
> 
> **Deliverables**:
> - Fetch latest Zen models dynamically using `opencode models opencode --verbose`
> - Filter and display only FREE models (cost = 0)
> - Keep hardcoded fallback if command fails
> 
> **Estimated Effort**: Short
> **Parallel Execution**: NO - sequential
> **Critical Path**: Implement fetch → Test → Build

---

## Context

### Current Problem
- `src/commands/models.ts` has hardcoded `KNOWN_ZEN_FREE_MODELS` as fallback
- The API at `https://opencode.ai/zen/api/models` seems broken (returns malformed data with duplicate return statements)
- Hardcoded list gets stale - models may become paid or new free models appear

### Solution
Use `opencode models opencode --verbose` command which returns full model info including cost:
- Free models have `cost.input === 0 && cost.output === 0`
- Current free models: big-pickle, gpt-5-nano, mimo-v2-flash-free, nemotron-3-super-free, minimax-m2.5-free, zen-free

---

## Work Objectives

### Must Have
- [ ] Fetch models using `opencode models opencode --verbose` command
- [ ] Parse JSON output to extract model info
- [ ] Filter for free models (input: 0, output: 0)
- [ ] Fallback to hardcoded list on any error
- [ ] Preserve existing Gemini model fetching (unchanged)

### Must NOT Have
- [ ] Don't break existing functionality
- [ ] Don't remove the fallback - it's important for reliability

---

## Verification Strategy

### Test Decision
- **Infrastructure exists**: NO
- **Automated tests**: None
- **Framework**: N/A

### QA Policy
- Run CLI, verify free models are fetched
- Test fallback works when command fails

---

## Execution Strategy

### Wave 1: Implementation
1. Modify fetchZenModels() function

### Wave 2: Verification  
2. Build and test

---

## TODOs

- [x] 1. Implement dynamic Zen models fetching

  **What to do**:
  - Modify `src/commands/models.ts` - the `fetchZenModels()` function
  - Replace the broken API call with `opencode models opencode --verbose` command
  - Use `child_process.exec` to run the command
  - Parse stdout as JSON
  - Filter models where `model.cost?.input === 0 && model.cost?.output === 0`
  - Map to `{ id, name, provider: 'zen', isFree: true }`
  - Keep KNOWN_ZEN_FREE_MODELS as fallback if command fails

  **Code approach**:
  ```typescript
  import { exec } from 'child_process';
  import { promisify } from 'util';
  const execAsync = promisify(exec);
  
  export async function fetchZenModels(): Promise<Model[]> {
    try {
      const { stdout } = await execAsync('opencode models opencode --verbose');
      const models = JSON.parse(stdout);
      
      return models
        .filter((m: any) => m.cost?.input === 0 && m.cost?.output === 0)
        .map((m: any) => ({
          id: m.id,
          name: m.name || m.id,
          provider: 'zen' as const,
          isFree: true,
        }));
    } catch {
      // Fallback
    }
    
    return KNOWN_ZEN_FREE_MODELS.map(m => ({...m, provider: 'zen', isFree: true }));
  }
  ```

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Blocks**: Task 2
  - **Blocked By**: None

  **References**:
  - `src/commands/models.ts` - Current implementation
  - `opencode models --help` - Command options

  **Acceptance Criteria**:
  - [ ] Fetches models using opencode CLI
  - [ ] Filters for free models correctly
  - [ ] Falls back on error

  **QA Scenarios**:

  Scenario: Fetches and displays free models
    Tool: Bash
    Preconditions: opencode installed
    Steps:
      1. Run CLI
      2. Check available Zen models
    Expected Result: Shows current free models from opencode
    Failure Indicators: Shows old hardcoded list

- [ ] 2. Build and verify

  **What to do**:
  - Run `npm run build`
  - Verify no errors

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Acceptance Criteria**:
  - [ ] Build passes

---

## Commit Strategy

- **1**: `feat(models): fetch free Zen models dynamically from opencode CLI` — src/commands/models.ts

---

## Success Criteria

### Verification Commands
```bash
npm run build  # Passes
# Run CLI, verify free models are fetched dynamically
```

### Final Checklist
- [x] Dynamic fetching works
- [x] Free models filtered correctly
- [x] Fallback preserved
- [x] Build passes
