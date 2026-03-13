# Draft: Model Recommendation Feature

## Research Summary

### Option 1: External Benchmark APIs

**Finding**: Most public leaderboard sites don't offer free APIs:
- **Vellum.ai**: No public API, requires signup
- **OpenMark.ai**: Requires credits to run benchmarks
- **HuggingFace Open LLM Leaderboard**: No public API endpoint available
- **Artificial Analysis**: No free API
- **OpenRouter Rankings**: Based on usage data, not benchmarks

**Problem**: Would need API keys, rate limits, model name mapping complexity

### Option 2: Use OpenCode Capabilities Data (RECOMMENDED)

**Available in `opencode models --verbose`**:
- `capabilities.reasoning` (boolean) - Supports reasoning
- `capabilities.thinking` (variant with budgetTokens) - Has thinking mode
- `capabilities.toolcall` (boolean) - Supports function calling
- `capabilities.attachment` (boolean) - Supports file uploads
- `capabilities.input.image` - Supports image input
- `limit.context` - Context window size (e.g., 200000)
- `limit.output` - Max output tokens (e.g., 128000)
- `variants` - Has high/max variants with thinking

### Recommendation

**Option 2 is better** because:
1. No extra API calls needed (already have the data)
2. Always up-to-date with latest model versions
3. Provides useful differentiation between free models
4. Can score based on practical capabilities

### Scoring Algorithm Idea

Score = base points + reasoning bonus + thinking bonus + toolcall bonus + context bonus

| Feature | Points |
|---------|--------|
| Base | 10 |
| reasoning: true | +5 |
| Has thinking variant | +10 |
| toolcall: true | +5 |
| attachment: true | +5 |
| Variants (high/max) | +3 each |
| Context > 100k | +3 |
| Output > 100k | +3 |

Max score possible: ~39 points
