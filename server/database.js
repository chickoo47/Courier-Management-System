const mysql = require('mysql2');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Create connection pool for better performance
// Try socket connection first (common on macOS), then TCP
const connectionConfig = {
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'courier_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Add socket path if on macOS/Unix, otherwise use host
if (process.platform === 'darwin' || process.platform === 'linux') {
  connectionConfig.socketPath = '/tmp/mysql.sock';
} else {
  connectionConfig.host = process.env.DB_HOST || 'localhost';
}

const pool = mysql.createPool(connectionConfig);

// Get promise-based connection
const promisePool = pool.promise();

// Test database connection
const testConnection = async () => {
  try {
    const connection = await promisePool.getConnection();
    console.log('✅ MySQL Database connected successfully!');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = {
  pool: promisePool,
  testConnection
};
