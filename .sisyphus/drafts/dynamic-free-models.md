# Draft: Dynamic Free Models Feature

## Analysis

### Current Implementation
- `src/commands/models.ts` has hardcoded `KNOWN_ZEN_FREE_MODELS` as fallback
- Also tries to fetch from `https://opencode.ai/zen/api/models` but the API seems broken (returns malformed data)

### New Approach
Use `opencode models opencode --verbose` command to get all models with cost info, filter for free ones:

**Free models identified** (cost.input === 0 && cost.output === 0):
- big-pickle
- gpt-5-nano
- mimo-v2-flash-free
- nemotron-3-super-free
- minimax-m2.5-free
- zen-free

### Implementation
1. Modify `fetchZenModels()` in `src/commands/models.ts`
2. Use `exec` to run `opencode models opencode --verbose`
3. Parse JSON output, filter for free models (cost: 0)
4. Fallback to hardcoded list if command fails

### Edge Cases
- What if opencode is not installed? → Fallback
- What if command fails? → Fallback
- What if no free models found? → Fallback
