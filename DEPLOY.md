# Quick Deployment Guide

## Prerequisites

1. **NPM Account**: Create at [npmjs.com](https://www.npmjs.com)
2. **NPM Token**: Generate at [npmjs.com/settings/YOUR_USERNAME/tokens](https://www.npmjs.com/settings/YOUR_USERNAME/tokens)
3. **GitHub Secrets**: Add `NPM_TOKEN` in repository Settings > Secrets > Actions

## Deployment Steps

### Option 1: Automatic Deployment (Recommended)

1. **Create GitHub Release**:
   - Go to GitHub repository
   - Click **Releases** > **Create a new release**
   - Tag: `v0.1.0`
   - Title: `v0.1.0 - Initial Release`
   - Click **Publish release**

2. **GitHub Actions will automatically**:
   - Build all packages
   - Publish to NPM
   - Deploy documentation to GitHub Pages

### Option 2: Manual Deployment

#### Build All Packages

```bash
pnpm install
pnpm build
```

#### Publish to NPM

```bash
# Publish all packages
cd packages/core && pnpm publish --access public
cd ../backend-node && pnpm publish --access public
cd ../frontend && pnpm publish --access public
cd ../format && pnpm publish --access public
cd ../converter && pnpm publish --access public
cd ../tokenizer && pnpm publish --access public
cd ../viewer && pnpm publish --access public
cd ../cli && pnpm publish --access public
```

#### Deploy Documentation

```bash
# Build documentation
pnpm build-docs

# Push to gh-pages branch (if using manual deployment)
git checkout --orphan gh-pages
git rm -rf .
cp -r docs-build/* .
git add .
git commit -m "Deploy documentation"
git push origin gh-pages
```

## Enable GitHub Pages

1. Go to repository **Settings** > **Pages**
2. Source: **GitHub Actions**
3. Save

## Verify Deployment

### NPM Packages

Check packages on NPM:
- [@toon/core](https://www.npmjs.com/package/@toon/core)
- [@toon/backend-node](https://www.npmjs.com/package/@toon/backend-node)
- [@toon/frontend](https://www.npmjs.com/package/@toon/frontend)
- [@toon/format](https://www.npmjs.com/package/@toon/format)
- [@toon/converter](https://www.npmjs.com/package/@toon/converter)
- [@toon/tokenizer](https://www.npmjs.com/package/@toon/tokenizer)
- [@toon/viewer](https://www.npmjs.com/package/@toon/viewer)
- [@toon/cli](https://www.npmjs.com/package/@toon/cli)

### GitHub Pages

Documentation will be available at:
`https://YOUR_USERNAME.github.io/toon-package`

## Troubleshooting

- **NPM Authentication Error**: Check `NPM_TOKEN` in GitHub Secrets
- **Package Already Exists**: Update version in `package.json`
- **GitHub Pages 404**: Enable GitHub Pages in repository settings

