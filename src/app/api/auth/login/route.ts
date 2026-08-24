import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { serialize } from 'cookie';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find user
    const [users] = await db.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const user = users[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const secret = process.env.JWT_SECRET || 'supersecretjwtkey_for_ecw_app_123';
    
    // Create token
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      secret,
      { expiresIn: '7d' }
    );

    // Set cookie
    const serializedCookie = serialize('ecw_auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    const response = NextResponse.json(
      { 
        message: 'Login successful',
        user: { id: user.id, name: user.name, email: user.email }
      },
      { status: 200 }
    );
    
    response.headers.set('Set-Cookie', serializedCookie);

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
