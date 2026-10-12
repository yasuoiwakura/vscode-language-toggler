# Publishing to the VS Code Marketplace

How to package and publish **vscode-language-toggler** so it appears in the
VS Code Marketplace (and therefore in the Extensions view / "Addon Store").

## Prerequisites

1. **Azure DevOps organization** - create one at <https://dev.azure.com> (free).
2. **Personal Access Token (PAT)** - in the Azure DevOps org:
   - User settings -> Personal access tokens -> New Token
   - Organization: **All accessible organizations**
   - Scope: **Marketplace -> Manage**
3. **Publisher** - create one at <https://marketplace.visualstudio.com/manage>.
   - Copy the publisher **ID** (e.g. `your-publisher-id`).
   - Set it in `package.json`:

     ```json
     "publisher": "your-publisher-id"
     ```

     > `blox-media` is already set in `package.json`. The publisher **ID** must
     > not contain a dot (only `a-z`, `0-9`, `-`), so `blox.media` is invalid -
     > use it as the publisher **Name / display name** instead.

## Open VSX (optional, lower effort)

[Open VSX](https://open-vsx.org) is the registry used by VSCodium, Cursor,
Theia and other VS Code forks. **It is not searched by Microsoft VS Code** -
there you would install the `.vsix` manually. Setup:

1. Create an account at <https://open-vsx.org> (login via GitHub).
2. Create the **namespace** matching `publisher` in `package.json`
   (`blox-media`).
3. Create an **access token** and store it as the repository secret
   `OPEN_VSX_TOKEN`.

The same `publisher` value is used for both registries.

## Checklist before publishing

- [x] `publisher` set to `blox-media`
- [ ] `repository.url` points to the public GitHub repo (see `docs/PORTING.md`)
- [ ] `README.md`, `LICENSE`, `CHANGELOG.md` present
- [ ] `icon` (128x128 PNG) added - **TODO (currently missing)**
- [ ] `version` bumped (semver)
- [ ] `engines.vscode` matches a released VS Code version
- [ ] `npm run package` succeeds

## Build the VSIX

Use the maintained CLI `@vscode/vsce` (the bare `vsce` package is deprecated):

```bash
npx @vscode/vsce package
```

Produces `vscode-language-toggler-<version>.vsix`. Install it locally with:

```bash
code --install-extension vscode-language-toggler-<version>.vsix
```

## Publish

```bash
npx @vscode/vsce login <publisher-id>   # or export the PAT
npx @vscode/vsce publish
```

With a PAT directly:

```bash
npx @vscode/vsce publish -p <PAT>
```

## Images in the README

Marketplace renders relative image paths against the `repository` URL (GitHub).
Once the repository is on GitHub, the relative paths (`doc/...`) in `README.md`
resolve automatically. If you package without a public repo, pass:

```bash
npx @vscode/vsce package --baseImagesUrl https://raw.githubusercontent.com/yasuoiwakura/vscode-language-toggler/HEAD/
```

## Continuous Integration / automated release

The workflow `.github/workflows/release.yml` builds the `.vsix` once and can
push it to four targets (see `docs/PORTING.md` for the switch block):

1. GitHub Actions artifact (always) - downloadable from the workflow run,
   retained 90 days.
2. [Open VSX](https://open-vsx.org) - needs secret `OPEN_VSX_TOKEN`.
3. VS Marketplace - needs secret `VSCE_PAT` (PAT with **Manage** scope).
4. GitHub Release asset - only on a version tag (`v*`).

Targets 2 and 3 are skipped when the matching secret is missing, so the
workflow runs green before any registry account exists. Disable a target
permanently by setting its flag in the workflow's `env` switch block to
`'false'`.

Trigger it by pushing a tag (`git tag v0.1.0 && git push origin v0.1.0`) or
manually via *Actions -> Release -> Run workflow*.

Build naming: a tag build uses the tag name
(`vscode-language-toggler-v0.1.0.vsix`); a manual/branch build gets a
nightly-style label `<yyyy-mm-dd>_<branch>_<commit>`. The artifact zip and the
VSIX inside share the same base name. See `docs/PORTING.md` for the table.
