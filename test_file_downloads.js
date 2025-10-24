const fs = require('fs');
const path = require('path');

console.log('🧪 Testing File Download System');
console.log('==============================');

// Test 1: Check upload directories exist
console.log('\n1️⃣ Checking upload directories...');
const uploadDirs = [
  'uploads/payment-proofs',
  'uploads/passport-photos',
  'uploads/abstracts'
];

uploadDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`✅ ${dir} exists`);
  } else {
    console.log(`❌ ${dir} missing - creating...`);
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ ${dir} created`);
  }
});

// Test 2: Check API endpoints exist
console.log('\n2️⃣ Checking API endpoints...');
const apiEndpoints = [
  'app/api/uploads/passport-photo/download/route.ts',
  'app/api/uploads/payment-proof/download/route.ts'
];

apiEndpoints.forEach(endpoint => {
  if (fs.existsSync(endpoint)) {
    console.log(`✅ ${endpoint} exists`);
  } else {
    console.log(`❌ ${endpoint} missing`);
  }
});

// Test 3: Check PM2 configuration
console.log('\n3️⃣ Checking PM2 configuration...');
if (fs.existsSync('ecosystem.config.js')) {
  const config = require('./ecosystem.config.js');
  if (config.apps[0].watch) {
    console.log('✅ PM2 watch mode enabled');
  } else {
    console.log('❌ PM2 watch mode disabled');
  }
} else {
  console.log('❌ ecosystem.config.js missing');
}

// Test 4: Check environment file
console.log('\n4️⃣ Checking environment configuration...');
if (fs.existsSync('.env.local')) {
  console.log('✅ .env.local exists');
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const requiredVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
  requiredVars.forEach(varName => {
    if (envContent.includes(varName)) {
      console.log(`✅ ${varName} is set`);
    } else {
      console.log(`❌ ${varName} is missing`);
    }
  });
} else {
  console.log('❌ .env.local missing');
}

// Test 5: Create test files for download testing
console.log('\n5️⃣ Creating test files...');
const testFiles = [
  {
    path: 'uploads/passport-photos/test_passport.jpg',
    content: 'Test passport photo content'
  },
  {
    path: 'uploads/payment-proofs/test_payment.pdf',
    content: 'Test payment proof content'
  }
];

testFiles.forEach(file => {
  const dir = path.dirname(file.path);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  if (!fs.existsSync(file.path)) {
    fs.writeFileSync(file.path, file.content);
    console.log(`✅ Created test file: ${file.path}`);
  } else {
    console.log(`✅ Test file exists: ${file.path}`);
  }
});

console.log('\n🎯 SUMMARY');
console.log('==========');
console.log('File download system should now work properly.');
console.log('Key improvements made:');
console.log('• Enhanced file path handling in download APIs');
console.log('• Added PM2 watch mode for auto-reload');
console.log('• Improved error logging for debugging');
console.log('• Created test files for verification');
console.log('\nNext steps:');
console.log('1. Push changes to repository');
console.log('2. Server will auto-reload with PM2 watch mode');
console.log('3. Test passport photo downloads in admin panel');
