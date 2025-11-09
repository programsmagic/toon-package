# GitHub Pages 404 Fix Guide

## Issue
Getting 404 on https://programsmagic.github.io/toon-package

## Solution Steps

### Step 1: Enable GitHub Pages in Repository Settings

1. Go to your repository: https://github.com/programsmagic/toon-package
2. Click **Settings** (top menu)
3. Scroll down to **Pages** (left sidebar)
4. Under **Source**, select: **GitHub Actions**
5. Click **Save**

### Step 2: Manually Trigger the Workflow

1. Go to **Actions** tab in your repository
2. Click on **Deploy to GitHub Pages** workflow
3. Click **Run workflow** button (top right)
4. Select branch: **main**
5. Click **Run workflow**

### Step 3: Verify Workflow Success

1. Go to **Actions** tab
2. Check if the workflow completed successfully
3. If it failed, check the logs for errors

### Step 4: Wait for Deployment

- GitHub Pages can take 1-2 minutes to deploy
- After deployment, the site will be available at:
  - https://programsmagic.github.io/toon-package

## Alternative: Check Workflow Status

If the workflow hasn't run, you can check:
1. Go to **Actions** tab
2. Look for **Deploy to GitHub Pages** workflow
3. If it shows "No workflow runs", the workflow needs to be triggered

## Troubleshooting

### If workflow fails:
- Check that `pnpm build-docs` runs successfully locally
- Verify all dependencies are in `package.json`
- Check workflow logs for specific errors

### If Pages still shows 404:
- Wait 2-3 minutes after workflow completes
- Clear browser cache
- Try incognito/private browsing mode
- Check repository Settings > Pages for the correct URL

