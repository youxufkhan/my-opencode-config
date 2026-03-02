# my-opencode

OpenCode Setup CLI - Automate your OpenCode configuration!

## Installation

```bash
npx my-opencode
```

Or install globally:

```bash
npm install -g my-opencode
my-opencode
```

## What it does

1. **Checks OpenCode** - Detects if OpenCode is installed, offers to install if not
2. **Configures Plugins** - Adds oh-my-opencode and opencode-gemini-auth
3. **Superpowers** - Optionally installs Superpowers from GitHub
4. **Authentication** - Helps you authenticate with Zen and Gemini
5. **Model Selection** - Interactive selection of models:
   - Main model (from free Zen models)
   - Small model (from free Zen models)
   - Fast agents (from Zen free)
   - Powerful agents (from Gemini - flash recommended)
6. **Generates Configs** - Creates opencode.json and oh-my-opencode.json

## Features

- ✅ Interactive CLI prompts
- ✅ Smart config merging (preserves existing settings)
- ✅ Config backup before changes
- ✅ Free Zen models filtering
- ✅ Gemini flash models recommended

## Requirements

- Node.js 18+
- Git (for Superpowers installation)
- OpenCode (will be installed if missing)

## License

MIT
