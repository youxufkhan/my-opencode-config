# my-opencode-config

> An interactive setup wizard to configure OpenCode with powerful free models and essential tools.

[![npm version](https://img.shields.io/npm/v/my-opencode-config.svg)](https://www.npmjs.com/package/my-opencode-config)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Why It Exists

OpenCode is powerful, but unlocking its full potential with free, high-quality models can be complex. This wizard automates the entire setup—from authentication to plugin installation—so you can get a supercharged, cost-effective OpenCode environment running in minutes, not hours.

Its sole purpose is to make OpenCode great for free by leveraging OpenCode Zen models and Gemini free tier limits, providing a generous allowance for daily, medium-complexity tasks.

## Quick Start

Run the setup wizard directly without installation. This is the fastest way to get started.

```bash
npx my-opencode-config
```

## Key Features

- 🔮 **Intelligent Model Discovery**: Finds and recommends the best-performing free models from OpenCode Zen.
- 🔌 **Essential Plugins**: Installs and configures the popular `oh-my-opencode` agent harness to put your agent on steroids.
- 🚀 **Superpowers Included**: Integrates the `superpowers` skill set for advanced agent capabilities.
- 🔐 **Seamless Authentication**: Handles OAuth for OpenCode Zen and Google Gemini.
- ⚙️ **Smart Configuration**: Sets up the GitHub MCP and configures agents to use free models by default.

## Prerequisites

- **Node.js**: `v18.0.0` or higher.
- **OpenCode**: An existing installation is required.

## Installation

Alternatively, you can install the CLI globally for easier access.

```bash
npm install -g my-opencode-config
```
Then, run the wizard:
```bash
my-opencode-config
```

## References

This tool stands on the shoulders of giants. Check out the projects that make it possible:

- **OpenCode**: [https://github.com/anomalyco/opencode](https://github.com/anomalyco/opencode)
- **oh-my-openagent**: [https://github.com/code-yeongyu/oh-my-openagent](https://github.com/code-yeongyu/oh-my-openagent)
- **Superpowers**: [https://github.com/obra/superpowers](https://github.com/obra/superpowers)
