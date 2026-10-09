import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-prod';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('ecw_auth_token');

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded: any = jwt.verify(token.value, JWT_SECRET);
      if (decoded.role !== 'super_admin' && decoded.role !== 'staff') {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
      }
    } catch (err) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute('SELECT * FROM reviews ORDER BY date DESC');
      return NextResponse.json(rows);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching admin reviews:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
