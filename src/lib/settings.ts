import pool from '@/lib/db';

export async function getContactEmail() {
  try {
    const [rows]: any = await pool.execute('SELECT setting_key, setting_value FROM settings WHERE setting_key IN ("contact_email", "smtp_email")');
    const dbSettings = rows.reduce((acc: any, row: any) => {
      acc[row.setting_key] = row.setting_value;
      return acc;
    }, {});
    
    const email = dbSettings.contact_email || dbSettings.smtp_email || "embilipitiyacycleworks911@gmail.com";
    return email;
  } catch (error) {
    console.error("Error fetching contact email:", error);
    return "embilipitiyacycleworks911@gmail.com";
  }
}
