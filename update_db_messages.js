const mysql = require('mysql2/promise');

async function initializeDatabase() {
  console.log("Connecting to MySQL on localhost:3306 (user: root, no password)...");
  
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'ecw_db',
    });

    console.log("Creating 'contact_messages' table...");
    await connection.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        status ENUM('unread', 'read') DEFAULT 'unread',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ 'contact_messages' table initialized successfully!");
    await connection.end();
  } catch (error) {
    console.error("❌ Error initializing database:", error.message);
  }
}

initializeDatabase();
