import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import db from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('ecw_auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const secret = process.env.JWT_SECRET || 'supersecretjwtkey_for_ecw_app_123';
    
    try {
      const decoded = jwt.verify(token, secret) as { id: number };
      
      const [users] = await db.execute<RowDataPacket[]>(
        'SELECT id, name, email FROM users WHERE id = ?',
        [decoded.id]
      );

      if (users.length === 0) {
        return NextResponse.json(
          { message: 'User not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { user: users[0] },
        { status: 200 }
      );
    } catch (err) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
