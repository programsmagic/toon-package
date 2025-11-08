# Deployment Guide

This guide explains how to deploy Toon Agent Bridge packages to NPM and documentation to GitHub Pages.

## Prerequisites

1. **NPM Account**: Create an account at [npmjs.com](https://www.npmjs.com)
2. **NPM Token**: Generate an access token at [npmjs.com/settings/YOUR_USERNAME/tokens](https://www.npmjs.com/settings/YOUR_USERNAME/tokens)
3. **GitHub Repository**: Push your code to GitHub
4. **GitHub Secrets**: Add your NPM token as a secret in GitHub repository settings

## Setting Up GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret**
4. Add:
   - **Name**: `NPM_TOKEN`
   - **Value**: Your NPM access token

## Updating Repository URLs

Before deploying, update the repository URLs in all `package.json` files:

1. Replace `yourusername` with your GitHub username in:
   - `packages/core/package.json`
   - `packages/backend-node/package.json`
   - `packages/frontend/package.json`

2. Update the homepage URL in the same files to match your GitHub Pages URL.

## Deploying to NPM

### Automatic Deployment (Recommended)

1. **Create a GitHub Release**:
   - Go to your repository on GitHub
   - Click **Releases** > **Create a new release**
   - Tag version: `v0.1.0`
   - Release title: `v0.1.0`
   - Click **Publish release**

2. **GitHub Actions will automatically**:
   - Build all packages
   - Publish to NPM
   - Deploy documentation to GitHub Pages

### Manual Deployment

1. **Build packages**:
   ```bash
   pnpm build
   ```

2. **Publish each package**:
   ```bash
   cd packages/core
   pnpm publish --access public
   
   cd ../backend-node
   pnpm publish --access public
   
   cd ../frontend
   pnpm publish --access public
   ```

## Deploying Documentation to GitHub Pages

### Automatic Deployment

The documentation is automatically deployed when you push to the `main` branch.

1. **Build documentation**:
   ```bash
   pnpm build-docs
   ```

2. **Commit and push**:
   ```bash
   git add docs-build
   git commit -m "Update documentation"
   git push origin main
   ```

3. **Enable GitHub Pages**:
   - Go to repository **Settings** > **Pages**
   - Source: **GitHub Actions**
   - Save

### Manual Deployment

1. **Build documentation**:
   ```bash
   pnpm build-docs
   ```

2. **Push to gh-pages branch**:
   ```bash
   git checkout --orphan gh-pages
   git rm -rf .
   git add docs-build/*
   git mv docs-build/* .
   git commit -m "Deploy documentation"
   git push origin gh-pages
   ```

## Verifying Deployment

### NPM Packages

Check your packages on NPM:
- [@toon/core](https://www.npmjs.com/package/@toon/core)
- [@toon/backend-node](https://www.npmjs.com/package/@toon/backend-node)
- [@toon/frontend](https://www.npmjs.com/package/@toon/frontend)

### GitHub Pages

Your documentation will be available at:
`https://YOUR_USERNAME.github.io/toon-package`

## Troubleshooting

### NPM Publishing Issues

- **Authentication Error**: Make sure your NPM token is set correctly in GitHub Secrets
- **Package Already Exists**: Update the version in `package.json` before publishing
- **Access Denied**: Make sure you're using `--access public` for scoped packages

### GitHub Pages Issues

- **404 Error**: Make sure GitHub Pages is enabled and using GitHub Actions as the source
- **Build Fails**: Check the GitHub Actions logs for errors
- **Missing Files**: Ensure `docs-build` directory is included in the repository

## Version Management

Follow [Semantic Versioning](https://semver.org/):

- **Patch** (0.1.0 → 0.1.1): Bug fixes
- **Minor** (0.1.0 → 0.2.0): New features, backward compatible
- **Major** (0.1.0 → 1.0.0): Breaking changes

Update versions in:
- `packages/*/package.json`
- `CHANGELOG.md`
- Create a new GitHub release with the version tag

## Next Steps

1. Update repository URLs in all package.json files
2. Add NPM_TOKEN to GitHub Secrets
3. Create your first release
4. Enable GitHub Pages
5. Share your packages with the community!

