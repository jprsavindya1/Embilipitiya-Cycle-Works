const mysql = require('mysql2/promise');

async function initializeDatabase() {
  console.log("Connecting to MySQL on localhost:3306 (user: root, no password)...");
  
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '', // default XAMPP password is empty
    });

    console.log("Connected successfully. Creating database 'ecw_db' if it doesn't exist...");
    await connection.query(`CREATE DATABASE IF NOT EXISTS ecw_db`);
    await connection.query(`USE ecw_db`);

    console.log("Creating 'products' table...");
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        originalPrice DECIMAL(10, 2),
        category VARCHAR(100) NOT NULL,
        imageUrl VARCHAR(500) NOT NULL,
        isNew BOOLEAN DEFAULT FALSE,
        description TEXT,
        sku VARCHAR(100),
        brand VARCHAR(100),
        stock INT DEFAULT 0,
        colors JSON,
        sizes JSON,
        rating DECIMAL(3, 1) DEFAULT 0,
        gallery JSON,
        isPublished BOOLEAN DEFAULT TRUE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log("Creating 'admins' table...");
    await connection.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255),
        role ENUM('super_admin', 'staff') NOT NULL,
        status ENUM('active', 'suspended') NOT NULL DEFAULT 'active',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Creating 'activity_logs' table...");
    await connection.query(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id VARCHAR(50) PRIMARY KEY,
        adminId VARCHAR(50) NOT NULL,
        adminName VARCHAR(100) NOT NULL,
        action VARCHAR(100) NOT NULL,
        target VARCHAR(255) NOT NULL,
        details TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Creating 'invite_tokens' table...");
    await connection.query(`
      CREATE TABLE IF NOT EXISTS invite_tokens (
        token VARCHAR(100) PRIMARY KEY,
        role ENUM('super_admin', 'staff') NOT NULL,
        used BOOLEAN DEFAULT FALSE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Creating 'categories' table...");
    await connection.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        subcategories JSON,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Creating 'reviews' table...");
    await connection.query(`
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

    console.log("Creating 'promocodes' table...");
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

    // We don't have orders table in init_db.js because it was added later, 
    // but if it exists, let's make sure it has the new columns if it's created elsewhere,
    // actually let's just create orders table here if it's missing from init_db.js
    console.log("Creating 'orders' table...");
    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(50),
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        address_line1 VARCHAR(255) NOT NULL,
        address_line2 VARCHAR(255),
        city VARCHAR(100) NOT NULL,
        postal_code VARCHAR(50) NOT NULL,
        country VARCHAR(50) NOT NULL,
        subtotal DECIMAL(10, 2) NOT NULL,
        delivery_fee DECIMAL(10, 2) NOT NULL,
        discount DECIMAL(10, 2) DEFAULT 0,
        promo_code VARCHAR(50),
        total DECIMAL(10, 2) NOT NULL,
        payment_method VARCHAR(50) NOT NULL,
        payment_status VARCHAR(50) NOT NULL,
        order_status VARCHAR(50) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Creating 'order_items' table...");
    await connection.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        quantity INT NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
      )
    `);

    // Seed default categories
    console.log("Seeding default categories...");
    const [catRows] = await connection.query(`SELECT COUNT(*) as count FROM categories`);
    if (catRows[0].count === 0) {
      await connection.query(`
        INSERT INTO categories (id, name, subcategories) VALUES
        ('cat_1', 'Bicycle and Accessories', JSON_ARRAY('Bicycle', 'Bicycle Accessories')),
        ('cat_2', 'Children Items', JSON_ARRAY('Baby Swings', 'Baby Walker', 'Go-Kart', 'Push Scooters', 'Rechargeable Jeeps and Bikes', 'TOLO Cars', 'Tricycle')),
        ('cat_3', 'Sport Items', JSON_ARRAY('Badminton', 'Carom', 'Cricket', 'Gym Equipment', 'Volleyball'))
      `);
      console.log("Default categories seeded.");
    }


    // Insert default Super Admin if not exists
    console.log("Seeding default Super Admin...");
    const [rows] = await connection.query(`SELECT * FROM admins WHERE email = 'admin@ecw.lk'`);
    if (rows.length === 0) {
      await connection.query(`
        INSERT INTO admins (id, name, email, password, role, status)
        VALUES ('admin_root', 'Super Admin', 'admin@ecw.lk', '$2b$10$BFvc11afWvXTqkmB6M23XOXpKrTao..31JjdCMCK/DlyE9T5t5s7W', 'super_admin', 'active')
      `);
      console.log("Default Super Admin created: admin@ecw.lk / admin123");
    } else {
      console.log("Super Admin already exists.");
    }

    console.log("✅ Database initialized successfully!");
    await connection.end();
  } catch (error) {
    console.error("❌ Error initializing database:", error.message);
    console.error("Make sure XAMPP is running and MySQL is started!");
  }
}

initializeDatabase();
