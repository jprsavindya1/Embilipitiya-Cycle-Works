const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function fixPassword() {
  try {
    const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'ecw_db' });
    const hash = await bcrypt.hash('admin123', 10);
    console.log("New Hash:", hash);
    await conn.execute('UPDATE admins SET password = ? WHERE email = ?', [hash, 'admin@ecw.lk']);
    console.log("Password updated in DB!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
fixPassword();
