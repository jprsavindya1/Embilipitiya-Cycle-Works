import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import pool from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-prod';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const connection = await pool.getConnection();

    try {
      const [rows]: any = await connection.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      if (rows.length === 0) {
        return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
      }

      const user = rows[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
      }

      // Create JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name, role: 'customer' },
        JWT_SECRET,
        { expiresIn: '30d' }
      );

      // Set cookie
      const serializedCookie = serialize('ecw_auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });

      const response = NextResponse.json(
        { 
          message: 'Login successful', 
          user: { id: user.id, name: user.name, email: user.email, role: 'customer' }
        },
        { status: 200 }
      );
      
      response.headers.set('Set-Cookie', serializedCookie);
      return response;

    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
