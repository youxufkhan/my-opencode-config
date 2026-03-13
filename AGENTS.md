# PROJECT KNOWLEDGE BASE

**Generated:** 2026-03-14
**Commit:** e2bb1ed
**Branch:** master

## OVERVIEW

TypeScript CLI tool for automating OpenCode configuration setup. Interactive 8-step wizard that installs plugins, configures auth, and generates opencode.json.

## STRUCTURE

```
./
├── src/
│   ├── commands/     # CLI command modules (auth, models, plugins, config)
│   └── utils/        # Utilities (config, logging, opencode, prompts)
├── tests/e2e/        # Docker-based E2E tests
├── dist/             # Compiled output
└── package.json      # npm scripts: build, test:e2e
```

## WHERE TO LOOK

| Task | Location |
|------|----------|
| CLI entry point | `src/index.ts` |
| Config merging logic | `src/utils/config.ts` |
| Model fetching | `src/commands/models.ts` |
| Plugin installation | `src/commands/plugins.ts` |
| Auth flow | `src/commands/auth.ts` |

## CONVENTIONS

- **TypeScript**: Strict mode, ES2020 target, CommonJS modules
- **Build**: `tsc` compiles `src/` → `dist/`
- **CLI args**: Manual parsing for `--help` and `--dry-run`
- **No ESLint/Prettier**: Project lacks linting config
- **Shebang**: Redundant in `src/index.ts` (bin field handles execution)

## ANTI-PATTERNS

- No TODO/FIXME comments in source (clean codebase)
- No explicit forbidden patterns documented

## COMMANDS

```bash
npm install           # Install dependencies
npm run build         # Compile TypeScript → dist/
npm run test:e2e     # Run Docker-based E2E tests
npx my-opencode      # Run CLI
```

## NOTES

- E2E tests run inside Alpine Docker container for isolation
- GitNexus indexed: use `gitnexus://repo/opencode-config/context` for code intelligence
- Subdirectories too small for individual AGENTS.md (skip)

---

<!-- gitnexus:start -->
# GitNexus MCP

This project is indexed by GitNexus as **opencode-config** (98 symbols, 196 relationships, 3 execution flows).

GitNexus provides a knowledge graph over this codebase — call chains, blast radius, execution flows, and semantic search.

## Always Start Here

For any task involving code understanding, debugging, impact analysis, or refactoring, you must:

1. **Read `gitnexus://repo/{name}/context`** — codebase overview + check index freshness
2. **Match your task to a skill below** and **read that skill file**
3. **Follow the skill's workflow and checklist**

> If step 1 warns the index is stale, run `npx gitnexus analyze` in the terminal first.

## Skills

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/refactoring/SKILL.md` |

## Tools Reference

| Tool | What it gives you |
|------|-------------------|
| `query` | Process-grouped code intelligence — execution flows related to a concept |
| `context` | 360-degree symbol view — categorized refs, processes it participates in |
| `impact` | Symbol blast radius — what breaks at depth 1/2/3 with confidence |
| `detect_changes` | Git-diff impact — what do your current changes affect |
| `rename` | Multi-file coordinated rename with confidence-tagged edits |
| `cypher` | Raw graph queries (read `gitnexus://repo/{name}/schema` first) |
| `list_repos` | Discover indexed repos |

## Resources Reference

Lightweight reads (~100-500 tokens) for navigation:

| Resource | Content |
|----------|---------|
| `gitnexus://repo/{name}/context` | Stats, staleness check |
| `gitnexus://repo/{name}/clusters` | All functional areas with cohesion scores |
| `gitnexus://repo/{name}/cluster/{clusterName}` | Area members |
| `gitnexus://repo/{name}/processes` | All execution flows |
| `gitnexus://repo/{name}/process/{processName}` | Step-by-step trace |
| `gitnexus://repo/{name}/schema` | Graph schema for Cypher |

## Graph Schema

**Nodes:** File, Function, Class, Interface, Method, Community, Process
**Edges (via CodeRelation.type):** CALLS, IMPORTS, EXTENDS, IMPLEMENTS, DEFINES, MEMBER_OF, STEP_IN_PROCESS

```cypher
MATCH (caller)-[:CodeRelation {type: 'CALLS'}]->(f:Function {name: "myFunc"})
RETURN caller.name, caller.filePath
```

<!-- gitnexus:end -->