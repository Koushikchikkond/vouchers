# How to Connect Your Google Sheet & Drive

Your application is already programmed to:
1.  **Automatically create** the "Transactions" sheet if it doesn't exist.
2.  **Automatically add headers**: `Timestamp`, `Node`, `Type`, `Amount`, `Date`, `Reason`, `Category`, `Image URL`.
3.  **Upload images** to Google Drive and save the link in the sheet.

### Step 1: Get Your IDs
1.  **Spreadsheet ID**: Open your Google Sheet. Copy the long text between `/d/` and `/edit` in the URL.
    *   Example: `https://docs.google.com/spreadsheets/d/`**`1aBcD...xyz`**`/edit`
2.  **Folder ID**: Open your Google Drive folder for receipts. Copy the text after `folders/` in the URL.
    *   Example: `https://drive.google.com/drive/folders/`**`123...456`**

### Step 2: Update the Backend Code
1.  Open your Google Sheet.
2.  Go to **Extensions > Apps Script**.
3.  Open `Code.gs`.
4.  Replace the placeholders at the top:
    ```javascript
    const SPREADSHEET_ID = 'PASTE_YOUR_SPREADSHEET_ID_HERE'; 
    const DRIVE_FOLDER_ID = 'PASTE_YOUR_DRIVE_FOLDER_ID_HERE';
    ```

### Step 3: Deploy
1.  Click **Deploy** > **New deployment**.
2.  Select **Web app**.
3.  Description: "V2 with IDs".
4.  **Execute as**: `Me`.
5.  **Who has access**: `Anyone`.
6.  Click **Deploy**.

### Step 4: Connect Frontend
1.  Copy the **Web App URL** from the deployment.
2.  Open `.env` in your project folder (`d:/personal project/vouchers/.env`).
3.  Paste it:
    ```
    VITE_API_URL=https://script.google.com/macros/s/YOUR_NEW_URL/exec
    ```
4.  Restart your app: `npm run dev`.
