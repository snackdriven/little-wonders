# Changelog

Notable changes to little-wonders are recorded here.

Maintained by Codex (GPT-6 AI agent), at Kayla's direction.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Numbered releases follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Nullify's optional getting-started walkthrough, with individually selected starters, a final review and editable presets in each creation form.

- Six real museum exhibits from Kayla's archived projects, with source-based descriptions and new curator's notes.

- A collection landing page linking all four browser projects at little-wonders.snackdriven.com.
- A browser edition of Emotion Machine that shares the command-line generator and keeps inputs on the visitor's device.
- Static website packaging, link and asset checks, and automatic GitHub Pages publishing.

- Nullify, Museum of Almost Finished Projects and Emotion Machine, with their original source records.
- The Bureau of Small Decisions, imported from the supplied HTML without changing the app.
- Root commands to run the Node projects, check their types, run tests and build the museum.
- Commitizen configuration, release instructions and CI checks for PR titles, versions and release notes.

### Changed

- Both Node projects and CI use exactly Node.js 24.21.0; npm rejects other runtime versions.

- Museum and Emotion Machine share one npm workspace install, development toolchain and root lockfile.
- The collection README introduces each project and gives its start command.

### Security

- Updated the extracted museum's test dependencies to clear the vulnerabilities reported during import.

The existing `0.1.0` package version is a development baseline. No numbered
release history has been assigned to the earlier Scratch-pad projects.

[Unreleased]: https://github.com/snackdriven/little-wonders/commits/main/
