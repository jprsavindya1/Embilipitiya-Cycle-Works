const mysql = require('mysql2/promise');
async function run() {
  const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'ecw_db' });
  await conn.query(`
    CREATE TABLE IF NOT EXISTS reviews (
      id VARCHAR(50) PRIMARY KEY,
      productId VARCHAR(50) NOT NULL,
      author VARCHAR(100) NOT NULL,
      rating INT NOT NULL,
      comment TEXT NOT NULL,
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      approved BOOLEAN DEFAULT FALSE
    )
  `);
  console.log('Reviews table created');
  process.exit(0);
}
run();
