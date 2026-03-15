---
title: Architecture
description: Understand the internal architecture of my-opencode-config.
---

# Architecture of my-opencode-config

`my-opencode-config` is built with TypeScript to provide a structured and maintainable CLI tool for OpenCode configuration.

## Key Design Principles

- **Modular Design**: The project is split into `src/commands` for business logic and `src/utils` for reusable helper functions.
- **Interactive Wizard**: The tool uses `@clack/prompts` to create an 8-step, step-by-step interactive setup wizard.
- **Resilient Configuration**: Before any change is made, `my-opencode-config` creates a backup of the existing `opencode.json` file.
- **Isolated Testing**: E2E tests are executed inside a Docker container (Alpine Linux) to prevent local environment interference.

## Project Structure

```
./
├── src/
│   ├── index.ts        # The entry point for the CLI - contains the 8-step wizard.
│   ├── commands/       # Core business logic for each step.
│   │   ├── auth.ts     # OpenCode and Google authentication.
│   │   ├── models.ts   # Model fetching and scoring logic.
│   │   ├── plugins.ts  # Plugin management and merging.
│   │   └── config.ts   # Configuration file generation and backups.
│   ├── utils/          # Reusable utility functions.
│   │   ├── config.ts   # Helper for configuration files.
│   │   ├── logging.ts  # Centralized logging logic.
│   │   ├── opencode.ts # OpenCode CLI detection.
│   │   └── prompts.ts  # Custom prompts and UI helpers.
│   └── types.ts        # Shared TypeScript interfaces and types.
├── tests/e2e/          # Docker-based end-to-end tests.
├── dist/               # Compiled JavaScript output.
└── package.json        # Build and test scripts.
```

## Adding a New Step to the Wizard

If you want to add a new step to the setup process, follow these guidelines:

1.  **Define the Logic**: Create a new command file in `src/commands/` or add the logic to an existing one.
2.  **Update `src/index.ts`**: Add a new step to the `main()` function's `p.intro()` and `p.outro()` chain.
3.  **Create Custom Prompts**: If needed, add new prompt logic in `src/utils/prompts.ts`.
4.  **Test the Change**: Ensure the new step works correctly by adding it to the E2E test suite in `tests/e2e/run.sh`.

## Configuration Merging

`my-opencode-config` uses a careful merging strategy to avoid overwriting existing user settings. It parses the current `opencode.json` and only updates or adds specific keys related to models, providers, and plugins.

## Future Roadmap

- **Support More Providers**: Add support for additional AI providers.
- **Advanced Model Selection**: Allow users to filter models by specific capabilities (e.g., vision, long context).
- **Automated Plugin Updates**: Periodically check and prompt for plugin updates.
