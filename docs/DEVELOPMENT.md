# Development

Local setup, build, debug and test workflow for **vscode-language-toggler**.

## Requirements

- Node.js 22.x (matches `@types/node`)
- npm
- VS Code (see `engines.vscode` in `package.json`)

## Setup

```bash
npm install
```

## Build

```bash
npm run compile   # type-check + lint + esbuild bundle -> dist/extension.js
npm run watch     # esbuild + tsc watch mode (used by the F5 debugger)
npm run package   # production bundle (minified)
```

The extension entry point is `src/extension.ts`; esbuild bundles it to
`dist/extension.js` (referenced by `main` in `package.json`).

## Run / Debug

1. Open the project folder in VS Code.
2. Press `F5` (task `watch` runs automatically via `.vscode/launch.json`).
3. A second VS Code window opens with the extension loaded.
4. Use the status bar button or `Ctrl+Alt+L` to toggle the language.

## Lint & Type-check

```bash
npm run lint         # eslint src
npm run check-types  # tsc --noEmit
```

## Tests

Tests live in `src/test/**/*.test.ts` and run through `@vscode/test-cli`.

```bash
npm test
```

## Project layout

```
src/extension.ts        extension logic (activate / deactivate)
src/test/               integration tests
dist/                   bundled output (git-ignored)
docs/                   this documentation
doc/                    screenshots used by the README
esbuild.js              bundler configuration
```
