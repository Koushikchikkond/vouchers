# 🚀 Deployment Checklist for Enhanced Voucher App

## ✅ Pre-Deployment Checklist

### 1. Backend (Google Apps Script) - **CRITICAL**

- [ ] **Open Google Apps Script Project**
  - Go to: https://script.google.com
  - Open your existing project

- [ ] **Replace Code**
  - Open `Code.gs` in your project
  - Copy all content from `backend/Code_Enhanced.gs`
  - Paste and replace the entire content
  - **Save the file** (Ctrl+S or Cmd+S)

- [ ] **Deploy New Version**
  - Click "Deploy" → "New deployment"
  - Type: "Web app"
  - Description: "Enhanced version with authentication and management"
  - Execute as: "Me"
  - Who has access: "Anyone"
  - Click "Deploy"
  - **Copy the new deployment URL**

- [ ] **Update Spreadsheet** (if needed)
  - The script will auto-create the "Users" sheet on first login
  - Default user will be created automatically:
    - Username: `koushik`
    - Password: `Koushik@8861`
  - **⚠️ IMPORTANT**: Update the default email in `Code_Enhanced.gs` line 70:
    ```javascript
    usersSheet.appendRow(['koushik', simpleHash('Koushik@8861'), 'Koushik', 'your.real.email@gmail.com']);
    ```
    Replace `'koushik@example.com'` with your actual Gmail address for password reset to work!

### 2. Frontend Environment Variables

- [ ] **Check .env file**
  ```bash
  # Open .env file
  # Verify VITE_API_URL is set to your Google Apps Script deployment URL
  VITE_API_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
  ```

- [ ] **Update if needed**
  - If you got a new deployment URL from step 1, update it here

### 3. Local Testing (Optional but Recommended)

- [ ] **Test locally first**
  ```bash
  npm run dev
  ```

- [ ] **Test these features**:
  - [ ] Login with admin/admin123
  - [ ] Create a new node
  - [ ] Add a transaction
  - [ ] View node details
  - [ ] Edit a transaction
  - [ ] Delete a transaction
  - [ ] Export node data
  - [ ] Export all nodes
  - [ ] Edit node name
  - [ ] Delete a node
  - [ ] Logout

### 4. Build for Production

- [ ] **Build the project**
  ```bash
  npm run build
  ```

- [ ] **Verify build success**
  - Check for `dist` folder
  - No build errors in console

### 5. Deploy to Vercel

#### Option A: Using Vercel CLI (Fastest)

- [ ] **Deploy**
  ```bash
  vercel --prod
  ```

- [ ] **Wait for deployment**
  - Vercel will provide a production URL
  - Note down the URL

#### Option B: Using Vercel Dashboard

- [ ] **Push to GitHub**
  ```bash
  git add .
  git commit -m "Added authentication and management features"
  git push
  ```

- [ ] **Vercel auto-deploys**
  - Go to vercel.com/your-project
  - Wait for automatic deployment
  - Check deployment status

### 6. Post-Deployment Verification

- [ ] **Open your Vercel URL**
  - Visit: https://your-app.vercel.app

- [ ] **Test Login**
  - Username: koushik
  - Password: Koushik@8861
  - Should successfully log in

- [ ] **Test Forgot Password** (Important!)
  - Click "Forgot Password?" on login screen
  - Enter your email (the one you set in backend)
  - Check your email for OTP
  - Enter OTP
  - Set a new password
  - Login with new password
  - **Note**: If email doesn't arrive, check spam folder and verify email in Users sheet

- [ ] **Test Core Features**:
  - [ ] Create a node
  - [ ] Add a transaction (both VOUCHER and REQUESTED modes)
  - [ ] View node details (click on node name)
  - [ ] Edit a transaction
  - [ ] Export node data
  - [ ] Export all nodes
  - [ ] Logout and login again

- [ ] **Test Data Isolation**
  - Create some transactions
  - Logout
  - Login again
  - Verify you only see your own data

### 7. Update CORS (If Needed)

If you see CORS errors:

- [ ] **Update Google Apps Script**
  - In `Code_Enhanced.gs`, the CORS headers should already be set to `*`
  - If you want to restrict to your domain:
    ```javascript
    // In the response() function, add:
    const output = ContentService.createTextOutput(JSON.stringify(data));
    output.setMimeType(ContentService.MimeType.JSON);
    output.setHeader('Access-Control-Allow-Origin', 'https://your-app.vercel.app');
    return output;
    ```

## 🎯 Quick Deploy Commands

```bash
# 1. Build
npm run build

# 2. Deploy to Vercel
vercel --prod

# That's it! ✨
```

## 📝 Important Notes

### Default Credentials
- **Username**: `koushik`
- **Password**: `Koushik@8861`
- **Email**: Update in backend before deploying!
- **⚠️ Change password after first login using Forgot Password feature!**

### Adding More Users
1. Open Google Spreadsheet
2. Go to "Users" sheet
3. Add row with: Username, Hashed Password, Name
4. To hash password, use Apps Script:
   ```javascript
   function hashPassword() {
     Logger.log(simpleHash("your_password"));
   }
   ```

### Data Migration
If you have existing data without user fields:
1. Open Google Spreadsheet
2. Add "User" column (column C)
3. Fill all existing rows with "admin"
4. This assigns all old data to the admin user

## 🐛 Common Issues

### Issue: "Invalid credentials"
**Solution**: 
- Check if Users sheet exists
- Try creating it manually with headers: Username, Password, Name
- Add admin user manually

### Issue: "No transactions showing"
**Solution**:
- Check if transactions have user field
- Verify you're logged in
- Check browser console for errors

### Issue: "CORS error"
**Solution**:
- Redeploy Google Apps Script
- Clear browser cache
- Check CORS headers in backend

### Issue: "Build fails"
**Solution**:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

## ✅ Final Checklist

Before announcing to users:

- [ ] Backend deployed and working
- [ ] Frontend deployed to Vercel
- [ ] Login works
- [ ] All features tested
- [ ] Data exports correctly
- [ ] No console errors
- [ ] Mobile responsive (test on phone)
- [ ] Created backup of Google Spreadsheet

## 🎉 You're Done!

Your enhanced voucher application is now live with:
- ✅ User authentication
- ✅ Node management (edit/delete)
- ✅ Transaction management (edit/delete)
- ✅ Enhanced exports (per-node and all nodes)
- ✅ Beautiful UI with user info

**Share your app**: https://your-app.vercel.app

---

**Questions?** Check `NEW_FEATURES.md` for detailed feature documentation.
