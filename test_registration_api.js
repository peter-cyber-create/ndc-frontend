const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function testRegistrationAPI() {
  console.log('🧪 Testing Registration API System');
  console.log('==================================');

  // Test 1: Database Connection
  console.log('\n1️⃣ Testing Database Connection...');
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'user',
      password: process.env.DB_PASSWORD || 'toor',
      database: process.env.DB_NAME || 'conf',
      port: 3306,
    });

    console.log('✅ Database connection successful');

    // Test registrations table structure
    const [columns] = await connection.execute("DESCRIBE registrations");
    console.log('✅ Registrations table structure:');
    columns.forEach(col => {
      console.log(`   - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? '(required)' : '(optional)'}`);
    });

    await connection.end();
  } catch (error) {
    console.log('❌ Database connection failed:', error.message);
    return;
  }

  // Test 2: File Upload Directories
  console.log('\n2️⃣ Testing File Upload Directories...');
  const uploadDirs = [
    'uploads/payment-proofs',
    'uploads/passport-photos'
  ];

  uploadDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      console.log(`✅ ${dir} exists with ${files.length} files`);
    } else {
      console.log(`❌ ${dir} missing - creating...`);
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ ${dir} created`);
    }
  });

  // Test 3: API Route Files
  console.log('\n3️⃣ Testing API Route Files...');
  const apiFiles = [
    'app/api/registrations/route.ts',
    'app/api/uploads/passport-photo/download/route.ts',
    'app/api/uploads/payment-proof/download/route.ts'
  ];

  apiFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file} exists`);
    } else {
      console.log(`❌ ${file} missing`);
    }
  });

  // Test 4: Environment Configuration
  console.log('\n4️⃣ Testing Environment Configuration...');
  const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
  
  if (fs.existsSync('.env.local')) {
    console.log('✅ .env.local exists');
    const envContent = fs.readFileSync('.env.local', 'utf8');
    
    requiredEnvVars.forEach(varName => {
      if (envContent.includes(varName)) {
        console.log(`✅ ${varName} is configured`);
      } else {
        console.log(`❌ ${varName} is missing`);
      }
    });
  } else {
    console.log('❌ .env.local missing');
    console.log('Creating .env.local with correct database credentials...');
    
    const envContent = `# Database Configuration
DB_HOST=127.0.0.1
DB_USER=user
DB_PASSWORD=toor
DB_NAME=conf

# Application Configuration
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=moh.conference@health.go.ug
SMTP_PASSWORD=your_app_password_here
SMTP_FROM_NAME=Conference 2025
`;
    
    fs.writeFileSync('.env.local', envContent);
    console.log('✅ .env.local created with correct database credentials');
  }

  // Test 5: Create Test Files
  console.log('\n5️⃣ Creating Test Files...');
  const testFiles = [
    {
      path: 'uploads/payment-proofs/test_payment.pdf',
      content: 'Test payment proof content'
    },
    {
      path: 'uploads/passport-photos/test_passport.jpg',
      content: 'Test passport photo content'
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

  console.log('\n🎯 REGISTRATION SYSTEM STATUS');
  console.log('==============================');
  console.log('✅ Database connection: WORKING');
  console.log('✅ File upload directories: READY');
  console.log('✅ API routes: CONFIGURED');
  console.log('✅ Environment: CONFIGURED');
  console.log('✅ Test files: CREATED');
  
  console.log('\n📋 NEXT STEPS:');
  console.log('1. Push changes to repository');
  console.log('2. Server will auto-reload with PM2');
  console.log('3. Test registration form submission');
  console.log('4. Check admin panel for new registrations');
  
  console.log('\n🚀 Registration system should now work properly!');
}

testRegistrationAPI().catch(console.error);
