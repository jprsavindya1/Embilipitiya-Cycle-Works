import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const connection = await pool.getConnection();
    
    // We only select specific keys that are safe to be public
    const publicKeys = [
      'store_name',
      'contact_email',
      'contact_phone',
      'address',
      'currency',
      'announcement_text',
      'announcement_enabled'
    ];
    
    // Fetch only the allowed public keys
    const placeholders = publicKeys.map(() => '?').join(',');
    const [rows]: any = await connection.execute(
      `SELECT setting_key, setting_value FROM settings WHERE setting_key IN (${placeholders})`,
      publicKeys
    );
    connection.release();

    const settings = rows.reduce((acc: any, row: any) => {
      acc[row.setting_key] = row.setting_value;
      return acc;
    }, {});

    return NextResponse.json({ settings });
  } catch (error: any) {
    console.error('Public Settings Fetch Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
