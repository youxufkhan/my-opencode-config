# Work Plan: Fix GitHub Issue #2 - Code Review Issues

## TL;DR

> **Quick Summary**: Fix 2 confirmed issues from PR #1 code review - spawn interactive /connect for auth, and add CLI flags. 2 other issues (superpowers URL, unused function) are already resolved.
> 
> **Deliverables**:
> - Auth step spawns `opencode /connect` interactively
> - CLI supports `--help` and `--dry-run` flags
> 
> **Estimated Effort**: Short
> **Parallel Execution**: NO - sequential (small fixes)
> **Critical Path**: Fix auth → Fix flags → Build → Test

---

## Context

### Original Request
Fix GitHub Issue #2: "Code Review: Issues Found in PR #1"

### Issue Analysis Summary

| # | Issue | Status | Action Required |
|---|-------|--------|-----------------|
| 1 | Auth Step Doesn't Spawn /connect | **TO FIX** | Use auth.ts to spawn interactive subprocess |
| 2 | Incorrect Superpowers Git URL | **ALREADY FIXED** | Already clones from `obra/superpowers` at runtime |
| 3 | Unused Function checkCommonPaths | **NOT AN ISSUE** | Function IS called in `getOpenCodeStatus()` line 79 |
| 4 | Missing CLI Flags | **TO FIX** | Add `--help` and `--dry-run` |

### Verified Working (from Issue)
- ✅ Build passes
- ✅ Config merge works
- ✅ Model fetching works
- ✅ Plugin configuration works
- ✅ Superpowers runtime cloning works (already implemented)
- ✅ Backup/restore functionality

---

## Work Objectives

### Core Objective
Fix the 2 confirmed issues from GitHub Issue #2:
1. **Auth Step**: Spawn interactive `opencode /connect` subprocess instead of printing instructions
2. **CLI Flags**: Add `--help` and `--dry-run` command line options

### Must Have
- [ ] Auth step launches `opencode /connect` as interactive subprocess
- [ ] `--help` flag shows usage information and exits
- [ ] `--dry-run` flag runs without writing any files

### Must NOT Have
- [ ] Don't break existing functionality (build, config, models, plugins)
- [ ] Don't keep superpowers in repo (must clone at runtime - already done)

---

## Verification Strategy

### Test Decision
- **Infrastructure exists**: NO - no test framework in project
- **Automated tests**: None
- **Framework**: N/A

### QA Policy
Agent-executed QA via running the CLI directly:
- Test `--help` flag outputs usage info
- Test `--dry-run` flag runs without writing files
- Test auth flow spawns subprocess

---

## Execution Strategy

### Sequential Execution (small task)

**Wave 1 (Foundation + Fixes):**
1. Fix Issue #1: Auth step spawn /connect
2. Fix Issue #4: Add CLI flags

**Wave 2 (Verification):**
3. Build and verify

---

## TODOs

- [x] 1. Fix Issue #1: Auth step spawns /connect interactively

  **What to do**:
  - Import `authenticateAll` from `./commands/auth` in `src/index.ts`
  - Replace the manual auth prompt block (lines 115-125) with a call to `authenticateAll()`
  - The auth.ts already has proper error handling and uses `spawn` with `stdio: 'inherit'`

  **Must NOT do**:
  - Don't remove the existing auth.ts file - it's already well implemented

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []
  - Reason: Simple code replacement task

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential
  - **Blocks**: Task 2
  - **Blocked By**: None

  **References**:
  - `src/commands/auth.ts:43-65` - `authenticateAll()` and `spawnOpencodeConnect()` implementation

  **Acceptance Criteria**:
  - [ ] CLI runs `opencode /connect` as interactive subprocess when user confirms auth

  **QA Scenarios**:

  Scenario: Auth step spawns /connect subprocess
    Tool: interactive_bash
    Preconditions: opencode is installed
    Steps:
      1. Run CLI with auth enabled
      2. Observe that opencode /connect is spawned (terminal should show the app)
    Expected Result: Subprocess spawns with interactive terminal
    Failure Indicators: Only prints instructions without spawning
    Evidence: N/A (visual verification)

- [x] 2. Fix Issue #4: Add --help and --dry-run CLI flags

  **What to do**:
  - Add argument parsing at the start of `main()` function
  - Parse `process.argv` for flags:
    - `--help`: Print usage info and exit
    - `--dry-run`: Skip file writing steps
  - Add usage text:
    ```
    Usage: my-opencode [OPTIONS]
    
    Options:
      --help        Show this help message and exit
      --dry-run     Run without writing any files
    ```

  **Must NOT do**:
  - Don't break the interactive prompts

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []
  - Reason: Simple CLI flag implementation

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential
  - **Blocks**: Task 3
  - **Blocked By**: Task 1

  **References**:
  - `src/index.ts` - Main entry point for adding flags

  **Acceptance Criteria**:
  - [ ] `my-opencode --help` shows usage and exits
  - [ ] `my-opencode --dry-run` runs through all prompts but doesn't write files

  **QA Scenarios**:

  Scenario: --help flag shows usage
    Tool: Bash
    Preconditions: None
    Steps:
      1. Run `node dist/index.js --help`
    Expected Result: Usage text printed, exit code 0
    Failure Indicators: No output or error
    Evidence: .sisyphus/evidence/task-2-help-output.txt

  Scenario: --dry-run skips file writing
    Tool: Bash
    Preconditions: None
    Steps:
      1. Run `node dist/index.js --dry-run` with all prompts answered
      2. Check that no config files were written
    Expected Result: No files written to ~/.config/opencode/
    Failure Indicators: Files exist after dry-run
    Evidence: .sisyphus/evidence/task-2-dryrun-no-files.txt

- [x] 3. Build and verify

  **What to do**:
  - Run `npm run build` to compile TypeScript
  - Verify no build errors

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []
  - Reason: Standard build verification

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential
  - **Blocks**: None
  - **Blocked By**: Task 1, Task 2

  **Acceptance Criteria**:
  - [ ] `npm run build` succeeds with no errors
  - [ ] `dist/index.js` exists

  **QA Scenarios**:

  Scenario: Build passes
    Tool: Bash
    Preconditions: None
    Steps:
      1. Run `npm run build`
    Expected Result: Build completes without errors
    Failure Indicators: TypeScript errors
    Evidence: .sisyphus/evidence/task-3-build-output.txt

---

## Final Verification Wave

- [ ] F1. **Functional Verification** — Run the CLI with new flags and auth flow
  Test --help, --dry-run, and auth spawning work correctly

---

## Commit Strategy

- **1**: `fix(auth): spawn opencode /connect interactively` — src/index.ts
- **2**: `feat(cli): add --help and --dry-run flags` — src/index.ts

---

## Success Criteria

### Verification Commands
```bash
npm run build  # Should pass
node dist/index.js --help  # Shows usage
node dist/index.js --dry-run  # Runs without writing files
```

### Final Checklist
- [x] Auth step spawns /connect
- [x] --help flag works
- [x] --dry-run flag works
- [x] Build passes
