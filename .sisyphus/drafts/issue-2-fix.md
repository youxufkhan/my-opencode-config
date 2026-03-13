# Draft: Issue #2 Fix Work Plan

## Issues to Fix (from GitHub Issue #2)

| # | Issue | Status | Action |
|---|-------|--------|--------|
| 1 | Auth Step Doesn't Spawn /connect | ✅ TO FIX | Use auth.ts functions to spawn interactive subprocess |
| 2 | Superpowers Git URL | ✅ ALREADY FIXED | Already clones from `obra/superpowers` at runtime |
| 3 | Unused Function checkCommonPaths | ✅ NOT AN ISSUE | Function IS called in `getOpenCodeStatus()` line 79 |
| 4 | Missing CLI Flags | ✅ TO FIX | Add `--help` and `--dry-run` flags |

## Confirmed Fixes Needed

### 1. Auth Step - Spawn /connect (Issue #1)
- **Location**: `src/index.ts` lines 115-125
- **Current**: Just prints instructions
- **Fix**: Import and use `authenticateAll()` from `./commands/auth`

### 2. CLI Flags (Issue #4)
- **Location**: `src/index.ts`
- **Missing**: `--help` and `--dry-run` flags
- **Fix**: Add argument parsing using process.argv

## Code Analysis

- `src/commands/auth.ts` already has `spawnOpencodeConnect()` function
- `src/index.ts` already clones superpowers at runtime (no change needed)
- `checkCommonPaths()` IS used (not dead code)
