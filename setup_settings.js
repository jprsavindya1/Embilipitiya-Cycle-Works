const mysql = require('mysql2/promise');

async function run() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ecw_db'
  });

  try {
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS settings (
        setting_key VARCHAR(50) PRIMARY KEY,
        setting_value TEXT NOT NULL
      )
    `);
    
    // Insert default settings if they don't exist
    const defaultSettings = [
      ['store_name', 'Ebilipitiya Cycle Works'],
      ['contact_email', 'support@ecw.com'],
      ['contact_phone', '047-2230123'],
      ['address', 'Main Street, Embilipitiya'],
      ['currency', 'LKR'],
      ['tax_rate', '15']
    ];

    for (const [key, value] of defaultSettings) {
      await connection.execute(
        'INSERT IGNORE INTO settings (setting_key, setting_value) VALUES (?, ?)',
        [key, value]
      );
    }
    
    console.log('Settings table created and seeded successfully.');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

run();
