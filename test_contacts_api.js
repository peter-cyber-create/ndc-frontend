const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'toor',
  database: process.env.DB_NAME || 'conf',
  port: 3306,
};

async function testContactsAPI() {
  try {
    console.log('Testing contacts API...');
    console.log('DB Config:', dbConfig);
    
    const connection = await mysql.createConnection(dbConfig);
    console.log('Database connected successfully');
    
    const { name, email, phone, organization, inquiry_type, subject, message } = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      organization: 'Test Org',
      inquiry_type: 'general',
      subject: 'Test Subject',
      message: 'Test message'
    };
    
    console.log('Data to insert:', { name, email, phone, organization, inquiry_type, subject, message });
    
    const [result] = await connection.execute(
      'INSERT INTO contacts (name, email, phone, organization, inquiry_type, subject, message, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())',
      [name, email, phone, organization, inquiry_type, subject, message, 'new']
    );
    
    console.log('Insert successful:', result);
    await connection.end();
    console.log('Test completed successfully');
    
  } catch (error) {
    console.error('Error in contacts API test:', error);
  }
}

testContactsAPI();
