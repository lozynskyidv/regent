/**
 * Generate Apple JWT Token for Supabase
 * 
 * This script generates a JWT token that Supabase needs for Apple OAuth configuration.
 * 
 * Usage:
 * 1. Place your .p8 key file in this directory
 * 2. Update the variables below with your Apple Developer details
 * 3. Run: node generate-apple-jwt.js
 * 4. Copy the output JWT token and paste it into Supabase
 */

const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// ============================================
// UPDATE THESE VALUES WITH YOUR INFORMATION
// ============================================

const TEAM_ID = 'GG45LXKPLR';                  // Your Apple Team ID (top right in Apple Developer Console)
const SERVICES_ID = 'com.dmy.networth.auth';   // Your Services ID (already set correctly)
const KEY_ID = 'ZRLCPBBJ4T';                   // Key ID from the Sign in with Apple key you created
const P8_FILE_NAME = 'AuthKey_ZRLCPBBJ4T.p8';  // Name of your .p8 file (e.g., AuthKey_ABC123DEF.p8)

// ============================================
// SCRIPT (DON'T MODIFY BELOW)
// ============================================

console.log('🍎 Generating Apple JWT Token for Supabase...\n');

// Validation
if (TEAM_ID === 'YOUR_TEAM_ID_HERE' || KEY_ID === 'YOUR_KEY_ID_HERE' || P8_FILE_NAME === 'AuthKey_XXXXX.p8') {
  console.error('❌ ERROR: Please update the variables at the top of this script first!\n');
  console.log('You need to set:');
  console.log('- TEAM_ID (from Apple Developer Console)');
  console.log('- KEY_ID (from the Sign in with Apple key)');
  console.log('- P8_FILE_NAME (name of your .p8 file)\n');
  process.exit(1);
}

// Check if .p8 file exists
const privateKeyPath = path.join(__dirname, P8_FILE_NAME);
if (!fs.existsSync(privateKeyPath)) {
  console.error(`❌ ERROR: Cannot find file: ${P8_FILE_NAME}`);
  console.log('Make sure your .p8 file is in the same directory as this script.\n');
  process.exit(1);
}

try {
  // Read the private key
  const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

  // Generate JWT token
  const token = jwt.sign(
    {
      iss: TEAM_ID,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 15777000, // Valid for ~6 months
      aud: 'https://appleid.apple.com',
      sub: SERVICES_ID,
    },
    privateKey,
    {
      algorithm: 'ES256',
      header: {
        alg: 'ES256',
        kid: KEY_ID,
      },
    }
  );

  console.log('✅ SUCCESS! Your JWT token:\n');
  console.log('─'.repeat(80));
  console.log(token);
  console.log('─'.repeat(80));
  console.log('\n📋 Next Steps:');
  console.log('1. Copy the token above (the long string)');
  console.log('2. Go to Supabase Dashboard → Authentication → Providers → Apple');
  console.log('3. Paste this token in the "Secret Key (JWT)" field');
  console.log('4. Fill in the other fields:');
  console.log(`   - Client ID: ${SERVICES_ID}`);
  console.log(`   - Team ID: ${TEAM_ID}`);
  console.log(`   - Key ID: ${KEY_ID}`);
  console.log('5. Click Save\n');
  console.log('🎉 Apple OAuth will be ready to use!\n');

} catch (error) {
  console.error('❌ ERROR generating JWT:', error.message);
  console.log('\nMake sure you have installed jsonwebtoken:');
  console.log('npm install jsonwebtoken\n');
  process.exit(1);
}
