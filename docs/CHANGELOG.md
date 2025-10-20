# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-10-15

### Added
- Issue templates, pull request template, and CI workflow to streamline contributions.
- Comprehensive unit tests for the canvas store, settings store, connection hook, and settings panel UX.
- Focus management and keyboard handling for modals and settings dialog to improve accessibility.
- README testing section plus new CHANGELOG to track releases.

### Changed
- Refactored the canvas surface into a dedicated component with extracted connection logic and reusable node helpers.
- Hardened Google AI service configuration with validation, clearer errors, and usage metrics.
- Reworked prompt and image nodes for better UX, error feedback, and store-driven state.
- Updated settings panel with inline validation, focus trap, and modeled dropdown experience.

### Fixed
- Inconsistent licensing references across documentation.
- Drag-to-connect flow to reliably spawn prompt nodes only when the source node can produce outputs.
- Image upload failures now surface toast feedback instead of silent console errors.

[1.0.0]: https://github.com/AUT-Valunex/nano-canvas/releases/tag/v1.0.0
