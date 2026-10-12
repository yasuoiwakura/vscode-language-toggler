# Change Log

All notable changes to this extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Status bar button and `Ctrl+Alt+L` keybinding to toggle the active editor
  between `yaml` and `cloudformation`.
- Status bar label now reflects the current language and updates when the
  active editor changes.

### Fixed

- Status bar no longer keeps showing a stale language after switching or
  changing editors.

## [0.0.1] - 2026-02-02

### Added

- Initial release: toggle language mode via status bar / keybinding.
