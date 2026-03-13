# Work Plan: Smart Model Recommendation Feature

## TL;DR

> **Quick Summary**: Add a scoring system that uses OpenCode's model capabilities data to rank and recommend the best free models. Also add loading spinners to all async steps for better UX.
> 
> **Deliverables**:
> - Calculate capability score for each free model
> - Mark the highest-scoring model as "recommended"
> - Show scores in model selection prompts
> - Add loading spinners to model fetching, scoring, and all async steps
> 
> **Estimated Effort**: Short
> **Parallel Execution**: NO - sequential
> **Critical Path**: Add scoring → Update UI → Add spinners → Test

---

## Context

### Why This Feature
- Users currently see a list of 6 free models but don't know which is "best"
- No external benchmark APIs available for free (all require keys/credits)
- OpenCode already provides rich capability data we can use
- CLI feels unresponsive during async operations (model fetching)

### Data Available from `opencode models --verbose`
- `capabilities.reasoning` - Supports reasoning
- `capabilities.thinking` - Has thinking mode with budget tokens
- `capabilities.toolcall` - Supports function calling
- `capabilities.attachment` - Supports file uploads
- `capabilities.input.*` - Input modalities
- `limit.context` - Context window size
- `limit.output` - Max output tokens
- `variants` - Has high/max variants

### Existing Loading Infrastructure
- Project already has `@clack/prompts` with `spinner()` 
- `src/utils/prompts.ts` has `withSpinner<T>()` function ready to use

---

## Work Objectives

### Must Have
- [ ] Add `capabilities` and `score` to Model interface in src/types.ts
- [ ] Add capability scoring function in models.ts
- [ ] Score each model based on features
- [ ] Mark ALL models with highest score as recommended (ties = all recommended)
- [ ] Show score in model selection prompt
- [ ] Add spinner to model fetching step
- [ ] Add spinner to model scoring step
- [ ] Add spinners to all async CLI steps
- [ ] Import withSpinner in src/index.ts
- [ ] Add error handling for JSON parsing

### Must NOT Have
- [ ] Don't break existing functionality
- [ ] Don't add external API calls
- [ ] Don't add scoring to Gemini models

---

## Execution Strategy

### Wave 1: Scoring Feature
1. Add capability scoring function
2. Update model selection UI

### Wave 2: Loading States
3. Add spinners to async operations
4. Test and build

---

## TODOs

- [x] 1. Add capabilities and score to Model interface

  **What to do**:
  - Modify `src/types.ts`
  - Add to Model interface:
    ```typescript
    interface Model {
      id: string;
      name: string;
      provider: 'zen' | 'google';
      isFree?: boolean;
      isRecommended?: boolean;
      score?: number;        // NEW: capability score
      capabilities?: {       // NEW: raw capabilities
        reasoning?: boolean;
        thinking?: boolean;
        toolcall?: boolean;
        attachment?: boolean;
        input?: { image?: boolean };
        limit?: { context?: number; output?: number };
        variants?: { high?: boolean; max?: boolean };
      };
    }
    ```

  **Acceptance Criteria**:
  - [x] Model interface updated

- [x] 2. Add capability scoring function

  **What to do**:
  - Modify `src/commands/models.ts`
  - Add scoring based on capabilities:
    ```
    Score breakdown:
    - Base: 10 points
    - reasoning: +5 points
    - thinking variant: +10 points
    - toolcall: +5 points
    - attachment: +5 points
    - image input: +3 points
    - Variants (high/max): +3 each
    - Context > 100k: +3 points
    - Output > 100k: +3 points
    ```
  - Calculate score after fetching models
  - Add try/catch for JSON parsing errors
  - Default to score 10 if capabilities missing

  **Acceptance Criteria**:
  - [x] Score calculated for each model

- [x] 3. Mark highest-scoring models as recommended

  **What to do**:
  - After scoring, find max score
  - Mark ALL models with max score as recommended (ties = all recommended)

  **Acceptance Criteria**:
  - [ ] Highest-scoring model(s) marked with isRecommended

- [x] 4. Update model selection prompts

  **What to do**:
  - Modify `src/utils/prompts.ts` formatModelLabel function
  - Show score next to model name: "Model Name (Score: XX) ⭐"
  - Mark recommended model with ⭐

  **Acceptance Criteria**:
  - [ ] Score visible in selection
  - [ ] ⭐ shown for recommended

- [x] 5. Add loading spinners

  **What to do**:
  - Import withSpinner in `src/index.ts`
  - Wrap async operations with `withSpinner`:
    - Model fetching: "Fetching available models..."
    - Model scoring: "Analyzing model capabilities..."
    - Plugin configuration
    - Superpowers installation
    - Config writing

  **Acceptance Criteria**:
  - [ ] Spinner shown during model fetch
  - [ ] Spinner shown during scoring
  - [ ] Spinners on other async steps

- [ ] 6. Build and test

  **What to do**:
  - Run build
  - Test model selection

---

## Success Criteria

### Final Checklist
- [x] Scoring works
- [x] Recommended model marked
- [x] Loading spinners work
- [x] Build passes
