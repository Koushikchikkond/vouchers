# 🚀 Vercel Deployment Guide

This guide will help you deploy your Vouchers application to Vercel for free.

## Prerequisites

- A GitHub account (recommended) or Vercel account
- Your project code
- Your Google Apps Script backend URL

## Method 1: Deploy via Vercel CLI (Fastest)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Build Your Project (Test First)

```bash
npm run build
```

This creates a `dist` folder with your production-ready files.

### Step 3: Deploy to Vercel

```bash
vercel
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Your account
- **Link to existing project?** → No
- **Project name?** → vouchers (or your preferred name)
- **Directory?** → ./ (press Enter)
- **Override settings?** → No

### Step 4: Add Environment Variables

After deployment, add your environment variable:

```bash
vercel env add VITE_API_URL
```

When prompted, paste your Google Apps Script URL:
```
https://script.google.com/macros/s/AKfycbxCXh8qxtRzu6G3xUsIISVYhfmeo6WpaFXpHNvNKr6SkluCWfwGRNDabKR5DalFdxZYhA/exec
```

Select: **Production, Preview, and Development**

### Step 5: Redeploy with Environment Variables

```bash
vercel --prod
```

Your app is now live! 🎉

---

## Method 2: Deploy via Vercel Dashboard (Easiest)

### Step 1: Push to GitHub

1. Create a new repository on GitHub
2. Initialize git in your project:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/vouchers.git
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click **"Add New Project"**
4. Import your `vouchers` repository
5. Vercel will auto-detect Vite settings

### Step 3: Configure Environment Variables

Before deploying, add environment variables:

1. In the import screen, expand **"Environment Variables"**
2. Add:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://script.google.com/macros/s/AKfycbxCXh8qxtRzu6G3xUsIISVYhfmeo6WpaFXpHNvNKr6SkluCWfwGRNDabKR5DalFdxZYhA/exec`
   - **Environment:** Production, Preview, Development

### Step 4: Deploy

Click **"Deploy"** and wait 1-2 minutes.

Your app is now live! 🎉

---

## Post-Deployment Steps

### 1. Update Google Apps Script CORS (Important!)

Your backend needs to allow requests from your Vercel domain.

1. Open your Google Apps Script project
2. Find the `doPost` or `doGet` function
3. Update the CORS headers to include your Vercel URL:

```javascript
function doPost(e) {
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  
  // Add your Vercel domain here
  output.setHeader('Access-Control-Allow-Origin', 'https://your-app.vercel.app');
  output.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  output.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // ... rest of your code
}
```

Or allow all origins (less secure but easier):
```javascript
output.setHeader('Access-Control-Allow-Origin', '*');
```

2. **Deploy** your Google Apps Script again

### 2. Test Your Deployment

Visit your Vercel URL and test:
- ✅ Voucher submission
- ✅ Requested money submission
- ✅ Transaction history
- ✅ Export functionality
- ✅ Image uploads

### 3. Custom Domain (Optional)

1. Go to your Vercel project settings
2. Navigate to **"Domains"**
3. Add your custom domain
4. Update DNS records as instructed

---

## Useful Vercel Commands

```bash
# Deploy to production
vercel --prod

# Deploy to preview
vercel

# View deployment logs
vercel logs

# List all deployments
vercel ls

# Remove a deployment
vercel rm [deployment-url]

# Open project in browser
vercel open
```

---

## Troubleshooting

### Build Fails
- Check `npm run build` works locally first
- Ensure all dependencies are in `package.json` (not just devDependencies)

### Environment Variables Not Working
- Make sure variable names start with `VITE_`
- Redeploy after adding environment variables
- Check Vercel dashboard → Settings → Environment Variables

### CORS Errors
- Update Google Apps Script CORS headers
- Redeploy your Google Apps Script
- Clear browser cache

### 404 Errors on Refresh
- The `vercel.json` file handles this with rewrites
- Make sure `vercel.json` is committed to your repo

---

## Your Deployment URLs

After deployment, you'll get:
- **Production URL:** `https://vouchers.vercel.app` (or custom name)
- **Preview URLs:** Automatic for each git push
- **Deployment Dashboard:** `https://vercel.com/your-username/vouchers`

---

## Free Tier Limits

Vercel's free tier includes:
- ✅ Unlimited personal projects
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Automatic deployments from Git
- ✅ Preview deployments for PRs

This is more than enough for your voucher application!

---

## Need Help?

- Vercel Documentation: https://vercel.com/docs
- Vite Deployment Guide: https://vitejs.dev/guide/static-deploy.html
- Vercel Support: https://vercel.com/support

Happy deploying! 🚀
