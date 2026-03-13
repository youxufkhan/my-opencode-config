# Features of my-opencode

`my-opencode` goes beyond a simple setup script. It uses smart logic to ensure you're using the best models and plugins available.

## Smart Model Scoring

When you select your main and small models, `my-opencode` doesn't just list them. It fetches the latest model capabilities from the OpenCode CLI and assigns each model a score based on several factors:

- **Thinking Capability**: Models with advanced internal reasoning receive a higher score.
- **Reasoning**: Models capable of complex problem-solving are prioritized.
- **Tool Calling**: Models that can interact with external tools gain extra points.
- **Attachments & Images**: Models that can handle diverse input types like images or file attachments are ranked higher.
- **Context & Output Limits**: Larger context windows and output limits contribute to a model's score.

Based on these scores, `my-opencode` will **recommend** the best free Zen models for your setup.

## Essential Plugins Management

`my-opencode` ensures that your OpenCode environment is equipped with essential plugins for a superior developer experience:

- **`oh-my-opencode`**: Provides enhanced prompts, better formatting, and overall usability improvements.
- **`opencode-gemini-auth`**: Enables seamless authentication and integration with Google's Gemini models.

The tool intelligently merges these into your existing configuration, adding them only if they're missing or out-of-date.

## Superpowers Integration (Optional)

You have the option to install **Superpowers**, a suite of advanced AI agents and skills that provide enhanced debugging, code exploration, and impact analysis capabilities directly within your OpenCode environment.

## Comprehensive Authentication

The setup wizard guides you through authenticating with:

- **OpenCode Zen**: Connects you to a wide variety of free, high-quality models.
- **Google Gemini**: Grants you access to Google's most powerful models like Gemini 1.5 Flash and Pro.

## Seamless Configuration Generation

`my-opencode` automatically generates and manages your configuration files, saving you from manual JSON editing:

- **`opencode.json`**: The core configuration file for OpenCode.
- **`oh-my-opencode.json`**: Specialized settings for the `oh-my-opencode` plugin.

The tool will even create a **backup** of your existing configuration before making any changes, ensuring you can always revert if needed.

---

[Back to Home](../README.md) | [Getting Started](GETTING_STARTED.md)
