import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-prod';

// Middleware-like function to check admin auth
async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('ecw_auth_token');
  
  if (!token) return null;

  try {
    const decoded: any = jwt.verify(token.value, JWT_SECRET);
    if (decoded.role === 'super_admin' || decoded.role === 'staff') {
      return decoded;
    }
  } catch (e) {
    return null;
  }
  return null;
}

export async function GET() {
  const auth = await checkAuth();
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const connection = await pool.getConnection();
  try {
    const [messages]: any = await connection.execute(
      `SELECT * FROM contact_messages ORDER BY createdAt DESC`
    );
    return NextResponse.json({ messages });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  } finally {
    connection.release();
  }
}

export async function PATCH(request: Request) {
  const auth = await checkAuth();
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ message: 'Message ID is required' }, { status: 400 });

    const connection = await pool.getConnection();
    try {
      await connection.execute(`UPDATE contact_messages SET status = 'read' WHERE id = ?`, [id]);
      return NextResponse.json({ success: true, message: 'Message marked as read' });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const auth = await checkAuth();
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ message: 'Message ID is required' }, { status: 400 });

    const connection = await pool.getConnection();
    try {
      await connection.execute(`DELETE FROM contact_messages WHERE id = ?`, [id]);
      return NextResponse.json({ success: true, message: 'Message deleted' });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
