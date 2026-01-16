# Vercel Deployment Guide

This guide will help you deploy this application to Vercel.

## Prerequisites

1. A GitHub account
2. A Vercel account (sign up at [vercel.com](https://vercel.com))
3. A GitHub Personal Access Token with `repo` and `user` scopes

## Step 1: Create a GitHub Personal Access Token

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name (e.g., "cside-interview")
4. Select scopes: `repo` and `user`
5. Generate the token and copy it (you won't see it again!)

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite (should auto-detect)
   - **Root Directory**: `./` (default)
   - **Build Command**: `pnpm relay && pnpm build` (already configured in vercel.json)
   - **Output Directory**: `dist` (already configured in vercel.json)
   - **Install Command**: `pnpm install` (already configured in vercel.json)
5. Add Environment Variable:
   - **Name**: `VITE_GH_TOKEN`
   - **Value**: Your GitHub Personal Access Token from Step 1
6. Click "Deploy"

### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. When prompted, add the environment variable:
   - `VITE_GH_TOKEN`: Your GitHub Personal Access Token

5. For production deployment:
   ```bash
   vercel --prod
   ```

## Step 3: Configure Environment Variables

After deployment, you can add/update environment variables:

1. Go to your project on Vercel dashboard
2. Navigate to Settings → Environment Variables
3. Add or update `VITE_GH_TOKEN` with your GitHub token
4. Redeploy if needed

## Important Security Note

⚠️ **WARNING**: This is a frontend-only application. Your GitHub token will be publicly visible in the browser's Network tab when making API requests. 

**Do NOT use a token with sensitive permissions or access to private repositories if you plan to make this public.**

Consider:
- Using a token with minimal required scopes
- Using a separate GitHub account for this project
- Not deploying this publicly if you're concerned about token exposure

## Troubleshooting

### Build Fails

- Make sure `pnpm` is selected as the package manager in Vercel settings
- Check that the `VITE_GH_TOKEN` environment variable is set
- Verify the build command runs successfully locally: `pnpm relay && pnpm build`

### App Doesn't Load

- Check that all routes are properly configured (SPA routing is handled by vercel.json)
- Verify the output directory is `dist`
- Check browser console for errors

### API Requests Fail

- Verify `VITE_GH_TOKEN` is set correctly in Vercel environment variables
- Check that the token has the required scopes (`repo` and `user`)
- Ensure the token hasn't expired
