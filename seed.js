const mysql = require('mysql2/promise');

async function seed() {
  const connection = await mysql.createConnection('mysql://root:@localhost/ecw_db');
  await connection.query(`
    INSERT INTO settings (setting_key, setting_value) 
    VALUES ('announcement_enabled', 'true'), 
           ('announcement_text', '🎉 Grand Opening! Use code ECW10 at checkout for 10% off!')
    ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)
  `);
  console.log("Done seeding announcement");
  await connection.end();
}

seed().catch(console.error);
