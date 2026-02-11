# 🔐 Forgot Password Feature - Documentation

## Overview
The application now includes a complete "Forgot Password" feature with email OTP verification for secure password resets.

## How It Works

### User Flow
1. **Request Reset**: User clicks "Forgot Password?" on login screen
2. **Enter Email**: User enters their registered email address
3. **Receive OTP**: System sends a 6-digit OTP to the email (valid for 10 minutes)
4. **Verify OTP**: User enters the OTP received
5. **Set New Password**: User creates a new password
6. **Success**: User is redirected to login with new credentials

### Security Features
- ✅ **OTP Expiry**: OTPs expire after 10 minutes
- ✅ **One-Time Use**: Each OTP can only be used once
- ✅ **Email Verification**: Only registered email addresses can request resets
- ✅ **Password Hashing**: New passwords are hashed before storage
- ✅ **Secure Storage**: OTPs stored separately with timestamps

## Technical Implementation

### Backend (Google Apps Script)

#### New Endpoints

1. **Request Password Reset** (GET)
   ```
   GET ?action=requestPasswordReset&email=user@example.com
   ```
   - Validates email exists in Users sheet
   - Generates 6-digit OTP
   - Stores OTP in OTP_Store sheet
   - Sends email with OTP
   - Returns success/error status

2. **Verify OTP** (POST)
   ```json
   {
     "action": "verifyOTP",
     "email": "user@example.com",
     "otp": "123456"
   }
   ```
   - Checks if OTP matches and is not expired
   - Returns verification status

3. **Reset Password** (POST)
   ```json
   {
     "action": "resetPassword",
     "email": "user@example.com",
     "otp": "123456",
     "newPassword": "NewPassword123"
   }
   ```
   - Verifies OTP again
   - Updates password in Users sheet
   - Marks OTP as used
   - Returns success status

#### New Google Sheets

**OTP_Store Sheet**:
```
Email | OTP | Timestamp | Used
user@example.com | 123456 | 2026-02-08 12:00:00 | false
```

**Updated Users Sheet**:
```
Username | Password | Name | Email
koushik | [hashed] | Koushik | koushik@example.com
```

### Frontend

#### New Component: ForgotPasswordScreen
- **Location**: `src/components/ForgotPasswordScreen.jsx`
- **Features**:
  - 3-step wizard (Email → OTP → New Password)
  - Progress indicator
  - Real-time validation
  - Error/success messages
  - Auto-advance on success

#### Updated Components

**LoginScreen.jsx**:
- Added "Forgot Password?" link
- Removed default credentials display
- Passes `onForgotPassword` callback

**App.jsx**:
- Added `showForgotPassword` state
- Routes to ForgotPasswordScreen when needed
- Handles back navigation

**api.js**:
- Added `requestPasswordReset(email)`
- Added `verifyOTP(email, otp)`
- Added `resetPassword(email, otp, newPassword)`

## Email Template

The OTP email sent to users includes:
- Professional HTML formatting
- Large, easy-to-read OTP display
- Validity information (10 minutes)
- Security notice
- Branding

Example:
```
Subject: Password Reset OTP - Voucher App

Hello Koushik,

You requested to reset your password. Use the OTP below to proceed:

    123456

This OTP is valid for 10 minutes.

If you didn't request this, please ignore this email.
```

## Configuration

### Email Settings
The system uses Google Apps Script's `MailApp` service, which:
- Sends from the Google account running the script
- Requires no additional configuration
- Has daily sending limits (check Google Workspace limits)

### OTP Settings
You can customize these in `Code_Enhanced.gs`:

```javascript
// OTP length (default: 6 digits)
const otp = Math.floor(100000 + Math.random() * 900000).toString();

// OTP validity (default: 10 minutes)
const tenMinutes = 10 * 60 * 1000;
```

## User Management

### Default User
- **Username**: `koushik`
- **Password**: `Koushik@8861`
- **Email**: `koushik@example.com` ⚠️ **Update this to your real email!**

### Adding Users
1. Open Google Spreadsheet
2. Go to "Users" sheet
3. Add row with:
   - Username: desired username
   - Password: run `simpleHash("password")` in Apps Script
   - Name: display name
   - Email: **valid email address** (required for password reset)

### Important: Update Default Email
**Before deploying**, update the default user's email in `Code_Enhanced.gs`:

```javascript
// Line 70
usersSheet.appendRow(['koushik', simpleHash('Koushik@8861'), 'Koushik', 'your.real.email@gmail.com']);
```

## Testing

### Local Testing
1. Start dev server: `npm run dev`
2. Click "Forgot Password?" on login
3. Enter email address
4. Check email for OTP
5. Enter OTP
6. Set new password
7. Login with new password

### Production Testing
1. Deploy backend to Google Apps Script
2. Deploy frontend to Vercel
3. Test complete flow
4. Verify email delivery
5. Check OTP expiry (wait 10+ minutes)
6. Test invalid OTP handling

## Troubleshooting

### Email Not Received
**Possible Causes**:
- Email address not in Users sheet
- Typo in email address
- Email in spam folder
- Google Apps Script email quota exceeded

**Solutions**:
- Verify email in Users sheet (column 4)
- Check spam/junk folder
- Check Apps Script execution logs
- Wait 24 hours if quota exceeded

### OTP Invalid
**Possible Causes**:
- OTP expired (>10 minutes old)
- OTP already used
- Typo in OTP
- Wrong email address

**Solutions**:
- Request new OTP
- Double-check OTP from email
- Verify email address matches

### Password Reset Fails
**Possible Causes**:
- OTP expired during password entry
- Network error
- Backend not deployed

**Solutions**:
- Request new OTP and complete quickly
- Check browser console for errors
- Verify backend deployment

## Security Considerations

### Current Implementation
- ✅ OTP-based verification
- ✅ Time-limited OTPs (10 minutes)
- ✅ One-time use OTPs
- ✅ Password hashing
- ✅ Email validation

### Recommendations for Production
1. **Stronger Hashing**: Implement bcrypt or similar
2. **Rate Limiting**: Limit OTP requests per email/IP
3. **HTTPS Only**: Enforce HTTPS in production
4. **Email Verification**: Verify email ownership on signup
5. **Password Strength**: Enforce strong password requirements
6. **Audit Logging**: Log all password reset attempts
7. **2FA**: Consider adding two-factor authentication

### Privacy
- OTPs are stored temporarily in Google Sheets
- Old OTPs should be periodically cleaned up
- Consider implementing automatic cleanup script

## Monitoring

### Check OTP Usage
1. Open Google Spreadsheet
2. Go to "OTP_Store" sheet
3. Review recent OTP requests
4. Check for suspicious patterns

### Email Delivery
- Monitor Apps Script execution logs
- Check for email sending errors
- Verify email quota usage

## Customization

### Change OTP Length
```javascript
// In Code_Enhanced.gs
// For 4-digit OTP:
const otp = Math.floor(1000 + Math.random() * 9000).toString();

// For 8-digit OTP:
const otp = Math.floor(10000000 + Math.random() * 90000000).toString();
```

### Change OTP Validity
```javascript
// In Code_Enhanced.gs
// For 5 minutes:
const fiveMinutes = 5 * 60 * 1000;

// For 30 minutes:
const thirtyMinutes = 30 * 60 * 1000;
```

### Customize Email Template
Edit the `htmlBody` in `requestPasswordReset` function in `Code_Enhanced.gs`.

## API Reference

### Frontend API Methods

```javascript
// Request password reset
await api.requestPasswordReset('user@example.com');
// Returns: { status: 'success', message: 'OTP sent...', email: '...' }

// Verify OTP
await api.verifyOTP('user@example.com', '123456');
// Returns: { status: 'success', message: 'OTP verified...' }

// Reset password
await api.resetPassword('user@example.com', '123456', 'NewPass123');
// Returns: { status: 'success', message: 'Password reset...' }
```

## Maintenance

### Cleanup Old OTPs
Periodically clean up old OTPs from OTP_Store sheet:
1. Open Google Spreadsheet
2. Go to "OTP_Store" sheet
3. Delete rows older than 24 hours

Or create an Apps Script trigger to auto-cleanup:
```javascript
function cleanupOldOTPs() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const otpSheet = ss.getSheetByName('OTP_Store');
  const data = otpSheet.getDataRange().getValues();
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  
  for (let i = data.length - 1; i >= 1; i--) {
    if (new Date(data[i][2]) < oneDayAgo) {
      otpSheet.deleteRow(i + 1);
    }
  }
}
```

---

**Need Help?** Check the main documentation in `NEW_FEATURES.md` or deployment guide in `DEPLOYMENT_CHECKLIST.md`.
