# Contributing to my-opencode

Thank you for your interest in contributing to `my-opencode`! We welcome all developers to help make this project even better.

## Development Setup

To get started, follow these steps:

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-repo/my-opencode.git
    cd my-opencode
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Build the project**:
    ```bash
    npm run build
    ```

4.  **Run the project** (using `npx` or by linking it):
    ```bash
    node dist/index.js
    ```

## Submitting Pull Requests

We follow a standard PR process:

1.  **Create a branch**: `git checkout -b feature/your-feature-name`
2.  **Make your changes**: Write clean, TypeScript-based code.
3.  **Run tests**: Ensure your changes pass existing tests (see below).
4.  **Commit and push**: `git commit -m "Your commit message"` and `git push origin feature/your-feature-name`
5.  **Open a Pull Request**: Describe your changes in detail.

## Testing Your Changes

We use Docker-based E2E tests for `my-opencode` to ensure isolation and consistency.

To run the E2E tests locally:
```bash
npm run test:e2e
```

The tests will:
1.  Build your project with `npm run build`.
2.  Create a Docker image using an Alpine-based Node.js environment.
3.  Execute a series of tests to verify configuration merging, model fetching, and plugin configuration.

## Code Style

- Use **TypeScript** with strict mode enabled.
- Follow existing patterns in the `src/` directory.
- Use **CommonJS** modules.
- Maintain clean, descriptive comments when necessary.

## Getting Help

If you have questions or need assistance, feel free to open an issue or reach out to the project maintainers.

---

[Back to Home](../README.md) | [Architecture Guide](ARCHITECTURE.md)
