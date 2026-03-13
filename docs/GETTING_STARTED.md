# Getting Started with my-opencode

Welcome to `my-opencode`! This CLI tool is designed to help you quickly and easily set up your OpenCode environment with the best free and powerful models, essential plugins, and optimal configurations.

Whether you're new to OpenCode or just looking for a streamlined way to manage your setup, `my-opencode` has you covered.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js**: Version 18.0.0 or higher.
- **Git**: Required if you choose to install Superpowers.
- **OpenCode**: The core platform. If it's missing, the tool will attempt to guide you through installation.

## Quick Start

The fastest way to use `my-opencode` is via `npx`. No installation is required!

```bash
npx my-opencode
```

Alternatively, you can install it globally:

```bash
npm install -g my-opencode
my-opencode
```

## The 8-Step Setup Wizard

When you run `my-opencode`, it will guide you through an interactive 8-step process:

1.  **Check OpenCode**: Verifies your OpenCode installation.
2.  **Essential Plugins**: Automatically adds `oh-my-opencode` and `opencode-gemini-auth`.
3.  **Superpowers (Optional)**: Offers to install the Superpowers suite for enhanced AI capabilities.
4.  **Authentication**: Helps you connect to OpenCode Zen and Google Gemini.
5.  **Main Model Selection**: Pick your primary free model from the Zen provider.
6.  **Small Model Selection**: Pick a secondary fast, free model for quick tasks.
7.  **Agent Configuration**: Configure your fast (Zen-free) and powerful (Gemini-based) agents.
8.  **Configuration Generation**: Generates your `opencode.json` and `oh-my-opencode.json` files.

## What's Next?

Once the setup is complete, you'll have a fully configured OpenCode environment ready for use! 

- **Check your configuration**: Take a look at the generated `opencode.json` in your home directory (`~/.local/share/opencode/`).
- **Start building**: Open your project and start using your newly configured AI agents and models.
- **Learn more**: Check out our [Features Guide](FEATURES.md) for a deeper dive into model scoring and plugin management.

---

[Back to Home](../README.md) | [Features Guide](FEATURES.md)
