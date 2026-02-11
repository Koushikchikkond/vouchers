# Implementation Plan: Enhanced Voucher Application

## Overview
Adding authentication, enhanced export functionality, and node management features to the voucher application.

## Features to Implement

### 1. Authentication System
- **Login Page**: Add a login screen with username/password
- **User-specific Data**: Filter vouchers by logged-in user
- **Session Management**: Keep user logged in during session
- **Protected Routes**: Show login page before accessing app

### 2. Enhanced Export Functionality
- **Per-Node Export**: Export transactions for a specific node with date range
- **Export Format**: CSV with columns: SL No, Date, Reason, Amount, Type, Category (NO images)
- **Export All Nodes**: Add option to export all nodes at once from node management page
- **Better CSV Structure**: Clean table format without image URLs

### 3. Node Management Features
- **Edit Node**: Rename existing nodes
- **Delete Node**: Remove nodes (with confirmation)
- **Node Details View**: 
  - Click on node to see detailed view
  - Show Total IN and Total OUT at top
  - List all transactions with full details
  - Edit/Delete individual transactions
  - Export option for that specific node

### 4. Transaction Management
- **Edit Transaction**: Modify existing transaction details
- **Delete Transaction**: Remove transactions (with confirmation)
- **Transaction ID**: Add unique ID to each transaction for editing/deleting

## Implementation Steps

### Phase 1: Backend Updates (Google Apps Script)
1. Add user authentication endpoint
2. Add user field to transactions
3. Add transaction ID (row number or unique ID)
4. Add endpoints for:
   - Edit transaction
   - Delete transaction
   - Edit node name
   - Delete node
   - Get node summary (total IN/OUT)
   - Export all nodes

### Phase 2: Frontend - Authentication
1. Create Login component
2. Add authentication context/state management
3. Store user session (localStorage)
4. Update API calls to include user info
5. Add logout functionality

### Phase 3: Frontend - Node Management
1. Create NodeDetailsView component showing:
   - Total IN/OUT summary
   - List of all transactions
   - Edit/Delete buttons for each transaction
2. Add Edit/Delete buttons to node list
3. Add confirmation dialogs

### Phase 4: Frontend - Enhanced Export
1. Update export to exclude images
2. Add SL No column
3. Create "Export All Nodes" button
4. Improve CSV formatting

### Phase 5: Testing & Deployment
1. Test all features locally
2. Update backend on Google Apps Script
3. Deploy frontend to Vercel
4. Test production environment

## File Changes Required

### Backend (Google Apps Script)
- `backend/Code.gs` - Major updates for all new endpoints

### Frontend
- `src/App.jsx` - Add authentication wrapper
- `src/components/LoginScreen.jsx` - NEW
- `src/components/LandingScreen.jsx` - Add node edit/delete, export all
- `src/components/TransactionScreen.jsx` - Update export functionality
- `src/components/NodeDetailsView.jsx` - NEW (detailed node view)
- `src/api.js` - Add new API methods
- `src/context/AuthContext.jsx` - NEW (authentication state)

## Data Structure Changes

### Google Sheets - Transactions Sheet
Current: `Timestamp | Node | Type | Amount | Date | Reason | Category | Image URL`
New: `ID | Timestamp | User | Node | Type | Amount | Date | Reason | Category | Image URL`

### New Sheet: Users
`Username | Password (hashed) | Name`

## Security Considerations
- Store passwords hashed (simple hash for now)
- Validate user on each request
- Filter data by user on backend
- Session timeout after inactivity

## Next Steps
1. Start with backend authentication
2. Then add frontend login
3. Add node management features
4. Finally enhance export functionality
