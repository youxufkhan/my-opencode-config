# my-opencode

> The ultimate OpenCode setup CLI. Automate your configuration and unlock the power of free and premium models in seconds.

[![npm version](https://img.shields.io/npm/v/my-opencode.svg)](https://www.npmjs.com/package/my-opencode)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Why This Exists

Manually configuring OpenCode with the best free and powerful models, essential plugins, and optimal settings can be a tedious and error-prone task. `my-opencode` simplifies this process into an interactive, 8-step wizard that gets you up and running with a professional-grade AI development environment in no time.

## Quick Start

The fastest way to use `my-opencode` is via `npx`. No installation required!

```bash
npx my-opencode
```

## Installation

### Globally (Recommended)

```bash
npm install -g my-opencode
my-opencode
```

### Locally

```bash
npm install my-opencode
npx my-opencode
```

## Features

- **✅ Smart Model Scoring**: Automatically fetches and ranks the best free models based on their capabilities (thinking, reasoning, tool calling, etc.).
- **✅ Essential Plugins**: Seamlessly installs and configures `oh-my-opencode` and `opencode-gemini-auth`.
- **✅ Comprehensive Authentication**: Easy connection to OpenCode Zen and Google Gemini.
- **✅ Superpowers Suite**: Optional integration with the advanced Superpowers AI agents for debugging and code analysis.
- **✅ Resilient Configuration**: Smart merging of your existing settings and automatic backups of `opencode.json`.
- **✅ Interactive UI**: A clean, step-by-step wizard powered by `@clack/prompts`.

## Requirements

- **Node.js**: 18.0.0 or higher.
- **Git**: Required if you choose to install the Superpowers suite.
- **OpenCode**: Will be detected and installation instructions provided if missing.

## Documentation

For more detailed information, check out our comprehensive guides:

- 🚀 [Getting Started Guide](docs/GETTING_STARTED.md)
- 💡 [Detailed Features Overview](docs/FEATURES.md)
- 🛠️ [Architecture & Internal Design](docs/ARCHITECTURE.md)
- 🤝 [Contributing to my-opencode](docs/CONTRIBUTING.md)

## Development

If you'd like to contribute, see the [Contributing Guide](docs/CONTRIBUTING.md) for setup and testing instructions.

## License

MIT © [OpenCode Team](https://github.com/opencode-config)
