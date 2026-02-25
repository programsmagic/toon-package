# Publishing Guide

How to publish Toon Agent Bridge packages to NPM and deploy documentation to GitHub Pages.

## Prerequisites

1. **NPM Account** at [npmjs.com](https://www.npmjs.com)
2. **NPM Token** (Automation type) from [npmjs.com/settings/programsmagic/tokens](https://www.npmjs.com/settings/programsmagic/tokens)
3. **GitHub Secret**: Add `NPM_TOKEN` in repository Settings > Secrets > Actions

## Publishing to NPM

### Option 1: GitHub Release (Recommended)

1. Go to [Releases](https://github.com/programsmagic/toon-package/releases/new)
2. Create a tag (e.g. `v0.1.0`)
3. Title: `v0.1.0 - Initial Release`
4. Click **Publish release**

GitHub Actions will automatically build and publish all 8 packages.

### Option 2: Manual

```bash
pnpm install
pnpm build

# Publish in dependency order
cd packages/core && pnpm publish --access public --no-git-checks
cd ../format && pnpm publish --access public --no-git-checks
cd ../converter && pnpm publish --access public --no-git-checks
cd ../tokenizer && pnpm publish --access public --no-git-checks
cd ../viewer && pnpm publish --access public --no-git-checks
cd ../frontend && pnpm publish --access public --no-git-checks
cd ../backend-node && pnpm publish --access public --no-git-checks
cd ../cli && pnpm publish --access public --no-git-checks
```

## GitHub Pages (Documentation)

Documentation deploys automatically on push to `main` via GitHub Actions.

### First-Time Setup

1. Go to repository **Settings** > **Pages**
2. Source: **GitHub Actions**
3. Save

### Manual Trigger

1. Go to **Actions** > **Deploy to GitHub Pages**
2. Click **Run workflow** > select `main` > **Run workflow**

Site: [programsmagic.github.io/toon-package](https://programsmagic.github.io/toon-package)

## Pre-Publish Checklist

- [ ] All tests pass: `pnpm test`
- [ ] Lint clean: `pnpm lint`
- [ ] Build succeeds: `pnpm build`
- [ ] Version bumped in all `packages/*/package.json`
- [ ] `CHANGELOG.md` updated with release notes
- [ ] `NPM_TOKEN` secret configured in GitHub

## Version Bumping

Follow [Semantic Versioning](https://semver.org/):

| Change | Example | When |
|--------|---------|------|
| Patch | 0.1.0 -> 0.1.1 | Bug fixes |
| Minor | 0.1.0 -> 0.2.0 | New features (backward compatible) |
| Major | 0.1.0 -> 1.0.0 | Breaking changes |

## Verify Publication

After publishing, check:
- https://www.npmjs.com/package/@programsmagic/toon-core
- https://www.npmjs.com/package/@programsmagic/toon-format
- https://www.npmjs.com/package/@programsmagic/toon-converter
- https://www.npmjs.com/package/@programsmagic/toon-tokenizer
- https://www.npmjs.com/package/@programsmagic/toon-viewer
- https://www.npmjs.com/package/@programsmagic/toon-frontend
- https://www.npmjs.com/package/@programsmagic/toon-backend-node
- https://www.npmjs.com/package/@programsmagic/toon-cli

## Troubleshooting

| Issue | Fix |
|-------|-----|
| NPM auth error | Check `NPM_TOKEN` in GitHub Secrets |
| Package exists | Bump version in `package.json` |
| Access denied | Use `--access public` for scoped packages |
| Pages 404 | Enable GitHub Pages with source: GitHub Actions |
| Build fails | Check Actions logs; run `pnpm build` locally first |
