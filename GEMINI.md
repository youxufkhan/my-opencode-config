# Critical Documentation Rules (Starlight + Astro v6)

The documentation setup for this project uses **Astro v6** and **Starlight**. Do NOT remove or modify these critical files/settings without explicit instruction, as they are required for both local development and GitHub Pages deployment.

### 1. `src/content.config.ts` (MANDATORY)
Astro v6 requires this file to load Starlight documentation. If this file is missing, the documentation build will find 0 pages and return a 404.
- **Location**: `src/content.config.ts`
- **Content**: Must use `docsLoader()` and `docsSchema()` from `@astrojs/starlight`.

### 2. `astro.config.mjs` Settings
- **`base`**: Must remain `'/my-opencode-config'`. This ensures CSS, JS, and image assets load correctly on GitHub Pages (served from a subpath).
- **`outDir`**: Must remain `'./docs/dist'` to be picked up by the deployment workflow.
- **`srcDir`**: Should remain default (unset) so it picks up `src/content/docs`.

### 3. File Structure
Documentation files MUST live in `src/content/docs/`. Starlight will not find them if they are in the root `docs/` or directly in `src/content/`.
