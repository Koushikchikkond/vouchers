// Enhanced Google Apps Script Code with Authentication and Management Features
// COMPLETE VERSION - Ready to Deploy

const SPREADSHEET_ID = '1m5E55_48R-NoOEWVE94hUODBM1S4PTklE85HDKosUQg'; 
const DRIVE_FOLDER_ID = '1HGinfvb_LU2mdwIVr2k9_NEUXgcryDP2';

// ============================================
// MAIN HANDLERS
// ============================================

function doGet(e) {
  const action = e.parameter.action;
  
  if (action === 'login') {
    return handleLogin(e.parameter.username, e.parameter.password);
  } else if (action === 'requestPasswordReset') {
    return requestPasswordReset(e.parameter.email);
  } else if (action === 'getNodes') {
    return getNodes(e.parameter.user);
  } else if (action === 'getHistory') {
    return getHistory(e.parameter.user, e.parameter.node, e.parameter.startDate, e.parameter.endDate);
  } else if (action === 'getNodeSummary') {
    return getNodeSummary(e.parameter.user, e.parameter.node);
  } else if (action === 'getAllNodesExport') {
    return getAllNodesExport(e.parameter.user);
  }
  
  return response({status: 'error', message: 'Invalid action'});
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    if (action === 'saveTransaction') {
      return saveTransaction(data);
    } else if (action === 'updateTransaction') {
      return updateTransaction(data);
    } else if (action === 'deleteTransaction') {
      return deleteTransaction(data);
    } else if (action === 'updateNode') {
      return updateNode(data);
    } else if (action === 'deleteNode') {
      return deleteNode(data);
    } else if (action === 'verifyOTP') {
      return verifyOTP(data.email, data.otp);
    } else if (action === 'resetPassword') {
      return resetPassword(data.email, data.otp, data.newPassword);
    }
    
    return response({status: 'error', message: 'Invalid action'});
    
  } catch (error) {
    return response({status: 'error', message: error.toString()});
  }
}

function response(data) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

// ============================================
// AUTHENTICATION FUNCTIONS
// ============================================

function handleLogin(username, password) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let usersSheet = ss.getSheetByName('Users');
  
  // Create Users sheet if it doesn't exist
  if (!usersSheet) {
    usersSheet = ss.insertSheet('Users');
    usersSheet.appendRow(['Username', 'Password', 'Name', 'Email']);
    usersSheet.appendRow(['koushik', simpleHash('Koushik@8861'), 'Koushik', 'koushikchikkond@gmail.com']);
  }
  
  const data = usersSheet.getDataRange().getValues();
  
  // Check if sheet has correct structure (4 columns)
  if (data.length > 0 && data[0].length < 4) {
    // Fix sheet structure - add Email column
    usersSheet.getRange(1, 4).setValue('Email');
    // Add default email for existing users
    for (let i = 1; i < data.length; i++) {
      if (!data[i][3]) {
        usersSheet.getRange(i + 1, 4).setValue('koushikchikkond@gmail.com');
      }
    }
    // Reload data
    const updatedData = usersSheet.getDataRange().getValues();
    return checkLogin(updatedData, username, password);
  }
  
  return checkLogin(data, username, password);
}

function checkLogin(data, username, password) {
  const hashedPassword = simpleHash(password);
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === username && data[i][1] === hashedPassword) {
      return response({
        status: 'success',
        user: {
          username: data[i][0],
          name: data[i][2] || username
        }
      });
    }
  }
  
  return response({status: 'error', message: 'Invalid credentials'});
}

// Simple hash function
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString();
}

// ============================================
// FORGOT PASSWORD FUNCTIONS
// ============================================

function requestPasswordReset(email) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const usersSheet = ss.getSheetByName('Users');
  
  if (!usersSheet) {
    return response({status: 'error', message: 'User system not initialized'});
  }
  
  const data = usersSheet.getDataRange().getValues();
  let userFound = false;
  let username = '';
  
  // Find user by email (column 4, index 3)
  for (let i = 1; i < data.length; i++) {
    if (data[i][3] === email) {
      userFound = true;
      username = data[i][0];
      break;
    }
  }
  
  if (!userFound) {
    return response({status: 'error', message: 'No account found with this email'});
  }
  
  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Store OTP
  let otpSheet = ss.getSheetByName('OTP_Store');
  if (!otpSheet) {
    otpSheet = ss.insertSheet('OTP_Store');
    otpSheet.appendRow(['Email', 'OTP', 'Timestamp', 'Used']);
  }
  
  otpSheet.appendRow([email, otp, new Date(), false]);
  
  // Send email
  try {
    MailApp.sendEmail({
      to: email,
      subject: 'Password Reset OTP - Voucher App',
      htmlBody: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>Hello <strong>${username}</strong>,</p>
          <p>You requested to reset your password. Use the OTP below to proceed:</p>
          <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <h1 style="color: #2563eb; margin: 0; font-size: 36px; letter-spacing: 8px;">${otp}</h1>
          </div>
          <p><strong>This OTP is valid for 10 minutes.</strong></p>
          <p>If you didn't request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">Voucher App - Expense & Advance Tracker</p>
        </div>
      `
    });
    
    return response({
      status: 'success',
      message: 'OTP sent to your email',
      email: email
    });
  } catch (error) {
    return response({status: 'error', message: 'Failed to send email: ' + error.toString()});
  }
}

function verifyOTP(email, otp) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const otpSheet = ss.getSheetByName('OTP_Store');
  
  if (!otpSheet) {
    return response({status: 'error', message: 'OTP system not initialized'});
  }
  
  const data = otpSheet.getDataRange().getValues();
  const now = new Date();
  const tenMinutes = 10 * 60 * 1000;
  
  for (let i = data.length - 1; i >= 1; i--) {
    if (data[i][0] === email && data[i][1] === otp && data[i][3] === false) {
      const otpTime = new Date(data[i][2]);
      const timeDiff = now - otpTime;
      
      if (timeDiff <= tenMinutes) {
        return response({
          status: 'success',
          message: 'OTP verified successfully'
        });
      } else {
        return response({status: 'error', message: 'OTP has expired. Please request a new one.'});
      }
    }
  }
  
  return response({status: 'error', message: 'Invalid OTP'});
}

function resetPassword(email, otp, newPassword) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const otpSheet = ss.getSheetByName('OTP_Store');
  const usersSheet = ss.getSheetByName('Users');
  
  if (!otpSheet || !usersSheet) {
    return response({status: 'error', message: 'System not initialized'});
  }
  
  // Verify OTP
  const otpData = otpSheet.getDataRange().getValues();
  const now = new Date();
  const tenMinutes = 10 * 60 * 1000;
  let otpValid = false;
  let otpRowIndex = -1;
  
  for (let i = otpData.length - 1; i >= 1; i--) {
    if (otpData[i][0] === email && otpData[i][1] === otp && otpData[i][3] === false) {
      const otpTime = new Date(otpData[i][2]);
      const timeDiff = now - otpTime;
      
      if (timeDiff <= tenMinutes) {
        otpValid = true;
        otpRowIndex = i + 1;
        break;
      }
    }
  }
  
  if (!otpValid) {
    return response({status: 'error', message: 'Invalid or expired OTP'});
  }
  
  // Update password
  const userData = usersSheet.getDataRange().getValues();
  let passwordUpdated = false;
  
  for (let i = 1; i < userData.length; i++) {
    if (userData[i][3] === email) {
      usersSheet.getRange(i + 1, 2).setValue(simpleHash(newPassword));
      passwordUpdated = true;
      break;
    }
  }
  
  if (passwordUpdated) {
    otpSheet.getRange(otpRowIndex, 4).setValue(true);
    return response({
      status: 'success',
      message: 'Password reset successfully'
    });
  }
  
  return response({status: 'error', message: 'Failed to update password'});
}

// ============================================
// NODE FUNCTIONS
// ============================================

function getNodes(user) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Transactions');
  if (!sheet) return response({nodes: []});
  
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return response({nodes: []});
  
  const nodes = new Set();
  for (let i = 1; i < data.length; i++) {
    if (data[i][2] === user && data[i][3]) {
      nodes.add(data[i][3]);
    }
  }
  
  return response({nodes: Array.from(nodes)});
}

function getNodeSummary(user, node) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Transactions');
  if (!sheet) return response({totalIn: 0, totalOut: 0, transactions: []});
  
  const data = sheet.getDataRange().getValues();
  let totalIn = 0;
  let totalOut = 0;
  const transactions = [];
  
  for (let i = 1; i < data.length; i++) {
    const rowUser = data[i][2];
    const rowNode = data[i][3];
    
    if (rowUser === user && rowNode === node) {
      const type = data[i][4];
      const amount = parseFloat(data[i][5]) || 0;
      
      if (type === 'IN') {
        totalIn += amount;
      } else if (type === 'OUT') {
        totalOut += amount;
      }
      
      transactions.push({
        id: i,
        timestamp: data[i][1],
        user: rowUser,
        node: rowNode,
        type: type,
        amount: amount,
        date: data[i][6],
        reason: data[i][7],
        category: data[i][8],
        imageUrl: data[i][9]
      });
    }
  }
  
  return response({
    totalIn: totalIn,
    totalOut: totalOut,
    balance: totalIn - totalOut,
    transactions: transactions
  });
}

function updateNode(data) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Transactions');
  if (!sheet) return response({status: 'error', message: 'Sheet not found'});
  
  const sheetData = sheet.getDataRange().getValues();
  let updated = 0;
  
  for (let i = 1; i < sheetData.length; i++) {
    if (sheetData[i][2] === data.user && sheetData[i][3] === data.oldNode) {
      sheet.getRange(i + 1, 4).setValue(data.newNode);
      updated++;
    }
  }
  
  return response({status: 'success', updated: updated});
}

function deleteNode(data) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Transactions');
  if (!sheet) return response({status: 'error', message: 'Sheet not found'});
  
  const sheetData = sheet.getDataRange().getValues();
  let rowsToDelete = [];
  
  // Collect row numbers to delete (from bottom to top)
  for (let i = sheetData.length - 1; i >= 1; i--) {
    if (sheetData[i][2] === data.user && sheetData[i][3] === data.node) {
      rowsToDelete.push(i + 1); // Store 1-indexed row number
    }
  }
  
  // Delete rows from bottom to top to avoid index shifting
  // rowsToDelete is already in reverse order (bottom to top)
  rowsToDelete.forEach(rowNum => {
    sheet.deleteRow(rowNum);
  });
  
  return response({status: 'success', deleted: rowsToDelete.length});
}

// ============================================
// TRANSACTION FUNCTIONS
// ============================================

function saveTransaction(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName('Transactions');
  
  if (!sheet) {
    sheet = ss.insertSheet('Transactions');
    sheet.appendRow(['ID', 'Timestamp', 'User', 'Node', 'Type', 'Amount', 'Date', 'Reason', 'Category', 'Image URL']);
  }
  
  let imageUrl = '';
  if (data.image) {
    const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    let base64Data = data.image;
    if (base64Data.includes('base64,')) {
      base64Data = base64Data.split('base64,')[1];
    }
    
    const blob = Utilities.newBlob(Utilities.base64Decode(base64Data), data.mimeType || 'image/jpeg', 'receipt_' + Date.now());
    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    imageUrl = file.getUrl();
  }
  
  const id = Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  
  sheet.appendRow([
    id,
    new Date(),
    data.user,
    data.node,
    data.type,
    data.amount,
    data.date,
    data.reason,
    data.category,
    imageUrl
  ]);
  
  return response({status: 'success', id: id});
}

function updateTransaction(data) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Transactions');
  if (!sheet) return response({status: 'error', message: 'Sheet not found'});
  
  const rowNum = data.rowId;
  
  sheet.getRange(rowNum, 5).setValue(data.type);
  sheet.getRange(rowNum, 6).setValue(data.amount);
  sheet.getRange(rowNum, 7).setValue(data.date);
  sheet.getRange(rowNum, 8).setValue(data.reason);
  sheet.getRange(rowNum, 9).setValue(data.category);
  
  return response({status: 'success'});
}

function deleteTransaction(data) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Transactions');
  if (!sheet) return response({status: 'error', message: 'Sheet not found'});
  
  sheet.deleteRow(data.rowId);
  
  return response({status: 'success'});
}

function getHistory(user, node, startDate, endDate) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Transactions');
  if (!sheet) return response({transactions: []});
  
  const data = sheet.getDataRange().getValues();
  const transactions = [];
  const start = new Date(startDate);
  start.setHours(0,0,0,0);
  const end = new Date(endDate);
  end.setHours(23,59,59,999);
  
  for (let i = 1; i < data.length; i++) {
    const rowUser = data[i][2];
    const rowNode = data[i][3];
    const rowDateStr = data[i][6];
    const rowDate = new Date(rowDateStr);
    
    if (rowUser === user && rowNode === node && rowDate >= start && rowDate <= end) {
      transactions.push({
        id: i,
        timestamp: data[i][1],
        user: rowUser,
        node: rowNode,
        type: data[i][4],
        amount: data[i][5],
        date: rowDateStr,
        reason: data[i][7],
        category: data[i][8]
      });
    }
  }
  
  return response({transactions: transactions});
}

function getAllNodesExport(user) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName('Transactions');
  if (!sheet) return response({transactions: []});
  
  const data = sheet.getDataRange().getValues();
  const transactions = [];
  
  for (let i = 1; i < data.length; i++) {
    const rowUser = data[i][2];
    
    if (rowUser === user) {
      transactions.push({
        id: i,
        timestamp: data[i][1],
        node: data[i][3],
        type: data[i][4],
        amount: data[i][5],
        date: data[i][6],
        reason: data[i][7],
        category: data[i][8]
      });
    }
  }
  
  return response({transactions: transactions});
}
