import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-prod';

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('ecw_auth_token');
    
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    
    const decoded: any = jwt.verify(token.value, JWT_SECRET);
    if (decoded.role !== 'super_admin' && decoded.role !== 'staff') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    const connection = await pool.getConnection();
    const [rows]: any = await connection.execute('SELECT setting_key, setting_value FROM settings');
    connection.release();

    const settings = rows.reduce((acc: any, row: any) => {
      acc[row.setting_key] = row.setting_value;
      return acc;
    }, {});

    return NextResponse.json({ settings });
  } catch (error: any) {
    console.error('Admin Settings Fetch Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('ecw_auth_token');
    
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    
    const decoded: any = jwt.verify(token.value, JWT_SECRET);
    if (decoded.role !== 'super_admin' && decoded.role !== 'staff') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    const body = await request.json();
    const { settings } = body; // expecting { settings: { store_name: '...', contact_email: '...' } }

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ message: 'Invalid settings object' }, { status: 400 });
    }

    const connection = await pool.getConnection();

    // Iterate over the object and update
    for (const [key, value] of Object.entries(settings)) {
      await connection.execute(
        `INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
        [key, String(value)]
      );
    }

    connection.release();
    return NextResponse.json({ success: true, message: 'Settings updated successfully' });

  } catch (error: any) {
    console.error('Admin Settings Update Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
