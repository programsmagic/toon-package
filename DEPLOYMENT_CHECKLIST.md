# Deployment Checklist

Use this checklist before deploying Toon Agent Bridge to NPM and GitHub Pages.

## Pre-Deployment Checklist

### 1. Update Repository URLs

- [ ] Replace `yourusername` with your GitHub username in:
  - [ ] `packages/core/package.json`
  - [ ] `packages/backend-node/package.json`
  - [ ] `packages/frontend/package.json`
  - [ ] `README.md`
  - [ ] `docs/index.html`
  - [ ] All documentation files

### 2. Update Homepage URLs

- [ ] Update homepage URL to match your GitHub Pages URL:
  - [ ] `packages/core/package.json`
  - [ ] `packages/backend-node/package.json`
  - [ ] `packages/frontend/package.json`

### 3. Verify Package Versions

- [ ] Check that all packages have the same version (0.1.0)
- [ ] Update `CHANGELOG.md` with release notes

### 4. Test Locally

- [ ] Run `pnpm install`
- [ ] Run `pnpm build`
- [ ] Run `pnpm test`
- [ ] Run `pnpm lint`
- [ ] Test examples:
  - [ ] `examples/basic-openapi`
  - [ ] `examples/agents-json-event`

### 5. Build Documentation

- [ ] Run `pnpm build-docs`
- [ ] Verify `docs-build` directory is created
- [ ] Check that all HTML files are generated correctly

### 6. GitHub Setup

- [ ] Create GitHub repository (if not exists)
- [ ] Push code to GitHub
- [ ] Add NPM_TOKEN to GitHub Secrets:
  - [ ] Go to Settings > Secrets and variables > Actions
  - [ ] Add secret: `NPM_TOKEN` with your NPM access token
- [ ] Enable GitHub Pages:
  - [ ] Go to Settings > Pages
  - [ ] Source: GitHub Actions
  - [ ] Save

### 7. NPM Setup

- [ ] Create NPM account (if not exists)
- [ ] Create NPM organization `@toon` (if using scoped packages)
- [ ] Generate NPM access token:
  - [ ] Go to npmjs.com/settings/YOUR_USERNAME/tokens
  - [ ] Create token with "Automation" type
  - [ ] Copy token to GitHub Secrets

## Deployment Steps

### Step 1: Create GitHub Release

1. Go to your GitHub repository
2. Click **Releases** > **Create a new release**
3. Tag version: `v0.1.0`
4. Release title: `v0.1.0 - Initial Release`
5. Description: Copy from `CHANGELOG.md`
6. Click **Publish release**

### Step 2: Verify NPM Publishing

1. Check GitHub Actions workflow runs
2. Verify packages are published:
   - [ ] [@toon/core](https://www.npmjs.com/package/@toon/core)
   - [ ] [@toon/backend-node](https://www.npmjs.com/package/@toon/backend-node)
   - [ ] [@toon/frontend](https://www.npmjs.com/package/@toon/frontend)

### Step 3: Verify GitHub Pages

1. Check GitHub Actions deployment workflow
2. Verify documentation is live:
   - [ ] https://yourusername.github.io/toon-package
   - [ ] All pages load correctly
   - [ ] Navigation works

## Post-Deployment

### 1. Test Installation

```bash
npm install @toon/core @toon/backend-node @toon/frontend
```

### 2. Test Examples

- [ ] Test basic OpenAPI example
- [ ] Test agents.json example
- [ ] Verify all endpoints work

### 3. Update Documentation

- [ ] Update README with actual NPM links
- [ ] Update documentation with actual GitHub Pages URL
- [ ] Add badges to README

### 4. Announce

- [ ] Post on social media
- [ ] Share in relevant communities
- [ ] Update project status

## Troubleshooting

### NPM Publishing Issues

- **Authentication Error**: Check NPM_TOKEN in GitHub Secrets
- **Package Already Exists**: Update version in package.json
- **Access Denied**: Use `--access public` for scoped packages

### GitHub Pages Issues

- **404 Error**: Check GitHub Pages settings
- **Build Fails**: Check GitHub Actions logs
- **Missing Files**: Ensure docs-build is in repository

## Next Release

When ready for next release:

1. Update versions in all `package.json` files
2. Update `CHANGELOG.md`
3. Create new GitHub release
4. Follow deployment steps again

