const mysql = require('mysql2/promise');

async function testDatabaseConnection() {
  try {
    console.log('Testing database connection...');
    
    const dbConfig = {
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'user',
      password: process.env.DB_PASSWORD || 'toor',
      database: process.env.DB_NAME || 'conf',
      port: 3306,
    };

    console.log('Connecting with config:', {
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database,
      port: dbConfig.port
    });

    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Database connection successful');
    
    // Test if registrations table exists
    const [tables] = await connection.execute("SHOW TABLES LIKE 'registrations'");
    if (tables.length > 0) {
      console.log('✅ Registrations table exists');
      
      // Test inserting a record
      const [result] = await connection.execute(
        `INSERT INTO registrations 
         (firstName, lastName, email, phone, organization, position, registrationType, status, createdAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?, 'test', NOW())`,
        ['Test', 'User', 'test@example.com', '+256123456789', 'Test Org', 'Test Position', 'local']
      );
      
      console.log('✅ Test record inserted successfully, ID:', result.insertId);
      
      // Clean up test record
      await connection.execute('DELETE FROM registrations WHERE id = ?', [result.insertId]);
      console.log('✅ Test record cleaned up');
      
    } else {
      console.log('❌ Registrations table does not exist');
    }
    
    await connection.end();
    console.log('✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Full error:', error);
  }
}

testDatabaseConnection();
