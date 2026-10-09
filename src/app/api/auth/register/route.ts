import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import pool from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-prod';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    const connection = await pool.getConnection();

    try {
      // Check if email exists
      const [existingUsers]: any = await connection.execute(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );

      if (existingUsers.length > 0) {
        return NextResponse.json({ message: 'Email already registered' }, { status: 409 });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user
      const [result]: any = await connection.execute(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword]
      );

      const userId = result.insertId;

      // Create JWT
      const token = jwt.sign(
        { id: userId, email, name, role: 'customer' },
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
          message: 'Registration successful', 
          user: { id: userId, name, email, role: 'customer' }
        },
        { status: 201 }
      );
      
      response.headers.set('Set-Cookie', serializedCookie);
      return response;

    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
