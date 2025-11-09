# How to Publish Packages to NPM

## Current Status

The packages are **NOT published to NPM yet**. They need to be published first before documentation will appear on NPM.

## Quick Publish Guide

### Option 1: Use GitHub Actions (Recommended)

1. **Create NPM Token**:
   - Go to: https://www.npmjs.com/settings/programsmagic/tokens
   - Click "Generate New Token"
   - Type: **Automation**
   - Copy the token

2. **Add to GitHub Secrets**:
   - Go to: https://github.com/programsmagic/toon-package/settings/secrets/actions
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: Paste your token
   - Click "Add secret"

3. **Create GitHub Release**:
   - Go to: https://github.com/programsmagic/toon-package/releases/new
   - Tag: `v0.1.0`
   - Title: `v0.1.0 - Initial Release`
   - Click "Publish release"
   - This will automatically publish all 8 packages to NPM

### Option 2: Manual Publishing

1. **Login to NPM**:
   ```bash
   npm login
   ```

2. **Publish packages in dependency order**:
   ```bash
   cd packages/core && pnpm publish --access public --no-git-checks
   cd ../format && pnpm publish --access public --no-git-checks
   cd ../converter && pnpm publish --access public --no-git-checks
   cd ../tokenizer && pnpm publish --access public --no-git-checks
   cd ../viewer && pnpm publish --access public --no-git-checks
   cd ../frontend && pnpm publish --access public --no-git-checks
   cd ../backend-node && pnpm publish --access public --no-git-checks
   cd ../cli && pnpm publish --access public --no-git-checks
   ```

## Verify Publication

After publishing, check:
- https://www.npmjs.com/package/@toon/core
- https://www.npmjs.com/package/@toon/format
- https://www.npmjs.com/package/@toon/converter
- https://www.npmjs.com/package/@toon/tokenizer
- https://www.npmjs.com/package/@toon/viewer
- https://www.npmjs.com/package/@toon/frontend
- https://www.npmjs.com/package/@toon/backend-node
- https://www.npmjs.com/package/@toon/cli

## Documentation on NPM

Once published, the README.md files will automatically appear on each package's NPM page. The README files are already included in the `files` array of each package.json.

