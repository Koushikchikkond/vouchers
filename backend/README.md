# Backend Setup

Since this application uses Google Apps Script (GAS) as a backend, you'll need to set it up manually.

1.  **Create a Google Sheet**:
    *   Go to [sheets.google.com](https://sheets.google.com) and create a new sheet.
    *   Note the **Spreadsheet ID** from the URL (e.g., `https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit`).

2.  **Create a Google Drive Folder**:
    *   Create a folder in Google Drive to store receipt images.
    *   Note the **Folder ID** from the URL (e.g., `https://drive.google.com/drive/folders/YOUR_FOLDER_ID`).

3.  **Create the Apps Script**:
    *   In your Google Sheet, go to `Extensions > Apps Script`.
    *   Delete any existing code in `Code.gs`.
    *   Copy the content of `backend/Code.gs` from this project and paste it there.
    *   **IMPORTANT**: Update `SPREADSHEET_ID` and `DRIVE_FOLDER_ID` at the top of the file with your actual IDs.

4.  **Deploy as Web App**:
    *   Click `Deploy > New deployment`.
    *   Select type: `Web app`.
    *   Description: "Vouchers API".
    *   **Execute as**: `Me` (your email).
    *   **Who has access**: `Anyone` (IMPORTANT: This allows the React app to access it without OAuth complexity).
    *   Click `Deploy`.
    *   Copy the **Web App URL** (e.g., `https://script.google.com/macros/s/.../exec`).

5.  **Connect Frontend**:
    *   Create a `.env` file in the root of the React project (`d:/personal project/vouchers/.env`).
    *   Add the following line:
        ```
        VITE_API_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
        ```
