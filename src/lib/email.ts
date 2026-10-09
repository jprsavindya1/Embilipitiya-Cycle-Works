import nodemailer from 'nodemailer';
import pool from '@/lib/db';

export const sendEmail = async ({ to, subject, html, text }: { to: string; subject: string; html: string; text?: string }) => {
  let emailUser = process.env.SMTP_EMAIL;
  let emailPass = process.env.SMTP_PASSWORD;
  let emailHost = process.env.SMTP_HOST;
  let emailPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : undefined;

  try {
    const connection = await pool.getConnection();
    const [rows]: any = await connection.execute('SELECT setting_key, setting_value FROM settings WHERE setting_key IN ("smtp_email", "smtp_password", "smtp_host", "smtp_port")');
    connection.release();
    
    const dbSettings = rows.reduce((acc: any, row: any) => {
      acc[row.setting_key] = row.setting_value;
      return acc;
    }, {});
    
    if (dbSettings.smtp_email) emailUser = dbSettings.smtp_email;
    if (dbSettings.smtp_password) emailPass = dbSettings.smtp_password;
    if (dbSettings.smtp_host) emailHost = dbSettings.smtp_host;
    if (dbSettings.smtp_port) emailPort = parseInt(dbSettings.smtp_port);
  } catch (error) {
    console.error("Failed to fetch SMTP settings from DB:", error);
  }

  if (!emailUser || !emailPass) {
    console.warn("SMTP credentials not configured. Email not sent.");
    return false;
  }

  const transporter = nodemailer.createTransport({
    ...(emailHost ? { host: emailHost, port: emailPort || 465, secure: (emailPort || 465) === 465 } : { host: 'smtp.gmail.com', port: 587, secure: false }),
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Embilipitiya Cycle Works" <${emailUser}>`,
      to,
      subject,
      text,
      html,
    });
    console.log(`Email successfully sent to ${to}`);
    return true;
  } catch (error: any) {
    console.error(`Failed to send email to ${to}:`, error);
    require('fs').appendFileSync('email_error.log', new Date().toISOString() + ' - ' + (error.message || JSON.stringify(error)) + '\n');
    return false;
  }
};
