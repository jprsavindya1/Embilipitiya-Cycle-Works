import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-prod';

async function checkAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('ecw_auth_token');
  if (!token) return false;
  try {
    const decoded: any = jwt.verify(token.value, JWT_SECRET);
    if (decoded.role === 'super_admin' || decoded.role === 'staff') return true;
  } catch (err) {}
  return false;
}

export async function PATCH(request: Request, props: { params: Promise<{ id: string }> }) {
  if (!(await checkAdmin())) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  try {
    const params = await props.params;
    const body = await request.json();
    const { approved } = body;

    const connection = await pool.getConnection();
    try {
      await connection.execute('UPDATE reviews SET approved = ? WHERE id = ?', [approved ? 1 : 0, params.id]);
      return NextResponse.json({ success: true });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  if (!(await checkAdmin())) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  try {
    const params = await props.params;
    const connection = await pool.getConnection();
    try {
      await connection.execute('DELETE FROM reviews WHERE id = ?', [params.id]);
      return NextResponse.json({ success: true });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
