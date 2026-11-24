# Commits and releases

Adapted by Codex (GPT-6 AI agent) from the release conventions in AL80 Studio,
Now Screaming and qa-agent-runtime.

## Keep the changelog useful

Record notable changes in [CHANGELOG.md](CHANGELOG.md). Keep an Unreleased
section first. Use Added, Changed, Deprecated, Removed, Fixed and Security;
omit empty categories. Write for someone using the collection, rather than
copying commit messages.

Keep existing release dates and entries. Automatic changelog generation is
disabled. Do not run `cz changelog` or `cz bump --changelog` on the curated log.

## Commitizen

Use Python 3.11+ and uv. Run from the repository root:

```sh
uvx --from commitizen==4.19.2 cz commit
uvx --from commitizen==4.19.2 cz check --message "feat: describe the change"
uvx --from commitizen==4.19.2 cz version --project
```

Stage the intended files before `cz commit`. Regular git commits also work.
Use `feat:` for compatible features and `fix:` for compatible fixes. Mark an
incompatible change with `!` or a `BREAKING CHANGE:` footer. Maintenance types
include `docs:`, `chore:`, `test:`, `ci:`, `build:`, `refactor:` and `perf:`.

CI checks PR titles as future squash commit subjects. Keep the validated title
when merging. The workflow has read-only permissions and does not rewrite titles.

## Semantic Versioning

The collection version comes from the root package.json. Commitizen's npm
provider keeps the root package-lock.json in sync. The current `0.1.0` is a
development baseline; a dated changelog entry and release tag establish a
numbered release.

The compatibility contract covers documented root commands, project folder paths,
CLI options and output, the museum exhibit format, and documented app behavior.
Use MAJOR for incompatible changes, MINOR for compatible features and PATCH for
compatible fixes. Below 1.0.0, describe breaking changes and choose the next
version deliberately. Never change the contents of an existing release tag.

Workspace package versions describe the imported components. They remain
independent of the collection version and are not changed by a root bump.

## Prepare a release

Start with a clean branch, current tags and passing checks:

```sh
git fetch --tags
npm ci
npm run check
uvx --from commitizen==4.19.2 cz bump --increment PATCH --dry-run --check-consistency
uvx --from commitizen==4.19.2 cz bump --increment PATCH --version-files-only --check-consistency
```

Choose MINOR or MAJOR when needed. For the first numbered release, pass the
chosen version explicitly. If it already matches the baseline, skip the bump.
The version-files-only command does not create a commit or tag.

Move only the changes in that release from Unreleased into
`## [X.Y.Z] - YYYY-MM-DD`, using the actual release date. Keep pending changes
in Unreleased. Add comparison links between tags and point Unreleased to
`compare/vX.Y.Z...HEAD`.

Run `python scripts/check-release.py` and `npm run check`. Review and commit the
version files and notes with `chore(release): X.Y.Z`. After release approval,
tag that reviewed commit as `vX.Y.Z` and push that specific tag. Publishing a
package or deploying a site is a separate action.
