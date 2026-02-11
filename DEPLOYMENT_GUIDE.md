# Deployment Guide - Updating Live Server

## Overview
This guide will help you deploy the updated voucher application with the new PDF export functionality and Indian Rupee (₹) currency symbol to your live server.

## What Changed
1. **Currency**: All $ symbols replaced with ₹
2. **Export Format**: CSV exports replaced with professional PDF exports with tables
3. **New Dependencies**: Added `jspdf` and `jspdf-autotable`

---

## Deployment Steps

### Step 1: Build the Production Bundle

Run the following command in your project directory:

```bash
npm run build
```

This will create an optimized production build in the `dist/` folder.

**Expected Output:**
- A `dist/` folder containing all compiled files
- Minified JavaScript and CSS files
- Optimized assets

---

### Step 2: Deploy Frontend

Depending on your hosting platform, follow the appropriate method:

#### Option A: Netlify / Vercel / Similar Platforms

1. **If using Git integration:**
   ```bash
   git add .
   git commit -m "Updated to PDF export and Indian Rupee currency"
   git push origin main
   ```
   - Your platform will automatically detect changes and rebuild

2. **If using manual deployment:**
   - Upload the entire `dist/` folder to your hosting platform
   - Or use their CLI tools:
   
   **Netlify:**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```
   
   **Vercel:**
   ```bash
   npm install -g vercel
   vercel --prod
   ```

#### Option B: Traditional Web Hosting (cPanel, FTP, etc.)

1. Build the project:
   ```bash
   npm run build
   ```

2. Upload the contents of the `dist/` folder to your web server:
   - Using FTP client (FileZilla, WinSCP, etc.)
   - Or using cPanel File Manager
   - Upload to your public_html or www directory

3. Ensure `.env` file is configured with your API URL

---

### Step 3: Backend (Google Apps Script) - No Changes Needed

**Good News:** The backend doesn't need any updates for these changes!

The PDF generation happens entirely in the frontend (browser), so your Google Apps Script backend remains unchanged.

However, if you want to verify your backend is working:

1. Open your Google Apps Script project
2. Ensure the deployment URL in your `.env` file matches:
   ```
   VITE_API_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
   ```

---

### Step 4: Verify Environment Variables

Make sure your `.env` file (or environment variables on your hosting platform) contains:

```env
VITE_API_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

**For different hosting platforms:**

- **Netlify**: Set in Site settings → Environment variables
- **Vercel**: Set in Project Settings → Environment Variables
- **Traditional hosting**: Upload `.env` file to root directory

---

### Step 5: Test the Deployment

After deployment, test the following:

1. **Login**: Use credentials `koushik` / `Koushik@8861`
2. **Currency Symbol**: Verify ₹ appears in amount fields
3. **Create Transaction**: Add a test transaction
4. **Export PDF**: 
   - Go to Node Details → Export Transactions
   - Select date range and download
   - Verify PDF has table format with ₹ symbols
5. **Export All Nodes**: Test the "Export All" button on landing screen

---

## Quick Deployment Commands

### For Git-based Deployment:
```bash
# Build the project
npm run build

# Commit and push changes
git add .
git commit -m "Updated to PDF export and Rupee currency"
git push origin main
```

### For Manual Deployment:
```bash
# Build the project
npm run build

# The dist/ folder is now ready to upload to your server
# Upload contents of dist/ folder to your web hosting
```

---

## Troubleshooting

### Issue: PDF not generating
**Solution**: Clear browser cache and hard reload (Ctrl+Shift+R)

### Issue: Still seeing $ instead of ₹
**Solution**: 
1. Clear browser cache
2. Verify you're accessing the new deployment URL
3. Check browser console for errors

### Issue: Build fails
**Solution**: 
1. Delete `node_modules` folder
2. Run `npm install`
3. Run `npm run build` again

### Issue: Environment variables not working
**Solution**:
- For Netlify/Vercel: Set variables in dashboard
- For traditional hosting: Ensure `.env` file is in root directory
- Rebuild after changing environment variables

---

## Rollback Plan

If you need to rollback to the previous version:

1. **Git-based deployment:**
   ```bash
   git revert HEAD
   git push origin main
   ```

2. **Manual deployment:**
   - Keep a backup of your previous `dist/` folder
   - Re-upload the backup if needed

---

## Support Files Created

- `AUTHENTICATION_UPDATE.md` - Details about hardcoded login
- `EXPORT_AND_CURRENCY_UPDATE.md` - Details about PDF export and currency changes
- This file: `DEPLOYMENT_GUIDE.md` - Deployment instructions

---

## Summary

✅ **Frontend Changes**: PDF export + ₹ currency symbol  
✅ **Backend Changes**: None required  
✅ **New Dependencies**: jspdf, jspdf-autotable (already installed)  
✅ **Build Command**: `npm run build`  
✅ **Deploy**: Upload `dist/` folder or push to Git  

Your application is ready to deploy! 🚀
