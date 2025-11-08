# NPM Organization Setup Guide

## Current Status

The `@toon` organization exists on NPM and you are the owner. However, publishing packages requires proper organization setup.

## Steps to Enable Publishing

### Option 1: Publish First Package via NPM Web Interface

1. Go to https://www.npmjs.com/org/toon
2. Click "Add Package" or "Publish Package"
3. Follow the instructions to publish the first package

### Option 2: Use GitHub Actions (Recommended)

The GitHub Actions workflow is already configured. To publish:

1. **Set up NPM Token**:
   - Go to https://www.npmjs.com/settings/programsmagic/tokens
   - Create a new token with "Automation" type
   - Copy the token

2. **Add to GitHub Secrets**:
   - Go to your repository: https://github.com/programsmagic/toon-package/settings/secrets/actions
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: Paste your NPM token
   - Click "Add secret"

3. **Create GitHub Release**:
   - Go to https://github.com/programsmagic/toon-package/releases/new
   - Tag: `v0.1.0`
   - Title: `v0.1.0 - Initial Release`
   - Click "Publish release"
   - GitHub Actions will automatically publish all packages

### Option 3: Manual Publishing (After First Package)

Once the first package is published, you can publish manually:

```bash
# Make sure you're logged in
npm login

# Publish packages in dependency order
cd packages/core && pnpm publish --access public --no-git-checks
cd ../format && pnpm publish --access public --no-git-checks
cd ../converter && pnpm publish --access public --no-git-checks
cd ../tokenizer && pnpm publish --access public --no-git-checks
cd ../viewer && pnpm publish --access public --no-git-checks
cd ../frontend && pnpm publish --access public --no-git-checks
cd ../backend-node && pnpm publish --access public --no-git-checks
cd ../cli && pnpm publish --access public --no-git-checks
```

## Verify Organization Access

```bash
# Check organization members
npm org ls @toon

# Verify you're the owner
npm org ls @toon | grep owner
```

## Troubleshooting

- **404 Not Found**: The organization exists but no packages have been published yet. Use GitHub Actions or publish the first package manually.
- **403 Forbidden**: Check that your NPM token has the correct permissions.
- **Organization not found**: Make sure you're logged in with the correct account.

