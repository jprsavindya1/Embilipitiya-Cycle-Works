import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-prod';

export async function GET(request: Request) {
  try {
    // 1. Verify Admin
    const cookieStore = await cookies();
    const token = cookieStore.get('ecw_auth_token');
    
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    
    const decoded: any = jwt.verify(token.value, JWT_SECRET);
    if (decoded.role !== 'admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    // 2. Fetch Customers
    const connection = await pool.getConnection();
    const [users]: any = await connection.execute(
      `SELECT id, name, email, created_at FROM users ORDER BY created_at DESC`
    );
    connection.release();

    return NextResponse.json({ customers: users });
  } catch (error: any) {
    console.error('Admin Customers Fetch Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // 1. Verify Admin
    const cookieStore = await cookies();
    const token = cookieStore.get('ecw_auth_token');
    
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    
    const decoded: any = jwt.verify(token.value, JWT_SECRET);
    if (decoded.role !== 'admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    // 2. Parse Body
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const connection = await pool.getConnection();

    // 3. Check if email exists
    const [existing]: any = await connection.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      connection.release();
      return NextResponse.json({ message: 'Email already exists' }, { status: 400 });
    }

    // 4. Hash password and insert
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result]: any = await connection.execute(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    connection.release();

    return NextResponse.json({ 
      success: true, 
      customer: { id: result.insertId, name, email, created_at: new Date().toISOString() } 
    });

  } catch (error: any) {
    console.error('Admin Customers Create Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
