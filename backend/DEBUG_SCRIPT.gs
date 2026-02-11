// DEBUG SCRIPT - Run this in Google Apps Script to check your Users sheet
// This will help us see what's wrong

function debugUsersSheet() {
  const SPREADSHEET_ID = '1m5E55_48R-NoOEWVE94hUODBM1S4PTklE85HDKosUQg';
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const usersSheet = ss.getSheetByName('Users');
  
  if (!usersSheet) {
    Logger.log('❌ ERROR: Users sheet does NOT exist!');
    return;
  }
  
  Logger.log('✅ Users sheet exists');
  
  const data = usersSheet.getDataRange().getValues();
  
  Logger.log('\n📊 Sheet Structure:');
  Logger.log('Number of columns: ' + data[0].length);
  Logger.log('Number of rows: ' + data.length);
  
  Logger.log('\n📋 Headers (Row 1):');
  for (let i = 0; i < data[0].length; i++) {
    Logger.log('Column ' + String.fromCharCode(65 + i) + ': ' + data[0][i]);
  }
  
  Logger.log('\n👤 User Data (Row 2):');
  if (data.length > 1) {
    Logger.log('Username: ' + data[1][0]);
    Logger.log('Password Hash: ' + data[1][1]);
    Logger.log('Name: ' + data[1][2]);
    Logger.log('Email: ' + (data[1][3] || '❌ MISSING!'));
  } else {
    Logger.log('❌ No user data found!');
  }
  
  Logger.log('\n🔐 Testing Password Hash:');
  const testPassword = 'Koushik@8861';
  const expectedHash = simpleHash(testPassword);
  Logger.log('Password to test: ' + testPassword);
  Logger.log('Expected hash: ' + expectedHash);
  Logger.log('Actual hash in sheet: ' + data[1][1]);
  Logger.log('Match: ' + (data[1][1] === expectedHash ? '✅ YES' : '❌ NO'));
  
  Logger.log('\n🧪 Testing Login:');
  const username = 'koushik';
  const password = 'Koushik@8861';
  const result = testLogin(username, password);
  Logger.log('Login test result: ' + JSON.stringify(result));
}

function testLogin(username, password) {
  const SPREADSHEET_ID = '1m5E55_48R-NoOEWVE94hUODBM1S4PTklE85HDKosUQg';
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const usersSheet = ss.getSheetByName('Users');
  
  if (!usersSheet) {
    return {status: 'error', message: 'Users sheet not found'};
  }
  
  const data = usersSheet.getDataRange().getValues();
  const hashedPassword = simpleHash(password);
  
  Logger.log('Looking for username: ' + username);
  Logger.log('With hashed password: ' + hashedPassword);
  
  for (let i = 1; i < data.length; i++) {
    Logger.log('\nChecking row ' + (i + 1) + ':');
    Logger.log('  Username in sheet: "' + data[i][0] + '"');
    Logger.log('  Password in sheet: "' + data[i][1] + '"');
    Logger.log('  Username match: ' + (data[i][0] === username));
    Logger.log('  Password match: ' + (data[i][1] === hashedPassword));
    
    if (data[i][0] === username && data[i][1] === hashedPassword) {
      return {
        status: 'success',
        user: {
          username: data[i][0],
          name: data[i][2] || username
        }
      };
    }
  }
  
  return {status: 'error', message: 'Invalid credentials'};
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

// Run this to get the correct hash
function getCorrectHash() {
  const hash = simpleHash('Koushik@8861');
  Logger.log('Correct hash for "Koushik@8861": ' + hash);
  return hash;
}

// Run this to fix the Users sheet
function fixUsersSheet() {
  const SPREADSHEET_ID = '1m5E55_48R-NoOEWVE94hUODBM1S4PTklE85HDKosUQg';
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let usersSheet = ss.getSheetByName('Users');
  
  if (!usersSheet) {
    Logger.log('Creating Users sheet...');
    usersSheet = ss.insertSheet('Users');
    usersSheet.appendRow(['Username', 'Password', 'Name', 'Email']);
    usersSheet.appendRow(['koushik', simpleHash('Koushik@8861'), 'Koushik', 'koushikchikkond@gmail.com']);
    Logger.log('✅ Users sheet created with correct structure!');
    return;
  }
  
  const data = usersSheet.getDataRange().getValues();
  
  // Check if Email column exists
  if (data[0].length < 4) {
    Logger.log('Adding Email column...');
    usersSheet.getRange(1, 4).setValue('Email');
    usersSheet.getRange(2, 4).setValue('koushikchikkond@gmail.com');
    Logger.log('✅ Email column added!');
  }
  
  // Fix password if needed
  const correctHash = simpleHash('Koushik@8861');
  if (data[1][1] !== correctHash) {
    Logger.log('Fixing password hash...');
    usersSheet.getRange(2, 2).setValue(correctHash);
    Logger.log('✅ Password hash fixed!');
  }
  
  Logger.log('\n✅ Users sheet is now correct!');
  Logger.log('Try logging in with:');
  Logger.log('Username: koushik');
  Logger.log('Password: Koushik@8861');
}
