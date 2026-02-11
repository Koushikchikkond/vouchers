# 🔐 Forgot Password - Quick Start Guide

## 🎯 Overview
Your voucher app now has a secure password reset feature using email OTP verification.

---

## 📱 User Flow (3 Simple Steps)

### Step 1: Request OTP
```
┌─────────────────────────────────┐
│     🔒 Reset Password           │
│                                 │
│  Enter your email to receive    │
│  OTP                            │
│                                 │
│  ┌───────────────────────────┐ │
│  │ 📧 your.email@gmail.com   │ │
│  └───────────────────────────┘ │
│                                 │
│  [ Send OTP ]                   │
│                                 │
│  ← Back to Login                │
└─────────────────────────────────┘
```

**What happens:**
- User enters their registered email
- System validates email exists
- Generates 6-digit OTP
- Sends email with OTP
- OTP valid for 10 minutes

---

### Step 2: Verify OTP
```
┌─────────────────────────────────┐
│     🔒 Reset Password           │
│                                 │
│  Enter the OTP sent to your     │
│  email                          │
│                                 │
│  ┌───────────────────────────┐ │
│  │      1  2  3  4  5  6     │ │
│  └───────────────────────────┘ │
│                                 │
│  OTP sent to user@example.com   │
│                                 │
│  [ Verify OTP ]                 │
│                                 │
│  Didn't receive? Try again      │
└─────────────────────────────────┘
```

**What happens:**
- User enters 6-digit OTP from email
- System validates OTP
- Checks if not expired
- Checks if not already used
- Advances to password reset

---

### Step 3: Set New Password
```
┌─────────────────────────────────┐
│     🔒 Reset Password           │
│                                 │
│  Create your new password       │
│                                 │
│  New Password                   │
│  ┌───────────────────────────┐ │
│  │ ••••••••••••••            │ │
│  └───────────────────────────┘ │
│                                 │
│  Confirm Password               │
│  ┌───────────────────────────┐ │
│  │ ••••••••••••••            │ │
│  └───────────────────────────┘ │
│                                 │
│  [ Reset Password ]             │
└─────────────────────────────────┘
```

**What happens:**
- User enters new password
- User confirms password
- System validates passwords match
- Updates password in database
- Marks OTP as used
- Redirects to login

---

## ✅ Success!
```
┌─────────────────────────────────┐
│     ✅ Success!                 │
│                                 │
│  Password reset successfully!   │
│  Redirecting to login...        │
│                                 │
└─────────────────────────────────┘
```

User can now login with new password!

---

## 📧 Email Example

**Subject:** Password Reset OTP - Voucher App

```
┌────────────────────────────────────────┐
│                                        │
│  Password Reset Request                │
│                                        │
│  Hello Koushik,                        │
│                                        │
│  You requested to reset your password. │
│  Use the OTP below to proceed:         │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │                                  │ │
│  │          1 2 3 4 5 6             │ │
│  │                                  │ │
│  └──────────────────────────────────┘ │
│                                        │
│  This OTP is valid for 10 minutes.     │
│                                        │
│  If you didn't request this, please    │
│  ignore this email.                    │
│                                        │
│  ────────────────────────────────────  │
│  Voucher App - Expense & Advance       │
│  Tracker                               │
└────────────────────────────────────────┘
```

---

## ⚙️ Setup (For Admin)

### 1. Update Default User Email
In `backend/Code_Enhanced.gs`, line 70:

```javascript
// BEFORE (won't work for password reset):
usersSheet.appendRow(['koushik', simpleHash('Koushik@8861'), 'Koushik', 'koushik@example.com']);

// AFTER (use your real email):
usersSheet.appendRow(['koushik', simpleHash('Koushik@8861'), 'Koushik', 'your.real.email@gmail.com']);
```

### 2. Deploy Backend
1. Open Google Apps Script
2. Replace Code.gs with Code_Enhanced.gs
3. Deploy as web app
4. Copy deployment URL

### 3. Test
1. Go to your app
2. Click "Forgot Password?"
3. Enter your email
4. Check inbox (and spam!)
5. Enter OTP
6. Set new password
7. Login!

---

## 🔒 Security Features

| Feature | Description |
|---------|-------------|
| **Email Verification** | Only registered emails can reset |
| **Time Limit** | OTP expires after 10 minutes |
| **One-Time Use** | Each OTP can only be used once |
| **Password Hashing** | Passwords stored securely |
| **Audit Trail** | All OTPs logged in OTP_Store sheet |

---

## 🐛 Troubleshooting

### Email Not Received?

**Check:**
- ✅ Email in spam/junk folder
- ✅ Email address in Users sheet (column 4)
- ✅ Correct email entered
- ✅ Apps Script execution logs

**Solution:**
- Wait a few minutes
- Check spam folder
- Verify email in Google Sheets
- Try again

---

### OTP Invalid?

**Possible Reasons:**
- ⏰ OTP expired (>10 minutes old)
- 🔄 OTP already used
- ❌ Wrong OTP entered
- 📧 Wrong email address

**Solution:**
- Request new OTP
- Complete process within 10 minutes
- Double-check OTP from email
- Verify email address

---

### Password Reset Failed?

**Check:**
- ✅ OTP still valid
- ✅ Passwords match
- ✅ Password at least 6 characters
- ✅ Network connection

**Solution:**
- Request new OTP if expired
- Ensure passwords match
- Check browser console for errors

---

## 📊 Admin Monitoring

### View OTP Activity
1. Open Google Spreadsheet
2. Go to "OTP_Store" sheet
3. See all OTP requests:

```
Email              | OTP    | Timestamp           | Used
user@example.com   | 123456 | 2026-02-08 12:00:00 | false
user@example.com   | 789012 | 2026-02-08 12:15:00 | true
```

### Cleanup Old OTPs
Periodically delete rows older than 24 hours to keep sheet clean.

---

## 🎨 UI Features

### Progress Indicator
```
Step 1: ━━━━━━━━  ○  ○
Step 2:   ✓    ━━━━━━━━  ○
Step 3:   ✓      ✓    ━━━━━━━━
```

### Animations
- ✨ Smooth transitions between steps
- ✨ Success/error message animations
- ✨ Auto-advance on success
- ✨ Loading indicators

### Validation
- ✅ Real-time email validation
- ✅ OTP format validation (6 digits)
- ✅ Password match validation
- ✅ Minimum password length

---

## 💡 Tips

1. **Complete Quickly**: OTP expires in 10 minutes
2. **Check Spam**: First OTP might go to spam
3. **Copy OTP**: Copy-paste OTP from email
4. **Strong Password**: Use a strong, unique password
5. **Save Password**: Use a password manager

---

## 📞 Need Help?

- **Full Documentation**: See `FORGOT_PASSWORD_GUIDE.md`
- **Deployment Guide**: See `DEPLOYMENT_CHECKLIST.md`
- **All Features**: See `NEW_FEATURES.md`
- **Technical Details**: See `IMPLEMENTATION_SUMMARY.md`

---

## ✨ That's It!

Your users can now securely reset their passwords using email OTP verification!

**Default Credentials:**
- Username: `koushik`
- Password: `Koushik@8861`
- Email: Update in backend!

**Remember:** Update the email in backend before deploying! 🚀
