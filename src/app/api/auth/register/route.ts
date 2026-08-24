import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user exists
    const [existingUsers] = await db.execute<RowDataPacket[]>(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    await db.execute(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    return NextResponse.json(
      { message: 'User registered successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
