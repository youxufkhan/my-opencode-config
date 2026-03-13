# Draft: Smart Deduplication & Authentication Changes

## Analysis Summary

### Issue 1: Plugin/Model Deduplication

**Problem**: In `src/utils/config.ts` line 102-103:
```typescript
if (Array.isArray(existingValue) && Array.isArray(updateValue)) {
  result[key] = [...existingValue, ...updateValue];  // CONCATENATES - causes duplicates!
}
```

**Current Behavior**: Every run adds plugins/models again, causing duplicates:
- `plugin`: `["a", "b", "a", "b", "a"]`
- `disabled_providers`: Massive duplicates
- `provider.opencode.models`: Keeps growing

**Fix**: Use Set to deduplicate arrays:
```typescript
if (Array.isArray(existingValue) && Array.isArray(updateValue)) {
  result[key] = [...new Set([...existingValue, ...updateValue])];
}
```

### Issue 2: Smart Authentication

**Problem**: Currently always prompts for auth even if already authenticated.

**Solution**: 
- Read auth.json to check existing providers
- Only prompt for unauthenticated providers
- Use existing `isAuthenticated()` functions in auth.ts

### Auth JSON Structure
```json
{
  "opencode": { "type": "api", "key": "..." },
  "google": { "type": "oauth", "access": "...", "refresh": "..." }
}
```

**Providers to check**:
- `opencode` → Zen
- `google` → Gemini
