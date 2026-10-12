# Porting from Gitea to GitHub

Checklist to move this repository from `git.blox.media` to a public GitHub repo
and adjust everything that references the old location.

## TODO - decisions to make

- [x] **GitHub owner** (user or organization): `yasuoiwakura`
- [x] **Repository name**: `vscode-language-toggler`
- [x] **Extension `name`** in `package.json`: `vscode-language-toggler`
- [x] **Marketplace publisher ID**: `blox-media` (set in `package.json`; display name may be `blox.media`)
- [x] Final public URL: `https://github.com/yasuoiwakura/vscode-language-toggler`

## URL occurrences to change

The old URL `https://git.blox.media/matt/vscode-toggle-languagemode` appeared in:

| File | Line | What | Status |
| --- | --- | --- | --- |
| `package.json` | 27 | `repository.url` | done - set to the GitHub URL |
| `docs/PUBLISHING.md` | baseImagesUrl example | done - set to the GitHub URL |

> Note: the generated `.vsixmanifest` inside an installed extension also carries
> the URL, but it is derived from `package.json` at package time - no manual edit.

## Git remote

```bash
git remote rename origin gitea
git remote add origin git@github.com:yasuoiwakura/vscode-language-toggler.git
git push -u origin main
git push origin --all
git push origin --tags
```

## GitHub Actions

The ready-made workflow `.github/workflows/release.yml` builds the extension
once and fans the resulting `.vsix` out to up to four targets. It uses the
pre-built action [HaaLeo/publish-vscode-extension](https://github.com/HaaLeo/publish-vscode-extension)
so no custom publish script is needed.

**Trigger:** a version tag (`v*`) or a manual run (`workflow_dispatch`).

**Targets (all active by default):**

| # | Target | Needs |
| --- | --- | --- |
| 1 | Upload VSIX as workflow artifact | nothing |
| 2 | Publish to Open VSX | secret `OPEN_VSX_TOKEN` |
| 3 | Publish to VS Marketplace | secret `VSCE_PAT` |
| 4 | Attach VSIX to GitHub Release | a tag push |

**Disable a target:** edit the switch block at the top of the workflow and set
the flag to `'false'` - no need to delete any step:

```yaml
env:
  ENABLE_ARTIFACT: 'true'
  ENABLE_OPEN_VSX: 'true'
  ENABLE_VS_MARKETPLACE: 'true'
  ENABLE_RELEASE: 'true'
```

**Secrets (repository settings -> Actions -> Secrets and variables):**

- `OPEN_VSX_TOKEN` - Open VSX access token (namespace must exist).
- `VSCE_PAT` - VS Marketplace PAT with **Manage** scope.

Targets 2 and 3 are skipped automatically when their secret is empty, so the
workflow stays green before a registry account exists; only the artifact (and,
on tags, the release asset) is produced.

> Build happens in CI: `vsce package` triggers `vscode:prepublish` ->
> `npm run package` (type-check + lint + esbuild). `dist/` is git-ignored, so
> nothing has to be committed for the build.

## Repository hygiene

- [ ] Add a `.gitignore` entry for OS/editor files if needed (current `dist/`,
      `out/`, `node_modules/`, `*.vsix`, `.vscode-test/` are already ignored).
- [ ] Decide whether to keep the Gitea history (`git push --all` keeps it) or
      start fresh.
- [ ] Add a public GitHub `README` badge / description.
- [ ] Add topics/tags on GitHub: `vscode-extension`, `yaml`, `cloudformation`.

