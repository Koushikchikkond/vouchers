// Temporary function to get hashed password
// Run this once in Apps Script, copy the result, then delete this function

function getHashedPassword() {
  const password = 'Koushik@8861';
  const hashed = simpleHash(password);
  Logger.log('Hashed password for Koushik@8861: ' + hashed);
  return hashed;
}

// Simple hash function (copy from your main code)
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString();
}
