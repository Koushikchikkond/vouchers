// Google Apps Script Code with CORS Support
// Follow the setup instructions in backend/README.md

const SPREADSHEET_ID = '1m5E55_48R-NoOEWVE94hUODBM1S4PTklE85HDKosUQg'; 
const DRIVE_FOLDER_ID = '1HGinfvb_LU2mdwIVr2k9_NEUXgcryDP2';

// IMPORTANT: After deploying to Vercel, replace 'YOUR_VERCEL_URL' with your actual Vercel URL
// Example: 'https://vouchers-xxx.vercel.app'
const ALLOWED_ORIGINS = [
  'http://localhost:5173',  // Local development
  'YOUR_VERCEL_URL'         // Replace with your Vercel URL after deployment
];

function doGet(e) {
  const action = e.parameter.action;
  
  if (action === 'getNodes') {
    return getNodes();
  } else if (action === 'getHistory') {
    return getHistory(e.parameter.node, e.parameter.startDate, e.parameter.endDate);
  }
  
  return response({status: 'error', message: 'Invalid action'});
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    if (action === 'saveTransaction') {
      return saveTransaction(data);
    }
    
    return response({status: 'error', message: 'Invalid action'});
    
  } catch (error) {
    return response({status: 'error', message: error.toString()});
  }
}

// Handle CORS preflight requests
function doOptions(e) {
  return response({});
}

function response(data) {
  const output = ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
  
  // Add CORS headers
  output.setHeader('Access-Control-Allow-Origin', '*');
  output.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  output.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  output.setHeader('Access-Control-Max-Age', '3600');
  
  return output;
}

function getNodes() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Transactions');
  if (!sheet) return response({nodes: []});
  
  const data = sheet.getDataRange().getValues();
  // Assume Node is column B (index 1). Row 0 is header.
  if (data.length <= 1) return response({nodes: []});
  
  const nodes = new Set();
  for (let i = 1; i < data.length; i++) {
    if (data[i][1]) nodes.add(data[i][1]); // Column 2 is Node
  }
  
  return response({nodes: Array.from(nodes)});
}

function saveTransaction(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName('Transactions');
  if (!sheet) {
    sheet = ss.insertSheet('Transactions');
    sheet.appendRow(['Timestamp', 'Node', 'Type', 'Amount', 'Date', 'Reason', 'Category', 'Image URL']);
  }
  
  let imageUrl = '';
  if (data.image) {
    const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    // data.image is expected to be just the base64 string without data:image/png;base64, prefix if possible, or we strip it.
    // For simplicity, let's assume the frontend sends pure base64 or we handle it in GS? 
    // Usually frontend sends data URL. Let's strip it here just in case.
    let base64Data = data.image;
    if (base64Data.includes('base64,')) {
        base64Data = base64Data.split('base64,')[1];
    }
    
    const blob = Utilities.newBlob(Utilities.base64Decode(base64Data), data.mimeType || 'image/jpeg', 'receipt_' + Date.now());
    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    imageUrl = file.getUrl();
  }
  
  sheet.appendRow([
    new Date(),
    data.node,
    data.type,
    data.amount,
    data.date,
    data.reason,
    data.category,
    imageUrl
  ]);
  
  return response({status: 'success'});
}

function getHistory(node, startDate, endDate) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Transactions');
  if (!sheet) return response({transactions: []});
  
  const data = sheet.getDataRange().getValues();
  const transactions = [];
  const start = new Date(startDate);
  start.setHours(0,0,0,0); // normalize
  const end = new Date(endDate);
  end.setHours(23,59,59,999); // normalize
  
  // Skip header
  for (let i = 1; i < data.length; i++) {
    const rowNode = data[i][1];
    const rowDateStr = data[i][4]; 
    const rowDate = new Date(rowDateStr);
    
    if (rowNode === node && rowDate >= start && rowDate <= end) {
      transactions.push({
        timestamp: data[i][0],
        node: rowNode,
        type: data[i][2],
        amount: data[i][3],
        date: rowDateStr,
        reason: data[i][5],
        category: data[i][6],
        imageUrl: data[i][7]
      });
    }
  }
  
  return response({transactions: transactions});
}
