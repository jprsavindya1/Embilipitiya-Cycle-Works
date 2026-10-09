import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import pool from '@/lib/db';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const connection = await pool.getConnection();
    try {
      const [rows]: any = await connection.execute(
        'SELECT * FROM admins WHERE email = ?',
        [email]
      );

      if (rows.length === 0) {
        return NextResponse.json({ message: 'Invalid admin credentials' }, { status: 401 });
      }

      const admin = rows[0];

      if (admin.status !== 'active') {
        return NextResponse.json({ message: 'This admin account is suspended' }, { status: 403 });
      }

      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
        return NextResponse.json({ message: 'Invalid admin credentials' }, { status: 401 });
      }

      const secret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-prod';
      
      // Create admin token
      const token = jwt.sign(
        { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
        secret,
        { expiresIn: '7d' }
      );

      // Set cookie
      const serializedCookie = serialize('ecw_auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      // Remove password before sending to client
      const adminWithoutPassword = { ...admin };
      delete adminWithoutPassword.password;

      const response = NextResponse.json(
        { message: 'Admin Login successful', admin: adminWithoutPassword },
        { status: 200 }
      );
      
      response.headers.set('Set-Cookie', serializedCookie);
      return response;

    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Admin Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
