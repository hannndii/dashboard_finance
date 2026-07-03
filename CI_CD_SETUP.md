# CI/CD Pipeline Setup Guide

Your project now has automated CI/CD workflows using GitHub Actions. This guide explains how to configure and use them.

## 📋 Overview

The pipeline includes:

- **Linting & Code Quality**: Runs ESLint to check code standards
- **Type Checking**: Validates TypeScript types
- **Build**: Compiles your Next.js application
- **Testing**: Runs automated tests (if configured)
- **Deploy**: Automatically deploys to Vercel on push to main/development branches

## 🚀 Deployment Setup (Required for Deploy Stage)

### 1. Get Vercel Tokens

Follow these steps to get your Vercel credentials:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to **Settings** → **Tokens**
3. Create a new token and copy it

### 2. Link Project to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Link your project
vercel link

# This will create a `.vercel` folder with project configuration
```

### 3. Add GitHub Secrets

Go to your GitHub repository settings:

1. Click **Settings** → **Secrets and variables** → **Actions**
2. Add these secrets:

| Secret Name | Value |
|---|---|
| `VERCEL_TOKEN` | Your Vercel authentication token |
| `VERCEL_ORG_ID` | Found in `.vercel/project.json` (teamId field, or your account ID) |
| `VERCEL_PROJECT_ID` | Found in `.vercel/project.json` (projectId field) |
| `GITHUB_TOKEN` | Auto-provided by GitHub Actions (no manual setup needed) |

**To find `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID`:**

After running `vercel link`, check `.vercel/project.json`:

```json
{
  "projectId": "your_project_id_here",
  "orgId": "your_org_id_here"
}
```

### 4. Environment Variables

If your project needs environment variables (like API keys, database URLs):

1. Add them to your `.env.local` file locally
2. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
3. Add each variable for Production, Preview, and Development environments

Common variables for this project:
- `MONGODB_URI` - MongoDB connection string
- `GOOGLE_SHEETS_API_KEY` - Google Sheets API key
- `JWT_SECRET` - Authentication secret
- Any other API keys needed

## 📊 Workflow Triggers

### CI Pipeline (ci.yml)
- ✅ Runs on every push to any branch
- ✅ Runs on pull requests to main/development
- ❌ Blocks merge if any check fails (recommended)

### Deploy Pipeline (deploy.yml)
- ✅ Runs only on push to `main` (production) or `development` (staging)
- ✅ Automatically deploys to Vercel

## 🔧 Managing the Workflows

### View Workflow Runs

1. Go to your GitHub repository
2. Click **Actions** tab
3. Select a workflow to see detailed logs

### Manually Trigger Workflow

In the **Actions** tab, click a workflow and select "Run workflow"

### Disable a Workflow

1. Go to **Actions** tab
2. Select the workflow
3. Click the **...** menu → **Disable workflow**

## 🛠️ Adding Tests

To enable the test stage, update your `package.json`:

```json
{
  "scripts": {
    "test": "jest --coverage"
  }
}
```

Then install Jest:

```bash
npm install --save-dev jest @types/jest
```

## 📝 Tips

- Always create a pull request before merging to main
- The CI pipeline will automatically run and show results on your PR
- Only merge if all checks pass (they're required)
- Preview deployments are created for pull requests (when ready)
- Production deploys happen automatically on push to main

## 🚨 Troubleshooting

### Deploy fails with "token error"
- Verify `VERCEL_TOKEN` is correctly set in GitHub Secrets
- Check that the token hasn't expired

### Deploy fails with "project not found"
- Verify `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` are correct
- Run `vercel link` again locally to refresh `.vercel/project.json`

### ESLint or TypeScript checks fail
- Run locally to see detailed errors: `npm run lint` or `npx tsc --noEmit`
- Fix errors and push again

### MongoDB connection errors during build
- If build connects to MongoDB, ensure IP whitelist allows GitHub Actions IPs
- Consider using environment variables for optional features

## 📚 Documentation

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel GitHub Action](https://github.com/vercel/action)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
