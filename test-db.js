const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'user',
      password: 'toor',
      database: 'conf'
    });
    
    console.log('✅ Database connection successful!');
    
    // Test tables exist
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('📋 Available tables:', tables.map(t => Object.values(t)[0]));
    
    // Test each table
    const tableTests = ['registrations', 'abstracts', 'exhibitors', 'sponsorships', 'contacts', 'pre_conference_meetings'];
    
    for (const table of tableTests) {
      try {
        const [count] = await connection.execute(`SELECT COUNT(*) as count FROM ${table}`);
        console.log(`✅ ${table}: ${count[0].count} records`);
      } catch (error) {
        console.log(`❌ ${table}: ${error.message}`);
      }
    }
    
    await connection.end();
    console.log('🎉 All database tests completed!');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Error code:', error.code);
  }
}

testConnection();
