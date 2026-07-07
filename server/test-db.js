const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',  // Apna password daalein
  database: 'zennix_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Database connection failed:');
    console.error('Error Code:', err.code);
    console.error('Error Message:', err.message);
    console.error('Error SQL:', err.sqlMessage);
    return;
  }
  
  console.log('✅ Database connected successfully!');
  console.log('📊 Database:', connection.config.database);
  console.log('👤 User:', connection.config.user);
  console.log('🏠 Host:', connection.config.host);
  
  // Test query
  connection.query('SELECT 1 + 1 AS result', (err, results) => {
    if (err) {
      console.error('❌ Query failed:', err.message);
    } else {
      console.log('✅ Query successful:', results[0].result);
    }
    connection.release();
    process.exit(0);
  });
});