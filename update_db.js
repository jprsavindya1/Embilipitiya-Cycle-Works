const mysql = require('mysql2/promise');

async function updateDb() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL || 'mysql://root:@localhost/ecw_db');
  
  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS promocodes (
        id VARCHAR(50) PRIMARY KEY,
        code VARCHAR(50) NOT NULL UNIQUE,
        discount_type ENUM('percentage', 'fixed') NOT NULL,
        discount_value DECIMAL(10, 2) NOT NULL,
        min_order_value DECIMAL(10, 2) DEFAULT 0,
        expiry_date DATETIME,
        is_active BOOLEAN DEFAULT TRUE,
        usage_count INT DEFAULT 0,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Promocodes table ready.");

    // Alter orders table
    try {
      await connection.query(`ALTER TABLE orders ADD COLUMN discount DECIMAL(10, 2) DEFAULT 0`);
      console.log("Added discount column to orders");
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') console.log("discount column already exists");
      else throw e;
    }

    try {
      await connection.query(`ALTER TABLE orders ADD COLUMN promo_code VARCHAR(50)`);
      console.log("Added promo_code column to orders");
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') console.log("promo_code column already exists");
      else throw e;
    }

  } catch (err) {
    console.error("DB Update Error:", err);
  } finally {
    await connection.end();
  }
}

updateDb().catch(console.error);
