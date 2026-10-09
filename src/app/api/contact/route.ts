import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { sendEmail } from '@/lib/email';
import { getContactEmail } from '@/lib/settings';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, message } = body;

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    const connection = await pool.getConnection();

    try {
      await connection.execute(
        `INSERT INTO contact_messages (first_name, last_name, email, message) VALUES (?, ?, ?, ?)`,
        [firstName, lastName, email, message]
      );
    } finally {
      connection.release();
    }

    const storeEmail = await getContactEmail();

    // Try sending notification email asynchronously
    sendEmail({
      to: storeEmail,
      subject: `New Contact Form Message from ${firstName} ${lastName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #ea580c;">New Message Received</h2>
          <p><strong>From:</strong> ${firstName} ${lastName} (${email})</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `
    });

    return NextResponse.json({ success: true, message: 'Message sent successfully' });

  } catch (error: any) {
    console.error('Contact API Error:', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
