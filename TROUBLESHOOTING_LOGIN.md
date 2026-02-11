# 🔧 STEP-BY-STEP FIX - Invalid Credentials Issue

## 🎯 Let's Fix This Together

Follow these steps **IN ORDER**:

---

## Step 1: Run Debug Script in Google Apps Script

1. **Open Google Apps Script**
   - Go to: https://script.google.com
   - Open your voucher project

2. **Add Debug Script**
   - Click the **+** next to Files
   - Name it: `Debug`
   - Copy ALL code from `backend/DEBUG_SCRIPT.gs`
   - Paste into the new file

3. **Run Debug Function**
   - Select function: `debugUsersSheet`
   - Click **Run** (▶️ button)
   - Click **View** → **Logs**
   - **COPY THE ENTIRE LOG OUTPUT**

4. **Share the logs with me** so I can see exactly what's wrong

---

## Step 2: Auto-Fix (While We Debug)

In the same Google Apps Script:

1. **Select function**: `fixUsersSheet`
2. **Click Run** (▶️)
3. **Check logs** - should say "✅ Users sheet is now correct!"
4. **Try logging in** again

---

## Step 3: Verify Google Sheet Manually

1. **Open your Google Spreadsheet**
   - ID: `1m5E55_48R-NoOEWVE94hUODBM1S4PTklE85HDKosUQg`

2. **Go to "Users" sheet**

3. **Check it looks EXACTLY like this:**

   ```
   Row 1 (Headers):
   A: Username
   B: Password
   C: Name
   D: Email
   
   Row 2 (Your data):
   A: koushik
   B: -1736575045
   C: Koushik
   D: koushikchikkond@gmail.com
   ```

4. **If anything is different:**
   - Column D missing? Add "Email" in D1
   - Email missing? Add "koushikchikkond@gmail.com" in D2
   - Password different? Change B2 to: `-1736575045`

---

## Step 4: Check Backend Deployment

1. **Open Google Apps Script**

2. **Click "Deploy" → "Manage deployments"**

3. **Check the deployment URL matches your .env:**
   ```
   Your .env: https://script.google.com/macros/s/AKfycbxzhp3xNUQr6itg037ZKWHWlJvD7LgXTVf3oPXT8MOzTzf6B7mTHdb742MtPbeDm1HEXA/exec
   ```

4. **If different, either:**
   - Update .env with correct URL, OR
   - Create new deployment

---

## Step 5: Test Backend Directly

**Test if backend is working:**

1. **Open this URL in browser:**
   ```
   https://script.google.com/macros/s/AKfycbxzhp3xNUQr6itg037ZKWHWlJvD7LgXTVf3oPXT8MOzTzf6B7mTHdb742MtPbeDm1HEXA/exec?action=login&username=koushik&password=Koushik@8861
   ```

2. **You should see:**
   ```json
   {"status":"success","user":{"username":"koushik","name":"Koushik"}}
   ```

3. **If you see error:**
   - Copy the exact error message
   - Share it with me

---

## Step 6: Clear Browser Cache

1. **Open your app** (http://localhost:5173)

2. **Open DevTools** (Press F12)

3. **Go to Application tab** (Chrome) or Storage tab (Firefox)

4. **Clear everything:**
   - Click "Clear site data" or "Clear storage"
   - Confirm

5. **Refresh page** (Ctrl+F5 or Cmd+Shift+R)

6. **Try logging in**

---

## Step 7: Check Browser Console

1. **Open your app**

2. **Open DevTools** (F12)

3. **Go to Console tab**

4. **Try logging in**

5. **Look for errors** (red text)

6. **Copy any errors** and share with me

---

## Step 8: Check Network Tab

1. **Open DevTools** (F12)

2. **Go to Network tab**

3. **Try logging in**

4. **Look for the login request**
   - Should be to: `https://script.google.com/macros/s/...`

5. **Click on it**

6. **Check Response tab**
   - What does it say?
   - Share the response with me

---

## 🔍 Common Issues & Fixes

### Issue 1: Password Hash Wrong
**Fix:**
```
Open Google Sheet → Users sheet → Cell B2
Change to: -1736575045
```

### Issue 2: Email Column Missing
**Fix:**
```
Open Google Sheet → Users sheet
Cell D1: Email
Cell D2: koushikchikkond@gmail.com
```

### Issue 3: Old Deployment
**Fix:**
```
Google Apps Script → Deploy → New deployment
Copy new URL → Update .env
Restart dev server
```

### Issue 4: Browser Cache
**Fix:**
```
F12 → Application → Clear site data
Ctrl+F5 to hard refresh
```

### Issue 5: Wrong Username/Password
**Fix:**
```
Username: koushik (all lowercase)
Password: Koushik@8861 (exact case)
```

---

## 🧪 Quick Test Checklist

Run through this:

- [ ] Users sheet exists in Google Spreadsheet
- [ ] Users sheet has 4 columns (Username, Password, Name, Email)
- [ ] Row 2 has: koushik | -1736575045 | Koushik | koushikchikkond@gmail.com
- [ ] Backend is deployed in Google Apps Script
- [ ] .env has correct deployment URL
- [ ] Browser cache is cleared
- [ ] Using correct credentials: koushik / Koushik@8861
- [ ] Dev server is running (npm run dev)
- [ ] No errors in browser console

---

## 🆘 Emergency Fix

If nothing works, do this:

1. **Delete Users sheet** from Google Spreadsheet
2. **Run this in Google Apps Script:**
   ```javascript
   function emergencyFix() {
     const ss = SpreadsheetApp.openById('1m5E55_48R-NoOEWVE94hUODBM1S4PTklE85HDKosUQg');
     
     // Delete old Users sheet if exists
     const oldSheet = ss.getSheetByName('Users');
     if (oldSheet) ss.deleteSheet(oldSheet);
     
     // Create new Users sheet
     const usersSheet = ss.insertSheet('Users');
     usersSheet.appendRow(['Username', 'Password', 'Name', 'Email']);
     usersSheet.appendRow(['koushik', simpleHash('Koushik@8861'), 'Koushik', 'koushikchikkond@gmail.com']);
     
     Logger.log('✅ Done! Try logging in now.');
   }
   
   function simpleHash(str) {
     let hash = 0;
     for (let i = 0; i < str.length; i++) {
       const char = str.charCodeAt(i);
       hash = ((hash << 5) - hash) + char;
       hash = hash & hash;
     }
     return hash.toString();
   }
   ```
3. **Run `emergencyFix` function**
4. **Try logging in**

---

## 📞 What I Need From You

To help you better, please:

1. **Run `debugUsersSheet` function** in Google Apps Script
2. **Copy the logs** (View → Logs)
3. **Share the logs** with me
4. **Try the backend URL** in browser (Step 5 above)
5. **Share what you see**
6. **Check browser console** for errors
7. **Share any error messages**

This will help me see exactly what's wrong!

---

## 💡 Most Likely Issues

Based on your screenshot earlier:

1. **Email column was missing** ← Most likely!
2. **Password hash might be wrong**
3. **Backend might not be deployed**

**Start with Step 2 (Auto-Fix) - it should solve most issues!**
