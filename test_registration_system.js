#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Registration System - Live System Diagnostics');
console.log('=======================================================\n');

// Test 1: Check environment variables
console.log('1️⃣ Checking Environment Variables:');
console.log('-----------------------------------');

const requiredEnvVars = [
  'DB_HOST',
  'DB_USER', 
  'DB_PASSWORD',
  'DB_NAME',
  'NEXT_PUBLIC_SITE_URL',
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS'
];

const envFile = path.join(__dirname, '.env.local');
let envVars = {};

if (fs.existsSync(envFile)) {
  const envContent = fs.readFileSync(envFile, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      envVars[key.trim()] = value.trim();
    }
  });
}

requiredEnvVars.forEach(varName => {
  const value = envVars[varName] || process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 10)}...`);
  } else {
    console.log(`❌ ${varName}: NOT SET`);
  }
});

// Test 2: Check database connection
console.log('\n2️⃣ Testing Database Connection:');
console.log('--------------------------------');

async function testDatabase() {
  try {
    const mysql = require('mysql2/promise');
    
    const dbConfig = {
      host: process.env.DB_HOST || envVars.DB_HOST || 'localhost',
      user: process.env.DB_USER || envVars.DB_USER || 'conf',
      password: process.env.DB_PASSWORD || envVars.DB_PASSWORD || 'toor',
      database: process.env.DB_NAME || envVars.DB_NAME || 'conf',
      port: 3306,
    };

    console.log(`Connecting to: ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);
    
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Database connection successful');
    
    // Check if registrations table exists
    const [tables] = await connection.execute("SHOW TABLES LIKE 'registrations'");
    if (tables.length > 0) {
      console.log('✅ Registrations table exists');
      
      // Check table structure
      const [columns] = await connection.execute("DESCRIBE registrations");
      console.log('📋 Table structure:');
      columns.forEach(col => {
        console.log(`   - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? '(required)' : '(optional)'}`);
      });
      
      // Check for existing registrations
      const [count] = await connection.execute("SELECT COUNT(*) as count FROM registrations");
      console.log(`📊 Total registrations: ${count[0].count}`);
      
    } else {
      console.log('❌ Registrations table does not exist');
    }
    
    await connection.end();
    return true;
  } catch (error) {
    console.log('❌ Database connection failed:', error.message);
    return false;
  }
}

// Test 3: Check file uploads directory
console.log('\n3️⃣ Checking File Upload Directories:');
console.log('-------------------------------------');

const uploadDirs = [
  'uploads/payment-proofs',
  'uploads/passport-photos'
];

uploadDirs.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${dir}: exists`);
    const files = fs.readdirSync(fullPath);
    console.log(`   Files: ${files.length}`);
  } else {
    console.log(`❌ ${dir}: missing`);
    try {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`✅ ${dir}: created`);
    } catch (error) {
      console.log(`❌ ${dir}: failed to create - ${error.message}`);
    }
  }
});

// Test 4: Check API endpoint
console.log('\n4️⃣ Testing Registration API Endpoint:');
console.log('--------------------------------------');

async function testAPI() {
  try {
    const response = await fetch('http://localhost:3000/api/registrations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        test: true
      })
    });
    
    if (response.status === 400) {
      console.log('✅ API endpoint is responding (400 expected for test data)');
    } else {
      console.log(`⚠️  API responded with status: ${response.status}`);
    }
  } catch (error) {
    console.log('❌ API endpoint test failed:', error.message);
    console.log('   Make sure the development server is running (npm run dev)');
  }
}

// Test 5: Check email service
console.log('\n5️⃣ Testing Email Service:');
console.log('-------------------------');

async function testEmailService() {
  try {
    const emailService = require('./lib/emailService.ts');
    console.log('✅ Email service module loaded');
    
    // Check if SMTP is configured
    const smtpHost = process.env.SMTP_HOST || envVars.SMTP_HOST;
    if (smtpHost) {
      console.log(`✅ SMTP Host: ${smtpHost}`);
    } else {
      console.log('❌ SMTP Host not configured');
    }
  } catch (error) {
    console.log('❌ Email service test failed:', error.message);
  }
}

// Test 6: Check form validation
console.log('\n6️⃣ Testing Form Validation:');
console.log('----------------------------');

const testFormData = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  phone: '+256123456789',
  institution: 'Test University',
  position: 'Student',
  country: 'Uganda',
  city: 'Kampala',
  registrationType: 'local'
};

console.log('Test form data:');
Object.entries(testFormData).forEach(([key, value]) => {
  console.log(`   ${key}: ${value}`);
});

// Run all tests
async function runAllTests() {
  console.log('\n🚀 Running All Tests...');
  console.log('=======================\n');
  
  await testDatabase();
  await testAPI();
  await testEmailService();
  
  console.log('\n📋 Test Summary:');
  console.log('================');
  console.log('Check the results above for any ❌ errors.');
  console.log('Common issues:');
  console.log('- Database connection problems');
  console.log('- Missing environment variables');
  console.log('- File upload directory permissions');
  console.log('- Email service configuration');
  console.log('- API endpoint not responding');
}

runAllTests().catch(console.error);
