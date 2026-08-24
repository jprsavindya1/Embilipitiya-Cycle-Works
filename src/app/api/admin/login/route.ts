import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Basic hardcoded check for demo purposes
    if ((email === 'admin@ecw.com' || email === 'admin@gmail.com') && password === 'admin123') {
      const secret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-prod';
      
      // Create admin token
      const token = jwt.sign(
        { id: 1, email: 'admin@ecw.com', name: 'Admin', role: 'admin' },
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

      const response = NextResponse.json(
        { message: 'Admin Login successful' },
        { status: 200 }
      );
      
      response.headers.set('Set-Cookie', serializedCookie);
      return response;
    } else {
      return NextResponse.json(
        { message: 'Invalid admin credentials' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Admin Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
